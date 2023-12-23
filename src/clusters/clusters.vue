<template>
  <main>

    <div class="table">
      <div class="row" v-for="rowCluster in clusterList">
        <div class="col">
          <input :placeholder="rowCluster.clusterName" v-model="rowCluster.clusterName" v-bind:disabled="cluster !== rowCluster"/>
        </div>
        <div class="col">
          <button v-if="cluster===null" @click="selectCluster(rowCluster)">
            edit
          </button>
          <button v-if="cluster===rowCluster" @click="updateCluster()">
            save
          </button>
          <button v-if="cluster===rowCluster" @click="cancelSelect()">
            cancel
          </button>
        </div>
      </div>
    </div>    

    <div v-if="cluster===null" style="margin-top: 20px;">
      create: <input v-model="newClusterName"/>
      <button v-if="newClusterName!==null" @click="insertCluster()">add</button>
    </div>

  </main>
</template>
<script>
export default {
  data() {
    return {
      cluster: null,
      clusterList: [],
      newClusterName: null
    }
  },
  methods: {
    async getClusters() {
      let response = await fetch('http://localhost:3000/clusters')
      if (!response.ok) 
        throw `error fetching clusters`
      let json = await response.json()
      this.clusterList = JSON.parse(json)
    },
    selectCluster(cluster) {
      this.cluster = cluster
    },
    cancelSelect() {
      this.cluster = null
    },
    async updateCluster() {
      let response = await fetch(
        `http://localhost:3000/clusters/updateCluster` +
        `?clusterId=${this.cluster.clusterId}` +
        `&clusterName=${this.cluster.clusterName}`
      )
      if (!response.ok)
        throw 'failure updating cluster'
      this.cluster = null
    },
    async insertCluster() {
      
      this.cluster = null
      this.newClusterName = this.newClusterName.toLowerCase()
      
      if (this.clusterList.some(row => 
        row.clusterName === this.newClusterName
      ))
        throw 'Cannot insert, that name already exists'
      
      let response = await fetch(
        `http://localhost:3000/clusters/insertCluster` +
        `?clusterName=${this.newClusterName}`
      )
      if (!response.ok)
        throw 'failure updating cluster'

      this.newClusterName = null
      this.getClusters()

    }
  },
  async mounted() {
    await this.getClusters()
  }
}
</script>
<style>

  .table {
    display: table;
  }

  .row {
    display: table-row;
  }

  .col {
    display: table-cell;
  }

</style>