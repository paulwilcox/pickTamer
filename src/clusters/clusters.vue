<template>
  <main>

    <div>
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

  </main>
</template>
<script>
export default {
  data() {
    return {
      cluster: null,
      clusterList: []
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
    }
  },
  async mounted() {
    await this.getClusters()
  }
}
</script>
<style>

  .row {
    display: flex;
    justify-content: space-between;
  }

  .col {
    flex: 1;
  }

</style>