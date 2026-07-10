<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  
  bgType: props.modelValue?.bgType || 'color', 
  bgColor: props.modelValue?.bgColor || '#2a1515', 
  bgImage: props.modelValue?.bgImage || '',
  bgGradient: props.modelValue?.bgGradient || 'linear-gradient(135deg, #2a1515 0%, #1a0d0d 100%)',
  
  titleColor: props.modelValue?.titleColor || '#ffffff',
  titleSize: props.modelValue?.titleSize || '1.8rem',
  quoteColor: props.modelValue?.quoteColor || '#f8f9fa',
  quoteSize: props.modelValue?.quoteSize || '1.1rem',
  authorColor: props.modelValue?.authorColor || '#cccccc',
  authorSize: props.modelValue?.authorSize || '0.9rem',

  
  title: props.modelValue?.title || 'ESTUDIA CON LOS PROFESIONALES DE LOS NEGOCIOS',
  testimonials: props.modelValue?.testimonials || [
    {
      id: Date.now(),
      quote: '"La carrera de Ingeniería de Sistemas integra la tecnología con los negocios, lo que es clave para hacer frente a la transformación digital que hoy experimentamos".',
      image: '',
      name: 'Daniella Tapia Villanes',
      role: 'Alumna Ingeniería de Sistemas (Analista de Transformación Digital)'
    }
  ]
});

const addTestimonial = () => {
  localData.value.testimonials.push({
    id: Date.now(),
    quote: '"Nuevo testimonio sobre la experiencia educativa".',
    image: '',
    name: 'Nombre del Alumno',
    role: 'Carrera y Cargo actual'
  });
};

const removeTestimonial = (index: number) => {
  localData.value.testimonials.splice(index, 1);
};


watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const stringifiedNew = JSON.stringify(newVal);
  const stringifiedLocal = JSON.stringify(localData.value);
  if (stringifiedNew !== stringifiedLocal) {
    localData.value = { ...localData.value, ...newVal };
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
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-paint-roller"></i> Diseño de la Sección</h6>
        
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Tipo de Fondo</label>
          <select v-model="localData.bgType" class="form-select form-select-sm">
            <option value="color">Color Sólido</option>
            <option value="gradient">Degradado</option>
            <option value="image">Imagen</option>
          </select>
        </div>

        <div v-if="localData.bgType === 'color'" class="mb-3">
          <label class="small text-muted mb-1">Color de Fondo</label>
          <input type="color" v-model="localData.bgColor" class="form-control form-control-color w-100 p-1">
        </div>
        <div v-if="localData.bgType === 'gradient'" class="mb-3">
          <label class="small text-muted mb-1">CSS del Degradado</label>
          <input type="text" v-model="localData.bgGradient" class="form-control form-control-sm" placeholder="Ej: linear-gradient(...)">
        </div>
        <div v-if="localData.bgType === 'image'" class="mb-3">
          <label class="small text-muted d-block mb-1">Imagen de Fondo</label>
          <div @click="$emit('select-image', { item: localData, field: 'bgImage' })" 
               class="media-placeholder border rounded clickable"
               :style="{ backgroundImage: `url(${localData.bgImage})` }">
            <i v-if="!localData.bgImage" class="las la-image fs-3 text-muted"></i>
          </div>
        </div>

        <hr class="my-3">

        <div class="row g-2 mb-2">
          <div class="col-12"><strong class="small">Título Principal</strong></div>
          <div class="col-6">
            <input type="color" v-model="localData.titleColor" class="form-control form-control-color w-100 p-0" style="height: 25px;" title="Color">
          </div>
          <div class="col-6">
            <input type="text" v-model="localData.titleSize" class="form-control form-control-sm" placeholder="Tamaño (ej: 1.8rem)">
          </div>
        </div>

        <div class="row g-2 mb-2">
          <div class="col-12"><strong class="small">Texto de Testimonio</strong></div>
          <div class="col-6">
            <input type="color" v-model="localData.quoteColor" class="form-control form-control-color w-100 p-0" style="height: 25px;">
          </div>
          <div class="col-6">
            <input type="text" v-model="localData.quoteSize" class="form-control form-control-sm" placeholder="Tamaño (ej: 1.1rem)">
          </div>
        </div>

        <div class="row g-2">
          <div class="col-12"><strong class="small">Autor y Cargo</strong></div>
          <div class="col-6">
            <input type="color" v-model="localData.authorColor" class="form-control form-control-color w-100 p-0" style="height: 25px;">
          </div>
          <div class="col-6">
            <input type="text" v-model="localData.authorSize" class="form-control form-control-sm" placeholder="Tamaño (ej: 0.9rem)">
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-quote-right"></i> Contenido</h6>
        
        <div class="mb-4">
          <label class="small text-muted mb-1">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm text-uppercase">
        </div>

        <h6 class="fw-bold small text-success mb-2">Testimonios</h6>
        
        <div v-for="(item, index) in localData.testimonials" :key="item.id" class="border rounded mb-3 p-2 bg-light position-relative">
          <button @click="removeTestimonial(Number(index))" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1" title="Eliminar">
            <i class="las la-times"></i>
          </button>
          
          <div class="row g-2 mt-2">
            <div class="col-4 text-center">
              <label class="x-small text-muted mb-1 d-block">Foto (Avatar)</label>
              <div @click="$emit('select-image', { item: item, field: 'image' })" class="avatar-placeholder rounded-circle mx-auto clickable bg-white border" :style="{ backgroundImage: `url(${item.image})` }">
                <i v-if="!item.image" class="las la-user fs-4 text-muted mt-3"></i>
              </div>
            </div>
            <div class="col-8">
              <input type="text" v-model="item.name" class="form-control form-control-sm mb-2" placeholder="Nombre (Ej: Daniella Tapia)">
              <input type="text" v-model="item.role" class="form-control form-control-sm" placeholder="Cargo (Ej: Alumna Ing. Sistemas)">
            </div>
            <div class="col-12 mt-2">
              <textarea v-model="item.quote" class="form-control form-control-sm fst-italic" rows="3" placeholder="Escribe el testimonio aquí..."></textarea>
            </div>
          </div>
        </div>

        <button @click="addTestimonial" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Agregar Testimonio
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.media-placeholder { height: 60px; background-size: cover; background-position: center; display: grid; place-items: center; cursor: pointer; }
.avatar-placeholder { width: 60px; height: 60px; background-size: cover; background-position: center; cursor: pointer; overflow: hidden; }
.clickable:hover { opacity: 0.8; border-color: #0d6efd !important; }
</style>