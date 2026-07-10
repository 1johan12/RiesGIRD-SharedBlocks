<template>
  <div class="header-innova-editor">

    <div class="p-3 mb-3 border rounded bg-light">
      <h6 class="fw-bold mb-3 text-primary d-flex align-items-center">
        <i class="las la-heading me-2"></i> Contenido del Hero
      </h6>

      <div class="mb-3">
        <label class="small fw-bold text-muted mb-1">Título Principal (Span Grande)</label>
        <div class="input-group input-group-sm">
            <span class="input-group-text bg-white"><i class="las la-text-height"></i></span>
            <input 
              :value="localContent.heroTitle" 
              @input="updateField('heroTitle', ($event.target as HTMLInputElement).value)"
              class="form-control" 
              placeholder="Ej: innova esan">
        </div>
      </div>

      <div class="mb-0">
        <label class="small fw-bold text-muted mb-1">Subtítulo (Segunda línea)</label>
        <div class="input-group input-group-sm">
            <span class="input-group-text bg-white"><i class="las la-align-left"></i></span>
            <input 
              :value="localContent.heroSubtitle" 
              @input="updateField('heroSubtitle', ($event.target as HTMLInputElement).value)"
              class="form-control" 
              placeholder="Ej: the business challenge">
        </div>
      </div>
    </div>

    <div class="p-3 mb-3 border rounded bg-white">
      <h6 class="fw-bold mb-3 text-dark small d-flex align-items-center">
        <i class="las la-images me-1"></i> Imágenes
      </h6>
      
      <div class="mb-3 border-bottom pb-3">
        <label class="small fw-bold text-muted mb-2">Logo Principal (Menú)</label>
        <div class="d-flex align-items-center gap-3">
          <div class="flex-shrink-0">
               <div v-if="localContent.logoUrl" class="rounded overflow-hidden border shadow-sm d-flex align-items-center justify-content-center" style="width: 100px; height: 50px; background: #eee;">
                  <img :src="formatImageUrl(localContent.logoUrl)" class="object-fit-contain" style="max-height: 100%; max-width: 100%;">
               </div>
               <div v-else class="rounded border bg-light d-flex align-items-center justify-content-center text-muted" style="width: 100px; height: 50px;">
                  <i class="las la-image fs-3 opacity-50"></i>
               </div>
          </div>
          <div class="flex-grow-1">
               <button type="button" 
                       @click="$emit('select-image', { item: localContent, field: 'logoUrl' })" 
                       class="btn btn-sm btn-outline-primary w-100">
                  <i class="las la-cloud-upload-alt me-1"></i> Cambiar Logo
               </button>
               <button v-if="localContent.logoUrl" 
                       @click="updateField('logoUrl', '')" 
                       class="btn btn-xs btn-link text-danger text-decoration-none mt-1 w-100 text-end">
                  <small>Quitar</small>
               </button>
          </div>
        </div>
      </div>

      <div class="mb-0">
        <label class="small fw-bold text-muted mb-2">Imagen de Fondo (Banner)</label>
        <div class="d-flex align-items-center gap-3">
          <div class="flex-shrink-0">
               <div v-if="localContent.heroImage" class="ratio ratio-16x9 rounded overflow-hidden border shadow-sm" style="width: 100px;">
                  <img :src="formatImageUrl(localContent.heroImage)" class="object-fit-cover">
               </div>
               <div v-else class="ratio ratio-16x9 rounded border bg-light d-flex align-items-center justify-content-center text-muted" style="width: 100px;">
                  <i class="las la-image fs-3 opacity-50"></i>
               </div>
          </div>
          <div class="flex-grow-1">
               <button type="button" 
                       @click="$emit('select-image', { item: localContent, field: 'heroImage' })" 
                       class="btn btn-sm btn-outline-primary w-100">
                  <i class="las la-cloud-upload-alt me-1"></i> Cambiar Fondo
               </button>
               <button v-if="localContent.heroImage" 
                       @click="updateField('heroImage', '')" 
                       class="btn btn-xs btn-link text-danger text-decoration-none mt-1 w-100 text-end">
                  <small>Quitar</small>
               </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 mb-3 border rounded bg-light">
      <h6 class="fw-bold mb-3 text-warning d-flex align-items-center">
        <i class="las la-palette me-2"></i> Diseño y Colores
      </h6>

      <div class="mb-3 d-flex justify-content-between align-items-center border-bottom pb-2">
        <label class="small fw-bold text-muted mb-0">Color Principal (Menú Fijo)</label>
        <input type="color" 
               :value="localContent.primaryColor || '#ff8121'" 
               @input="updateField('primaryColor', ($event.target as HTMLInputElement).value)"
               class="form-control form-control-color form-control-sm border-0 p-0" 
               style="width: 40px; height: 30px;" title="Elige un color">
      </div>

      <div class="mb-3 d-flex justify-content-between align-items-center border-bottom pb-2">
        <label class="small fw-bold text-muted mb-0">Color Onda Inferior</label>
        <input type="color" 
               :value="localContent.waveColor || '#ffffff'" 
               @input="updateField('waveColor', ($event.target as HTMLInputElement).value)"
               class="form-control form-control-color form-control-sm border-0 p-0" 
               style="width: 40px; height: 30px;" title="Elige un color">
      </div>

      <div class="mb-0">
        <label class="small fw-bold text-muted mb-1">Capa Degradada (Fondo CSS)</label>
        <textarea :value="localContent.bannerOverlay" 
                  @input="updateField('bannerOverlay', ($event.target as HTMLTextAreaElement).value)"
                  class="form-control form-control-sm" 
                  rows="2"
                  placeholder="Ej: linear-gradient(...)"></textarea>
        <div class="form-text x-small">Filtro de color que va encima de la imagen de fondo.</div>
      </div>
    </div>

    <div class="p-3 mb-3 border rounded bg-white">
      <h6 class="fw-bold mb-3 text-info d-flex align-items-center">
        <i class="las la-link me-2"></i> Enlaces Superiores (Top Bar)
      </h6>

      <div v-if="localContent.topLinks && localContent.topLinks.length > 0" class="list-group shadow-sm mb-2">
          <div v-for="(link, index) in localContent.topLinks" :key="'tl-'+index" class="list-group-item p-2 bg-light mb-1">
              <div class="d-flex justify-content-between align-items-center mb-1">
                  <small class="fw-bold text-muted">Enlace {{ Number(index) + 1 }}</small>
                  <button @click="removeTopLink(Number(index))" class="btn btn-xs btn-outline-danger border-0 px-1 py-0">
                      <i class="las la-times fs-6"></i>
                  </button>
              </div>
              <input :value="link.label" 
                     @input="updateArrayItem('topLinks', Number(index), 'label', ($event.target as HTMLInputElement).value)"
                     class="form-control form-control-sm mb-1" placeholder="Texto a mostrar (Ej: Esan University)">
              <input :value="link.url" 
                     @input="updateArrayItem('topLinks', Number(index), 'url', ($event.target as HTMLInputElement).value)"
                     class="form-control form-control-sm" placeholder="URL Destino">
          </div>
      </div>
      <div v-else class="text-center p-2 border border-dashed rounded bg-light mb-2">
          <small class="text-muted fst-italic">Sin enlaces superiores</small>
      </div>
      
      <button @click="addTopLink" class="btn btn-sm btn-outline-info w-100 border-dashed fw-bold">
          <i class="las la-plus me-1"></i> Agregar Enlace Superior
      </button>
    </div>

    <div class="p-3 border rounded bg-white">
      <h6 class="fw-bold mb-3 text-success d-flex align-items-center">
        <i class="las la-share-alt me-2"></i> Redes Sociales
      </h6>

      <div v-if="localContent.socialLinks && localContent.socialLinks.length > 0" class="list-group shadow-sm mb-2">
          <div v-for="(social, index) in localContent.socialLinks" :key="'sl-'+index" class="list-group-item p-2 bg-light mb-1">
              <div class="d-flex justify-content-between align-items-center mb-1">
                  <div class="d-flex align-items-center">
                    <i :class="social.icon" class="fs-5 me-2 text-primary"></i>
                    <small class="fw-bold text-muted">Red {{ Number(index) + 1 }}</small>
                  </div>
                  <button @click="removeSocialLink(Number(index))" class="btn btn-xs btn-outline-danger border-0 px-1 py-0">
                      <i class="las la-times fs-6"></i>
                  </button>
              </div>
              <input :value="social.icon" 
                     @input="updateArrayItem('socialLinks', Number(index), 'icon', ($event.target as HTMLInputElement).value)"
                     class="form-control form-control-sm mb-1" placeholder="Clase de icono (Ej: fa-brands fa-instagram)">
              <input :value="social.url" 
                     @input="updateArrayItem('socialLinks', Number(index), 'url', ($event.target as HTMLInputElement).value)"
                     class="form-control form-control-sm" placeholder="URL Destino">
          </div>
      </div>
      <div v-else class="text-center p-2 border border-dashed rounded bg-light mb-2">
          <small class="text-muted fst-italic">Sin redes sociales</small>
      </div>
      
      <button @click="addSocialLink" class="btn btn-sm btn-outline-success w-100 border-dashed fw-bold">
          <i class="las la-plus me-1"></i> Agregar Red Social
      </button>
    </div>
    <div class="p-3 mt-3 border rounded bg-white shadow-sm border-primary">
      <h6 class="fw-bold mb-3 text-primary d-flex align-items-center">
        <i class="las la-stream me-2"></i> Menú de Navegación (Secciones)
      </h6>
      <p class="x-small text-muted mb-3">
        Estos enlaces se crean automáticamente según los bloques que añades a la página. 
        Puedes cambiar el texto que aparecerá en el menú.
      </p>

      <div v-if="localContent.navLinks && localContent.navLinks.length > 0" class="d-flex flex-column gap-2">
          <div v-for="(link, index) in localContent.navLinks" :key="link.id || index" class="p-2 border rounded bg-light">
              <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge bg-secondary" style="font-size: 0.65rem;">Ancla: {{ link.url }}</span>
              </div>
              <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="las la-tag"></i></span>
                  <input 
                    type="text" 
                    :value="link.label" 
                    @input="updateArrayItem('navLinks', Number(index), 'label', ($event.target as HTMLInputElement).value)"
                    class="form-control" 
                    placeholder="Etiqueta del menú">
              </div>
          </div>
      </div>
      <div v-else class="text-center p-3 border border-dashed rounded bg-light">
          <small class="text-muted fst-italic">No hay secciones detectadas para el menú.</small>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '../../../helpers/url';

