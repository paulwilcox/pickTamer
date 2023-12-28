<template>

  <ddClusterComponent @onSelected="clusterSelected"/>  
  
  <div v-if="this.cluster" class="table">
    <div class="row">
      <div class="col">name</div>
    </div> 
    <div>
      <input class="col" v-model="this.cluster.clusterName" />
      <button class="col" @click="updateCluster()">save</button>
    </div>
  </div>

  <div id="divCreate" v-if="!this.cluster">
    new cluster name: 
    <input id="inputNewCluster" />
    <button @click="insertCluster()">add</button>
  </div>

  <div class="statusMessage">
    {{ message }}
  </div>

</template>
<script>
  import ddClusterComponent from './ddClusterComponent.vue'  
  import { dateFormat } from '../_assets/tools.js'

  export default {
    data() {
      return {
        cluster: null,
        message: "welcome",
        newClusterName: null
      };
    },
    components: {
      ddClusterComponent
    },
    methods: {
      clusterSelected(cluster) {      
        this.cluster = cluster
      },
      async updateCluster() {
        let response 
        try {
          response = await fetch(
            `http://localhost:3000/clusters/updateCluster` +
            `?clusterId=${this.cluster.clusterId}` +
            `&clusterName=${this.cluster.clusterName}`)
          if (!response.ok)
            throw 'failure updating cluster'
        }
        catch (ex) {
          this.message = ex.message
          return
        }
        this.message = 
          'cluster saved - ' + 
           dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss t') 
      },
      async insertCluster() {
        this.cluster = null
        this.newClusterName = 
          document.querySelector('#inputNewCluster').value
          .toLowerCase()
        let response
        try {
          response = await fetch(
            `http://localhost:3000/clusters/insertCluster` +
            `?clusterName=${this.newClusterName}`)
          if (!response.ok)
            throw 'failure updating cluster (response != ok)'
        }
        catch (ex) {
          this.message = ex.message
          return 
        }
        this.message = 
          'cluster created - ' + 
           dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss t') 
        this.newClusterName = null
      }

    }
  }
</script>
<style>

  #divCreate {
    margin-top: 15px;
    margin-bottom: 15px;

  }

  .table {
    display: table;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .row {
    display: table-row;
  }

  .col {
    display: table-cell;
  }

  .statusMessage {
    margin-top: 15px;
    color: darkslategray;
    font-size: small;
    font-style: italic;
  }

</style>
