<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits([
  'update:modelValue'
])

const localData = ref(
  JSON.parse(JSON.stringify(props.modelValue))
)

watch(
  () => props.modelValue,
  (value) => {
    localData.value = JSON.parse(
      JSON.stringify(value)
    )
  },
  { deep: true }
)

watch(
  localData,
  (value) => {
    emit(
      'update:modelValue',
      JSON.parse(JSON.stringify(value))
    )
  },
  { deep: true }
)

const addRequirement = () => {
  localData.value.requirements.push({
    text: ''
  })
}

const removeRequirement = (index: number) => {
  localData.value.requirements.splice(index, 1)
}

const addDocument = () => {
  localData.value.documents.push({
    title: '',
    description: '',
    file: ''
  })
}

const removeDocument = (index: number) => {
  localData.value.documents.splice(index, 1)
}
</script>

<template>
  <div class="p-3">

    <div class="mb-4">
      <label>Título Requisitos</label>

      <input
        v-model="localData.titleRequirements"
        class="form-control"
      >
    </div>

    <div
      v-for="(item, index) in localData.requirements"
      :key="index"
      class="card p-2 mb-2"
    >
      <input
        v-model="item.text"
        class="form-control mb-2"
        placeholder="Requisito"
      >

      <button
        class="btn btn-danger btn-sm"
        @click="removeRequirement(Number(index))"
      >
        Eliminar
      </button>
    </div>

    <button
      class="btn btn-primary mb-4"
      @click="addRequirement"
    >
      Agregar requisito
    </button>

    <hr>

    <div class="mb-4">
      <label>Título Documentos</label>

      <input
        v-model="localData.titleDocuments"
        class="form-control"
      >
    </div>

    <div
      v-for="(doc, index) in localData.documents"
      :key="index"
      class="card p-3 mb-3"
    >
      <input
        v-model="doc.title"
        class="form-control mb-2"
        placeholder="Título"
      >

      <input
        v-model="doc.description"
        class="form-control mb-2"
        placeholder="Descripción"
      >

      <input
        v-model="doc.file"
        class="form-control"
        placeholder="URL archivo"
      >

      <button
        class="btn btn-danger btn-sm mt-2"
        @click="removeDocument(Number(index))"
      >
        Eliminar
      </button>
    </div>

    <button
      class="btn btn-primary mb-4"
      @click="addDocument"
    >
      Agregar documento
    </button>

    <hr>

    <input
      v-model="localData.buttonText"
      class="form-control mb-3"
      placeholder="Texto botón"
    >

    <input
      v-model="localData.buttonUrl"
      class="form-control"
      placeholder="URL botón"
    >

  </div>
</template>