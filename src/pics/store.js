import { defineStore } from 'pinia'

export default defineStore({

  id: 'picStore',

  state: () => ({
    selectedPic: null,
    selectedListType: null, // main|other
    picLists: {
      main: [],
      other: []
    },
    clusterList: [],
    pageSize: 50,
    message: "welcome"
  }),

  getters: {
    getSelectedPic: state => state.selectedPic,
    getProperListType: state => (listType) => 
      listType == 'selected' 
      ? state.selectedListType 
      : listType,
    getPicList: state => (listType) => {
      listType = state.getProperListType(listType)
      return state.picLists[listType]
    },
    getPicListPage: state => (listType) => {
      let picList = state.getPicList(listType)
      return picList.filter((pic,ix) => 
        ix >= (picList.page - 1) * state.pageSize &&
        ix < picList.page * state.pageSize
      )
    },
    getClusterId: state => (listType) => {
      listType = state.getProperListType(listType)
      let picList = state.picLists[listType] 
      return picList.clusterId
    },
    getClusterName: state => (listType) => {
      let clusterId = state.getClusterId(listType)
      let cluster = state.clusterList
        .find(cluster => cluster.clusterId === clusterId)
      return cluster.clusterName
    },
    getChanged: state => (listType) => {
      listType = state.getProperListType(listType)
      return state.picLists[listType]?.changed
    }
  },

  actions: {

    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/pics/getFile?fileName=${fileName}`
    },

    setPicList(listType, picList) {
      listType = this.getProperListType(listType) 
      this.$state.picLists[listType] = picList
    },

    selectPic(listType, pic) { 
      this.$state.selectedPic = pic 
      this.$state.selectedListType = listType
    },

    showOtherPicList() {
      let mainClusterId = this.picLists['main']?.clusterId
      let otherClusterId = this.picLists['other']?.clusterId
      return mainClusterId != otherClusterId && otherClusterId >= 0
    },

    async loadClusterList() {
      let response = await fetch('http://localhost:3000/clusters')
      if (!response.ok) 
        throw `error fetching clusters`
      let json = await response.json()   
      this.$state.clusterList = JSON.parse(json)
    },

    async loadPics(listType, clusterId) {
      clusterId = parseInt(clusterId)
      if (isNaN(clusterId))
        throw 'clusterId could not be parsed to an integer'
      let response = await fetch(
        `http://localhost:3000/pics?clusterId=${clusterId}`
      )
      if (!response.ok) 
        throw `error fetching pics`
      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.clusterId = clusterId
      parsedList.changed = false
      parsedList.page = 1
      this.setPicList(listType, parsedList)
    },
    
    async movePicTo(
      listType,
      pic, 
      deleteFromSource
    ) {

      listType = this.getProperListType(listType) 
      let selectedPic = this.$state.selectedPic

      let picList = this.$state.picLists[listType]

      let targetIndex = 
        !pic 
        ? picList.length // put to end
        : picList.findIndex(item => item.picId === pic.picId) 
    
      let existingIndex =
        picList
        .findIndex(pic => pic.picId === selectedPic.picId)
    
      if (existingIndex >= 0) {
        let removed = picList.splice(existingIndex,1)[0]
        // when you splice out the source, indexes 
        // of all pics that come after reduce by 1
        if (targetIndex > existingIndex)
          targetIndex-- 
        picList.splice(targetIndex, 0, removed)
      }
      else 
        picList.splice(targetIndex, 0, selectedPic)

      picList.changed = true
      this.setPicList(listType, picList)

      if (
        deleteFromSource && 
        pic !== selectedPic &&
        listType !== this.selectedListType
      ) 
        this.deletePic('selected', selectedPic.picId)
    
    },
    
    async deletePic(listType, picId) {
      listType = this.getProperListType(listType) 
      let picList = this.$state.picLists[listType]
      let index = picList.findIndex(pic => pic.picId === picId)
      picList.splice(index,1) 
      picList.changed = true
      this.setPicList(listType, picList)
    },

    async save() {

      console.log('saving')
      this.$state.message = "saving"

      if (this.$state.picLists.main?.changed) 
        this.reorderClusterPics('main')
      if (this.$state.picLists.other?.changed)
        this.reorderClusterPics('other')
      
      if (!this.$state.selectedPic)
        return

      let picId = this.$state.selectedPic.picId
      let label = this.$state.selectedPic.label
      let description = this.$state.selectedPic.description
      let notes = this.$state.selectedPic.notes

      let response = await fetch(
        `http://localhost:3000/pics/updatePic` + 
        `?picId=${picId}` + 
        `&label=${label}` +
        `&description=${description}` + 
        `&notes=${notes}`
      )
      if (!response.ok) 
        throw `error saving pic(s)`      

      console.log('selected pic saved to db')
      this.$state.message += ` - pic ${this.$state.selectedPic.picId}`

      let date = new Date()
      let hh = date.getHours().toString().padStart(2, '0');
      let mm = date.getMinutes().toString().padStart(2, '0');
      let ss = date.getSeconds().toString().padStart(2, '0');
      this.$state.message += ` - done ${hh}:${mm}:${ss}`

    },

    async reorderClusterPics(listType) {
      listType = this.getProperListType(listType) 
      let picList = this.$state.picLists[listType]
      let clusterId = picList.clusterId
      let picIdCsv = picList.map(pic => pic.picId).join(',')
      let response = await fetch(
        `http://localhost:3000/pics/reorderClusterPics` + 
        `?clusterId=${clusterId}` + 
        `&picIdCsv=${picIdCsv}`
      )
      if (!response.ok) 
        throw `error reordering pics`      
      this.$state.picLists[listType].changed = false
      console.log(`${listType} ordering saved to db`) 
      this.$state.message += ` - list ${listType}`
    },

    pageSelected (listType) {
      listType = this.getProperListType(listType)
      let selectedPicId = this.$state.selectedPic?.picId
      let selectedIndexInList = 
        this.$state.picLists[listType]
        .findIndex(pic => pic.picId == selectedPicId)
      if (selectedIndexInList === -1)
        return
      let page = Math.ceil(
        selectedIndexInList /
        this.$state.pageSize
      )
      this.$state.picLists[listType].page = page
    },

    pageFirst (listType) {
      listType = this.getProperListType(listType)
      this.$state.picLists[listType].page = 1
    },

    pageLast (listType) {
      listType = this.getProperListType(listType)
      this.$state.picLists[listType].page = Math.ceil(
        this.$state.picLists[listType].length /
        this.$state.pageSize
      )
    },

    pageDown (listType) {
      listType = this.getProperListType(listType)
      if (this.$state.picLists[listType].page >= 1)
        this.$state.picLists[listType].page--
    },

    pageUp (listType) {
      listType = this.getProperListType(listType)
      let lastPage = Math.ceil(
        this.$state.picLists[listType].length /
        this.$state.pageSize 
      )
      if (this.$state.picLists[listType].page < lastPage)
        this.$state.picLists[listType].page++
    } 

  }

})

