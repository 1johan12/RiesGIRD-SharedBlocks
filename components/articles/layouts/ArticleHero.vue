<template>
    <article class="w-100 bg-white">
        <div class="position-relative text-white d-flex align-items-end mb-5" style="min-height: 450px;">
            <div class="position-absolute w-100 h-100 top-0 start-0" 
                 :style="{ 
                     backgroundImage: data.featured_image_path ? `url(${formatImageUrl(data.featured_image_path)})` : 'none', 
                     backgroundSize: 'cover', 
                     backgroundPosition: 'center',
                     backgroundColor: '#2d3748'
                 }">
                <div class="position-absolute w-100 h-100 top-0 start-0 bg-dark" style="opacity: 0.7;"></div>
            </div>

            <div class="container position-relative z-1 pb-5">
                <div class="row justify-content-center text-center text-md-start">
                    <div class="col-lg-8 mx-auto mx-md-0">
                        <span v-if="data.category_name" class="badge bg-danger mb-3 px-3 py-2 text-uppercase fw-bold tracking-wide">
                            {{ data.category_name }}
                        </span>
                        
                        <h1 class="fw-bold display-4 text-white mb-3" style="line-height: 1.2; word-break: break-word;">
                            {{ data.title || 'Título de la Noticia' }}
                        </h1>
                        
                        <p v-if="data.excerpt" class="lead text-light mb-4 opacity-75">
                            {{ data.excerpt }}
                        </p>
                        
                        <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mt-4">
                            <img v-if="authorAvatar" 
                                 :src="formatImageUrl(authorAvatar)" 
                                 class="rounded-circle border border-2 border-white shadow-sm" 
                                 width="48" height="48" 
                                 style="object-fit: cover;" alt="Autor">
                            <div class="text-start">
                                <span class="fw-bold d-block fs-6">{{ authorName || 'Redacción' }}</span>
                                <span class="text-light opacity-75 small">
                                    {{ formatDate(data.start_date) || 'Fecha de publicación' }} 
                                    <span v-if="readTime" class="ms-2 border-start ps-2 border-secondary">
                                        <i class="las la-clock me-1"></i>{{ readTime }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container pb-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    
                    <div v-if="htmlContent" class="article-content" v-html="htmlContent"></div>
                    
                    <div v-else class="text-muted fst-italic py-5 text-center border border-dashed rounded bg-light">
                        El contenido de la noticia aparecerá aquí...
                    </div>

                    <div v-if="tags && tags.length" class="mt-5 pt-4 border-top">
                        <h6 class="text-muted fw-bold mb-3 text-uppercase small tracking-wide">
                            Temas relacionados
                        </h6>
                        <div class="d-flex flex-wrap gap-2">
                            <span v-for="tag in tags" :key="tag" 
                                  class="badge bg-light text-secondary border px-3 py-2 fw-normal">
                                #{{ tag }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

const props = defineProps({
    data: { type: Object, required: true }
});

const bodyData = computed(() => {
    let parsed = props.data.body || props.data.content_blocks;
    if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch (e) { parsed = {}; }
    }
    return parsed || {};
});

const htmlContent = computed(() => bodyData.value.html || '');
const authorName = computed(() => bodyData.value.author?.name || '');
const authorAvatar = computed(() => bodyData.value.author?.avatar || '');
const readTime = computed(() => bodyData.value.extra?.read_time || '');
const tags = computed(() => bodyData.value.extra?.tags || []);

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};
</script>

<style scoped>
/* Utilidad visual temporal si está vacío */
.border-dashed { border-style: dashed !important; border-width: 2px !important; border-color: #dee2e6; }
.tracking-wide { letter-spacing: 0.05em; }

/* Estilos refinados para el contenido inyectado por v-html */
.article-content {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #334155;
    
    /* CAMBIO AQUÍ: Aseguramos que el texto respete los límites del contenedor y parta palabras muy largas si es necesario */
    word-wrap: break-word;
    overflow-wrap: break-word;
    /* Esto ayuda si el editor guardó saltos de línea como \n en lugar de <p> o <br> */
    white-space: pre-wrap; 
}

/* Resto de estilos igual... */
.article-content :deep(p) {
    margin-bottom: 1.5rem;
}

.article-content :deep(h2), 
.article-content :deep(h3) {
    color: #0f172a;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
}

.article-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 2rem 0;
}

.article-content :deep(a) {
    color: #dc3545; 
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    transition: opacity 0.2s;
}

.article-content :deep(a:hover) {
    opacity: 0.8;
}
</style>    