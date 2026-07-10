<template>
    <b-modal 
        v-model="isVisible" 
        size="xl" 
        hide-footer 
        hide-header 
        centered 
        body-class="p-0" 
        content-class="sys-spec-modal"
        no-fade
    >
        <div class="spec-sheet-container" v-if="isVisible">
            
            <header class="sheet-header animate-drop">
                <div class="header-content">
                    <div class="meta-line">
                        <span class="sys-id">RES: {{ course.slug || 'SYS-001' }}</span>
                        <span class="divider">/</span>
                        <span class="category-text">{{ course.category ? course.category.name : 'GENERAL' }}</span>
                    </div>
                    <h1 class="course-title">{{ course.title }}</h1>
                </div>
                
                <button class="btn-close-tech" @click="isVisible = false">
                    <i class="las la-times"></i>
                </button>
                
                <div class="accent-line-anim"></div>
            </header>

            <div class="sheet-body">
                
                <aside class="visual-col">
                    <div class="image-wrapper animate-reveal">
                        <div class="tech-frame"></div>
                        
                        <img 
                            :src="formatImageUrl(course.image_path)" 
                            v-if="course.image_path" 
                            class="spec-image" 
                            alt="Vista del Sistema"
                        >
                        <div v-else class="no-image">
                            <i class="las la-cube"></i>
                            <p>VISUALIZACIÓN NO DISPONIBLE</p>
                        </div>
                    </div>
                </aside>

                <main class="data-col scroll-tech">
                    
                    <div class="stagger-container">
                        <section class="data-block">
                            <div class="block-label">
                                <i class="las la-align-justify text-accent"></i> Descripción Técnica
                            </div>
                            <div class="block-body">
                                <p class="description-text">
                                    {{ course.description || 'Datos técnicos no especificados en el manifiesto.' }}
                                </p>
                            </div>
                        </section>

                        <section class="data-block" v-if="course.content_blocks?.ventajas">
                            <div class="block-label text-primary">
                                <i class="las la-check-square"></i> Ventajas
                            </div>
                            <div class="block-body bg-light-gray">
                                <p>{{ course.content_blocks.ventajas }}</p>
                            </div>
                        </section>

                        <section class="data-block" v-if="course.content_blocks?.aplicacion">
                            <div class="block-label text-primary">
                                <i class="las la-project-diagram"></i> Aparición en clases
                            </div>
                            <div class="block-body bg-light-blue">
                                <p>{{ course.content_blocks.aplicacion }}</p>
                            </div>
                        </section>

                        <section class="data-block" v-if="course.content_blocks?.laboratorios">
                            <div class="block-label text-accent">
                                <i class="las la-building"></i> Laboratorios con el software
                            </div>
                            <div class="block-body border-accent-left">
                                <p class="fw-bold text-dark mb-0">{{ course.content_blocks.laboratorios }}</p>
                            </div>
                        </section>

                        <div class="download-block mt-5 pt-2">
                            <div v-if="course.video_url">
                                <div v-if="isUrl(course.video_url)">
                                    <a :href="course.video_url" target="_blank" class="btn-tech-construct">
                                        <span class="layer-bg"></span>
                                        <span class="icon-part"><i class="las la-download"></i></span>
                                        <span class="text-part">
                                            <span class="small-tag">RECURSO EXTERNO</span>
                                            <span class="main-tag">DESCARGAR RECURSO</span>
                                        </span>
                                        <span class="arrow-part"><i class="las la-chevron-right"></i></span>
                                    </a>
                                </div>
                                <div v-else class="info-note">
                                    <strong class="text-accent">Link de Descarga:</strong> {{ course.video_url }}
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
            
            <footer class="sheet-footer">
                <span class="footer-anim">ESAN ENGINEERING SYSTEMS 
            </footer>

        </div>
    </b-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from "@/helpers/url";

const props = defineProps<{
    modelValue: boolean;
    course: any;
}>();

