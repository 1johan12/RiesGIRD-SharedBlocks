<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
  cardBgColor: props.modelValue?.cardBgColor || '#db143c',
  metricas: props.modelValue?.metricas || [
    { id: 1, numero: '25+', label: 'Universidades' },
    { id: 2, numero: '45+', label: 'Investigadores' },
    { id: 3, numero: '1200+', label: 'Personas Capacitadas' },
    { id: 4, numero: '8', label: 'Convenios' }
  ]
});

// Métodos para controlar el arreglo dinámico
const addMetrica = () => {
  localData.value.metricas.push({
    id: Date.now(),
    numero: '10+',
    label: 'Nueva Métrica'
  });
};

const removeMetrica = (index: number) => {
  localData.value.metricas.splice(index, 1);
};

// Sincronización limpia para romper bucles reactivos
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
    
    <!-- Configuración Estética Global del Bloque -->
    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning"><i class="las la-palette"></i> Estilo del Bloque</h6>
        
        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Color de las Tarjetas</label>
          <div class="d-flex gap-2 align-items-center">
            <input type="color" v-model="localData.cardBgColor" class="form-control form-control-color p-1" style="width: 50px; height: 38px;">
            <input type="text" v-model="localData.cardBgColor" class="form-control form-control-sm" placeholder="#db143c">
          </div>
        </div>
      </div>
    </div>

    <!-- Lista Dinámica de Métricas -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0 text-primary"><i class="las la-list-ol"></i> Métricas / Contadores</h6>
          <span class="badge bg-secondary text-white small">{{ localData.metricas.length }}</span>
        </div>

        <div v-for="(item, index) in localData.metricas" :key="item.id || index" class="border rounded mb-3 p-2 bg-light position-relative">
          
          <!-- Botón de eliminación -->
          <button 
            @click="removeMetrica(Number(index))" 
            class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 py-0 px-1 text-white" 
            title="Eliminar Métrica"
            :disabled="localData.metricas.length <= 1"
          >
            <i class="las la-times"></i>
          </button>

          <div class="row g-2 mt-2">
            <!-- Input del Número/Dato -->
            <div class="col-4">
              <label class="x-small fw-bold text-muted mb-1">Número</label>
              <input type="text" v-model="item.numero" class="form-control form-control-sm text-center fw-bold" placeholder="Ej: 25+">
            </div>
            
            <!-- Input de la Descripción -->
            <div class="col-8">
              <label class="x-small fw-bold text-muted mb-1">Etiqueta</label>
              <input type="text" v-model="item.label" class="form-control form-control-sm" placeholder="Ej: Universidades">
            </div>
          </div>

        </div>

        <!-- Botón para añadir una nueva tarjeta al Grid -->
        <button @click="addMetrica" class="btn btn-sm btn-outline-success w-100 mt-2" :disabled="localData.metricas.length >= 4">
          <i class="las la-plus"></i> Agregar Métrica (Máx 4)
        </button>
        <p v-if="localData.metricas.length >= 4" class="x-small text-center text-muted mt-2 mb-0">Se recomienda un máximo de 4 columnas para mantener el diseño flotante.</p>

      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.7rem; }
.form-control-color { cursor: pointer; }
</style>