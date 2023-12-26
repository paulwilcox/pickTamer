<template>
  <main>

    <div style="height:80%;">

      <div id="selectedPicDiv" class="picListContainer" style="width:45%;">
        <div class="header">
          selected
          <div>
            <button class="linkButton" @click="store.save()">
              save
            </button>
          </div>
        </div>

        <div v-if="store.selectedPic">
          <img
            :src="store.getPicUrl(store.selectedPic)"
            :alt="`picId-${store.selectedPic.picId}`"
            style="max-width:100%;"
          >
        </div>
      </div>

      <picListComponent 
        id="mainPicComponent" 
        listType="main"
        style="width:35%"
      />

      <picListComponent 
        id="otherPicComponent"
        listType="other" 
        style="width:20%"
      />

    </div>

  </main>
</template>

<script>
  import picListComponent from './picListComponent.vue'
  import storeDef from './store.js'
  import { ref, onMounted } from 'vue';

  export default {
    components: {
      picListComponent
    },
    setup() {
      let store = ref(storeDef())

      onMounted(async () => {
        await store.value.loadClusterList()
      });

      return { store }
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

  #mainPicComponent { background-color: #f4fdf4; }
  #mainPicComponent::-webkit-scrollbar { background-color: #f4fdf4 }
  #mainPicComponent::-webkit-scrollbar-thumb { background-color: #00cc0022; }
  #mainPicComponent .header { background-color: #00cc0022; }

  #otherPicComponent { background-color: #f6cccb; }
  #otherPicComponent::-webkit-scrollbar { background-color: rgb(228, 170, 184) }
  #otherPicComponent::-webkit-scrollbar-thumb { background-color: rgba(255, 0, 0, 0.71); }
  #otherPicComponent .header { background-color: rgba(255, 0, 0, 0.71); }

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
