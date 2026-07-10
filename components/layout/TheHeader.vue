<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white py-2 shadow-sm sticky-top font-primary">
    <div class="container-fluid px-3 px-lg-4">

      <HeaderLogo />

      <HeaderBtn />

      <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon" style="width: 1.2em; height: 1.2em;"></span>
      </button>

      <div class="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
        <HeaderNav />
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">

import HeaderLogo from '../header/HeaderLogo.vue';
import HeaderBtn from '../header/HeaderBtn.vue';
import HeaderNav from '../header/HeaderNav.vue';
</script>

<style scoped lang="scss">
/* --- PARCHE DE EMERGENCIA (Solo lo que afecta al contenedor padre) --- */
@media (min-width: 992px) and (max-width: 1100px) {
    .container-fluid {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
}
</style>