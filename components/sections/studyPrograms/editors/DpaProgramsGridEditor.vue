<script setup lang="ts">
import { ref, watch } from 'vue';
import HttpClient from '../../../../helpers/http-client';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const loadingCourses = ref(false);

const localData = ref({
  
  title: props.modelValue?.title || 'Nuestras Carreras DPA',
  subtitle: props.modelValue?.subtitle || '',
  programs: props.modelValue?.programs || [],
  
  
  bgType: props.modelValue?.bgType || 'color', 
  bgColor: props.modelValue?.bgColor || '#f8f9fa',
  bgImage: props.modelValue?.bgImage || '',
  bgGradient: props.modelValue?.bgGradient || 'linear-gradient(90deg, #00A89E 0%, #18b5dc 100%)',
  titleColor: props.modelValue?.titleColor || '#212529',
  titleSize: props.modelValue?.titleSize || '2.5rem',
  subtitleColor: props.modelValue?.subtitleColor || '#6c757d',
  subtitleSize: props.modelValue?.subtitleSize || '1.25rem'
});


const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const response = await HttpClient.get('study-programs');
    const dbPrograms = response.data.data || response.data;
    
    const newPrograms = dbPrograms.map((p: any) => {
      let extraData: any = {};
      if (p.curriculum_json) {
        try {
          extraData = typeof p.curriculum_json === 'string' ? JSON.parse(p.curriculum_json) : p.curriculum_json;
        } catch (e) {
          console.warn("No se pudo parsear curriculum_json para el ID:", p.id);
        }
      }
      return {
        id: p.id,
        name: p.name,
        link: `https://www.ue.edu.pe/pregrado/dpa/carreras/${p.slug}`, 
        color: p.branding_color || '#00A89E', 
        image: extraData.image || 'https://ue.edu.pe/pregrado/images/dpa/carreras/administracion.png',
        icon: extraData.icon || 'https://ue.edu.pe/pregrado/templates/shaper_floox/images/administracionDPA-icono.png'
      };
    });

    localData.value.programs = newPrograms;
    alert("¡Programas sincronizados con éxito!");
  } catch (e) {
    console.error(e);
    alert("Error al cargar los programas de estudio desde la base de datos.");
  } finally {
    loadingCourses.value = false;
  }
};

const removeProgram = (index: number) => {
  localData.value.programs.splice(index, 1);
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
          <div class="col-8">
            <label class="small text-muted mb-1">Color del Título</label>
            <div class="d-flex align-items-center gap-2">
              <input type="color" v-model="localData.titleColor" class="form-control form-control-color p-0" style="width: 35px; height: 30px;">
              <input type="text" v-model="localData.titleColor" class="form-control form-control-sm">
            </div>
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Tamaño</label>
            <input type="text" v-model="localData.titleSize" class="form-control form-control-sm" placeholder="Ej: 2.5rem">
          </div>
        </div>

        <div class="row g-2">
          <div class="col-8">
            <label class="small text-muted mb-1">Color del Subtítulo</label>
            <div class="d-flex align-items-center gap-2">
              <input type="color" v-model="localData.subtitleColor" class="form-control form-control-color p-0" style="width: 35px; height: 30px;">
              <input type="text" v-model="localData.subtitleColor" class="form-control form-control-sm">
            </div>
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Tamaño</label>
            <input type="text" v-model="localData.subtitleSize" class="form-control form-control-sm" placeholder="Ej: 1.25rem">
          </div>
        </div>

      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-heading"></i> Textos de la Grilla</h6>
        <div class="mb-2">
          <label class="small text-muted mb-1">Título</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm">
        </div>
        <div>
          <label class="small text-muted mb-1">Subtítulo</label>
          <input type="text" v-model="localData.subtitle" class="form-control form-control-sm">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-success"><i class="las la-graduation-cap"></i> Programas DPA</h6>
        <button @click="fetchCourses" class="btn btn-sm w-100 mb-3" :class="loadingCourses ? 'btn-secondary' : 'btn-success'" :disabled="loadingCourses">
          <i v-if="loadingCourses" class="las la-spinner la-spin"></i>
          <i v-else class="las la-sync"></i>
          {{ loadingCourses ? 'Consultando BD...' : 'Cargar / Actualizar desde BD' }}
        </button>
        <small class="text-muted d-block mb-3" style="font-size: 0.7rem;">
          Se importará el nombre, slug y branding_color de tu BD. Las imágenes puedes ajustarlas aquí.
        </small>
        <hr>
        <div v-if="localData.programs.length > 0">
          <div v-for="(program, index) in localData.programs" :key="index" class="border rounded mb-2 p-2 bg-light">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <strong class="small text-truncate" style="max-width: 80%;">{{ program.name }}</strong>
              <button @click="removeProgram(Number(index))" class="btn btn-sm btn-outline-danger py-0 px-1"><i class="las la-trash"></i></button>
            </div>
            <div class="row g-2">
              <div class="col-12">
                <label class="x-small text-muted mb-0">Color de Acento</label>
                <input type="color" v-model="program.color" class="form-control form-control-color w-100 p-0" style="height: 25px;">
              </div>
              <div class="col-6">
                <label class="x-small text-muted mb-0">Graduado</label>
                <div @click="$emit('select-image', { item: program, field: 'image' })" class="media-placeholder border rounded clickable bg-white" :style="{ backgroundImage: `url(${program.image})` }"></div>
              </div>
              <div class="col-6">
                <label class="x-small text-muted mb-0">Icono</label>
                <div @click="$emit('select-image', { item: program, field: 'icon' })" class="media-placeholder border rounded clickable bg-dark" :style="{ backgroundImage: `url(${program.icon})` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.media-placeholder { height: 60px; background-size: cover; background-repeat: no-repeat; background-position: center; display: grid; place-items: center; cursor: pointer; }
.media-placeholder:hover { opacity: 0.8; border-color: #0d6efd !important; }
.clickable { cursor: pointer; }
</style>