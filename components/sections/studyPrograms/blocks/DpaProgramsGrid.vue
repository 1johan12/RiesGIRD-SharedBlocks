<script setup lang="ts">
import { computed } from 'vue';
import DpaProgramCard from '../../components/cards/blocks/DpaProgramCard.vue';

const props = defineProps<{
  data: any
}>();


const title = computed(() => props.data?.title || 'Nuestras Carreras');
const subtitle = computed(() => props.data?.subtitle);
const programs = computed(() => props.data?.programs || []);


const bgType = computed(() => props.data?.bgType || 'color');
const bgColor = computed(() => props.data?.bgColor || '#f8f9fa');
const bgImage = computed(() => props.data?.bgImage || '');
const bgGradient = computed(() => props.data?.bgGradient || '');
const titleColor = computed(() => props.data?.titleColor || '#212529');
const titleSize = computed(() => props.data?.titleSize || '2.5rem');
const subtitleColor = computed(() => props.data?.subtitleColor || '#6c757d');
const subtitleSize = computed(() => props.data?.subtitleSize || '1.25rem');




const sectionStyle = computed(() => {
  
  if (bgType.value === 'image' && bgImage.value) {
    return {
      backgroundImage: `url(${bgImage.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
  } 
  
  
  else if (bgType.value === 'gradient' && props.data?.bgGradient) {
    return {
      backgroundImage: props.data.bgGradient
    };
  }

  
  return {
    backgroundColor: bgColor.value
  };
});
</script>

<template>
  <section class="dpa-programs-section py-5" :style="sectionStyle">
    <div class="container">
      
      <div class="row mb-5 text-center">
        <div class="col-12">
          <h2 class="fw-bold mb-3" :style="{ color: titleColor, fontSize: titleSize }">
            {{ title }}
          </h2>
          <p v-show="subtitle" class="lead mb-0" :style="{ color: subtitleColor, fontSize: subtitleSize }">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div class="row g-4 justify-content-center" v-if="programs.length > 0">
        <div class="col-12 col-md-6 col-lg-4 d-flex justify-content-center" v-for="program in programs" :key="program.id">
          <DpaProgramCard 
            :name="program.name"
            :link="program.link"
            :color="program.color"  
            :image="program.image"
            :icon="program.icon"
          />
        </div>
      </div>

      <div v-else class="text-center py-5 border border-dashed rounded" :style="{ borderColor: titleColor + ' !important', color: titleColor }">
        <i class="las la-inbox fs-1 mb-2"></i>
        <p>No hay programas cargados. Usa el editor para sincronizar desde la base de datos.</p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.border-dashed { border-style: dashed !important; border-width: 2px !important; }
</style>