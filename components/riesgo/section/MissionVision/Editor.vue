<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const localData = ref({
  visionTitle: props.modelValue?.visionTitle || 'Nuestra Visión',
  visionText: props.modelValue?.visionText || '',
  visionFutureTitle: props.modelValue?.visionFutureTitle || '',
  visionFutureText: props.modelValue?.visionFutureText || '',

  misionTitle: props.modelValue?.misionTitle || 'Nuestra Misión',
  misionText: props.modelValue?.misionText || '',
  misionHowTitle: props.modelValue?.misionHowTitle || '',
  misionHowText: props.modelValue?.misionHowText || ''
})

const activeTab = ref<'vision' | 'mision'>('vision')

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
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)
</script>

<template>
  <div class="p-2">
    <div class="btn-group w-100 mb-3 shadow-sm rounded-3 overflow-hidden">
      <button
        class="btn btn-sm"
        :class="activeTab === 'vision' ? 'btn-primary' : 'btn-light border'"
        @click="activeTab = 'vision'"
      >
        <i class="las la-eye"></i>
        Visión
      </button>

      <button
        class="btn btn-sm"
        :class="activeTab === 'mision' ? 'btn-danger' : 'btn-light border'"
        @click="activeTab = 'mision'"
      >
        <i class="las la-flag"></i>
        Misión
      </button>
    </div>

    <!-- VISIÓN -->
    <div
      v-if="activeTab === 'vision'"
      class="card border-0 shadow-sm animate-fade-in"
    >
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-eye"></i>
          Contenido de la Visión
        </h6>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Título Principal
          </label>
          <input
            v-model="localData.visionTitle"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Texto Descriptivo
          </label>
          <textarea
            v-model="localData.visionText"
            rows="5"
            class="form-control form-control-sm"
          />
        </div>

        <hr>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Título del Futuro
          </label>
          <input
            v-model="localData.visionFutureTitle"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div>
          <label class="small text-muted fw-bold mb-1">
            Texto del Futuro
          </label>
          <textarea
            v-model="localData.visionFutureText"
            rows="4"
            class="form-control form-control-sm"
          />
        </div>
      </div>
    </div>

    <!-- MISIÓN -->
    <div
      v-if="activeTab === 'mision'"
      class="card border-0 shadow-sm animate-fade-in"
    >
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-danger">
          <i class="las la-flag"></i>
          Contenido de la Misión
        </h6>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Título Principal
          </label>
          <input
            v-model="localData.misionTitle"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Texto Descriptivo
          </label>
          <textarea
            v-model="localData.misionText"
            rows="5"
            class="form-control form-control-sm"
          />
        </div>

        <hr>

        <div class="mb-3">
          <label class="small text-muted fw-bold mb-1">
            Título del Cómo
          </label>
          <input
            v-model="localData.misionHowTitle"
            type="text"
            class="form-control form-control-sm"
          >
        </div>

        <div>
          <label class="small text-muted fw-bold mb-1">
            Texto del Cómo
          </label>
          <textarea
            v-model="localData.misionHowText"
            rows="4"
            class="form-control form-control-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>