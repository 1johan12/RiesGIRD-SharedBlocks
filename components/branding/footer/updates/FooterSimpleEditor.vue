<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const localData = ref({
    bgColor: props.modelValue?.bgColor || '#1e1e1e',
    textColor: props.modelValue?.textColor || '#7e7e7e',
    linkColor: props.modelValue?.linkColor || '#9ba8b5',
    iconColor: props.modelValue?.iconColor || '#ffffff',
    links: props.modelValue?.links?.length ? [...props.modelValue.links] : [],
    copyrightText: props.modelValue?.copyrightText || '',
    socialLinks: props.modelValue?.socialLinks?.length ? [...props.modelValue.socialLinks] : []
});

watch(localData, (newVal) => emit('update:modelValue', { ...newVal }), { deep: true });


const addLink = () => localData.value.links.push({ text: 'Nuevo Enlace', url: '#' });
const addSocial = () => localData.value.socialLinks.push({ icon: 'bi bi-link', url: '#' });
</script>

<template>
    <div class="pro-editor bg-white rounded-4 border p-4 mt-3 shadow-sm h-100 overflow-auto">
        <h6 class="fw-bold mb-4 pb-2 border-bottom d-flex align-items-center">
            <i class="bi bi-window-minimize text-primary fs-4 me-2"></i> Configuración Footer Simple
        </h6>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">1. PALETA DE COLORES</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="row g-2">
                    <div class="col-6 col-md-3 text-center">
                        <label class="small d-block">Fondo</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bgColor">
                    </div>
                    <div class="col-6 col-md-3 text-center">
                        <label class="small d-block">Enlaces</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.linkColor">
                    </div>
                    <div class="col-6 col-md-3 text-center">
                        <label class="small d-block">Texto (Copy)</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.textColor">
                    </div>
                    <div class="col-6 col-md-3 text-center">
                        <label class="small d-block">Redes Soc.</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.iconColor">
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="section-title text-muted mb-0">2. ENLACES PRINCIPALES (SEPARADOS POR | )</label>
                <button class="btn btn-xs btn-outline-primary p-1 px-2" @click="addLink"><i class="bi bi-plus"></i></button>
            </div>
            <div class="bg-light p-2 rounded-3 border">
                <div v-for="(link, i) in localData.links" :key="i" class="d-flex gap-1 mb-1">
                    <input type="text" class="form-control form-control-xs" v-model="link.text" placeholder="Texto">
                    <input type="text" class="form-control form-control-xs" v-model="link.url" placeholder="URL">
                    <button class="btn btn-sm text-danger p-0 px-1" @click="localData.links.splice(i,1)"><i class="bi bi-x"></i></button>
                </div>
                <div v-if="!localData.links.length" class="text-center small text-muted py-2">No hay enlaces configurados</div>
            </div>
        </div>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">3. INFORMACIÓN FINAL</label>
            <div class="bg-light p-3 rounded-3 border">
                <label class="small fw-bold">Texto de Copyright / Institución</label>
                <input type="text" class="form-control form-control-sm" v-model="localData.copyrightText">
            </div>
        </div>

        <div class="mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="section-title text-muted mb-0">4. REDES SOCIALES</label>
                <button class="btn btn-xs btn-outline-info p-1 px-2" @click="addSocial"><i class="bi bi-plus"></i></button>
            </div>
            <div class="bg-light p-2 rounded-3 border">
                <div v-for="(soc, i) in localData.socialLinks" :key="i" class="d-flex gap-1 mb-1">
                    <input type="text" class="form-control form-control-xs" v-model="soc.icon" placeholder="Ej: bi bi-twitter-x">
                    <input type="text" class="form-control form-control-xs" v-model="soc.url" placeholder="URL">
                    <button class="btn btn-sm text-danger p-0 px-1" @click="localData.socialLinks.splice(i,1)"><i class="bi bi-x"></i></button>
                </div>
                <div v-if="!localData.socialLinks.length" class="text-center small text-muted py-2">Sin redes sociales</div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.form-control-xs { font-size: 0.75rem; padding: 0.2rem 0.4rem; }
.btn-xs { padding: 0.1rem 0.3rem; font-size: 0.7rem; }
.form-control-color { height: 35px; padding: 2px; }
</style>