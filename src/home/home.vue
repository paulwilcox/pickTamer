<template>
  <main>
    <div>
      Welcome
    </div>
    <div>
      <button @click="loadNewPics()">load new pics</button>
      <div style="color:orange;">{{ loadNewPicsMessage }}</div>
    </div>
  </main>
</template>
<script>
export default {
  data() { 
    return {
      loadNewPicsMessage: null
    }
  },
  methods: {
    async loadNewPics() {
      let response
      try {
        response = await fetch(`http://localhost:3000/loadNewPics`)
      }
      catch (ex) {
        this.loadNewPicsMessage = ex.message 
        return 
      }
      if (!response.ok) {
        this.loadNewPicsMessage = 'failed to fetch while loading new pics'
        return
      }
      let json = await response.json()
      let parsed = JSON.parse(json)
      this.loadNewPicsMessage = parsed
    }
  }
}
</script>
<style>
  div {
    margin-top: 15px;
  }
</style>