const emit = defineEmits(['update:modelValue']);

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const isUrl = (string: string) => {
    try { return Boolean(new URL(string)); } catch (e) { return false; }
};
</script>

<style scoped lang="scss">
/* --- PALETA CORPORATIVA --- */
$c-blue: #144c74;
$c-gray: #746c6c;
$c-red: #e31140;
$c-white: #ffffff;
$c-bg-light: #f4f6f8;

/* --- RESET MODAL --- */
:deep(.sys-spec-modal) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* --- CONTENEDOR MAESTRO --- */
.spec-sheet-container {
    background: $c-white;
    width: 100%;
    height: 85vh; max-height: 900px;
    display: flex; flex-direction: column;
    box-shadow: 0 30px 60px rgba(0,0,0,0.4);
    overflow: hidden;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    border: 1px solid #ddd;
    
    /* Animación: Expansión desde el centro (Pop up técnico) */
    animation: frameExpand 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    transform-origin: center;
}

@keyframes frameExpand {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

/* --- HEADER --- */
.sheet-header {
    background: $c-blue;
    color: white;
    padding: 25px 30px;
    position: relative;
    display: flex; justify-content: space-between; align-items: flex-start;
    z-index: 10;
}
/* Animación Header: Caída */
.animate-drop {
    transform: translateY(-100%);
    animation: slideDown 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) 0.2s forwards;
}
@keyframes slideDown { to { transform: translateY(0); } }

.meta-line { font-size: 0.75rem; letter-spacing: 2px; opacity: 0.7; text-transform: uppercase; margin-bottom: 5px; }
.course-title { font-size: 2.2rem; font-weight: 800; line-height: 1; margin: 0; }
.btn-close-tech {
    background: rgba(255,255,255,0.1); border: none; color: white;
    width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; transition: 0.2s; cursor: pointer;
    &:hover { background: $c-red; transform: rotate(90deg); }
}

/* Animación Línea Roja: Dibujado */
.accent-line-anim {
    position: absolute; bottom: 0; left: 0; height: 4px; background: $c-red;
    width: 0%;
    animation: drawLine 0.8s ease-out 0.6s forwards;
}
@keyframes drawLine { to { width: 100%; } }

/* --- BODY --- */
.sheet-body {
    display: flex; flex: 1; overflow: hidden;
    @media (max-width: 991px) { flex-direction: column; overflow-y: auto; }
}

