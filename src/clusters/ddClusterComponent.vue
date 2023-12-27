<template>
  <select 
    ref="ddCluster"
    :value="cluster?.clusterId" 
    @click="selectCluster($event)"
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
    data() {
      return {
        cluster: null,
        clusterList: [],
        newClusterName: null,
      };
    },
    async mounted() {
      await this.getClusters()
    },
    methods: {
      async getClusters() {
        let response = await fetch('http://localhost:3000/clusters');
        if (!response.ok)
          throw `error fetching clusters`;
        let json = await response.json();
        this.clusterList = JSON.parse(json);
      },
      selectCluster(event) {
        let clusterId = parseInt(event.target.value)
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
      },
      async updateCluster() {
        let response = await fetch(`http://localhost:3000/clusters/updateCluster` +
          `?clusterId=${this.cluster.clusterId}` +
          `&clusterName=${this.cluster.clusterName}`);
        if (!response.ok)
          throw 'failure updating cluster';
        this.cluster = null
        this.editing = false
      },
      async insertCluster() {
        this.cluster = null;
        this.newClusterName = this.newClusterName.toLowerCase();
        if (this.clusterList.some(row => row.clusterName === this.newClusterName))
          throw 'Cannot insert, that name already exists';
        let response = await fetch(`http://localhost:3000/clusters/insertCluster` +
          `?clusterName=${this.newClusterName}`);
        if (!response.ok)
          throw 'failure updating cluster';
        this.newClusterName = null;
        this.getClusters();
      }
    }
  }
</script>
