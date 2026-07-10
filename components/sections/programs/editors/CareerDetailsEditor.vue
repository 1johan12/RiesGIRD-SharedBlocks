<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  image: props.modelValue?.image || '',
  boxBgColor: props.modelValue?.boxBgColor || '#fcf5fb',
  iconColor: props.modelValue?.iconColor || '#8c357f',
  textColor: props.modelValue?.textColor || '#1e1e1e',
  
  items: props.modelValue?.items?.length ? [...props.modelValue.items] : [
    { icon: 'bi bi-calendar3', text: '10 Semestres' },
    { icon: 'bi bi-bar-chart-fill', text: '200 Créditos' },
    { icon: 'bi bi-mortarboard', text: 'Grado de Bachiller' },
    { icon: 'bi bi-bank', text: 'Título de Ingeniero' }
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


const addItem = () => {
  
  localData.value.items.push({ icon: 'bi bi-check-circle', text: 'Nuevo detalle' });
};

const removeItem = (i: number) => {
  localData.value.items.splice(i, 1);
};


const activeIconIndex = ref<number | null>(null);


const suggestedIcons = [
  'bi bi-calendar3', 'bi bi-clock', 'bi bi-bar-chart-fill', 'bi bi-mortarboard',
  'bi bi-bank', 'bi bi-award', 'bi bi-book', 'bi bi-person-video3',
  'bi bi-laptop', 'bi bi-display', 'bi bi-database', 'bi bi-code-slash',
  'bi bi-star-fill', 'bi bi-trophy', 'bi bi-briefcase', 'bi bi-globe'
];

const selectIcon = (iconClass: string) => {
  if (activeIconIndex.value !== null) {
    localData.value.items[activeIconIndex.value].icon = iconClass;
    activeIconIndex.value = null; 
  }
};
</script>

<template>
  <div class="p-3">
    <div class="card bg-light border-0 shadow-sm">
      <div class="card-body p-3">
        <h6 class="fw-bold text-primary mb-3"><i class="bi bi-list-ul"></i> Lista de Detalles</h6>

        <div v-for="(item, i) in localData.items" :key="i" class="card mb-3 p-2 shadow-sm border-0 position-relative">
          <button @click="removeItem(i)" class="btn btn-sm text-danger position-absolute top-0 end-0 m-1 p-0 z-1">
            <i class="bi bi-x-lg fs-6"></i>
          </button>
          
          <div class="row g-2 align-items-center pe-3 mb-2">
            <div class="col-12 col-md-4">
              <label class="small text-muted mb-1">Icono</label>
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-white">
                  <i :class="item.icon" class="fs-5" :style="{ color: localData.iconColor }"></i>
                </span>
                <input type="text" class="form-control" v-model="item.icon">
                <button class="btn btn-outline-secondary" type="button" @click="activeIconIndex = activeIconIndex === i ? null : i">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>

            <div class="col-12 col-md-8">
              <label class="small text-muted mb-1">Texto</label>
              <input type="text" class="form-control form-control-sm" v-model="item.text">
            </div>
          </div>

          <div v-if="activeIconIndex === i" class="bg-white p-2 border rounded mt-2">
            <label class="small text-muted d-block mb-2">Selecciona un icono rápido:</label>
            <div class="d-flex flex-wrap gap-1">
              <button 
                v-for="icon in suggestedIcons" 
                :key="icon"
                @click="selectIcon(icon)"
                class="btn btn-sm btn-light border p-2 d-flex align-items-center justify-content-center"
                style="width: 40px; height: 40px;"
                title="Seleccionar este icono"
              >
                <i :class="icon" class="fs-5 text-dark"></i>
              </button>
            </div>
            <div class="text-end mt-2">
              <button class="btn btn-sm btn-link text-muted p-0" @click="activeIconIndex = null">Cerrar</button>
            </div>
          </div>

        </div>

        <button @click="addItem" class="btn btn-sm btn-outline-primary w-100 mt-2 fw-bold">
          <i class="bi bi-plus-lg"></i> AGREGAR DETALLE
        </button>
      </div>
    </div>
  </div>
</template>