<template>
    <div v-if="json">
        Working data from pics:
        {{ json }}
    </div>
  </template>
  
  <script>
    export default {
      data () {
        return { 
          json: null
        }
      },
      methods: {
        async getData() {
          var res = await fetch("http://localhost:3000/pics");
          var json = await res.json();
          this.json = json;
        }
      },
      mounted() {
        this.getData()
      }
    }
  </script>