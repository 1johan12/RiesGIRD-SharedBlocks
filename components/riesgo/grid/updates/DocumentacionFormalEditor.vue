<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
// 🎯 Declaramos las emisiones de actualización profunda y de llamado al Media Manager
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || 'Documentación Formal y Respaldo',
  introText: props.modelValue?.introText || 'Toda nuestra estrategia de transversalización está respaldada por marcos normativos nacionales e internacionales.',
  documentos: (props.modelValue?.documentos || []).map((d: any) => ({
    ...d,
    fileUrl: d.fileUrl || '' // Asegura la existencia del campo de redirección del PDF
  }))
});

// Inyección en la colección dinámica
const addDocumento = () => {
  localData.value.documentos.push({
    id: Date.now(),
    tag: '[PDF]',
    title: 'Nuevo Documento Institucional / Acuerdo',
    institution: 'Universidad Miembro de la Red',
    desc: 'Descripción corta del alcance del archivo o directiva.',
    fileUrl: ''
  });
};

const removeDocumento = (index: number) => {
  localData.value.documentos.splice(index, 1);
};

// Sincronizador blindado contra bucles de reactividad infinita
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const stringifiedNew = JSON.stringify(newVal);
  const stringifiedLocal = JSON.stringify(localData.value);
  if (stringifiedNew !== stringifiedLocal) {
    localData.value = {
      title: newVal.title || 'Documentación Formal y Respaldo',
      introText: newVal.introText || '',
      documentos: (newVal.documentos || []).map((d: any) => ({ ...d, fileUrl: d.fileUrl || '' }))
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
          <label class="small text-muted mb-1 fw-bold">Descripción Introductoria</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-file-pdf"></i> Archivos de Respaldo</h6>
          <span class="badge bg-secondary text-white small">{{ localData.documentos.length }}</span>
        </div>

        <div v-for="(doc, index) in localData.documentos" :key="doc.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeDocumento(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Quitar Documento"
            :disabled="localData.documentos.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            
            <div class="col-12 mb-2">
              <label class="x-small fw-bold text-muted d-block mb-1">Recurso Digital (PDF / Documento)</label>
              
              <div 
                @click="$emit('select-image', { item: doc, field: 'fileUrl' })" 
                class="file-placeholder-box border rounded clickable-box text-center"
                :class="{ 'file-loaded': doc.fileUrl }"
              >
                <div v-if="doc.fileUrl" class="text-success small fw-bold px-2 truncate-text">
                  <i class="las la-file-pdf fs-5 me-1"></i> {{ doc.fileUrl.split('/').pop() }}
                </div>
                <div v-else class="text-muted small">
                  <i class="las la-cloud-upload-alt fs-5 me-1"></i> Cargar Archivo PDF
                </div>
              </div>
            </div>

            <div class="col-4">
              <label class="x-small fw-bold text-muted mb-0.5">Etiqueta</label>
              <input type="text" v-model="doc.tag" class="form-control form-control-sm text-center fw-bold" placeholder="Ej: [PDF]">
            </div>
            <div class="col-8">
              <label class="x-small fw-bold text-muted mb-0.5">Universidad / Entidad</label>
              <input type="text" v-model="doc.institution" class="form-control form-control-sm" placeholder="Institución creadora">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Título del Documento</label>
              <input type="text" v-model="doc.title" class="form-control form-control-sm fw-bold">
            </div>
            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Resumen / Descripción</label>
              <textarea v-model="doc.desc" class="form-control form-control-sm small-text" rows="3"></textarea>
            </div>
          </div>

        </div>

        <button @click="addDocumento" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Nuevo Documento
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.76rem; line-height: 1.4; }

/* Casillero interactivo estilizado para el selector de PDFs */
.file-placeholder-box {
  height: 44px;
  background-color: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
}
.clickable-box:hover {
  border-color: #0d6efd !important;
  background-color: #f1f7fe;
}
.file-placeholder-box.file-loaded {
  background-color: #e6f4ea;
  border-color: #34a853;
}
.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>