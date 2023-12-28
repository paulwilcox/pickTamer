<template>
  <select 
    ref="ddCluster"
    :value="ddCandidate?.clusterId" 
    @click="ddClick($event.target.value)"
  >
    <option value="" :selected="cluster===null">
      -choose-
    </option>
    <option v-for="cluster in this.ddOptions" :value="cluster.clusterId">
      {{ cluster.clusterName }}
    </option>
  </select>    
</template>
<script>
  export default {
    data() {
      return {
        cluster: null,
        clusterList: [], // the full list
        ddCandidate: null,
        ddOptions: []  
      }
    },
    async mounted() {
      await this.getClusters()
      this.ddOptions = this.topLevelOptions()
    },
    methods: {

      async getClusters() {
        let response = await fetch('http://localhost:3000/clusters');
        if (!response.ok)
          throw `error fetching clusters`;
        let json = await response.json();
        this.clusterList = JSON.parse(json);
      },

      ddClick(clusterId) {
        
        clusterId = parseInt(clusterId)

        // first click, just opening the options
        if (isNaN(clusterId) && this.ddCandidate === null)
          return
        
        // clicking the first option, to start back at beginning
        if (isNaN(clusterId)) {  
          this.ddCandidate = null
          this.cluster = null
          this.ddOptions = this.topLevelOptions()
          this.$refs.ddCluster.size = 1
          this.$emit('onSelected',this.cluster) // to emit deselection
          return
        } 
        // past here, real option clicked
        
        let lastDdCandidate = this.ddCandidate

        this.ddCandidate = 
          this.ddOptions
          .find(cluster => cluster.clusterId === clusterId)

        this.ddOptions =
          this.clusterList.filter(cluster => 
            cluster.clusterName.startsWith(
              this.ddCandidate.clusterName
            )
            || cluster === this.ddCandidate
          )

        // it's a true selection (not just drill down) 
        if (
          lastDdCandidate === this.ddCandidate || // user confirmed
          this.ddOptions.length === 1 // only one option exists
        ) {
          this.cluster = this.ddCandidate
          this.ddOptions = this.topLevelOptions(this.ddCandidate)
          this.$refs.ddCluster.size = 1
          this.$emit('onSelected',this.cluster)
          return 
        }

        // it's just a drill down
        this.$refs.ddCluster.size = this.ddOptions.length + 1

      },

      topLevelOptions(alsoWithCluster) {
        return this.clusterList.filter(cluster => 
          !cluster.clusterName.includes('-')
          || cluster === alsoWithCluster
        )
      }

    }
  }
</script>