const props = defineProps<{
  modelValue: any 
}>();

const emit = defineEmits(['update:modelValue', 'select-image']);


const localContent = computed(() => props.modelValue || {});




const updateField = (field: string, value: string) => {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
};


const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    
    const currentArray = [...(props.modelValue[arrayName] || [])];
    
    currentArray[index] = { ...currentArray[index], [field]: value };
    
    emit('update:modelValue', { ...props.modelValue, [arrayName]: currentArray });
};


const addTopLink = () => {
    const currentLinks = [...(props.modelValue.topLinks || [])];
    currentLinks.push({ label: 'Nuevo Enlace', url: '#' });
    emit('update:modelValue', { ...props.modelValue, topLinks: currentLinks });
};

const removeTopLink = (index: number) => {
    const currentLinks = [...(props.modelValue.topLinks || [])];
    currentLinks.splice(index, 1);
    emit('update:modelValue', { ...props.modelValue, topLinks: currentLinks });
};


const addSocialLink = () => {
    const currentSocials = [...(props.modelValue.socialLinks || [])];
    currentSocials.push({ icon: 'fa-brands fa-facebook-f', url: '#' });
    emit('update:modelValue', { ...props.modelValue, socialLinks: currentSocials });
};

const removeSocialLink = (index: number) => {
    const currentSocials = [...(props.modelValue.socialLinks || [])];
    currentSocials.splice(index, 1);
    emit('update:modelValue', { ...props.modelValue, socialLinks: currentSocials });
};

</script>

<style scoped>
.x-small {
  font-size: 0.75rem;
}
.object-fit-cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.object-fit-contain {
  object-fit: contain;
}
.btn-xs {
    padding: 0.1rem 0.4rem;
    font-size: 0.75rem;
}
.border-dashed {
    border-style: dashed !important;
}
</style>