import { defineStore } from 'pinia'

export default defineStore({

  id: 'picStore',

  state: () => ({
    selectedPic: null,
    selectedListId: null,
    picLists: { // key(aka listId) = clusterId except for the 'empty' list
      empty: []
    },
    clusterList: [],
    pageSize: 50,
    scrollStartPic: null,
    message: "welcome"
  }),

  getters: {
    getSelectedPic: state => state.selectedPic,
    getProperListId: state => (listId) => 
      listId == 'selected' 
      ? state.selectedListId 
      : listId,
    getPicList: state => (listId) => {
      listId = state.getProperListId(listId)
      return state.picLists[listId]
    },
    getPicListPage: state => (listId) => {
      let picList = state.getPicList(listId)
      return picList.filter((pic,ix) => 
        ix >= (picList.page - 1) * state.pageSize &&
        ix < picList.page * state.pageSize
      )
    },
    getClusterId: state => (listId) => {
      listId = state.getProperListId(listId)
      let picList = state.picLists[listId] 
      return picList.clusterId
    },
    getClusterName: state => (listId) => {
      let clusterId = state.getClusterId(listId)
      let cluster = state.clusterList
        .find(cluster => cluster.clusterId === clusterId)
      return cluster.clusterName
    },
    getChanged: state => (listId) => {
      listId = state.getProperListId(listId)
      return state.picLists[listId]?.changed
    },
    isSelectedInList: state => (listId) => {
      listId = state.getProperListId(listId)
      let picList = state.picLists[listId]
      if (!state.selectedPic || !picList)
        return false 
      return state.picLists[listId].some(pic => 
        pic.picId === state.selectedPic.picId
      )
    }
  },

  actions: {

    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/pics/getFile?fileName=${fileName}`
    },

    setPicList(listId, picList) {
      listId = this.getProperListId(listId) 
      this.$state.picLists[listId] = picList
      console.log(`picList with id = ${listId} set`)
    },

    selectPic(listId, pic) { 
      this.$state.selectedPic = pic 
      this.$state.selectedListId = listId
    },

    slideSelected() { 
      let listId = this.getProperListId('selected')
      let picList = this.$state.picLists[listId] 
      let ord = this.$state.selectedPic.ord - 1
      if (ord < 1)
        ord = this.$state.scrollStartPic.ord
      this.$state.selectedPic = picList.find(pic => pic.ord === ord)
      this.$state.message = 
        `slideshow - pic ${ord} of ${this.$state.scrollStartPic.ord}`
    },

    async loadClusterList() {
      let response = await fetch('http://localhost:3000/clusters')
      if (!response.ok) 
        throw `error fetching clusters`
      let json = await response.json()   
      this.$state.clusterList = JSON.parse(json)
    },

    async loadPics(clusterId) {
      clusterId = parseInt(clusterId)
      if (isNaN(clusterId)) {
        console.log('clusterId could not be parsed to an integer')
        this.setPicList('empty', [])
        return
      }
      let response
      try { 
        response = await fetch(
          `http://localhost:3000/pics?clusterId=${clusterId}`
        )
        if (!response.ok) 
          throw `error fetching pics`
      }
      catch(ex) {
        this.$state.message += - ` - error ${ex.message}`
      }
      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.clusterId = clusterId
      parsedList.changed = false
      parsedList.page = 1
      this.setPicList(clusterId, parsedList)
    },
    
    async movePicTo(
      listId,
      pic, 
      deleteFromSource
    ) {

      listId = this.getProperListId(listId) 
      let selectedPic = this.$state.selectedPic

      let picList = this.$state.picLists[listId]

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
      this.setPicList(listId, picList)

      if (
        deleteFromSource && 
        pic !== selectedPic &&
        listId !== this.selectedListId
      ) 
        this.deletePic('selected', selectedPic.picId, false)
    
      this.save()

    },
    
    async deletePic(listId, picId, _save = true) {
      listId = this.getProperListId(listId) 
      let picList = this.$state.picLists[listId]
      let index = picList.findIndex(pic => pic.picId === picId)
      picList.splice(index,1) 
      picList.changed = true
      this.setPicList(listId, picList)
      if (_save) 
        this.save()
    },

    async save() {

      console.log('saving')
      this.$state.message = "saving"

      for (let picListName of Object.keys(this.$state.picLists)) 
          this.reorderClusterPics(picListName)
      
      if (!this.$state.selectedPic)
        return

      let picId = this.$state.selectedPic.picId
      let label = this.$state.selectedPic.label
      let description = this.$state.selectedPic.description
      let notes = this.$state.selectedPic.notes

      let response 
      try {
        response = await fetch(
          `http://localhost:3000/pics/updatePic` + 
          `?picId=${picId}` + 
          `&label=${label}` +
          `&description=${description}` + 
          `&notes=${notes}`
        )
        if (!response.ok) 
          throw `error saving pic(s)`
      }
      catch(ex) {
        this.state.message += ` - error ${this.message}`
        return 
      }      

      console.log('selected pic saved to db')
      this.$state.message += ` - pic ${this.$state.selectedPic.picId}`

      let date = new Date()
      let hh = date.getHours().toString().padStart(2, '0');
      let mm = date.getMinutes().toString().padStart(2, '0');
      let ss = date.getSeconds().toString().padStart(2, '0');
      this.$state.message += ` - time ${hh}:${mm}:${ss}`

    },

    async reorderClusterPics(listId) {

      listId = this.getProperListId(listId) 
      let picList = this.$state.picLists[listId]
      if (!picList.changed)
        return

      let clusterId = picList.clusterId
      let picIdCsv = picList.map(pic => pic.picId).join(',')
      
      let response
      try {
        response = await fetch(
          `http://localhost:3000/pics/reorderClusterPics` + 
          `?clusterId=${clusterId}` + 
          `&picIdCsv=${picIdCsv}`
        )
        if (!response.ok) 
          throw `error reordering pics`
      }
      catch (ex) {
        this.$state.message += 
          ` - error saving listId = ${listId} : ${ex.message}`
          return 
      }      
      
      this.$state.picLists[listId].changed = false
      console.log(`${listId} ordering saved to db`) 
      this.$state.message += ` - list ${listId}`

    },

    pageSelected (listId) {
      listId = this.getProperListId(listId)
      let selectedPicId = this.$state.selectedPic?.picId
      let selectedIndexInList = 
        this.$state.picLists[listId]
        .findIndex(pic => pic.picId == selectedPicId)
      if (selectedIndexInList === -1)
        return
      let page = Math.ceil(
        selectedIndexInList /
        this.$state.pageSize
      )
      this.$state.picLists[listId].page = page
    },

    pageFirst (listId) {
      listId = this.getProperListId(listId)
      this.$state.picLists[listId].page = 1
    },

    pageLast (listId) {
      listId = this.getProperListId(listId)
      this.$state.picLists[listId].page = Math.ceil(
        this.$state.picLists[listId].length /
        this.$state.pageSize
      )
    },

    pageDown (listId) {
      listId = this.getProperListId(listId)
      if (this.$state.picLists[listId].page >= 1)
        this.$state.picLists[listId].page--
    },

    pageUp (listId) {
      listId = this.getProperListId(listId)
      let lastPage = Math.ceil(
        this.$state.picLists[listId].length /
        this.$state.pageSize 
      )
      if (this.$state.picLists[listId].page < lastPage)
        this.$state.picLists[listId].page++
    } 

  }

})

