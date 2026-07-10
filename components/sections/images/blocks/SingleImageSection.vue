<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();


const imageUrl = computed(() => props.data?.imageUrl || '');
const alignment = computed(() => props.data?.alignment || 'center');
const maxWidth = computed(() => props.data?.maxWidth || '100%'); 
const paddingTopBottom = computed(() => props.data?.padding || 'py-5'); 
</script>

<template>
  <section v-if="imageUrl" :class="`single-image-section ${paddingTopBottom}`">
    <div class="image-wrapper" :class="`text-${alignment}`">
      <img 
        :src="imageUrl" 
        class="responsive-banner" 
        alt="Imagen destacada"
        :style="{ maxWidth: maxWidth }"
      />
    </div>
  </section>
</template>

<style scoped>
.single-image-section {
  width: 100%;
  background-color: transparent; 
  overflow: hidden; 
}

.image-wrapper {
  width: 100%;
}

.responsive-banner {
  width: 100%; 
  height: auto;
  display: inline-block;
}
</style>