<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  
  bgColor: props.modelValue?.bgColor || '#fcf5fb', 
  textColor: props.modelValue?.textColor || '#1e293b', 
  accentColor: props.modelValue?.accentColor || '#8c357f', 
  
  
  devTitle: props.modelValue?.devTitle || 'Desarrollo Profesional',
  devSubtitle: props.modelValue?.devSubtitle || 'Como graduado, podrás trabajar en:',
  devImage: props.modelValue?.devImage || '',
  devItems: props.modelValue?.devItems?.length ? [...props.modelValue.devItems] : [
    'Posiciones de gerencia en áreas de tecnología de la información.',
    'Gerencia en inteligencia de negocios.',
    'Gerencia en tecnologías de información.',
    'Consultoría independiente.',
    'Administrador de proyectos de tecnología.'
  ],

  
  specTitle: props.modelValue?.specTitle || 'Áreas de Especialización',
  specSubtitle: props.modelValue?.specSubtitle || 'Nuestra carrera cuenta con una estructura curricular flexible, que te brinda una amplia gama de créditos electivos para que personalices tu formación y potencies tus oportunidades laborales al finalizar tus estudios.',
  specItems: props.modelValue?.specItems?.length ? [...props.modelValue.specItems] : [
    { title: 'Sistemas de Información', icon: 'bi bi-cpu' },
    { title: 'Ciencias de Datos', icon: 'bi bi-database' }
  ]
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


const addDevItem = () => localData.value.devItems.push('Nueva posición laboral');
const removeDevItem = (index: number) => localData.value.devItems.splice(index, 1);


const addSpecItem = () => localData.value.specItems.push({ title: 'Nueva Especialización', icon: 'bi bi-star' });
const removeSpecItem = (index: number) => localData.value.specItems.splice(index, 1);


const activeIconIndex = ref<number | null>(null);
const suggestedIcons = [
  'bi-cpu', 'bi-database', 'bi-laptop', 'bi-cloud', 'bi-shield-check', 'bi-graph-up', 'bi-code-slash', 'bi-diagram-3'
];
const selectIcon = (icon: string) => {
  if (activeIconIndex.value !== null) {
    localData.value.specItems[activeIconIndex.value].icon = `bi ${icon}`;
    activeIconIndex.value = null;
  }
};
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-palette"></i> Colores de la Sección</h6>
        <div class="row g-2">
          <div class="col-4">
            <label class="small text-muted mb-1">Fondo General</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.bgColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Texto Base</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.textColor">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Acento (Íconos)</label>
            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.accentColor">
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-person-workspace"></i> 1. Desarrollo Profesional</h6>
        
        <div class="row g-3 mb-3">
          <div class="col-md-8">
            <div class="mb-2">
              <label class="small text-muted mb-1">Título</label>
              <input type="text" class="form-control form-control-sm" v-model="localData.devTitle">
            </div>
            <div>
              <label class="small text-muted mb-1">Subtítulo</label>
              <input type="text" class="form-control form-control-sm" v-model="localData.devSubtitle">
            </div>
          </div>
          <div class="col-md-4 text-center">
            <label class="small text-muted d-block mb-1">Imagen Lateral</label>
            <img v-if="localData.devImage" :src="localData.devImage" class="img-thumbnail mb-2" style="height: 80px; object-fit: cover;">
            <div v-else class="bg-white border rounded mb-2 mx-auto" style="height: 80px; display: grid; place-items: center;">
              <i class="bi bi-image text-muted"></i>
            </div>
            <button class="btn btn-sm btn-dark w-100" @click="$emit('select-image', { item: localData, field: 'devImage' })">
              Cambiar Imagen
            </button>
          </div>
        </div>

        <label class="small fw-bold mb-2 d-block">Lista de Puestos Laborales:</label>
        <div v-for="(item, index) in localData.devItems" :key="index" class="input-group input-group-sm mb-2">
          <span class="input-group-text bg-white text-success"><i class="bi bi-check-circle-fill"></i></span>
          <input type="text" class="form-control" v-model="localData.devItems[index]">
          <button class="btn btn-outline-danger" type="button" @click="removeDevItem(index)"><i class="bi bi-trash"></i></button>
        </div>
        <button class="btn btn-sm btn-outline-secondary w-100 mt-1" @click="addDevItem">+ Agregar Puesto</button>
      </div>
    </div>

    <div class="card mb-3 bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-grid"></i> 2. Áreas de Especialización</h6>
        
        <div class="mb-2">
          <label class="small text-muted mb-1">Título</label>
          <input type="text" class="form-control form-control-sm" v-model="localData.specTitle">
        </div>
        <div class="mb-3">
          <label class="small text-muted mb-1">Descripción</label>
          <textarea class="form-control form-control-sm" v-model="localData.specSubtitle" rows="3"></textarea>
        </div>

        <label class="small fw-bold mb-2 d-block">Tarjetas de Especialidad:</label>
        <div v-for="(spec, index) in localData.specItems" :key="'spec'+index" class="card p-2 mb-2 border-0 shadow-sm">
           <div class="d-flex justify-content-between mb-2">
             <span class="small fw-bold text-muted">Tarjeta {{ index + 1 }}</span>
             <button class="btn btn-sm text-danger p-0" @click="removeSpecItem(index)"><i class="bi bi-x-lg"></i></button>
           </div>
           
           <div class="row g-2">
             <div class="col-4">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i :class="spec.icon" :style="{ color: localData.accentColor }"></i></span>
                  <input type="text" class="form-control text-center" v-model="spec.icon" readonly>
                  <button class="btn btn-outline-secondary" type="button" @click="activeIconIndex = activeIconIndex === index ? null : index">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
             </div>
             <div class="col-8">
               <input type="text" class="form-control form-control-sm" v-model="spec.title" placeholder="Nombre Especialidad">
             </div>
           </div>

           <div v-if="activeIconIndex === index" class="bg-light p-2 border rounded mt-2">
            <div class="d-flex flex-wrap gap-1">
              <button v-for="ico in suggestedIcons" :key="ico" @click="selectIcon(ico)" class="btn btn-sm btn-white border p-1" style="width: 35px; height: 35px;">
                <i :class="`bi ${ico}`"></i>
              </button>
            </div>
          </div>
        </div>
        
        <button class="btn btn-sm btn-outline-secondary w-100 mt-1" @click="addSpecItem">+ Agregar Tarjeta</button>
      </div>
    </div>

  </div>
</template>