<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits([
  'update:modelValue'
])

const localData = ref({
  title: props.modelValue?.title || 'Fases del Proceso',

  cards: props.modelValue?.cards || [
    {
      title: 'Solicitud Institucional',
      description: '',
      periodText: '1 Semana',
      highlightBackground: true
    }
  ]
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

const addCard = () => {
  localData.value.cards.push({
    title: 'Nueva Fase',
    description: '',
    periodText: '1 Semana',
    highlightBackground: false
  })
}

const removeCard = (index: number) => {
  localData.value.cards.splice(index, 1)
}
</script>

<template>
  <div class="p-3">

    <div class="card border-0 shadow-sm">

      <div class="card-body">

        <h6 class="fw-bold mb-3 text-primary">
          Process Phases
        </h6>

        <div class="mb-4">
          <label class="small text-muted">
            Título del bloque
          </label>

          <input
            v-model="localData.title"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div
          v-for="(card, index) in localData.cards"
          :key="index"
          class="border rounded p-3 mb-3"
        >
          <div class="d-flex justify-content-between align-items-center mb-3">

            <strong>
              Fase {{ Number(index) + 1 }}
            </strong>

            <button
              v-if="localData.cards.length > 1"
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="removeCard(Number(index))"
            >
              Eliminar
            </button>

          </div>

          <div class="mb-3">
            <label class="small text-muted">
              Título
            </label>

            <input
              v-model="card.title"
              type="text"
              class="form-control form-control-sm"
            >
          </div>

          <div class="mb-3">
            <label class="small text-muted">
              Descripción
            </label>

            <textarea
              v-model="card.description"
              rows="4"
              class="form-control form-control-sm"
            />
          </div>

          <div class="mb-3">
            <label class="small text-muted">
              Periodo (acepta HTML)
            </label>

            <textarea
              v-model="card.periodText"
              rows="3"
              class="form-control form-control-sm"
            />
          </div>

          <div class="form-check">

            <input
              :id="`highlight-${index}`"
              v-model="card.highlightBackground"
              class="form-check-input"
              type="checkbox"
            >

            <label
              :for="`highlight-${index}`"
              class="form-check-label"
            >
              Card destacada
            </label>

          </div>

        </div>

        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="addCard"
        >
          Agregar fase
        </button>

      </div>

    </div>

  </div>
</template>