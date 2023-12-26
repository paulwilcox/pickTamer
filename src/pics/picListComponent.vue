<template>

  <div :id="id" class="picListContainer" :style="style">

    <div class="header">
      <select 
        id="ddCluster"
        :disabled="store.getChanged(listType)" 
        @change="store.loadPics(listType,$event.target.value)"
      >
        <option value="" disabled selected>choose</option>            
        <option v-for="cluster in store.clusterList" 
          :value="cluster.clusterId"
        >
          {{ cluster.clusterName }}
        </option>
      </select>
      <span v-if="store.getChanged(listType)">
        <i style="font-size:small;"> (unsaved)</i>
      </span>
    </div>

    <div class="picTablesDiv" v-if="listType == 'main' || store.showOtherPicList()">
      <table v-for="pic in store.getPicList(listType)" class="picTable">
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
            <div v-if="store.selectedPic" style="text-align: right;">
              <button @click="store.movePicTo(listType, pic, true)" class="linkButton">
                move-here
              </button>
              <button v-if="store.selectedListType !== listType" @click="store.movePicTo(listType, pic, false)" class="linkButton">
                copy-here
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
  import { ref } from 'vue'

  export default {
    props: {
      id: { type: String, required: false },
      style: { type: Object, required: true },
      listType: { type: String, required: true }
    },
    setup(props) {

      let listType = ref(props.listType)
      let store = ref(storeDef())

      if(!['main','other'].includes(props.listType))
        throw 'listType prop must be "main" or "other"' 
      
      return {
        listType,
        store
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