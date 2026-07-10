<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits([
  'update:modelValue'
])

const localData = ref({
  title: props.modelValue?.title || '',
  introText: props.modelValue?.introText || '',
  maxWidth: props.modelValue?.maxWidth || 760,
  gap: props.modelValue?.gap || 40,
  paddingTop: props.modelValue?.paddingTop || 0,
  paddingBottom: props.modelValue?.paddingBottom || 0,
  backgroundColor: props.modelValue?.backgroundColor || 'transparent'
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return

    const incoming = JSON.stringify(newVal)
    const current = JSON.stringify(localData.value)

    if (incoming !== current) {
      localData.value = {
        ...localData.value,
        ...newVal
      }
    }
  },
  { deep: true }
)

watch(
  localData,
  (value) => {
    emit(
      'update:modelValue',
      { ...value }
    )
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="p-3">
    <div class="card border-0 shadow-sm">
      <div class="card-body">

        <h6 class="fw-bold text-primary mb-3">
          Encabezado de Sección
        </h6>

        <div class="mb-3">
          <label class="small text-muted">
            Título
          </label>

          <input
            v-model="localData.title"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Introducción
          </label>

          <textarea
            v-model="localData.introText"
            rows="4"
            class="form-control form-control-sm"
          />
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Ancho máximo (px)
          </label>

          <input
            v-model.number="localData.maxWidth"
            type="number"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Separación título / texto
          </label>

          <input
            v-model.number="localData.gap"
            type="number"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Padding superior
          </label>

          <input
            v-model.number="localData.paddingTop"
            type="number"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Padding inferior
          </label>

          <input
            v-model.number="localData.paddingBottom"
            type="number"
            class="form-control form-control-sm"
          >
        </div>

        <div>
          <label class="small text-muted">
            Color de fondo
          </label>

          <div class="input-group">
            <input
              v-model="localData.backgroundColor"
              type="text"
              class="form-control form-control-sm"
              placeholder="#ffffff"
            >

            <div class="input-group-text p-1 bg-white">
              <input
                v-model="localData.backgroundColor"
                type="color"
                class="form-control form-control-color border-0 m-0 p-0"
                style="width: 38px; height: 100%; min-height: 30px; cursor: pointer;"
                title="Elegir color de fondo"
              >
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>