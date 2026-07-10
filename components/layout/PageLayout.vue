<template>
  <UniversitySnow />

  <TheHeader2 />
  <main>
    <slot />
  </main>
  <TheFooter />
</template>

<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue';
import TheHeader2 from '@/components/layout/TheHeader2.vue';
import UniversitySnow from '@/components/layout/visual/UniversitySnow.vue';
</script>
<style scoped>
main {
  padding-top: 125px; 
  min-height: 100vh; 
}

@media (max-width: 991px) {
  main {
    padding-top: 125px; 
  }
}
@media (max-width: 768px) {
  main {
    padding-top: 120px; 
  }
}
</style>