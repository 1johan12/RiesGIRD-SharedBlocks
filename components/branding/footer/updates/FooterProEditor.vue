<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue', 'select-image']);

const localData = ref({
    logoUrl: props.modelValue?.logoUrl || '',
    logoHeight: props.modelValue?.logoHeight || 60,
    description: props.modelValue?.description || 'Excelencia académica para el desarrollo profesional.',
    bgColor: props.modelValue?.bgColor || '#1a1a1a',
    textColor: props.modelValue?.textColor || '#ffffff',
    accentColor: props.modelValue?.accentColor || '#cc0033',
    address: props.modelValue?.address || 'Av. Principal 123, Campus Universitario',
    phone: props.modelValue?.phone || '+51 1 123-4567',
    email: props.modelValue?.email || 'contacto@universidad.edu.pe',
    socialLinks: props.modelValue?.socialLinks?.length ? [...props.modelValue.socialLinks] : [],
    footerColumns: props.modelValue?.footerColumns?.length ? [...props.modelValue.footerColumns] : [],
    copyrightText: props.modelValue?.copyrightText || `© ${new Date().getFullYear()} Universidad.`
});

watch(localData, (newVal) => emit('update:modelValue', { ...newVal }), { deep: true });


const addColumn = () => localData.value.footerColumns.push({ title: 'Nueva Sección', links: [] });
const addLinkToCol = (colIndex: number) => localData.value.footerColumns[colIndex].links.push({ text: 'Nuevo Enlace', url: '#' });
const addSocial = () => localData.value.socialLinks.push({ icon: 'bi bi-link-45deg', url: '#' });
</script>

<template>
    <div class="pro-editor bg-white rounded-4 border p-4 mt-3 shadow-sm h-100 overflow-auto">
        <h6 class="fw-bold mb-4 pb-2 border-bottom d-flex align-items-center">
            <i class="bi bi-pencil-square text-primary fs-4 me-2"></i> Configuración del Footer
        </h6>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">1. IDENTIDAD VISUAL</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="row g-2 mb-3">
                    <div class="col-9">
                        <label class="small fw-bold">Logo URL</label>
                        <div class="input-group input-group-sm">
                            <input type="text" class="form-control" v-model="localData.logoUrl">
                            <button class="btn btn-primary" @click="emit('select-image', 'logoUrl')"><i class="bi bi-image"></i></button>
                        </div>
                    </div>
                    <div class="col-3">
                        <label class="small fw-bold">Alto (px)</label>
                        <input type="number" class="form-control form-control-sm" v-model="localData.logoHeight">
                    </div>
                </div>
                <div class="mb-0">
                    <label class="small fw-bold">Descripción Institucional</label>
                    <textarea class="form-control form-control-sm" rows="2" v-model="localData.description"></textarea>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">2. COLORES DE MARCA</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="row g-2">
                    <div class="col-4 text-center">
                        <label class="small d-block">Fondo</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.bgColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="small d-block">Texto</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.textColor">
                    </div>
                    <div class="col-4 text-center">
                        <label class="small d-block">Acento</label>
                        <input type="color" class="form-control form-control-color w-100" v-model="localData.accentColor">
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <label class="section-title text-muted mb-2 d-block">3. INFORMACIÓN DE CONTACTO</label>
            <div class="bg-light p-3 rounded-3 border">
                <div class="mb-2">
                    <label class="small fw-bold">Dirección Física</label>
                    <input type="text" class="form-control form-control-sm" v-model="localData.address">
                </div>
                <div class="row g-2">
                    <div class="col-6">
                        <label class="small fw-bold">Teléfono</label>
                        <input type="text" class="form-control form-control-sm" v-model="localData.phone">
                    </div>
                    <div class="col-6">
                        <label class="small fw-bold">Email</label>
                        <input type="email" class="form-control form-control-sm" v-model="localData.email">
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="section-title text-muted mb-0">4. REDES SOCIALES</label>
                <button class="btn btn-xs btn-outline-info p-1 px-2" @click="addSocial"><i class="bi bi-plus"></i></button>
            </div>
            <div class="bg-light p-2 rounded-3 border">
                <div v-for="(soc, i) in localData.socialLinks" :key="i" class="d-flex gap-1 mb-1">
                    <input type="text" class="form-control form-control-xs" v-model="soc.icon" placeholder="Clase Icono (bi bi-...)">
                    <input type="text" class="form-control form-control-xs" v-model="soc.url" placeholder="URL">
                    <button class="btn btn-sm text-danger p-0 px-1" @click="localData.socialLinks.splice(i,1)"><i class="bi bi-x"></i></button>
                </div>
                <div v-if="!localData.socialLinks.length" class="text-center small text-muted py-2">No hay redes sociales configuradas</div>
            </div>
        </div>

        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="section-title text-muted mb-0">5. COLUMNAS DE NAVEGACIÓN</label>
                <button class="btn btn-xs btn-outline-primary p-1 px-2" @click="addColumn"><i class="bi bi-plus"></i></button>
            </div>
            <div v-for="(col, i) in localData.footerColumns" :key="i" class="card p-2 mb-3 border-dashed">
                <div class="d-flex gap-2 mb-2">
                    <input type="text" class="form-control form-control-sm fw-bold bg-white" v-model="col.title" placeholder="Título Columna">
                    <button class="btn btn-sm text-danger" @click="localData.footerColumns.splice(i,1)"><i class="bi bi-trash"></i></button>
                </div>
                <div v-for="(link, li) in col.links" :key="li" class="d-flex gap-1 mb-1 ms-3">
                    <input type="text" class="form-control form-control-xs" v-model="link.text" placeholder="Texto">
                    <input type="text" class="form-control form-control-xs" v-model="link.url" placeholder="URL">
                    <button class="btn btn-sm p-0 px-1" @click="col.links.splice(li,1)"><i class="bi bi-x-circle"></i></button>
                </div>
                <button class="btn btn-sm btn-light mt-2 w-100 py-1 border shadow-sm" style="font-size: 0.7rem" @click="addLinkToCol(i)">
                    + Añadir Enlace a "{{ col.title || '...' }}"
                </button>
            </div>
        </div>

        <div class="mb-2">
            <label class="section-title text-muted mb-2 d-block">6. FINAL DE PÁGINA</label>
            <div class="bg-light p-3 rounded-3 border">
                <label class="small fw-bold">Texto de Copyright</label>
                <input type="text" class="form-control form-control-sm" v-model="localData.copyrightText">
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-title { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
.form-control-xs { font-size: 0.75rem; padding: 0.2rem 0.4rem; }
.border-dashed { border: 1px dashed #dee2e6 !important; background: #fdfdfd; }
.btn-xs { padding: 0.1rem 0.3rem; font-size: 0.7rem; }
.form-control-color { height: 35px; padding: 2px; }
</style>