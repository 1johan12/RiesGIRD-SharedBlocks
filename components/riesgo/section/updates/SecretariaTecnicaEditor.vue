<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title || 'Secretaría Técnica',
  description1: props.modelValue?.description1 || 'La Secretaría Técnica es el brazo operativo y articulador de la RiesGIRD-ACC Perú.',
  leaderTitle: props.modelValue?.leaderTitle || 'Liderazgo Actual',
  leader: props.modelValue?.leader || {
    nombre: 'Prof. e investigadora Mary Mollo Medina',
    cargo: 'Secretaria Técnica Nacional',
    institucion: 'Universidad ESAN',
    correo: 'mmollo@esan.edu.pe',
    photo_url: ''
  },
  description2: props.modelValue?.description2 || 'El verdadero valor de nuestra Secretaría Técnica radica en su pluralidad.',
  committeeTitle: props.modelValue?.committeeTitle || 'Comité Técnico Interinstitucional',
  comite: props.modelValue?.comite || []
});

const addComiteMember = () => {
  localData.value.comite.push({
    universidad: 'NUEVA',
    nombre: 'Nombre de Especialista',
    especialidad: 'Especialidad / Línea de Investigación',
    correo: '',
    photo_url: '',
    logoUniversidad: ''
  });
};

const removeComiteMember = (index: number) => {
  localData.value.comite.splice(index, 1);
};

// Sincronizador de romper bucles de reactividad profunda
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
  <div class="p-2 custom-scrollbar overflow-y-auto h-100">
    
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary"><i class="las la-heading"></i> Textos Base</h6>
        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input type="text" v-model="localData.title" class="form-control form-control-sm fw-semibold">
        </div>
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Descripción Reseña 1</label>
          <textarea v-model="localData.description1" class="form-control form-control-sm" rows="3"></textarea>
        </div>
      </div>
    </div>

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-success"><i class="las la-user-tie"></i> Secretario(a) Nacional</h6>
        <div class="row g-2">
          <div class="col-12 mb-1">
            <label class="x-small fw-bold text-muted d-block mb-1">Fotografía del Líder</label>
            <div 
              @click="$emit('select-image', { item: localData.leader, field: 'photo_url' })" 
              class="media-box border rounded text-center clickable"
              :style="{ backgroundImage: localData.leader.photo_url ? `url(${localData.leader.photo_url})` : 'none' }"
            >
              <i v-if="!localData.leader.photo_url" class="las la-user-plus text-muted fs-4"></i>
            </div>
          </div>
          <div class="col-12">
            <input type="text" v-model="localData.leader.nombre" class="form-control form-control-sm fw-bold" placeholder="Nombre completo">
          </div>
          <div class="col-6">
            <input type="text" v-model="localData.leader.cargo" class="form-control form-control-sm" placeholder="Cargo">
          </div>
          <div class="col-6">
            <input type="text" v-model="localData.leader.institucion" class="form-control form-control-sm" placeholder="Universidad">
          </div>
          <div class="col-12">
            <input type="email" v-model="localData.leader.correo" class="form-control form-control-sm" placeholder="Correo electrónico">
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-danger"><i class="las la-users"></i> Miembros del Comité</h6>
          <span class="badge bg-secondary text-white small">{{ localData.comite.length }}</span>
        </div>

        <div v-for="(member, index) in localData.comite" :key="index" class="border rounded mb-3 p-2 bg-light position-relative">
          <button @click="removeComiteMember(Number(index))" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" title="Quitar Miembro">
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <div class="col-6">
              <label class="x-small fw-bold text-muted d-block mb-1">Foto Miembro</label>
              <div @click="$emit('select-image', { item: member, field: 'photo_url' })" class="media-box border rounded text-center clickable" :style="{ backgroundImage: member.photo_url ? `url(${member.photo_url})` : 'none' }">
                <i v-if="!member.photo_url" class="las la-image text-muted"></i>
              </div>
            </div>
            <div class="col-6">
              <label class="x-small fw-bold text-muted d-block mb-1">Escudo Uni</label>
              <div @click="$emit('select-image', { item: member, field: 'logoUniversidad' })" class="media-box border rounded text-center clickable" :style="{ backgroundImage: member.logoUniversidad ? `url(${member.logoUniversidad})` : 'none' }">
                <i v-if="!member.logoUniversidad" class="las la-university text-muted"></i>
              </div>
            </div>

            <div class="col-4">
              <input type="text" v-model="member.universidad" class="form-control form-control-sm text-center fw-bold" placeholder="Siglas">
            </div>
            <div class="col-8">
              <input type="text" v-model="member.nombre" class="form-control form-control-sm fw-semibold" placeholder="Nombre completo">
            </div>
            <div class="col-12">
              <input type="text" v-model="member.especialidad" class="form-control form-control-sm" placeholder="Especialidad / Línea">
            </div>
            <div class="col-12">
              <input type="email" v-model="member.correo" class="form-control form-control-sm" placeholder="Correo de contacto">
            </div>
          </div>
        </div>

        <button @click="addComiteMember" class="btn btn-sm btn-outline-success w-100 mt-2">
          <i class="las la-plus"></i> Añadir Especialista
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.media-box { height: 60px; background-size: cover; background-position: center; background-color: #ffffff; border-radius: 8px; display: grid; place-items: center; cursor: pointer; transition: border-color 0.2s; }
.media-box:hover { border-color: #0d6efd !important; }
</style>