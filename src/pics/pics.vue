<template>
  <main>

    <div style="height:80%;">

      <div id="selectedPicDiv" class="picListContainer" style="width:45%;">

        <div class="header">
          selected
          <button 
            class="linkButton" 
            style="margin-left: 5px;"
            @click="store.slideShowToogle()" 
            v-if="this.store.selectedPic"
          >
            {{ this.store.scrollStartPic === null ? 'slide' : 'stop-slide' }}
          </button>
          <div >
            <span id="message" style="margin-left: 15px;">{{ store.message }}</span>
          </div>
        </div>

        <div v-if="store.selectedPic">
          <img
            :src="store.getPicUrl(store.selectedPic)"
            :alt="`picId-${store.selectedPic.picId}`"
            style="max-width:100%; max-height: 500px;"
            @click="this.store.fullScreenToggle()"
          >
          <div id="selectedInfo">
            picId: {{ store.selectedPic.picId }}<br/>
            extension: {{ store.selectedPic.extension }}<br/>
            source: {{ store.getClusterName('selected') }}
          </div>
          <hr style="margin-top: 15px; margin-bottom: 15px;"/>
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

      <picListComponent 
        id="mainPicComponent" 
        style="width:35%" 
        :preLoadWithClusterId="preLoadWithClusterId"
      />
      <picListComponent id="otherPicComponent" style="width:20%" />

    </div>

    <div 
      id="fullScreenDiv"
      :style="`display:${store.fullScreenSwitch ? 'flex' : 'none'}`"
      v-if="store.selectedPic"
    >
      <button
        class="linkButton"
        @click="this.store.fullScreenToggle()"
        style="position:absolute; top:10px; right:10px;"
      >
        x
      </button>
      <img
        :src="store.getPicUrl(store.selectedPic)"
        :alt="`picId-${store.selectedPic.picId}`"
        style="max-width:95%;max-height:95%;"
      >
    </div>

  </main>
</template>

<script>
  import picListComponent from './picListComponent.vue'
  import storeDef from './store.js'
  import { ref } from 'vue';

  export default {
    components: {
      picListComponent
    },
    setup(props) {
      let store = ref(storeDef())
      let urlParams = new URLSearchParams(window.location.search);
      let preLoadWithClusterId = 
        ref(urlParams.get('preLoadWithClusterId'))
      return { store, preLoadWithClusterId }
    },
    async mounted() {
      await this.store.loadClusterList()
    },
    beforeDestroy() {
      clearInterval(this.store.intervalId);
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

  #fullScreenDiv {
      position: fixed;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      border: 1px solid black;
      background-color: rgb(37, 10, 37); /* Semi-transparent black background */
      z-index: 9999; /* Ensure the overlay is on top of other elements */
      justify-content: center;
      align-items: center;
      display: none;
    }

</style>