/* --- VISUAL COL (Left) --- */
.visual-col {
    width: 40%;
    background: $c-bg-light;
    padding: 30px;
    display: flex; align-items: center; justify-content: center;
    border-right: 1px solid #e0e0e0;
    @media (max-width: 991px) { width: 100%; height: 300px; border-right: none; border-bottom: 1px solid #ddd; }
}

.image-wrapper {
    width: 100%; position: relative; padding: 10px;
    /* Animación Imagen: Aparición gradual */
    opacity: 0; transform: translateX(-30px);
    animation: slideInFade 0.6s ease-out 0.5s forwards;
    
    .tech-frame {
        position: absolute; inset: 0; border: 1px dashed $c-gray; opacity: 0.3; pointer-events: none;
    }
    .spec-image { 
        width: 100%; height: auto; display: block; 
        box-shadow: 10px 10px 30px rgba(0,0,0,0.1); 
    }
    .no-image {
        height: 250px; background: #e9ecef; color: $c-gray;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        i { font-size: 3rem; margin-bottom: 15px; }
    }
}
@keyframes slideInFade { to { opacity: 1; transform: translateX(0); } }

/* --- DATA COL (Right) --- */
.data-col {
    width: 60%;
    padding: 40px;
    background: white;
    overflow-y: auto;
    @media (max-width: 991px) { width: 100%; padding: 25px; }
}
/* Scrollbar */
.scroll-tech::-webkit-scrollbar { width: 6px; }
.scroll-tech::-webkit-scrollbar-track { background: #f0f0f0; }
.scroll-tech::-webkit-scrollbar-thumb { background: $c-blue; }

/* ANIMACIÓN DE BLOQUES EN CASCADA (Ensamblaje) */
.stagger-container > * {
    opacity: 0; transform: translateX(50px); /* Empiezan a la derecha */
    animation: assembleBlock 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
/* Delays para efecto cascada */
.stagger-container > *:nth-child(1) { animation-delay: 0.6s; }
.stagger-container > *:nth-child(2) { animation-delay: 0.7s; }
.stagger-container > *:nth-child(3) { animation-delay: 0.8s; }
.stagger-container > *:nth-child(4) { animation-delay: 0.9s; }
.stagger-container > *:nth-child(5) { animation-delay: 1.0s; }

@keyframes assembleBlock {
    to { opacity: 1; transform: translateX(0); }
}

/* Estilos de Bloques */
.data-block { margin-bottom: 25px; }

.block-label {
    font-size: 0.9rem; text-transform: uppercase; font-weight: 700; color: $c-gray;
    margin-bottom: 8px; display: flex; align-items: center; gap: 8px; letter-spacing: 0.5px;
    i { font-size: 1.2rem; }
}

.block-body {
    padding: 15px; font-size: 1rem; color: #444; line-height: 1.6;
    border-left: 2px solid #eee; transition: 0.3s;
    
    &.bg-light-gray { background: #f9f9f9; border-left-color: $c-gray; }
    &.bg-light-blue { background: rgba($c-blue, 0.04); border-left-color: $c-blue; }
    &.border-accent-left { border-left: 4px solid $c-red; background: white; padding-left: 20px; }
    
    &:hover { transform: translateX(5px); }
}

/* --- BOTÓN DE DESCARGA (Estilo Construcción) --- */
.btn-tech-construct {
    position: relative; display: flex; text-decoration: none;
    height: 60px; overflow: hidden; background: white; border: 1px solid $c-blue;
    transition: 0.3s;
    
    .layer-bg {
        position: absolute; top: 0; left: 0; width: 0%; height: 100%;
        background: $c-blue; z-index: 0; transition: width 0.4s ease-in-out;
    }
    
    &:hover {
        border-color: $c-blue;
        .layer-bg { width: 100%; }
        .icon-part, .text-part, .arrow-part { color: white; }
    }

    /* Partes del botón */
    .icon-part, .text-part, .arrow-part { position: relative; z-index: 1; transition: 0.3s; }
    
    .icon-part {
        width: 60px; display: flex; align-items: center; justify-content: center;
        background: #f0f0f0; color: $c-blue; font-size: 1.5rem;
    }
    &:hover .icon-part { background: transparent; }

    .text-part {
        flex-grow: 1; padding: 0 20px; display: flex; flex-direction: column; justify-content: center;
        color: $c-blue;
        .small-tag { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
        .main-tag { font-size: 1.1rem; font-weight: 800; letter-spacing: 0.5px; }
    }
    
    .arrow-part {
        width: 50px; display: flex; align-items: center; justify-content: center;
        color: $c-gray; font-size: 1.2rem;
    }
}

.info-note { 
    border: 1px dashed $c-red; padding: 15px; color: $c-gray; font-size: 0.95rem; 
    background: rgba($c-red, 0.02);
}

/* --- FOOTER --- */
.sheet-footer {
    padding: 10px 30px; background: #fafafa; border-top: 1px solid #eaeaea;
    text-align: right; font-size: 0.7rem; color: $c-gray; letter-spacing: 1px;
    
    .footer-anim { opacity: 0; animation: fadeIn 1s 1.2s forwards; }
}
@keyframes fadeIn { to { opacity: 1; } }

/* Utilidades */
.text-primary { color: $c-blue !important; }
.text-accent { color: $c-red !important; }
.text-dark { color: #222 !important; }
</style>