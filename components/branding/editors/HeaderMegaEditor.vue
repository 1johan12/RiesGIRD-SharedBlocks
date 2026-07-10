<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);


const localData = ref({
    logoUrl: props.modelValue?.logoUrl || '',
    logoHeight: props.modelValue?.logoHeight || 65,
    logoHeightScrolled: props.modelValue?.logoHeightScrolled || 45,
    sticky: props.modelValue?.sticky ?? true,
    isTransparent: props.modelValue?.isTransparent ?? true,
    
    showTopBar: props.modelValue?.showTopBar ?? true,
    topBarBgColor: props.modelValue?.topBarBgColor || '#cc0033',
    topBarTextColor: props.modelValue?.topBarTextColor || '#ffffff',
    
    
    navBgColor: props.modelValue?.navBgColor || '#ffffff', 
    navTextColor: props.modelValue?.navTextColor || '#333333',
    navTransparentTextColor: props.modelValue?.navTransparentTextColor || '#ffffff',
    navHoverColor: props.modelValue?.navHoverColor || '#cc0033',

    socialLinks: props.modelValue?.socialLinks?.length ? [...props.modelValue.socialLinks] : [
        { icon: 'bi bi-facebook', url: '#' },
        { icon: 'bi bi-twitter-x', url: '#' },
        { icon: 'bi bi-instagram', url: '#' },
        { icon: 'bi bi-linkedin', url: '#' }
    ],
    topLinks: props.modelValue?.topLinks?.length ? [...props.modelValue.topLinks] : [
        { text: 'Acerca de ESAN', url: '#', hasChild: true },
        { text: 'Biblioteca', url: '#', hasChild: false }
    ],
    ctaText: props.modelValue?.ctaText || 'PORTAL ACADÉMICO',
    ctaUrl: props.modelValue?.ctaUrl || '#',
    ctaIcon: props.modelValue?.ctaIcon || 'bi bi-arrow-right-circle'
});

watch(localData, (newVal) => emit('update:modelValue', { ...newVal }), { deep: true });

watch(() => props.modelValue, (newVal) => {
    if (newVal && JSON.stringify(localData.value) !== JSON.stringify(newVal)) {
        localData.value = { ...localData.value, ...newVal };
    }
}, { deep: true });

const triggerImageSelection = () => emit('select-image', 'logoUrl');


const activeSocialIconIndex = ref<number | null>(null);


const suggestedSocialIcons = [
    'bi bi-facebook', 'bi bi-twitter-x', 'bi bi-instagram', 'bi bi-youtube', 
    'bi bi-linkedin', 'bi bi-tiktok', 'bi bi-whatsapp', 'bi bi-telegram',
    'bi bi-envelope', 'bi bi-telephone', 'bi bi-globe', 'bi bi-database',
    'bi bi-link-45deg', 'bi bi-geo-alt', 'bi bi-mortarboard', 'bi bi-briefcase'
];

const addSocialLink = () => localData.value.socialLinks.push({ icon: 'bi bi-link-45deg', url: '#' });
const removeSocialLink = (i: number) => localData.value.socialLinks.splice(i, 1);
const selectSocialIcon = (iconClass: string) => {
    if (activeSocialIconIndex.value !== null) {
        localData.value.socialLinks[activeSocialIconIndex.value].icon = iconClass;
        activeSocialIconIndex.value = null; 
    }
};

const addTopLink = () => localData.value.topLinks.push({ text: 'Nuevo Enlace', url: '#', hasChild: false });
const removeTopLink = (i: number) => localData.value.topLinks.splice(i, 1);
</script>

