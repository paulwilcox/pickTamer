<template>
  <main>

    <div style="height:80%;">

      <div id="selectedPicDiv" class="picListContainer" style="width:45%;">
        <div class="header">selected</div>

        <div v-if="selectedPicStore.pic">
          <img
            :src="getPicUrl(this.selectedPicStore.pic)"
            :alt="`picId-${this.selectedPicStore.pic.picId}`"
            style="max-width:100%;"
          >
        </div>
      </div>

      <picListComponent 
        id="mainListDiv" 
        style="width:35%"
      />

      <picListComponent 
        id="otherListDiv" 
        style="width:20%"
      />

    </div>

  </main>
</template>

<script>
import picListComponent from './picListComponent.vue'
import picStore from './picStore.js'
import { ref } from 'vue';
export default {
  components: {
    picListComponent
  },
  methods: {
    getPicUrl(pic) {
      let fileName = `${pic.picId}.${pic.extension}`
      return `http://localhost:3000/pics/getFile?fileName=${fileName}`
    },
    /* showOtherPicList() {
      let clusterId = this.mainPicList.clusterId
      let otherClusterId = this.otherPicList.clusterId
      return clusterId != otherClusterId && otherClusterId >= 0
    }*/
  },
  setup() {
    let selectedPicStore = ref(picStore())
    return { selectedPicStore }
  }
}
</script>

<style>

  .picListContainer {
    height: 600px;
    overflow: auto;
    float: left;    
    border: 1px solid green;
    padding: 10px;
  }

  #selectedPicDiv .header { background-color: rgba(63, 63, 63, 0.25); }

  #mainListDiv { background-color: #f4fdf4; }
  #mainListDiv::-webkit-scrollbar { background-color: #f4fdf4 }
  #mainListDiv::-webkit-scrollbar-thumb { background-color: #00cc0022; }
  #mainListDiv .header { background-color: #00cc0022; }

  #otherListDiv { background-color: #f6cccb; }
  #otherListDiv::-webkit-scrollbar { background-color: rgb(228, 170, 184) }
  #otherListDiv::-webkit-scrollbar-thumb { background-color: rgba(255, 0, 0, 0.71); }
  #otherListDiv .header { background-color: rgba(255, 0, 0, 0.71); }

  .selected {
    border: 2px solid blue;
  }

  .header {
    font-size: medium;
    border:1px solid rgb(151, 158, 158);
    padding: 5px;
    margin-bottom: 5px;
  }

  .linkButton {
    background: none;
    border: none;
    color: #007bff; /* Set the color to the link color you want */
    cursor: pointer;
    padding-right: 5px;
    font: inherit;
    font-size: small;
    vertical-align: middle;
    text-align: center;
  }  

</style>
