import { defineStore } from 'pinia';

export default defineStore({

  id: 'picStore',

  state: () => ({
    selectedPic: null,
    selectedListType: null, // main|other
    picLists: {
      mainPicList: [],
      otherPicList: []
    },
    clusterList: []
  }),

  getters: {
    getSelectedPic: state => state.selectedPic,
    getPicList: state => (listType) => {
      listType = 
        listType == 'selected' 
        ? state.selectedListType 
        : listType
      return state.picLists[listType]
    },
    getClusterId: state => (listType) => {
      listType = 
        listType == 'selected' 
        ? state.selectedListType 
        : listType
      let picList = state.picLists[listType] 
      return (picList && picList.clusterId >= 0)
        ? picList.clusterId
        : null
    }
  },

  actions: {

    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/pics/getFile?fileName=${fileName}`
    },

    setPicList(listType, picList) {
      listType = listType == 'selected' ? selectedListType : listType 
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
      let response = await fetch(
        `http://localhost:3000/pics?clusterId=${clusterId}`
      )
      if (!response.ok) 
        throw `error fetching pics`
      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.clusterId = clusterId
      this.setPicList(listType, parsedList)
    },
    
    async movePicTo(
      listType,
      pic, 
      deleteFromSource
    ) {

      listType = listType == 'selected' ? this.$state.selectedListType : listType       
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
  
      this.setPicList(listType, picList)

      if (
        deleteFromSource && 
        pic !== selectedPic &&
        listType !== this.selectedListType
      ) 
        this.deletePic('selected', selectedPic.picId)
    
    },
    
    async deletePic(listType, picId) {
      listType = listType == 'selected' ? this.$state.selectedListType : listType 
      let picList = this.$state.picLists[listType]
      let index = picList.findIndex(pic => pic.picId === picId)
      picList.splice(index,1) 
      this.setPicList(listType, picList)
    },

    async save(listType) {
      listType = listType == 'selected' ? this.$state.selectedListType : listType 
      let picList = this.$state.picLists[listType]
      let clusterId = picList.clusterId
      let picIdCsv = picList.map(pic => pic.picId).join(',')
      throw 'save not yet implemented'      
    }

  },

  listTypeIsMain(listType) {
    if (!['main','other','selected'].includes(listType))
      throw 'listType must be "main", "other", or "selected"'
    if (listType === "selected")
      listType = selectedlistType
    return listType === 'main'
  }

})

