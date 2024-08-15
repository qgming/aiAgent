<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/aHeader.vue';
import { SpeedInsights } from "@vercel/speed-insights/next"
</script>

<template>
  <div class="header">
    <Header />
  </div>
  <div class="main">
    <RouterView />
  </div>

  <!-- <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/tool">Tool</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav> -->
  <div class="footer"></div>
</template>

<style scoped>
.header {
  width: 100%;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {}
</style>