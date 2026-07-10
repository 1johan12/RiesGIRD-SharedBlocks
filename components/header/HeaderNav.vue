<template>
  <ul class="navbar-nav mx-auto align-items-center fw-semibold text-uppercase" 
      style="font-size: 0.8rem; letter-spacing: 0.5px;">

    <DropdownLink 
      label="CONÓCENOS" 
      id="conocenosDrop"
      :items="[
        { label: 'ESAN' },
        { label: '¿Quiénes somos?' },
        { label: 'Propósito' },
        { label: 'Autoridades' }
      ]"
    />

    <DropdownLink 
      label="PROGRAMAS" 
      id="programasDrop"
      :items="[
        { label: 'Pregrado', href: 'https://ue.edu.pe/' },
        { label: 'Posgrado', href: 'https://www.esan.edu.pe/'  },
        { label: 'DPA', href: 'https://www.esan.edu.pe/'  },
        { label: 'Executive Education', href: ''  }
      ]"
    />
    <SimpleLink label="INTERNACIONAL" />
    <SimpleLink label="ALUMNOS" />
    <SimpleLink label="BLOGS" />
    <SimpleLink label="BOLSA DE TRABAJO" href='https://bolsatrabajo.uesan.edu.pe/' :openInNewTab="true" />

  </ul>
</template>

<script setup lang="ts">
import SimpleLink from './items/SimpleLink.vue';
import DropdownLink from './items/DropdownLink.vue';
import type { ref } from 'vue';
</script>

<style scoped>

</style>