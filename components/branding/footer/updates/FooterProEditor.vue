<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

// --- ENCAPSULAMIENTO REACTIVO DE LOS NUEVOS TOKENS DEL FOOTER PRO ---
const localData = ref({
    logoUrl: props.modelValue?.logoUrl || '',
    logoHeight: props.modelValue?.logoHeight || 60,
    description: props.modelValue?.description || '',
    bgColor: props.modelValue?.bgColor || '#1e40af',
    textColor: props.modelValue?.textColor || '#e0f2fe',
    accentColor: props.modelValue?.accentColor || '#ffffff',
    bulletColor: props.modelValue?.bulletColor || '#93c5fd',
    bottomBgColor: props.modelValue?.bottomBgColor || '#173287',
    bottomTextColor: props.modelValue?.bottomTextColor || '#93c5fd',
    footerColumns: props.modelValue?.footerColumns?.length ? [...props.modelValue.footerColumns] : [],
    copyrightText: props.modelValue?.copyrightText || 'Riesgird - ACC | Todos los derechos reservados.'
});

// Sincronización profunda contra el almacén del orquestador del Page Builder
watch(localData, (newVal) => {
    emit('update:modelValue', { ...newVal });
}, { deep: true });

// Métodos de control estructural para la rejilla de navegación
const addColumn = () => {
    localData.value.footerColumns.push({ 
        title: 'Nueva Sección', 
        links: [] 
    });
};

const addLinkToCol = (colIndex: number) => {
    localData.value.footerColumns[colIndex].links.push({ 
        text: 'Nuevo Enlace', 
        url: '/' 
    });
};
</script>

