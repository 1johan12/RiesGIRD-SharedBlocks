<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();

const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  bgColor: props.modelValue?.bgColor || '#0a0a0a',
  textColor: props.modelValue?.textColor || '#ffffff',
  fontFamily: props.modelValue?.fontFamily || 'Montserrat, sans-serif',
  
  socials: props.modelValue?.socials || [
    { icon: 'fa-brands fa-facebook-f', url: '#' },
    { icon: 'fa-brands fa-instagram', url: '#' },
    { icon: 'fa-brands fa-youtube', url: '#' },
    { icon: 'fa-brands fa-linkedin-in', url: '#' },
    { icon: 'fa-brands fa-tiktok', url: '#' }
  ],
  
  complaintsBookImg: props.modelValue?.complaintsBookImg || '',
  complaintsBookUrl: props.modelValue?.complaintsBookUrl || '#',

  locationTitle: props.modelValue?.locationTitle || 'UBÍCANOS',
  locationText: props.modelValue?.locationText || 'Alonso de Molina 1652, Monterrico, Surco, Lima - Perú',
  locationEmail: props.modelValue?.locationEmail || 'exitoesan@ue.edu.pe',

  scheduleTitle: props.modelValue?.scheduleTitle || 'HORARIOS DE ATENCIÓN',
  scheduleText: props.modelValue?.scheduleText || 'Oficina de Admisión de Pregrado\nLunes a viernes de 10:00 - 6:45 p.m.',

  copyright: props.modelValue?.copyright || '© Copyright 2024 - Universidad ESAN',
  companyInfo: props.modelValue?.companyInfo || 'Razón Social: Universidad ESAN | RUC: 20136507720'
});

const addSocial = () => {
  localData.value.socials.push({ icon: 'fa-solid fa-link', url: '#' });
};

const removeSocial = (index: number) => {
  localData.value.socials.splice(index, 1);
};

watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });
</script>

<template>
  <div class="p-3">
    <div class="card mb-3 border-0 shadow-sm bg-light">
      <div class="card-body p-2">
        <h6 class="fw-bold mb-2 small text-muted"><i class="fa-solid fa-palette"></i> Diseño General</h6>
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="x-small fw-bold">Fondo</label>
            <input type="color" v-model="localData.bgColor" class="form-control form-control-sm border-0 p-0" style="height: 25px;">
          </div>
          <div class="col-6">
            <label class="x-small fw-bold">Texto</label>
            <input type="color" v-model="localData.textColor" class="form-control form-control-sm border-0 p-0" style="height: 25px;">
          </div>
        </div>
        <div class="row g-2">
          <div class="col-12">
            <label class="x-small fw-bold">Tipografía</label>
            <input type="text" v-model="localData.fontFamily" class="form-control form-control-sm" placeholder="Ej: 'Montserrat', sans-serif">
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary small"><i class="fa-solid fa-share-nodes"></i> Redes Sociales</h6>
          <button @click="addSocial" class="btn btn-xs btn-outline-primary py-0 px-2">+ Añadir</button>
        </div>
        
        <div v-for="(social, index) in localData.socials" :key="index" class="mb-2 p-2 border rounded bg-light position-relative">
          <button @click="removeSocial(Number(index))" class="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-1" title="Eliminar">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
          <div class="row g-2">
            <div class="col-5">
              <label class="x-small text-muted mb-0">Icono</label>
              <input type="text" v-model="social.icon" class="form-control form-control-sm" placeholder="fa-brands...">
            </div>
            <div class="col-7">
              <label class="x-small text-muted mb-0">URL</label>
              <input type="text" v-model="social.url" class="form-control form-control-sm" placeholder="https://...">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 small"><i class="fa-solid fa-location-dot"></i> Contacto y Horarios</h6>
        <div class="mb-2">
          <label class="x-small text-muted">Título Ubicación</label>
          <input type="text" v-model="localData.locationTitle" class="form-control form-control-sm">
        </div>
        <div class="mb-2">
          <label class="x-small text-muted">Dirección</label>
          <textarea v-model="localData.locationText" class="form-control form-control-sm" rows="2"></textarea>
        </div>
        <div class="mb-3">
          <label class="x-small text-muted">Email</label>
          <input type="email" v-model="localData.locationEmail" class="form-control form-control-sm">
        </div>
        <hr class="my-2">
        <div class="mb-2">
          <label class="x-small text-muted">Título Horarios</label>
          <input type="text" v-model="localData.scheduleTitle" class="form-control form-control-sm">
        </div>
        <div>
          <label class="x-small text-muted">Texto Horarios</label>
          <textarea v-model="localData.scheduleText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 small"><i class="fa-solid fa-scale-balanced"></i> Legal & Libro</h6>
        
        <div class="mb-3">
          <label class="x-small text-muted mb-1 d-block">Libro de Reclamaciones (Imagen)</label>
          <div @click="$emit('select-image', { item: localData, field: 'complaintsBookImg' })" 
               class="border rounded p-2 text-center bg-white image-selector"
               style="cursor: pointer; min-height: 60px;">
            <img v-if="localData.complaintsBookImg" :src="localData.complaintsBookImg" alt="Libro" style="max-height: 50px;">
            <div v-else class="text-muted d-flex flex-column align-items-center py-2">
              <i class="fa-solid fa-image fs-4 mb-1"></i>
              <span class="x-small">Seleccionar Imagen</span>
            </div>
          </div>
        </div>
        
        <div class="mb-3">
          <label class="x-small text-muted">URL del Libro de Reclamaciones</label>
          <input type="text" v-model="localData.complaintsBookUrl" class="form-control form-control-sm" placeholder="https://...">
        </div>

        <div class="mb-2">
          <label class="x-small text-muted">Copyright</label>
          <input type="text" v-model="localData.copyright" class="form-control form-control-sm">
        </div>
        <div>
          <label class="x-small text-muted">RUC / Razón Social</label>
          <input type="text" v-model="localData.companyInfo" class="form-control form-control-sm">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; text-transform: uppercase; }
.btn-xs { padding: 0.1rem 0.4rem; font-size: 0.75rem; }
.image-selector:hover { border-color: #0d6efd !important; opacity: 0.8; }
</style>