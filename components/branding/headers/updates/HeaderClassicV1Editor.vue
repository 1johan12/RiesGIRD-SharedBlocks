<template>
    <div class="header-classic-editor">
        <div class="editor-section mb-4">
            <h6 class="fw-bold mb-3 small text-uppercase text-primary">Navegación Principal</h6>
            <label class="form-label small fw-bold">Menú Dinámico</label>
            <select class="form-select form-select-sm mb-3" v-model="modelValue.menuId">
                <option :value="null">-- Seleccionar Menú --</option>
                <option v-for="menu in availableMenus" :key="menu.id" :value="menu.id">
                    {{ menu.name }}
                </option>
            </select>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="stickyHeader" v-model="modelValue.sticky">
                <label class="form-check-label small" for="stickyHeader">Cabecera Pegajosa (Sticky)</label>
            </div>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="transparentHeader" v-model="modelValue.isTransparent">
                <label class="form-check-label small" for="transparentHeader">Transparente al inicio</label>
            </div>
        </div>

        <hr>

        <div class="editor-section mb-4">
            <h6 class="fw-bold mb-3 small text-uppercase text-primary">Logotipo</h6>
            <label class="form-label small fw-bold">URL del Logo</label>
            <div class="input-group input-group-sm mb-3">
                <input type="text" class="form-control" v-model="modelValue.logoUrl">
                <button class="btn btn-outline-secondary" @click="$emit('select-image', 'logoUrl')">
                    <i class="las la-image"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label small fw-bold">Alto (Normal)</label>
                    <input type="number" class="form-control form-control-sm" v-model="modelValue.logoHeight">
                </div>
                <div class="col-6">
                    <label class="form-label small fw-bold">Alto (Scroll)</label>
                    <input type="number" class="form-control form-control-sm" v-model="modelValue.logoHeightScrolled">
                </div>
            </div>
        </div>

        <hr>

        <div class="editor-section mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold m-0 small text-uppercase text-primary">Barra Superior (Top Bar)</h6>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="modelValue.showTopBar">
                </div>
            </div>

            <div v-if="modelValue.showTopBar">
                <label class="form-label small fw-bold d-block">Redes Sociales</label>
                <div v-for="(social, index) in modelValue.socialLinks" :key="index" class="input-group input-group-sm mb-2">
                    <input type="text" class="form-control w-25" v-model="social.icon" placeholder="Icon (bi-facebook)">
                    <input type="text" class="form-control w-50" v-model="social.url" placeholder="URL">
                    <button class="btn btn-outline-danger" @click="removeItem('socialLinks', Number(index))">-</button>
                </div>
                <button class="btn btn-link btn-sm p-0 mb-3" @click="addItem('socialLinks', {icon: 'bi-link', url: ''})">+ Agregar Red</button>

                <label class="form-label small fw-bold d-block">Links Rápidos</label>
                <div v-for="(link, index) in modelValue.topLinks" :key="index" class="input-group input-group-sm mb-2">
                    <input type="text" class="form-control w-25" v-model="link.text" placeholder="Texto">
                    <input type="text" class="form-control w-50" v-model="link.url" placeholder="URL">
                    <button class="btn btn-outline-danger" @click="removeItem('topLinks', Number(index))">-</button>
                </div>
                <button class="btn btn-link btn-sm p-0 mb-3" @click="addItem('topLinks', {text: 'Link', url: ''})">+ Agregar Link</button>
            </div>
        </div>

        <hr>

        <div class="editor-section mb-4">
            <h6 class="fw-bold mb-3 small text-uppercase text-primary">Botón de Acción (CTA)</h6>
            <input type="text" class="form-control form-control-sm mb-2" v-model="modelValue.ctaText" placeholder="Texto del botón">
            <input type="text" class="form-control form-control-sm mb-2" v-model="modelValue.ctaUrl" placeholder="URL destino">
            <input type="text" class="form-control form-control-sm" v-model="modelValue.ctaIcon" placeholder="Icono (bi-box-arrow-right)">
        </div>

        <hr>

        <div class="editor-section mb-4">
            <h6 class="fw-bold mb-3 small text-uppercase text-primary">Colores</h6>
            
            <div v-if="modelValue.showTopBar" class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label small fw-bold">Top Bar Fondo</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.topBarBgColor">
                </div>
                <div class="col-6">
                    <label class="form-label small fw-bold">Top Bar Texto</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.topBarTextColor">
                </div>
            </div>

            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label small fw-bold">Nav Fondo</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.navBgColor">
                </div>
                <div class="col-6">
                    <label class="form-label small fw-bold">Nav Texto</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.navTextColor">
                </div>
            </div>

            <div class="row g-2 mb-3">
                <div class="col-6">
                    <label class="form-label small fw-bold">Hover / Botón</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.navHoverColor">
                </div>
                <div class="col-6" v-if="modelValue.isTransparent">
                    <label class="form-label small fw-bold">Texto Transparente</label>
                    <input type="color" class="form-control form-control-color w-100" v-model="modelValue.navTransparentTextColor">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HttpClient from '@/helpers/http-client';

const props = defineProps({
    modelValue: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue', 'select-image']);

const availableMenus = ref<any[]>([]);


const initStructure = () => {
    const defaults = {
        menuId: null,
        sticky: true,
        isTransparent: false,
        showTopBar: true,
        logoUrl: '',
        logoHeight: 60,
        logoHeightScrolled: 50,
        socialLinks: [],
        topLinks: [],
        ctaText: '',
        ctaUrl: '',
        ctaIcon: 'bi-arrow-right',
        topBarBgColor: '#003366',
        topBarTextColor: '#ffffff',
        navBgColor: '#ffffff',
        navTextColor: '#333333',
        navHoverColor: '#cc0033',
        navTransparentTextColor: '#ffffff'
    };
    
    
    Object.assign(props.modelValue, { ...defaults, ...props.modelValue });
};

const fetchMenus = async () => {
    try {
        const { data } = await HttpClient.get('menus');
        availableMenus.value = data.data || data;
    } catch (e) {
        console.error("Error cargando menús en el Header Editor", e);
    }
};

const addItem = (property: 'socialLinks' | 'topLinks', item: any) => {
    if (!props.modelValue[property]) props.modelValue[property] = [];
    props.modelValue[property].push(item);
};

const removeItem = (property: 'socialLinks' | 'topLinks', index: number) => {
    props.modelValue[property].splice(index, 1);
};

onMounted(() => {
    initStructure();
    fetchMenus();
});
</script>

<style scoped>
.header-classic-editor {
    padding: 5px;
}
.editor-section {
    padding: 2px 0;
}
.form-label {
    margin-bottom: 0.3rem;
}
.form-control-color {
    height: 30px;
    padding: 2px;
}
hr {
    margin: 1.5rem 0;
    opacity: 0.1;
}
/* Estilo para los inputs de iconos */
.input-group-sm .form-control {
    font-size: 0.75rem;
}
</style>