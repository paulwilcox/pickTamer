<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/pics">pics</RouterLink>
  </nav>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>

  nav {
    border: 2px solid green;
    width: 100%;
    font-size: 12px;
    text-align: left;
    margin: 0px 0px 15px 0px;
  }

  nav a {
    display: inline-block;
    padding: 5px 15px 5px 15px;
    border-left: 1px solid green;
    border-right: 1px solid green;
  }

  nav a:first-of-type {
    border: 0;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }
  
</style>
