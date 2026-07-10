<script setup lang="ts">
import { ref, watch } from 'vue';


import FormEditor from './FormEditor.vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
  
  bgImage: props.modelValue?.bgImage || 'https://www.ue.edu.pe/img/home/fondo-carreras-dpa.jpg',
  formPosition: props.modelValue?.formPosition || 'izquierda',
  themeColor: props.modelValue?.themeColor || '#a00000', 
  linkColor: props.modelValue?.linkColor || '#ff2b2b',   
  
  
  mainTitle: props.modelValue?.mainTitle || '¡TRANSFORMA TU FUTURO! DA EL PRIMER PASO HACIA TU EXCELENCIA PROFESIONAL',
  subTitle: props.modelValue?.subTitle || 'Déjanos tus datos y un asesor absolverá tus dudas.',
  
  
  marketingTitle: props.modelValue?.marketingTitle || 'INVIERTE EN TU EXCELENCIA',
  marketingDescription: props.modelValue?.marketingDescription || '',
  marketingImage: props.modelValue?.marketingImage || '', 

  
  formConfig: props.modelValue?.formConfig || {
    campaign_id: null,
    condition: 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
    button_text: 'Enviar mis datos',
    success_title: '¡Solicitud enviada!',
    success_message: 'Un asesor se pondrá en contacto contigo muy pronto.',
    show_phone: true,
    show_consult: true,
    show_courses: true,
    courses_list: []
  }
});


const removeMarketingImage = () => {
  localData.value.marketingImage = '';
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
    
    <ul class="nav nav-tabs nav-fill mb-3" id="leadTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active py-1 px-2 small" id="mkt-tab" data-bs-toggle="tab" data-bs-target="#mkt" type="button" role="tab">1. Diseño y Textos</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link py-1 px-2 small text-primary" id="form-tab" data-bs-toggle="tab" data-bs-target="#form" type="button" role="tab">2. Formulario</button>
      </li>
    </ul>

    <div class="tab-content" id="leadTabsContent">
      
      <div class="tab-pane fade show active" id="mkt" role="tabpanel">
        
        <div class="card mb-3 bg-dark text-white border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold mb-3 text-warning"><i class="las la-palette"></i> Diseño y Fondo</h6>
            
            <div class="row g-2 mb-3">
              <div class="col-12">
                <label class="x-small d-block mb-1">Imagen de Fondo</label>
                <div @click="$emit('select-image', { item: localData, field: 'bgImage' })" 
                     class="media-placeholder border rounded mb-2 clickable bg-secondary position-relative"
                     :style="{ backgroundImage: `url(${localData.bgImage})` }">
                  <i v-if="!localData.bgImage" class="las la-image fs-2 text-white-50"></i>
                </div>
              </div>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-6">
                <label class="x-small d-block mb-1">Color Botón</label>
                <input type="color" v-model="localData.themeColor" class="form-control form-control-color w-100 p-1" title="Color del botón enviar">
              </div>
              <div class="col-6">
                <label class="x-small d-block mb-1">Color Enlace</label>
                <input type="color" v-model="localData.linkColor" class="form-control form-control-color w-100 p-1" title="Color del link de términos">
              </div>
            </div>

            <div>
              <label class="x-small d-block mb-1">Posición del Formulario</label>
              <select v-model="localData.formPosition" class="form-select form-select-sm">
                <option value="izquierda">Formulario a la IZQUIERDA</option>
                <option value="derecha">Formulario a la DERECHA</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="fw-bold mb-3 text-primary"><i class="las la-pen"></i> Contenido Principal</h6>
            
            <div class="mb-3">
              <label class="small text-muted mb-1">Titular Grande (Visible)</label>
              <textarea v-model="localData.mainTitle" class="form-control form-control-sm" rows="2"></textarea>
            </div>
            
            <div class="mb-3">
              <label class="small text-muted mb-1">Subtítulo (Visible)</label>
              <textarea v-model="localData.subTitle" class="form-control form-control-sm" rows="2"></textarea>
            </div>

            <hr class="text-muted">

            <div class="mb-3">
              <label class="small text-muted mb-1">Título SEO (Oculto - H1)</label>
              <input type="text" v-model="localData.marketingTitle" class="form-control form-control-sm">
            </div>

            <div class="mb-3">
              <label class="small text-muted mb-1">Descripción extra (opcional)</label>
              <textarea v-model="localData.marketingDescription" class="form-control form-control-sm" rows="2"></textarea>
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label class="small text-muted mb-0">Imagen Extra (Ej. Graduado)</label>
                <button v-if="localData.marketingImage" @click="removeMarketingImage" class="btn btn-sm btn-outline-danger py-0 px-2" title="Quitar imagen">
                  <i class="las la-times"></i> Quitar
                </button>
              </div>
              <div @click="$emit('select-image', { item: localData, field: 'marketingImage' })" 
                   class="media-placeholder border rounded mb-2 clickable position-relative"
                   :style="{ backgroundImage: `url(${localData.marketingImage})` }">
                <i v-if="!localData.marketingImage" class="las la-image fs-2 text-muted"></i>
              </div>
              <small class="text-muted" style="font-size: 0.7rem;">Si no hay imagen, esta sección se oculta.</small>
            </div>
            
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="form" role="tabpanel">
        <div class="card border-0">
          <div class="card-body p-0">
            <FormEditor v-model="localData.formConfig" />
          </div>
        </div>
      </div> 

    </div> 
  </div> 
</template>

<style scoped>
.media-placeholder {
  height: 80px;
  background-color: #eee;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
}
.media-placeholder:hover {
  opacity: 0.8;
}

.x-small { font-size: 0.65rem; text-transform: uppercase; font-weight: bold; }
.clickable { cursor: pointer; }

/* Ajustes para las tabs de Bootstrap */
.nav-tabs .nav-link { color: #6c757d; border-radius: 4px 4px 0 0; }
.nav-tabs .nav-link.active { font-weight: bold; color: #0d6efd; }
</style>