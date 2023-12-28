<template>

  <div :id="id" class="picListContainer" :style="style">

    <div class="header">
      <ddClusterComponent @onSelected="clusterSelected"/>
      <span v-if="store.getChanged(listType)">
        <i style="font-size:small;"> (unsaved)</i>
      </span>
      <i style="font-size:small; margin-left: 5px;">
        {{ store.getPicList(listType).length }}
      </i>
      <div>
        <button @click="store.pageFirst(listType)" class="linkButton">
          &lt;&lt;
        </button>
        <button @click="store.pageDown(listType)" class="linkButton">
          &lt;
        </button>
        <button @click="scrollToSelected()" class="linkButton">
          selected
        </button>
        <button @click="store.pageUp(listType)" class="linkButton">
          &gt;
        </button>
        <button @click="store.pageLast(listType)" class="linkButton">
          &gt;&gt;
        </button>
      </div>
    </div>

    <div v-if="
      store.selectedPic && 
      store.getClusterId(listType) !== null &&
      store.getPicList(listType).length > 0
    ">
      <button @click="store.movePicTo(listType, null, true)" class="linkButton">
        move to end
      </button>
      <button @click="store.movePicTo(listType, null, false)" class="linkButton">
        copy to end
      </button>
    </div>

    <div class="picTablesDiv">
      <table v-for="pic in store.getPicListPage(listType)" class="picTable">
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>
            <img
              :src="store.getPicUrl(pic)"
              :alt="`pic-${pic.picId}`"
              @click="store.selectPic(listType, pic)"
              :class="{ selected: store.selectedPic && store.selectedPic.picId === pic.picId }"
              style="max-width: 150px;"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="picInfo">{{pic.ord}}</div>
            <div v-if="store.selectedPic" style="text-align: right;">
              <button @click="store.movePicTo(listType, pic, true)" class="linkButton">
                move
              </button>
              <button v-if="store.selectedListType !== listType" @click="store.movePicTo(listType, pic, false)" class="linkButton">
                copy
              </button>
              <button @click="store.deletePic(listType, pic.picId)" class="linkButton">
                x
              </button>
            </div>
          </td>
          <td></td>
        </tr>
      </table>
    </div>

    <div v-if="store.selectedPic && store.getClusterId(listType) !== null">
      <button @click="store.movePicTo(listType, null, true)" class="linkButton">
        move here
      </button>
      <button @click="store.movePicTo(listType, null, false)" class="linkButton">
        copy here
      </button>
    </div>

  </div>

</template>
<script>
  import storeDef from './store.js'
  import ddClusterComponent from '../clusters/ddClusterComponent.vue'  
  import { ref } from 'vue'

  export default {
    props: {
      id: { type: String, required: false },
      style: { type: Object, required: true }
    },
    setup() {
      let store = ref(storeDef())  
      let listType = ref("empty")
      return { store, listType }
    },
    mounted() {
      this.store.loadPics(this.listType) // listType should be 'empty'
    },
    components: {
      ddClusterComponent
    },
    methods: {
      async clusterSelected(cluster) {
        await this.store.loadPics(cluster?.clusterId)
        this.listType = cluster?.clusterId || 'empty'
      },
      async scrollToSelected() {
        await this.store.pageSelected(this.listType)
        let selectedElement = 
          document.querySelector(`#${this.id} .selected`);
        selectedElement?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center' 
        })
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

  .picInfo {
    float: left;
    text-align: left; 
    font-size:small;
    font-style: italic;
    color: lightslategray;
    vertical-align: middle;
    padding: 1px;
    margin-top: 4px;
  }
</style>