import { defineStore } from 'pinia';

export default defineStore({

  id: 'picStore',
  key: 'picStore',

  state: () => ({
    pic: null,
    sourceList: []
  }),

  getters: {
    getPic: state => state.pic,
    getSourceList: state => state.sourceList
  },

  actions: {
    setPic(val) { this.$state.pic = val },
    modifyPic(func) { func(this.pic) },

    setSourceList(val) { this.$state.sourceList = val },
    modifySourceList(func) { func(this.sourceList) }
  },

  set pic(val) { this.actions.setPic(val) },

})
