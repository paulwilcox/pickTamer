<template>
  <div v-if="message">
      Sample area to try to fetch something from.
      <ul>
        <li>message: {{ message }}</li>
        <li>question: {{ question }}</li>
      </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return { 
        message: null,
        question: null 
      }
    },
    methods: {
      async getData() {
        var res = await fetch("http://localhost:3000/fetchApiExample");
        var json = await res.json();
        this.message = json.message;
        this.question = json.question
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>