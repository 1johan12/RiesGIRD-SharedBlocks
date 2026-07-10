<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  
  bgColor: props.modelValue?.bgColor || '#151e2d', 
  textColor: props.modelValue?.textColor || '#e2e8f0', 
  iconHoverColor: props.modelValue?.iconHoverColor || '#8c357f', 
  
  
  logoImage: props.modelValue?.logoImage || '',
  slogan: props.modelValue?.slogan || 'Trabajar y estudiar es crecer X 2.',
  copyrightText: props.modelValue?.copyrightText || 'Universidad ESAN.',
  
  
  socialLinks: {
    linkedin: props.modelValue?.socialLinks?.linkedin || 'https://www.linkedin.com/',
    facebook: props.modelValue?.socialLinks?.facebook || 'https://www.facebook.com/',
    instagram: props.modelValue?.socialLinks?.instagram || 'https://www.instagram.com/',
    twitter: props.modelValue?.socialLinks?.twitter || 'https://twitter.com/'
  }
});

watch(localData, (newVal) => { 
  emit('update:modelValue', { ...newVal }); 
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  if (JSON.stringify(localData.value) !== JSON.stringify(newVal)) {
    localData.value = { ...localData.value, ...newVal };
  }
}, { deep: true });
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-palette"></i> Colores del Footer</h6>
        <div class="row g-2">
          <div class="col-4">
            <label class="small text-muted mb-1">Fondo</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.bgColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Texto</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.textColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Hover Iconos</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.iconHoverColor">
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-card-text"></i> Contenido Principal</h6>
        
        <div class="mb-3 text-center">
          <label class="small text-muted d-block mb-1 text-start">Logo del Footer (Blanco/Claro)</label>
          <div class="bg-dark rounded p-2 mb-2 d-flex justify-content-center align-items-center" style="height: 60px;">
            <img v-if="localData.logoImage" :src="localData.logoImage" style="max-height: 40px; object-fit: contain;">
            <span v-else class="text-white-50 small">Sin logo</span>
          </div>
          <button class="btn btn-sm btn-dark w-100" @click="$emit('select-image', { item: localData, field: 'logoImage' })">
            Seleccionar Logo
          </button>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1">Eslogan</label>
          <input type="text" class="form-control form-control-sm" v-model="localData.slogan">
        </div>
        
        <div class="mb-2">
          <label class="small text-muted mb-1">Texto Copyright (El año se pone solo)</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">© {{ new Date().getFullYear() }}</span>
            <input type="text" class="form-control" v-model="localData.copyrightText">
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-share"></i> Redes Sociales</h6>
        <p class="small text-muted mb-2">Deja el enlace vacío para ocultar el icono.</p>
        
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text bg-white"><i class="bi bi-linkedin text-primary"></i></span>
          <input type="text" class="form-control" v-model="localData.socialLinks.linkedin" placeholder="URL de LinkedIn">
        </div>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text bg-white"><i class="bi bi-facebook text-primary"></i></span>
          <input type="text" class="form-control" v-model="localData.socialLinks.facebook" placeholder="URL de Facebook">
        </div>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text bg-white"><i class="bi bi-instagram text-danger"></i></span>
          <input type="text" class="form-control" v-model="localData.socialLinks.instagram" placeholder="URL de Instagram">
        </div>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text bg-white"><i class="bi bi-twitter-x"></i></span>
          <input type="text" class="form-control" v-model="localData.socialLinks.twitter" placeholder="URL de Twitter / X">
        </div>
      </div>
    </div>

  </div>
</template>