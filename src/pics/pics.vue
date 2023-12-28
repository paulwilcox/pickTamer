<template>
  <main>

    <div style="height:80%;">

      <div id="selectedPicDiv" class="picListContainer" style="width:45%;">

        <div class="header">
          selected
          <div>
            <span id="message" style="margin-left: 15px;">{{ store.message }}</span>
          </div>
        </div>

        <div v-if="store.selectedPic">
          <img
            :src="store.getPicUrl(store.selectedPic)"
            :alt="`picId-${store.selectedPic.picId}`"
            style="max-width:100%; max-height: 500px;"
          >
          <div id="selectedInfo">
            picId: {{ store.selectedPic.picId }}<br/>
            extension: {{ store.selectedPic.extension }}
          </div>
          <div>
            <label>label</label><br/>
            <input id="labelInput" v-model="store.selectedPic.label"/>
          </div>
          <div>
            <label>description</label><br/>
            <textarea 
              id="descInput" 
              v-model="store.selectedPic.description"
              cols="50"
            >
            </textarea>
          </div>
          <div>
            <label>notes</label><br/>
            <textarea 
              id="notesInput" 
              v-model="store.selectedPic.notes"
              cols="50"
              rows="4"
            >
            </textarea>
          </div>
        </div>

      </div>

      <picListComponent id="mainPicComponent" style="width:35%" />
      <picListComponent id="otherPicComponent" style="width:20%" />

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

  div {
    margin-top: 3px;
  }

  .picListContainer {
    height: 600px;
    overflow: auto;
    float: left;    
    border: 1px solid green;
    padding: 10px;
  }

  #selectedPicDiv .header { background-color: rgba(63, 63, 63, 0.25); }
  #selectedPicDiv td { vertical-align: top; }

  #mainPicComponent { background-color: #f4fdf4; }
  #mainPicComponent::-webkit-scrollbar { background-color: #f4fdf4 }
  #mainPicComponent::-webkit-scrollbar-thumb { background-color: #00cc0022; }
  #mainPicComponent .header { background-color: #00cc0022; }

  #otherPicComponent { background-color: #ffecdd  }
  #otherPicComponent::-webkit-scrollbar { background-color: #e8d6bfcc; }
  #otherPicComponent::-webkit-scrollbar-thumb { background-color: #ffca9ab8; }
  #otherPicComponent .header { background-color: #ffca9ab8; }

  .selected {
    border: 2px solid blue;
  }

  .header {
    font-size: medium;
    border:1px solid rgb(151, 158, 158);
    padding: 5px;
    margin-bottom: 5px;
  }

  label, #selectedInfo, #message {
    font-size: small;
    font-style: italic;
    color: darkslateblue;
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