<template>
    <div class="pro-editor bg-white rounded-4 border p-4 mt-3 shadow-sm h-100 flex-column d-flex">
        <h6 class="fw-bold text-dark mb-4 pb-3 border-bottom d-flex align-items-center tracking-tight">
            <i class="bi bi-gear-fill text-primary fs-4 me-2"></i> Ajustes de Cabecera Premium
        </h6>

        <div class="flex-grow-1 overflow-auto pe-2 pb-4">
            
            <div class="mb-4">
                <label class="section-title text-uppercase small text-muted mb-3 d-block">1. Logo Principal</label>
                <div class="bg-light p-3 rounded-3 border">
                    <div class="mb-3">
                        <label class="small text-muted mb-1 fw-bold">Imagen del Logo</label>
                        <div class="input-group">
                            <input type="text" class="form-control" v-model="localData.logoUrl" placeholder="URL o subir imagen...">
                            <button class="btn btn-primary" type="button" @click="triggerImageSelection">
                                <i class="bi bi-image"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="row g-3 pt-2 border-top">
                        <div class="col-6">
                            <label class="small text-muted d-block mb-0 fw-bold">Altura Normal:</label>
                            <input type="range" class="form-range" min="30" max="100" step="5" v-model="localData.logoHeight">
                            <span class="badge bg-secondary rounded-pill small">{{ localData.logoHeight }}px</span>
                        </div>
                        <div class="col-6">
                            <label class="small text-muted d-block mb-0 fw-bold">Altura Reducida (Scroll):</label>
                            <input type="range" class="form-range" min="20" max="80" step="5" v-model="localData.logoHeightScrolled">
                            <span class="badge bg-secondary rounded-pill small">{{ localData.logoHeightScrolled }}px</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label class="section-title text-uppercase small text-muted mb-3 d-block">2. Colores del Menú (Navbar)</label>
                <div class="bg-light p-3 rounded-3 border">
                    <div class="row g-2">
                        <div class="col-6">
                            <label class="small text-muted mb-1 fw-bold">Fondo General</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navBgColor">
                        </div>
                        <div class="col-6">
                            <label class="small text-muted mb-1 fw-bold">Color Texto (Hover)</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navHoverColor">
                        </div>
                        <div class="col-6">
                            <label class="small text-muted mb-1 fw-bold">Texto (Normal)</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navTextColor">
                        </div>
                        <div class="col-6">
                            <label class="small text-muted mb-1 fw-bold">Texto (Transparente)</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.navTransparentTextColor" title="Color del texto cuando el menú está sobre la imagen de portada">
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-1">
                    <label class="section-title text-uppercase small text-muted mb-0 d-block">3. Cinta Superior (Top Bar)</label>
                    <div class="form-check form-switch form-switch-md m-0">
                        <input class="form-check-input" type="checkbox" v-model="localData.showTopBar" id="h-top">
                    </div>
                </div>

                <div v-if="localData.showTopBar" class="bg-light p-3 rounded-3 border">
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <label class="small text-muted mb-1">Fondo TopBar</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.topBarBgColor">
                        </div>
                        <div class="col-6">
                            <label class="small text-muted mb-1">Texto TopBar</label>
                            <input type="color" class="form-control form-control-color w-100 p-1" v-model="localData.topBarTextColor">
                        </div>
                    </div>

                    <hr class="text-muted opacity-25 mb-3">

                    <label class="small text-muted mb-2 d-block fw-bold">Botón de Acción (CTA)</label>
                    <div class="d-flex gap-2 mb-3">
                        <input type="text" class="form-control form-control-sm w-50" v-model="localData.ctaText" placeholder="Texto (ej: PORTAL)">
                        <input type="text" class="form-control form-control-sm w-50" v-model="localData.ctaUrl" placeholder="URL (#)">
                    </div>

                    <hr class="text-muted opacity-25 mb-3">

                    <label class="small text-muted mb-2 d-block fw-bold">Redes Sociales</label>
                    <div v-for="(link, i) in localData.socialLinks" :key="i" class="card p-2 mb-2 border rounded shadow-sm bg-white position-relative">
                        <button class="btn btn-sm text-danger position-absolute top-0 end-0 m-1 p-0" @click="removeSocialLink(i)">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="d-flex gap-2">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-white border"><i :class="link.icon" class="fs-6"></i></span>
                                <input type="text" class="form-control bg-light" v-model="link.icon">
                                <button class="btn btn-light border" type="button" @click="activeSocialIconIndex = activeSocialIconIndex === i ? null : i">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                            <input type="text" class="form-control form-control-sm w-50" v-model="link.url" placeholder="URL">
                        </div>
                        
                        <div v-if="activeSocialIconIndex === i" class="bg-light p-2 border rounded mt-2">
                            <div class="d-flex flex-wrap gap-1 justify-content-center">
                                <button v-for="icon in suggestedSocialIcons" :key="icon" @click="selectSocialIcon(icon)" class="btn btn-light border p-0 rounded" style="width: 32px; height: 32px;">
                                    <i :class="icon" class="fs-6 text-dark"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary dashed-btn w-100 mb-3" @click="addSocialLink">+ Red Social</button>

                    <hr class="text-muted opacity-25 mb-3">

                    <label class="small text-muted mb-2 d-block fw-bold">Enlaces Secundarios</label>
                    <div v-for="(link, i) in localData.topLinks" :key="i" class="d-flex gap-2 mb-2 align-items-center p-2 bg-white rounded border">
                        <input type="text" class="form-control form-control-sm" v-model="link.text" placeholder="Texto">
                        <input type="text" class="form-control form-control-sm" v-model="link.url" placeholder="URL">
                        <div class="form-check form-switch m-0 pt-1" title="Tiene submenú">
                            <input class="form-check-input" type="checkbox" v-model="link.hasChild" style="width: 1.5em; height: 0.75em;">
                        </div>
                        <button class="btn btn-sm btn-outline-danger p-1" @click="removeTopLink(i)"><i class="bi bi-trash"></i></button>
                    </div>
                    <button class="btn btn-sm btn-outline-primary dashed-btn w-100" @click="addTopLink">+ Enlace Secundario</button>
                </div>
            </div>

            <div>
                <label class="section-title text-uppercase small text-muted mb-3 d-block fw-bold">4. Comportamiento</label>
                <div class="bg-light p-3 rounded-3 border">
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" type="checkbox" v-model="localData.isTransparent" id="h-trans">
                        <label class="form-check-label small fw-bold" for="h-trans">Fondo Inicial Transparente (Overlay)</label>
                    </div>
                    <div class="form-check form-switch mb-0">
                        <input class="form-check-input" type="checkbox" v-model="localData.sticky" id="h-stick">
                        <label class="form-check-label small fw-bold" for="h-stick">Seguir al Scroll (Fixed)</label>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Tipografía e UI */
.pro-editor {
    font-family: 'Arial', sans-serif;
}
.tracking-tight { letter-spacing: -0.5px; }

.section-title { 
    font-size: 0.75rem; 
    font-weight: 800; 
    letter-spacing: 1px; 
}
.dashed-btn {
    border-style: dashed;
}
.form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
}

/* Scrollbar personalizado para el editor */
.flex-grow-1::-webkit-scrollbar { width: 6px; }
.flex-grow-1::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
</style>