<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits([
  'update:modelValue',
  'select-image'
])

const buildState = (val: any) => ({
  titleRequirements: val?.titleRequirements || '',
  requirements: Array.isArray(val?.requirements) ? JSON.parse(JSON.stringify(val.requirements)) : [],
  titleDocuments: val?.titleDocuments || '',
  documents: Array.isArray(val?.documents) ? JSON.parse(JSON.stringify(val.documents)) : [],
  buttonText: val?.buttonText || '',
  buttonUrl: val?.buttonUrl || ''
})

const localData = ref(buildState(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    const incoming = buildState(value)
    if (JSON.stringify(incoming) !== JSON.stringify(localData.value)) {
      localData.value = incoming
    }
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

      <div class="input-group input-group-sm mb-2">
        <input
          v-model="doc.file"
          class="form-control"
          placeholder="URL archivo"
        >
        <button
          type="button"
          class="btn btn-outline-primary"
          title="Seleccionar o subir archivo"
          @click="$emit('select-image', { item: doc, field: 'file' })"
        >
          <i class="las la-cloud-upload-alt"></i>
        </button>
      </div>

      <button
        class="btn btn-danger btn-sm mt-1"
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

    <div class="input-group">
      <input
        v-model="localData.buttonUrl"
        class="form-control"
        placeholder="URL botón"
      >
      <button
        type="button"
        class="btn btn-outline-primary"
        title="Seleccionar archivo desde Biblioteca"
        @click="$emit('select-image', { item: localData, field: 'buttonUrl' })"
      >
        <i class="las la-folder-open"></i>
      </button>
    </div>

  </div>
</template>