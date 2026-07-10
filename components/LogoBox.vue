<template>
  <router-link to="/" class="logo">
    <span>
      <img :src="logoSm" alt="logo-small" class="logo-sm" />
    </span>
    <span class="">
      <img :src="logoLight" alt="logo-large" class="logo-lg logo-light custom-logo-lg" />
      <img :src="logoDark" alt="logo-large" class="logo-lg logo-dark custom-logo-lg" />
    </span>
  </router-link>
</template>

<script setup lang="ts">
import logoSm from "@/assets/images/logo-sm.png";
import logoLight from "@/assets/images/logo-light.png";
import logoDark from "@/assets/images/logo-dark.png";
</script>

<style scoped>
/* Aquí defines los tamaños que quieres */
.custom-logo-sm {
  max-width: 50px;  /* Puedes modificar este tamaño */
  height: auto;
}

.custom-logo-lg {
  max-width: 100px;  /* Puedes modificar este tamaño */
  height: auto;
}
</style>