<template>
    <div class="pro-editor bg-white rounded-4 border p-4 mt-3 shadow-sm h-100 overflow-auto">
        <h6 class="fw-bold mb-4 pb-2 border-bottom d-flex align-items-center">
            <i class="bi bi-pencil-square text-primary fs-4 me-2"></i> Configuración del Footer Pro
        </h6>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">1. IDENTIDAD VISUAL</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="row g-2 mb-3">
                    <div class="col-9">
                        <label class="small fw-bold">Logotipo de la Red</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control" v-model="localData.logoUrl" placeholder="Ruta de la imagen...">
                            <button class="btn btn-primary" type="button" @click="emit('select-image', 'logoUrl')">
                                <i class="bi bi-image"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-3">
                        <label class="small fw-bold">Alto (px)</label>
                        <input type="number" class="form-control form-control-sm text-center fw-bold" v-model="localData.logoHeight">
                    </div>
                </div>
                <div class="mb-0">
                    <label class="small fw-bold">Reseña o Descripción Corta</label>
                    <textarea class="form-control form-control-sm long-text-box" rows="3" v-model="localData.description"></textarea>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">2. PALETA DE COLORES CORPORATIVOS</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="row g-2 mb-2">
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Fondo Cuerpo</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bgColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Texto Links</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.textColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Títulos (Acento)</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.accentColor">
                    </div>
                </div>
                <div class="row g-2 border-top pt-2 mt-1">
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Puntos Viñeta</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bulletColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Fondo Base</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bottomBgColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="x-small d-block fw-semibold mb-1">Texto Base</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bottomTextColor">
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="section-title text-muted mb-0">3. ENLACES MULTICOLUMNA (REJILLA)</label>
                <button type="button" class="btn btn-xs btn-outline-primary p-1 px-2" @click="addColumn" title="Añadir Columna">
                    <i class="bi bi-plus-lg"></i> Columna
                </button>
            </div>
            
            <div v-for="(col, i) in localData.footerColumns" :key="i" class="card p-3 mb-3 border-dashed position-relative">
                
                <button type="button" class="btn-close-custom position-absolute top-0 end-0 m-2" @click="localData.footerColumns.splice(i, 1)" title="Eliminar Columna">
                    <i class="bi bi-trash-fill text-danger"></i>
                </button>

                <div class="mb-3 mt-1 row g-2">
                    <div class="col-12">
                        <label class="x-small fw-bold text-muted mb-1">Título de la Columna</label>
                        <input type="text" class="form-control form-control-sm fw-bold bg-white" v-model="col.title" placeholder="Ej: Líneas de acción">
                    </div>
                </div>

                <div class="links-sub-group-wrapper">
                    <label class="x-small fw-bold text-muted mb-1 d-block" v-if="col.links?.length > 0">Enlaces Internos</label>
                    <div v-for="(link, li) in col.links" :key="li" class="d-flex gap-1 align-items-center mb-15">
                        <input type="text" class="form-control form-control-xs font-semibold" v-model="link.text" placeholder="Texto (ej: RED)">
                        <input type="text" class="form-control form-control-xs font-mono" v-model="link.url" placeholder="Ruta (ej: /noticias)">
                        <button type="button" class="btn btn-sm p-0 px-1 border-0" @click="col.links.splice(li, 1)" title="Remover Enlace">
                            <i class="bi bi-x-circle-fill text-muted fs-6"></i>
                        </button>
                    </div>
                </div>

                <button type="button" class="btn btn-sm btn-light mt-2 w-100 py-1 border shadow-sm small-action-btn" @click="addLinkToCol(i)">
                    + Añadir Ítem a "{{ col.title || '...' }}"
                </button>
            </div>
            
            <div v-if="!localData.footerColumns.length" class="text-center small text-muted py-3 border rounded-3 bg-light">
                No hay columnas de navegación creadas. Presiona "+ Columna" arriba.
            </div>
        </div>

        <div class="mb-2">
            <label class="section-title text-muted mb-2 d-block">4. FINAL DE PÁGINA</label>
            <div class="bg-light p-3 rounded-3 border">
                <label class="small fw-bold mb-1">Texto de Créditos / Propietario</label>
                <input type="text" class="form-control form-control-sm fw-semibold" v-model="localData.copyrightText" placeholder="Ej: Riesgird - ACC | Todos los derechos reservados.">
                <span class="x-small text-muted mt-1 d-block">El año y el símbolo de Copyright © se autogeneran dinámicamente en el servidor.</span>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* ── ESTILIZACIÓN DE ALTA FIDELIDAD SEGÚN TU LAYOUT NATIVO ── */
.section-title { 
    font-size: 0.65rem; 
    font-weight: 800; 
    letter-spacing: 1.2px; 
    text-transform: uppercase; 
}
.x-small { 
    font-size: 0.68rem; 
}
.small-text { 
    font-size: 0.76rem; 
}
.form-control-xs { 
    font-size: 0.75rem; 
    padding: 0.25rem 0.5rem; 
}
.font-semibold {
    font-weight: 600;
}
.font-mono {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
}
.border-dashed { 
    border: 1px dashed #cbd5e1 !important; 
    background: #f8fafc; 
}
.btn-xs { 
    padding: 0.15rem 0.4rem; 
    font-size: 0.7rem; 
    font-weight: 700;
}
.form-control-color { 
    height: 34px; 
    padding: 2px; 
    cursor: pointer;
    border-radius: 6px;
}
.long-text-box {
    font-size: 0.82rem;
    line-height: 1.4;
}
.mb-15 {
    margin-bottom: 6px;
}
.small-action-btn {
    font-size: 0.72rem;
    font-weight: 700;
    color: #475569;
}
.btn-close-custom {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 2px 6px;
    opacity: 0.6;
    transition: opacity 0.15s;
}
.btn-close-custom:hover {
    opacity: 1;
}
.pro-editor {
    box-sizing: border-box;
}
/* Scrollbar personalizado y sutil para la barra lateral de 320px */
.overflow-auto::-webkit-scrollbar {
    width: 5px;
}
.overflow-auto::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>