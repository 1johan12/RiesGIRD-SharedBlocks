<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatImageUrl, extractYoutubeId } from '../../../../helpers/url';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
  title: props.modelValue?.title !== undefined ? props.modelValue.title : '¿Quiénes somos?',
  text: props.modelValue?.text || '',
  mediaType: props.modelValue?.mediaType === 'video' ? 'video' : 'image',
  imageUrl: props.modelValue?.imageUrl || '',
  videoUrl: props.modelValue?.videoUrl || ''
});

const detectedYoutubeId = computed(() => extractYoutubeId(localData.value.videoUrl));

// Sincronización blindada contra bucles de reactividad profunda
watch(() => props.modelValue, (newVal) => {
  if (!newVal) return;
  const incoming = {
    title: newVal.title !== undefined ? newVal.title : '¿Quiénes somos?',
    text: newVal.text || '',
    mediaType: newVal.mediaType === 'video' ? 'video' : 'image',
    imageUrl: newVal.imageUrl || '',
    videoUrl: newVal.videoUrl || ''
  };
  if (JSON.stringify(incoming) !== JSON.stringify(localData.value)) {
    localData.value = incoming;
  }
}, { deep: true });

watch(localData, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });
</script>

<template>
  <div class="p-3">

    <div class="card mb-3 border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-primary">
          <i class="las la-align-left"></i> Textos Informativos
        </h6>

        <div class="mb-3">
          <label class="small text-muted mb-1 fw-bold">Título de la Sección</label>
          <input
            type="text"
            v-model="localData.title"
            class="form-control form-control-sm"
            placeholder="Ej: ¿Quiénes somos?"
          >
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 fw-bold">Descripción / Reseña (Opcional)</label>
          <textarea
            v-model="localData.text"
            class="form-control form-control-sm"
            rows="5"
            placeholder="Si dejas este campo vacío, la descripción se ocultará automáticamente en la vista pública..."
          ></textarea>
          <span class="x-small text-muted d-block mt-1">Soporta HTML básico como `<strong>texto</strong>`. Si queda vacío, no se renderiza el bloque de texto.</span>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h6 class="fw-bold mb-3 text-warning">
          <i class="las la-photo-video"></i> Multimedia (Imagen o Video YouTube)
        </h6>

        <div class="btn-group btn-group-sm w-100 mb-3" role="group">
          <button
            type="button"
            class="btn border"
            :class="localData.mediaType === 'image' ? 'btn-primary fw-bold' : 'btn-light'"
            @click="localData.mediaType = 'image'"
          >
            <i class="las la-image me-1"></i> Imagen
          </button>
          <button
            type="button"
            class="btn border"
            :class="localData.mediaType === 'video' ? 'btn-danger fw-bold' : 'btn-light'"
            @click="localData.mediaType = 'video'"
          >
            <i class="lab la-youtube me-1"></i> Video YouTube (Modal)
          </button>
        </div>

        <div v-if="localData.mediaType === 'video'" class="mb-3">
          <label class="small text-muted mb-1 d-block fw-bold">Enlace de YouTube</label>
          <input
            type="url"
            v-model="localData.videoUrl"
            class="form-control form-control-sm"
            placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
          >
          <small v-if="detectedYoutubeId" class="text-success d-block mt-1 fw-semibold">
            <i class="las la-check-circle"></i> Video detectado (ID: {{ detectedYoutubeId }} · carga lazy al abrir modal).
          </small>
          <small v-else-if="localData.videoUrl.trim()" class="text-danger d-block mt-1">
            Ingresa una URL válida de YouTube (watch, youtu.be, shorts o embed).
          </small>
        </div>

        <div class="mb-2">
          <label class="small text-muted mb-1 d-block fw-bold">
            {{ localData.mediaType === 'video' ? 'Portada / Miniatura (Opcional: usa la de YouTube si se deja vacía)' : 'Fotografía Destacada' }}
          </label>
          <div
            @click="$emit('select-image', { item: localData, field: 'imageUrl' })"
            class="media-placeholder border rounded clickable"
            :style="{
              backgroundImage: localData.imageUrl
                ? `url(${formatImageUrl(localData.imageUrl, '')})`
                : (localData.mediaType === 'video' && detectedYoutubeId
                    ? `url(https://i.ytimg.com/vi/${detectedYoutubeId}/hqdefault.jpg)`
                    : 'none')
            }"
          >
            <i v-if="!localData.imageUrl && !(localData.mediaType === 'video' && detectedYoutubeId)" class="las la-picture-o fs-3 text-muted"></i>
          </div>
          <div class="d-flex gap-1 mt-1">
            <button type="button" class="btn btn-xs btn-outline-primary flex-grow-1" @click="$emit('select-image', { item: localData, field: 'imageUrl' })">
              <i class="las la-image me-1"></i>{{ localData.imageUrl ? 'Cambiar Imagen' : 'Elegir Imagen' }}
            </button>
            <button v-if="localData.imageUrl" type="button" class="btn btn-xs btn-outline-danger" @click="localData.imageUrl = ''">
              <i class="las la-times"></i>
            </button>
          </div>
          <span class="x-small text-muted d-block mt-2">
            {{ localData.mediaType === 'video'
              ? 'La miniatura se carga con lazy-loading y el reproductor de YouTube solo se monta al hacer clic.'
              : 'Se recomienda un formato horizontal limpio (ej: 1200x800px) con buena compresión para web.' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.x-small { font-size: 0.65rem; }
.media-placeholder {
  height: 140px;
  background-size: cover;
  background-position: center;
  display: grid;
  place-items: center;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: all 0.2s;
}
.clickable:hover {
  opacity: 0.85;
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 1px #0d6efd;
}
</style>
