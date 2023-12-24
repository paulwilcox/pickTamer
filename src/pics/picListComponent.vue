<template>

  <div :id="id" class="picListContainer" :style="style">

    <div class="header">cluster
      <select id="ddCluster" @change="getPics($event.target.value)">
        <option value="" disabled selected>choose</option>            
        <option v-for="cluster in clusterList" 
          :value="cluster.clusterId"
        >
          {{cluster.clusterName}}
        </option>
      </select>
    </div>

    <div class="picTablesDiv">
      <table v-for="pic in picList" class="picTable">
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>
            <img
              :src="getPicUrl(pic)"
              :alt="`pic-${pic.picId}`"
              @click="selectPic(pic, picList)"
              :class="{ selected: selectedPicStore.pic && selectedPicStore.pic.picId === pic.picId }"
              style="max-width: 150px;"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div v-if="selectedPicStore.pic" style="text-align: right;">
              <button @click="moveSelected(pic, true)" class="linkButton">
                move-here
              </button>
              <button v-if="selectedPicStore.sourceList !== picList" @click="moveSelected(pic, false)" class="linkButton">
                copy-here
              </button>
              <button @click="deletePic(pic, picList)" class="linkButton">
                x
              </button>
            </div>
          </td>
          <td></td>
        </tr>
      </table>
    </div>

    <div v-if="true">
      <button @click="moveSelected(null, true)" class="linkButton">
        move here
      </button>
      <button @click="moveSelected(null, false)" class="linkButton">
        copy here
      </button>
    </div>

  </div>

</template>
<script>
import picStore from './picStore.js'

export default {
  props: {
    id: { type: String, required: true },
    style: { type: Object, required: true }
  },
  data() {
    return {
      clusterList: [],
      picList: [],
      selectedPicStore: null
    }
  },
  async mounted() {
    this.selectedPicStore = picStore()
    await this.getClusters()
  },
  methods: {
    async getClusters() {
      let response = await fetch('http://localhost:3000/clusters')
      if (!response.ok) 
        throw `error fetching clusters`
      let json = await response.json()
      this.clusterList = JSON.parse(json)
    },
    async getPics(clusterId) {
      let response = await fetch(
        `http://localhost:3000/pics?clusterId=${clusterId}`
      )
      if (!response.ok) 
        throw `error fetching pics`

      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.clusterId = clusterId
      this.picList = parsedList
    },
    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/pics/getFile?fileName=${fileName}`
    },
    async selectPic(pic, picList) {
      if (pic === this.selectedPicStore.pic) {
        this.selectedPicStore.pic = null 
        this.selectedPicStore.sourceList = null
      }
      else {
        this.selectedPicStore.pic = pic
        this.selectedPicStore.sourceList = picList
      }
    },
    // todo: consider presentation moves only, with save later
    // to prevent anxiety over layers being out of sync if there
    // is ever a bug in one of them but not the other
    async moveSelected(
      targetPic, 
      deleteFromSource
    ) {
      
      let targetIndex = 
        !targetPic 
        ? this.picList.length // put to end
        : this.picList.findIndex(pic => pic.picId == targetPic.picId) 

      let existingIndex =
        this.picList
        .findIndex(pic => pic.picId == this.selectedPicStore.pic.picId)

      /* presentation move */

      if (existingIndex >= 0) {
        let removed = this.picList.splice(existingIndex,1)[0]
        // when you splice out the source, indexes 
        // of all pic that come after reduce by 1
        if (targetIndex > existingIndex)
          targetIndex-- 
        this.picList.splice(targetIndex, 0, removed)
      }
      else 
        this.picList.splice(targetIndex, 0, this.selectedPicStore.pic)

      /* database move */
/*
      let clusterId = this.picList.clusterId
      let picId = this.picList[targetIndex].picId
      let picToMoveBeforeId = targetIndex === this.picList.length - 1 
        ? null 
        : this.picList[targetIndex + 1].picId
      
      let response = await fetch(
          `http://localhost:3000/pics/upsertClusterPic` + 
          `?clusterId=${clusterId}` + 
          `&picId=${picId}` + 
          `&picToMoveBeforeId=${picToMoveBeforeId}`
      )
      if (!response.ok) 
        throw `error upserting clusterPic` 
*/

      if (
        deleteFromSource && 
        targetPic !== this.selectedPicStore.pic &&
        this.picList !== this.selectedPicStore.sourceList
      ) 
        this.deleteSelectedPic()

    },
    async deletePic(pic, list) {
      let index = list.findIndex(listItem => listItem.picId == pic.picId)
      list.splice(index,1) 
/*      let response = await fetch(
          `http://localhost:3000/pics/deleteClusterPic` + 
          `?clusterId=${list.clusterId}` + 
          `&picId=${pic.picId}`
      )
      if (!response.ok) 
        throw `error deleting pic` 
*/
    },
    async deleteSelectedPic() {
      let index = this.selectedPicStore.sourceList.findIndex(listItem => 
        listItem.picId == this.selectedPicStore.pic.picId
      )
      this.selectedPicStore.modifySourceList(list => 
        list.splice(index,1) 
      )
/*
      let response = await fetch(
          `http://localhost:3000/pics/deleteClusterPic` + 
          `?clusterId=${this.selectedPicStore.sourceList.clusterId}` + 
          `&picId=${this.selectedPicStore.sourceList.pic.picId}`
      )
      if (!response.ok) 
        throw `error deleting selected pic` 
*/
    }
  }
}
</script>
<style>
  .picTablesDiv {
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap to the next line */
    align-items: flex-start;
  }

  .picTable {
    display: inline-block;
    border-collapse: collapse;
    border: 1px solid darkgreen;    
  }
</style>