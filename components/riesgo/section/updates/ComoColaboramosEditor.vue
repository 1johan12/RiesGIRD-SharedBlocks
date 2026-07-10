<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || '¿Cómo colaboramos?',
  introText: props.modelValue?.introText || 'Nuestra red transforma la competencia académica en cooperación estratégica.',
  cards: (props.modelValue?.cards || []).map((c: any) => ({ ...c, imageUrl: c.imageUrl || '' })),
  wideCard: props.modelValue?.wideCard || {
    title: 'Estandarización Académica',
    text: 'Compartimos mallas curriculares, sílabos...',
    imageUrl: ''
  }
});

// Controladores dinámicos del listado de cards superiores
const addCard = () => {
  localData.value.cards.push({
    id: Date.now(),
    title: 'Nuevo Eje Corto',
    text: 'Descripción corta del apoyo interinstitucional coordinado.',
    imageUrl: '' // Inicializa vacío para detonar el previsualizador gris
  });
};

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1);
};

// Sincronizador blindado contra bucles de reactividad profunda
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const stringifiedNew = JSON.stringify(newVal);
  const stringifiedLocal = JSON.stringify(localData.value);
  if (stringifiedNew !== stringifiedLocal) {
    localData.value = {
      title: newVal.title || '¿Cómo colaboramos?',
      introText: newVal.introText || '',
      cards: (newVal.cards || []).map((c: any) => ({ ...c, imageUrl: c.imageUrl || '' })),
      wideCard: newVal.wideCard || { title: '', text: '', imageUrl: '' }
    };
  }
}, { deep: true });

watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-heading"></i> Textos Base</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título del Bloque</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Descripción General</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-th-large"></i> Tarjetas Grilla</h6>
          <span class="badge bg-secondary text-white small">{{ localData.cards.length }}</span>
        </div>

        <div v-for="(card, index) in localData.cards" :key="card.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          <button @click="removeCard(Number(index))" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" :disabled="localData.cards.length <= 1">
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-12 mb-1">
              <label class="x-small fw-bold text-muted d-block mb-1">Ilustración / Foto de Tarjeta</label>
              <div 
                @click="$emit('select-image', { item: card, field: 'imageUrl' })" 
                class="media-placeholder-box border rounded clickable text-center"
                :style="{ backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : 'none' }"
              >
                <i v-if="!card.imageUrl" class="las la-image text-muted fs-4"></i>
              </div>
            </div>

            <div class="col-12">
              <input type="text" v-model="card.title" class="form-control form-control-sm fw-bold" placeholder="Título">
            </div>
            <div class="col-12">
              <textarea v-model="card.text" class="form-control form-control-sm small-text" rows="3" placeholder="Contenido..."></textarea>
            </div>
          </div>
        </div>

        <button @click="addCard" class="btn btn-sm btn-outline-success w-100 mt-1">
          <i class="las la-plus"></i> Añadir Tarjeta Chica
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm" v-if="localData.wideCard">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger"><i class="las la-stream"></i> Tarjeta Ancha (Cierre)</h6>
        
        <div class="row g-2">
          <div class="col-12 mb-1">
            <label class="x-small fw-bold text-muted d-block mb-1">Imagen Corporativa Destacada</label>
            <div 
              @click="$emit('select-image', { item: localData.wideCard, field: 'imageUrl' })" 
              class="media-placeholder-box border rounded clickable text-center"
              :style="{ backgroundImage: localData.wideCard.imageUrl ? `url(${localData.wideCard.imageUrl})` : 'none' }"
            >
              <i v-if="!localData.wideCard.imageUrl" class="las la-image text-muted fs-4"></i>
            </div>
          </div>

          <div class="col-12">
            <input type="text" v-model="localData.wideCard.title" class="form-control form-control-sm fw-bold" placeholder="Título largo">
          </div>
          <div class="col-12">
            <textarea v-model="localData.wideCard.text" class="form-control form-control-sm small-text" rows="4" placeholder="Cuerpo largo..."></textarea>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.76rem; line-height: 1.4; }

/* Caja multimedia interactiva coordinada para la barra lateral de 320px */
.media-placeholder-box {
  height: 85px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.clickable:hover {
  border-color: #0d6efd !important;
  opacity: 0.9;
}
</style>