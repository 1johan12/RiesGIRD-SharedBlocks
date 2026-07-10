<script setup lang="ts">

import TopBar from './header/TopBar.vue';
import MainMenu from './header/MainMenu.vue';

</script>

<template>
  <header class="header-section">
    <TopBar />
    <MainMenu />
  </header>
</template>

<style scoped>
.header-section {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  /* Fondo semi-transparente oscuro */
  background-color: rgba(26, 26, 26, 0.8);

  /* El efecto de desenfoque */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Sombra sutil para dar profundidad */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  /* Línea decorativa inferior opcional */
}
</style>