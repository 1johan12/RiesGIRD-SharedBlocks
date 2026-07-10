<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || 'Consejo Directivo',
  introText: props.modelValue?.introText || 'El Consejo Directivo es el órgano encargado de dirigir, administrar y representar legalmente a la Red.',
  subtitle: props.modelValue?.subtitle || 'Directorio Actual (Periodo 2024 - 2027)',
  // Mapeamos los emails de los miembros a strings con comas para que sea ultra fácil editarlos
  directorio: (props.modelValue?.directorio || []).map((m: any) => ({
    ...m,
    emailString: Array.isArray(m.emails) ? m.emails.join(', ') : ''
  }))
});

// Agrega un nuevo casillero de directivo a la plancha de gestión
const addMiembro = () => {
  localData.value.directorio.push({
    nombre: 'Nuevo Directivo',
    cargo: 'Vocal',
    institucion: 'Universidad Miembro',
    photo_url: '',
    emailString: '',
    emails: []
  });
};

const removeMiembro = (index: number) => {
  localData.value.directorio.splice(index, 1);
};

// Sincronizador bidireccional blindado contra bucles de reactividad infinita
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const currentString = JSON.stringify(localData.value.directorio.map((m: any) => ({ ...m, emailString: undefined, emails: m.emails })));
  const newString = JSON.stringify(newVal.directorio || []);
  
  if (newString !== currentString || newVal.title !== localData.value.title || newVal.introText !== localData.value.introText || newVal.subtitle !== localData.value.subtitle) {
    localData.value.title = newVal.title || 'Consejo Directivo';
    localData.value.introText = newVal.introText || '';
    localData.value.subtitle = newVal.subtitle || '';
    localData.value.directorio = (newVal.directorio || []).map((m: any) => ({
      ...m,
      emailString: Array.isArray(m.emails) ? m.emails.join(', ') : ''
    }));
  }
}, { deep: true });

watch(localData, (newVal) => {
  // Antes de emitir hacia el canvas, procesamos el string de comas y lo devolvemos como array limpio
  const directorioProcesado = newVal.directorio.map((m: any) => {
    const limpio = { ...m };
    limpio.emails = m.emailString
      ? m.emailString.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0)
      : [];
    delete limpio.emailString;
    return limpio;
  });

  emit('update:modelValue', {
    title: newVal.title,
    introText: newVal.introText,
    subtitle: newVal.subtitle,
    directorio: directorioProcesado
  });
}, { deep: true });
</script>

<template>
  <div class="p-3">
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-heading"></i> Textos del Bloque</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título del Órgano</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Descripción / Reseña</label>
          <textarea v-model="localData.introText" class="form-control form-control-sm" rows="3"></textarea>
        </div>
        <div class="mb-1">
          <label class="small text-muted mb-1 fw-bold">Título del Directorio</label>
          <input type="text" v-model="localData.subtitle" class="form-control form-control-sm">
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-danger"><i class="las la-users-cog"></i> Integrantes Plancha</h6>
          <span class="badge bg-secondary text-white small">{{ localData.directorio.length }}</span>
        </div>

        <div v-for="(member, index) in localData.directorio" :key="index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <button 
            @click="removeMiembro(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Remover Miembro"
            :disabled="localData.directorio.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-12 mb-1">
              <label class="x-small fw-bold text-muted d-block mb-1">Fotografía del Directivo</label>
              <div 
                @click="$emit('select-image', { item: member, field: 'photo_url' })" 
                class="media-placeholder border rounded clickable-box text-center"
                :style="{ backgroundImage: member.photo_url ? `url(${member.photo_url})` : 'none' }"
              >
                <i v-if="!member.photo_url" class="las la-user-plus text-muted fs-4"></i>
              </div>
            </div>

            <div class="col-12">
              <label class="x-small fw-bold text-muted mb-0.5">Nombre Completo</label>
              <input type="text" v-model="member.nombre" class="form-control form-control-sm fw-bold">
            </div>

            <div class="col-6">
              <label class="x-small fw-bold text-muted mb-0.5">Cargo Red</label>
              <input type="text" v-model="member.cargo" class="form-control form-control-sm" placeholder="Ej: Presidente">
            </div>

            <div class="col-6">
              <label class="x-small fw-bold text-muted mb-0.5">Universidad Origen</label>
              <input type="text" v-model="member.institucion" class="form-control form-control-sm" placeholder="Ej: Universidad ESAN">
            </div>

            <div class="col-12 mt-1">
              <label class="x-small fw-bold text-muted mb-0.5">Correos (Separados por coma)</label>
              <input type="text" v-model="member.emailString" class="form-control form-control-sm small-text" placeholder="correo1@edu.pe, correo2@edu.pe">
            </div>
          </div>

        </div>

        <button @click="addMiembro" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Directivo
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.small-text { font-size: 0.75rem; }
.media-placeholder {
  height: 65px;
  background-size: cover;
  background-position: center;
  background-color: #ffffff;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.clickable-box:hover { border-color: #0d6efd !important; }
</style>