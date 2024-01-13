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
    scrollSeconds: 5,
    fullScreenSwitch: false,
    message: "welcome",
    intervalId: null
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

    getPicUrl(pic,asVideoThumb) {
      let fileName = `${pic.picId}.${pic.extension}`
      let url = `http://localhost:3000/pics/getFile?fileName=${fileName}`
      if (asVideoThumb === true && pic.codes.videoThumb)
        url += pic.codes.videoThumb
      return url
    },

    setPicList(listId, picList) {
      listId = this.getProperListId(listId) 
      this.$state.picLists[listId] = picList
      console.log(`picList with id = ${listId} set`)
    },

    selectPic(listId, pic) { 
      this.$state.selectedPic = pic 
      this.$state.selectedListId = listId
      this.$state.videoIntervals = pic.codes.videoIntervals || []
      this.$state.message = `selected pic:${pic.picId}`
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

    async createEmptyPicList(clusterId) {
      clusterId = parseInt(clusterId)
      this.setPicList(clusterId, [])
    },

    async loadPics(clusterId) {
      clusterId = parseInt(clusterId)
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
      for(let pic of parsedList)
        this.loadCodes(pic)
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
    },

    slideShowToogle() {

      clearInterval(this.$state.intervalId)

      // if scrollStartPic exists, you're turning scroll off
      if (this.$state.scrollStartPic !== null) {
        this.$state.message = 'slideshow stopping'
        this.$state.selectedPic = this.$state.scrollStartPic
        this.$state.scrollStartPic = null
        this.$state.message = 'slideshow stopped'
        return
      }
      // otherwise, you're turning it on, it will scroll
      // in reverse, starting from selected pic.  It will
      // hit the beginning and start again at the selection

      this.$state.message = 'slideshow starting'

      try {
        if (!this.$state.selectedPic) 
          throw 'no selection to reference for sliding'
        if (this.$state.selectedPic.ord === 1)
          throw `doesn''t make sense to have a slideshow of one pic`
      }
      catch(ex) {
        this.$state.message = `error - ${ex.message}`
        return 
      }

      this.$state.scrollStartPic = this.$state.selectedPic
      this.$state.message = 'slideshow started'

      this.$state.intervalId = // capture intervalId for later destruction 
        setInterval(
          () => this.slideSelected(), 
          this.$state.scrollSeconds * 1000
        )

    },
    
    fullScreenToggle() {
      this.$state.fullScreenSwitch = !this.$state.fullScreenSwitch
      this.message = 
        'full-screen: ' 
        + (this.$state.fullScreenSwitch ? 'on' : 'off')
    },

    loadCodes(pic) {
      pic.codes = {
        errors: ''
      }

      try { pic.codes.videoIntervals = _parseVideoIntervals(pic.notes) }
      catch (ex) { pic.codes.errors += ` - ${ex.message}` }

      try { pic.codes.videoThumb = _parseVideoThumb(pic.notes) }
      catch (ex) { pic.codes.errors += ` - ${ex.message}` }
    }

  }

})

function _parseVideoThumb(picNote) {
  let regex = /(?<=videoThumb\:)\d+/i 
  let match = picNote.match(regex) 
  if (match === null) 
    throw 'could not find number in regex'
  match = match[0]
  return `#t=${match}`
}

function _parseVideoIntervals(picNote) {
  
  let regex = /(?<=videoIntervals\:)\[\[.*?\]\]/i 
  let match = picNote.match(regex) 

  if (match === null) 
    throw 'could not find nested array in regex'

  match = match[0]

  let parsed = JSON.parse(match)
  if (!Array.isArray(parsed)) 
    throw 'not an array'

  for(let row of parsed) {
    if (!Array.isArray(row)) throw 'not an array of arrays'
    if (!row.length === 2) throw 'array row not exactly two values'
    row[0] = Number(row[0])
    row[1] = Number(row[1])
    if (isNaN(row[0]) || isNaN(row[1])) throw 'inner array value not a number'
    if (!(row[0] <= row[1])) throw 'inner array values not in order'
  }
  
  return parsed

}