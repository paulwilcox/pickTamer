<template>
  <main>
    <h2>Ordered Pics:</h2>

    <div v-if="imageList !== null && imageList.length === 0">
      <div v-if="!lastSelectedType">
        No ordered pics found.  
        Select an unordered image to prepare it for ordering.
      </div>
      <div v-else>
        <button @click="moveSelected('initial')">
          add {{lastSelectedName}} here
        </button>
      </div>
    </div>

    <div v-for="(item, index) in imageList" :key="index" class="image-container">
      <table>
        <tr>
          <td class="imgTd"></td>
          <td class="imgTd">
            <button @click="moveSelected('before',item,index)">
              move {{lastSelectedName}} here
            </button>
          </td>
          <td class="imgTd"></td>
        </tr>
        <tr>
          <td class="imgTd">
            <button @click="moveSelected('before',item,index)">
              move {{lastSelectedName}} here
            </button>
          </td>
          <td>
            <img
              :src="getImageUrl(item)"
              :alt="`image-ix-${index}`"
              @click="selectImage(item, index)"
              :class="{ selected: selectedIndex === index }"
            >
          </td>
          <td class="imgTd">
            <button @click="moveSelected('after',item,index)">
              move {{lastSelectedName}} here
            </button>
          </td>
        </tr>
        <tr>
          <td class="imgTd"></td>
          <td class="imgTd">
            <button @click="moveSelected('after',item,index)">
              move {{lastSelectedName}} here
            </button>
          </td>
          <td class="imgTd"></td>
        </tr>
      </table>
    </div>

    <hr/>

    <h2>Unordered Pics:</h2>
    <div v-for="(item, index) in unorderedList" :key="index" class="image-container">
      <img
        :src="getImageUrl(item)"
        :alt="`image-ix-${index}`"
        @click="selectUnorderedImage(item, index)"
        :class="{ selected: unorderedSelectedIndex === index }"
      >
    </div>

  </main>
</template>

<script>
export default {
  data() {
    return {
      imageList: null, 
      unorderedList: null,
      lastSelectedType: null,
      selectedIndex: null,
      selectedItem: null,
      unorderedSelectedIndex: null,
      unorderedSelectedItem: null
    };
  },
  computed: {
    lastSelectedName() { 
      if(this.lastSelectedType == 'unordered') 
        return `${this.unorderedSelectedItem.picId}.${this.unorderedSelectedItem.extension}`
      if(this.lastSelectedType == 'ordered')
        return `${this.selectedItem.picId}.${this.selectedItem.extension}`
      throw 'no item of any type has been selected yet'
    }
  },
  methods: {
    async fetchData() {
      let response = await fetch('http://localhost:3000/pics')
      if (!response.ok) 
        throw `error fetching data`
      let json = await response.json()
      let parsed = JSON.parse(json)
      this.imageList = parsed.filter(item => item.isOrdered)
      this.unorderedList = parsed.filter(item => !item.isOrdered)
    },
    getImageUrl(imageItem) {
      let fileName = `${imageItem.picId}.${imageItem.extension}`
      return `http://localhost:3000/image?fileName=${fileName}`
    },
    async selectImage(item, index) {
      await fetch(`http://localhost:3000/pics/select?picId=${item.picId}`)
      this.selectedIndex = index
      this.selectedItem = item
      this.lastSelectedType = 'ordered'
    },
    async selectUnorderedImage(item, index) {
      this.unorderedSelectedIndex = index
      this.unorderedSelectedItem = item
      this.lastSelectedType = 'unordered'
    },
    moveSelected(insertionType,item,index) {

      if(insertionType == 'initial') {
        alert('initial')
        let removed = this.unorderedList.splice(this.unorderedSelectedIndex, 1)[0]
        this.imageList.splice(0,0,removed) 
        return 
      }

    }
  },
  mounted() {
    this.fetchData();
  },
  beforeDestroy() {
    // to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style>

  .image-container {
    margin: 10px;
    cursor: pointer;
    display: inline-block;
  }

  .imgUpperLeft,.imgUpper,.imgUpperRight,
  .imgLeft,.imgRight, 
  .imgLowerLeft,.imgLower,.imgLowerRight{
    border: solid 1px red;
    width: 25px;
    height: 25px;
  }

  .selected {
    border: 2px solid blue;
  }

</style>
