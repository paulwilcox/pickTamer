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
          <select @change="getPics($event.target.value)">
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

        <button v-if="selectedItem" @click="moveSelected(null, imageList)">
          move here
        </button>

      </div>

      <div id="otherImagesDiv" class="imageListContainer">

        <h2>Other picOrder:
          <select @change="getPics($event.target.value, 'other')">
            <option v-for="picOrder in picOrderList" 
              :value="picOrder.picOrderId"
            >
              {{picOrder.orderName}}
            </option>
          </select>
        </h2>

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
                @click="selectImage(item, otherImageList)"
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

  </main>
</template>

<script>
export default {
  data() {
    return {
      picOrderList: null,

      picOrderItem: null,
      imageList: null, 

      otherPicOrderItem: null,
      otherImageList: null, 

      selectedItem: null,
      selectedSourceList: null,
      selectedPickOrderItem: null
    };
  },
  methods: {
    async getPics(picOrderId, listType = 'main') {

      if (!['main','other'].includes(listType))
        throw 'listType must be "main" or "other"'

      if (picOrderId === undefined)
        picOrderId = null

      let picOrderItem = 
        this.picOrderList
        .find(item => item.picOrderId === picOrderId)

      if (picOrderId !== null)
        if(listType === 'main') 
          this.picOrderItem = picOrderItem
        else
          this.otherPicOrderItem = picOrderItem

      let response = await fetch(
        `http://localhost:3000/pics?picOrderId=${picOrderId}`
      )
      if (!response.ok) 
        throw `error fetching pics`

      let json = await response.json()
      let parsed = JSON.parse(json)
      if (listType === 'main') 
        this.imageList = parsed
      else
        this.otherImageList = parsed

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
      this.selectedItem = item
      this.selectedSourceList = sourceList
      this.selectedPickOrderItem = 
        sourceList === this.imageList ? this.picOrderItem
        : sourceList === this.otherImageList ? this.otherPicOrderItem
        : (() => { throw 'sourceList is null or unexpected value' })()
    },
    moveSelected(insertionType, targetItem, targetSourceList) {
      let targetPickOrderItem = 
        targetSourceList === this.imageList ? this.picOrderItem
        : targetSourceList === this.otherImageList ? this.otherPicOrderItem
        : (() => { throw 'targetSourceList is null or unexpected value' })()
      
    }
  },
  async mounted() {
    await this.getPicOrders();
    this.getPics();
    this.getPics(null, 'other')
  },
  beforeDestroy() {
    // to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style>

  .imageListContainer {
    height: 800px;
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
