<template>
  <select 
    ref="ddCluster"
    :value="cluster?.clusterId" 
    @click="selectCluster($event.target.value)"
  >
    <option value="" :selected="cluster===null">
      -choose-
    </option>
    <option v-for="cluster in showClusters()" :value="cluster.clusterId">
      {{ cluster.clusterName }}
    </option>
  </select>    
</template>
<script>
  export default {
    props: {
      clusterNameWatcher: { type: String, required: false }
    },
    data() {
      return {
        cluster: null,
        clusterList: []
      }
    },
    async mounted() {
      await this.getClusters()
    },
    watch: {
      async clusterNameWatcher(newClusterName) {
        if (!newClusterName)
          return
        console.log(`refreshing to add: ${newClusterName}`)
        await this.getClusters()
        let cluster = 
          this.clusterList.find(cluster => 
            cluster.clusterName.toLowerCase() == newClusterName.toLowerCase()
          )
        this.selectCluster(cluster?.clusterId)
      } 
    },
    methods: {

      async getClusters() {
        let response = await fetch('http://localhost:3000/clusters');
        if (!response.ok)
          throw `error fetching clusters`;
        let json = await response.json();
        this.clusterList = JSON.parse(json);
      },

      selectCluster(clusterId) {
        clusterId = parseInt(clusterId)
        let lastClusterId = this.cluster?.clusterId || null
        if (isNaN(clusterId) && lastClusterId === null)
          return
        else if (isNaN(clusterId))   
          this.cluster = null
        else 
          this.cluster = 
            this.clusterList
            .find(cluster => cluster.clusterId === clusterId)
        let showCount = this.showClusters().length
        this.$refs.ddCluster.size = 
          this.cluster === null ? 1
          : lastClusterId === this.cluster.clusterId ? 1
          : showCount === 1 ? 1
          : showCount + 1
        this.$emit('onSelected',this.cluster)
      },

      showClusters() {
        if(this.cluster === null)
          return this.clusterList
            .filter(cluster => !cluster.clusterName.includes('-'))
        return this.clusterList.filter(c => 
          c.clusterName.startsWith(this.cluster.clusterName)
        )    
      }

    }
  }
</script>
