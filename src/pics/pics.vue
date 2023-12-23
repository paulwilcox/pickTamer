<template>
  <main>

    <h2>Selected:</h2>

    <div v-if="this.selectedItem">
      <img
        :src="getImageUrl(this.selectedItem)"
        :alt="`image-picId-${this.selectedItem.picId}`"
        style="max-height: 500px;"
      >
    </div>

    <hr/>

    <div>

      <div id="imagesDiv" class="imageListContainer">
        <h2>picOrder:
          <select id="ddPicOrder" @change="getPics($event.target.value, imageList)">
            <option value="" disabled selected>choose</option>            
            <option v-for="picOrder in picOrderList" 
              :value="picOrder.picOrderId"
            >
              {{picOrder.orderName}}
            </option>
          </select>
        </h2>

        <table v-for="item in imageList" class="imgTable">
          <tr>
            <td></td>
            <td>
              <div v-if="selectedItem">
                <button @click="deleteImage(item, imageList)">
                  delete
                </button>
                <button @click="moveSelected(item, imageList, true)">
                  move here
                </button>
                <button v-if="selectedList !== imageList" @click="moveSelected(item, imageList, false)">
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
                :src="getImageUrl(item)"
                :alt="`image-ix-${item.picId}`"
                @click="selectImage(item, imageList)"
                :class="{ selected: selectedItem && item && selectedItem.picId === item.picId }"
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

        <div v-if="selectedItem">
          <button @click="moveSelected(null, imageList, true)">
            move here
          </button>
          <button @click="moveSelected(null, imageList, false)">
            copy here
          </button>
        </div>

      </div>

      <div id="otherImagesDiv" class="imageListContainer">

        <h2>Other picOrder:
          <select id="ddOtherPicOrder" @change="getPics($event.target.value, otherImageList)">
            <option value="" disabled selected>choose</option>            
            <option v-for="picOrder in picOrderList" 
              :value="picOrder.picOrderId"
            >
              {{picOrder.orderName}}
            </option>
          </select>
        </h2>

        <div v-if="this.showOtherImageList()">
          <table v-for="item in otherImageList" class="imgTable">
            <tr>
              <td></td>
              <td>
                <div v-if="selectedItem">
                  <button @click="deleteImage(item, otherImageList)">
                    delete
                  </button>
                  <button @click="moveSelected(item, otherImageList, true)">
                    move here
                  </button>
                  <button v-if="selectedList !== otherImageList" @click="moveSelected(item, otherImageList, false)">
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
                  :src="getImageUrl(item)"
                  :alt="`image-ix-${item.picId}`"
                  @click="selectImage(item, imageList)"
                  :class="{ selected: selectedItem && item && selectedItem.picId === item.picId }"
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

          <div v-if="selectedItem">
            <button @click="moveSelected(null, otherImageList, true)">
              move here
            </button>
            <button @click="moveSelected(null, otherImageList, false)">
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
      picOrderList: [],
      imageList: [], 
      otherImageList: [], 
      selectedItem: null,
      selectedList: null
    };
  },
  methods: {
    async getPics(picOrderId, list) {

      if (list !== this.imageList && list !== this.otherImageList)
        throw 'list is null or of unexpected value'

      let response = await fetch(
        `http://localhost:3000/pics?picOrderId=${picOrderId}`
      )
      if (!response.ok) 
        throw `error fetching pics`

      let json = await response.json()
      let parsedList = JSON.parse(json)
      parsedList.picOrderId = picOrderId

      // todo: unselect may be more drastic than necessary in many cases
      if (list === this.imageList) 
        this.imageList = parsedList
      else 
        this.otherImageList = parsedList

    },
    async getPicOrders() {
      let response = await fetch('http://localhost:3000/pics/picOrders')
      if (!response.ok) 
        throw `error fetching picOrders`
      let json = await response.json()
      this.picOrderList = JSON.parse(json)
    },
    getImageUrl(imageItem) {
      let fileName = `${imageItem.picId}.${imageItem.extension}`
      return `http://localhost:3000/image?fileName=${fileName}`
    },
    async selectImage(item, sourceList) {
      if (item === this.selectedItem) {
        this.selectedItem = null 
        this.selectedList = null
      }
      else {
        this.selectedItem = item
        this.selectedList = sourceList
      }
    },
    async moveSelected(
      targetItem, 
      targetList,
      deleteFromSource
    ) {
      
      let targetIndex = 
        !targetItem 
        ? targetList.length // put to end
        : targetList.findIndex(item => item.picId == targetItem.picId) 

      let existingIndex =
        targetList
        .findIndex(item => item.picId == this.selectedItem.picId)

      /* presentation move */

      if (existingIndex >= 0) {
        let removed = targetList.splice(existingIndex,1)[0]
        // when you splice out the source, indexes 
        // of all items that come after reduce by 1
        if (targetIndex > existingIndex)
          targetIndex-- 
        targetList.splice(targetIndex, 0, removed)
      }
      else 
        targetList.splice(targetIndex, 0, this.selectedItem)

      /* database move */

      let picOrderId = targetList.picOrderId
      let picId = targetList[targetIndex].picId
      let picToMoveAfterId = targetIndex == 0 
        ? null 
        : targetList[targetIndex - 1].picId
      
      let response = await fetch(
          `http://localhost:3000/pics/upsertPicOrderItem` + 
          `?picOrderId=${picOrderId}` + 
          `&picId=${picId}` + 
          `&picToMoveAfterId=${picToMoveAfterId}`
      )
      if (!response.ok) 
        throw `error upserting picOrderItem` 

      if (
        deleteFromSource && 
        targetItem !== this.selectedItem &&
        targetList !== this.selectedList
      ) 
        this.deleteImage(this.selectedItem, this.selectedList)

    },
    async deleteImage(item, list) {
      let index = list.findIndex(listItem => listItem.picId == item.picId)
      list.splice(index,1) 
      let response = await fetch(
          `http://localhost:3000/pics/deletePicOrderItem` + 
          `?picOrderId=${list.picOrderId}` + 
          `&picId=${item.picId}`
      )
      if (!response.ok) 
        throw `error deleting pic` 
    },
    showOtherImageList() {
      let pickOrderId = this.imageList.picOrderId
      let otherPickOrderId = this.otherImageList.picOrderId
      return pickOrderId != otherPickOrderId && otherPickOrderId >= 0
    }
  },
  async mounted() {
    await this.getPicOrders()
  },
  beforeDestroy() {
    // to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style>

  .imageListContainer {
    height: 600px;
    border: 1px solid green;
    overflow: auto;
    width: 50%; 
    float: left;    
  }

  .imgTable {
    display: inline-block;
  }

  .imgTable td {
    border: solid 1px red;
    width: 25px;
    height: 25px;
    margin: 10px;
  }

  .selected {
    border: 2px solid blue;
  }

</style>
