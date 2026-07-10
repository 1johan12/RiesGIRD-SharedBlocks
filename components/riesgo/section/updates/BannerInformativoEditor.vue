<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BannerBlockData } from '../views/BannerInformativo.vue';

const props = defineProps<{ modelValue: BannerBlockData | null }>();
const emit = defineEmits(['update:modelValue']);

// Enforzamiento del tipado estricto local antes de emitir la persistencia
const localData = ref<BannerBlockData>({
  bannerText: props.modelValue?.bannerText || 'Entérate de las últimas novedades, participa en nuestros próximos encuentros y únete a las iniciativas que impulsan el desarrollo territorial sostenible.'
});

const isTextsOpen = ref(true);

// Sincronizador máster libre de rebotes reactivos
watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(newVal) !== JSON.stringify(localData.value)) {
    localData.value.bannerText = newVal.bannerText || '';
  }
}, { deep: true });
</script>

<template>
  <div class="p-3 custom-banner-sidebar">
    
    <h6 class="fw-bold mb-3 sidebar-title-header border-bottom pb-2">
      <i class="bi bi-bookmark-star-fill text-danger me-2"></i> Configurar Banner
    </h6>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white p-2 border-0 clickable d-flex justify-content-between align-items-center" @click="isTextsOpen = !isTextsOpen">
        <span class="fw-bold small text-warning"><i class="bi bi-chat-left-text-fill me-1"></i> 1. Copropiedad del Texto</span>
        <i class="bi" :class="isTextsOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </div>
      
      <div class="card-body pt-0 mt-2" v-show="isTextsOpen">
        <div class="mb-1">
          <label class="x-small fw-bold text-muted mb-1">Mensaje Destacado de la Red</label>
          <textarea v-model="localData.bannerText" class="form-control form-control-sm admin-text-box" rows="5" placeholder="Escribe el lema institucional..."></textarea>
          <span class="super-small text-muted mt-1 d-block">El texto se centrará y aplicará el gradiente tricolor RiesGIRD de forma automática en el portal web.</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.sidebar-title-header { font-size: 0.95rem; }
.x-small { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3px; }
.super-small { font-size: 0.6rem; }
.admin-text-box { font-size: 0.8rem; line-height: 1.4; color: #334155; }
.clickable { cursor: pointer; }
.custom-banner-sidebar { box-sizing: border-box; }
</style>