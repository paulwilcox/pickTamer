<template>
  <main>

    <h2>Selected:</h2>

    <div v-if="this.selectedPic">
      <img
        :src="getPicUrl(this.selectedPic)"
        :alt="`picId-${this.selectedPic.picId}`"
        style="max-height: 500px;"
      >
    </div>

    <hr/>

    <div>

      <div class="picListContainer">
        <h2>cluster:
          <select id="ddCluster" @change="getPics($event.target.value, mainPicList)">
            <option value="" disabled selected>choose</option>            
            <option v-for="cluster in clusterList" 
              :value="cluster.clusterId"
            >
              {{cluster.clusterName}}
            </option>
          </select>
        </h2>

        <table v-for="pic in mainPicList" class="picTable">
          <tr>
            <td></td>
            <td>
              <div v-if="selectedPic">
                <button @click="deletePic(pic, mainPicList)">
                  delete
                </button>
                <button @click="moveSelected(pic, mainPicList, true)">
                  move here
                </button>
                <button v-if="selectedPicList !== mainPicList" @click="moveSelected(pic, mainPicList, false)">
                  copy here
                </button>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <img
                :src="getPicUrl(pic)"
                :alt="`pic-${pic.picId}`"
                @click="selectPic(pic, mainPicList)"
                :class="{ selected: selectedPic && pic && selectedPic.picId === pic.picId }"
                style="max-width: 150px;"
              >
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>

        <div v-if="selectedPic">
          <button @click="moveSelected(null, mainPicList, true)">
            move here
          </button>
          <button @click="moveSelected(null, mainPicList, false)">
            copy here
          </button>
        </div>

      </div>

      <div class="picListContainer">

        <h2>Other cluster:
          <select id="ddOtherCluster" @change="getPics($event.target.value, otherPicList)">
            <option value="" disabled selected>choose</option>            
            <option v-for="cluster in clusterList" 
              :value="cluster.clusterId"
            >
              {{cluster.clusterName}}
            </option>
          </select>
        </h2>

        <div v-if="this.showOtherPicList()">
          <table v-for="pic in otherPicList" class="picTable">
            <tr>
              <td></td>
              <td>
                <div v-if="selectedPic">
                  <button @click="deletePic(pic, otherPicList)">
                    delete
                  </button>
                  <button @click="moveSelected(pic, otherPicList, true)">
                    move here
                  </button>
                  <button v-if="selectedPicList !== otherPicList" @click="moveSelected(pic, otherPicList, false)">
                    copy here
                  </button>
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>
                <img
                  :src="getPicUrl(pic)"
                  :alt="`picId-${pic.picId}`"
                  @click="selectPic(pic, mainPicList)"
                  :class="{ selected: selectedPic && pic && selectedPic.picId === pic.picId }"
                  style="max-width: 150px;"
                >
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>

          <div v-if="selectedPic">
            <button @click="moveSelected(null, otherPicList, true)">
              move here
            </button>
            <button @click="moveSelected(null, otherPicList, false)">
              copy here
            </button>            
          </div>  

        </div>

      </div>

    </div>

  </main>
</template>

<script>
export default {
  data() {
    return {
      clusterList: [],
      mainPicList: [], 
      otherPicList: [], 
      selectedPic: null,
      selectedPicList: null
    };
  },
  methods: {
    async getPics(clusterId, list) {

      if (list !== this.mainPicList && list !== this.otherPicList)
        throw 'list is null or of unexpected value'

      let response = await fetch(
        `http://localhost:3000/pics?clusterId=${clusterId}`
      )
      if (!response.ok) 
        throw `error fetching pics`

      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.clusterId = clusterId

      // todo: unselect may be more drastic than necessary in many cases
      if (list === this.mainPicList) 
        this.mainPicList = parsedList
      else 
        this.otherPicList = parsedList

    },
    async getClusters() {
      let response = await fetch('http://localhost:3000/pics/clusters')
      if (!response.ok) 
        throw `error fetching clusters`
      let json = await response.json()
      this.clusterList = JSON.parse(json)
    },
    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/image?fileName=${fileName}`
    },
    async selectPic(pic, picList) {
      if (pic === this.selectedPic) {
        this.selectedPic = null 
        this.selectedPicList = null
      }
      else {
        this.selectedPic = pic
        this.selectedPicList = picList
      }
    },
    async moveSelected(
      targetPic, 
      targetList,
      deleteFromSource
    ) {
      
      let targetIndex = 
        !targetPic 
        ? targetList.length // put to end
        : targetList.findIndex(pic => pic.picId == targetPic.picId) 

      let existingIndex =
        targetList
        .findIndex(pic => pic.picId == this.selectedPic.picId)

      /* presentation move */

      if (existingIndex >= 0) {
        let removed = targetList.splice(existingIndex,1)[0]
        // when you splice out the source, indexes 
        // of all pic that come after reduce by 1
        if (targetIndex > existingIndex)
          targetIndex-- 
        targetList.splice(targetIndex, 0, removed)
      }
      else 
        targetList.splice(targetIndex, 0, this.selectedPic)

      /* database move */

      let clusterId = targetList.clusterId
      let picId = targetList[targetIndex].picId
      let picToMoveAfterId = targetIndex == 0 
        ? null 
        : targetList[targetIndex - 1].picId
      
      let response = await fetch(
          `http://localhost:3000/pics/upsertClusterPic` + 
          `?clusterId=${clusterId}` + 
          `&picId=${picId}` + 
          `&picToMoveAfterId=${picToMoveAfterId}`
      )
      if (!response.ok) 
        throw `error upserting clusterPic` 

      if (
        deleteFromSource && 
        targetPic !== this.selectedPic &&
        targetList !== this.selectedPicList
      ) 
        this.deletePic(this.selectedPic, this.selectedPicList)

    },
    async deletePic(pic, list) {
      let index = list.findIndex(listItem => listItem.picId == pic.picId)
      list.splice(index,1) 
      let response = await fetch(
          `http://localhost:3000/pics/deleteClusterPic` + 
          `?clusterId=${list.clusterId}` + 
          `&picId=${pic.picId}`
      )
      if (!response.ok) 
        throw `error deleting pic` 
    },
    showOtherPicList() {
      let clusterId = this.mainPicList.clusterId
      let otherClusterId = this.otherPicList.clusterId
      return clusterId != otherClusterId && otherClusterId >= 0
    }
  },
  async mounted() {
    await this.getClusters()
  },
  beforeDestroy() {
    // to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style>

  .picListContainer {
    height: 600px;
    border: 1px solid green;
    overflow: auto;
    width: 50%; 
    float: left;    
  }

  .picTable {
    display: inline-block;
  }

  .picTable td {
    border: solid 1px red;
    width: 25px;
    height: 25px;
    margin: 10px;
  }

  .selected {
    border: 2px solid blue;
  }

</style>
