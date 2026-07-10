<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits([
  'update:modelValue'
])

const localData = ref({
  title: props.modelValue?.title || 'Certificado de Membresía',
  description: props.modelValue?.description || '',
  buttonText: props.modelValue?.buttonText || 'Solicitar Información',
  buttonUrl: props.modelValue?.buttonUrl || '#'
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

        <h6 class="fw-bold mb-3 text-primary">
          Certificado de Membresía
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
            Descripción
          </label>

          <textarea
            v-model="localData.description"
            rows="4"
            class="form-control form-control-sm"
          />
        </div>

        <div class="mb-3">
          <label class="small text-muted">
            Texto del botón
          </label>

          <input
            v-model="localData.buttonText"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div>
          <label class="small text-muted">
            URL del botón
          </label>

          <input
            v-model="localData.buttonUrl"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

      </div>
    </div>

  </div>
</template>