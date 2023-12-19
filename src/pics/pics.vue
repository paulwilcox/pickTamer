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
              <button v-if="selectedItem" @click="moveSelected(item, imageList)">
                move here
              </button>
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <img
                :src="getImageUrl(item)"
                :alt="`image-ix-${item.picId}`"
                @click="selectImage(item)"
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

        <button v-if="selectedItem" @click="moveSelected(null, imageList)">
          move here
        </button>

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

        <div v-if="!this.pickOrdersAreSame()">
          <table v-for="item in otherImageList" class="imgTable">
            <tr>
              <td></td>
              <td>
                <button v-if="selectedItem" @click="moveSelected(item, otherImageList)">
                  move here
                </button>
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>
                <img
                  :src="getImageUrl(item)"
                  :alt="`image-ix-${item.picId}`"
                  @click="selectImage(item)"
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

          <button v-if="selectedItem" @click="moveSelected(null, otherImageList)">
            move here
          </button>

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
    async selectImage(item) {
      this.selectedItem = item === this.selectedItem ? null : item
    },
    moveSelected(targetItem, targetSourceList) {
      
      let targetIndex = 
        !targetItem 
        ? targetSourceList.length // put to end
        : targetSourceList.findIndex(item => item.picId == targetItem.picId) 

      let existingIndex =
        targetSourceList
        .findIndex(item => item.picId == this.selectedItem.picId)

      if (existingIndex >= 0) {
        let removed = targetSourceList.splice(existingIndex,1)[0]
        // when you splice out the source, indexes 
        // of all items that come after reduce by 1
        if (targetIndex > existingIndex)
          targetIndex-- 
        targetSourceList.splice(targetIndex, 0, removed)
      }
      else 
        targetSourceList.splice(targetIndex, 0, this.selectedItem)

    },
    pickOrdersAreSame() {
      let pickOrderId = document.querySelector('#ddPicOrder')?.value
      let otherPickOrderId = document.querySelector('#ddOtherPicOrder')?.value
      return pickOrderId == otherPickOrderId;
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
