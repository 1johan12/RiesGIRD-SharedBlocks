<template>
    <article class="container-fluid px-0 overflow-hidden">
        <div class="row g-0">
            <div class="col-lg-6 d-flex flex-column justify-content-center px-4 px-md-5 py-5" style="min-height: 80vh;">
                <div class="max-w-md mx-auto ms-lg-auto me-lg-5 w-100" style="max-width: 600px;">
                    
                    <span v-if="data.category_name" class="text-uppercase fw-bold text-primary small tracking-wide mb-2 d-block">{{ data.category_name }}</span>
                    <h1 class="fw-bold display-4 mb-4" style="font-family: 'Playfair Display', serif;">{{ data.title }}</h1>
                    <p v-if="data.excerpt" class="fs-4 text-muted border-start border-4 border-primary ps-3 mb-5">{{ data.excerpt }}</p>
                    
                    <div class="d-flex align-items-center mb-5 pb-4 border-bottom">
                        <img v-if="authorAvatar" :src="formatImageUrl(authorAvatar)" class="rounded-circle me-3 shadow-sm" width="50" height="50" style="object-fit: cover;">
                        <div>
                            <span class="fw-bold text-dark d-block">{{ authorName || 'Redacción' }}</span>
                            <span class="text-muted small">{{ formatDate(data.start_date) }} · {{ readTime }}</span>
                        </div>
                    </div>

                    <div class="article-content fs-5 text-secondary" style="line-height: 1.9;" v-html="htmlContent"></div>
                </div>
            </div>

            <div class="col-lg-6 d-none d-lg-block position-relative">
                <div class="position-sticky top-0 h-100 vh-100">
                    <img v-if="data.featured_image_path" :src="formatImageUrl(data.featured_image_path)" class="w-100 h-100 object-fit-cover shadow-lg" :alt="data.title">
                </div>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '../../../helpers/url';

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
const readTime = computed(() => bodyData.value.extra?.read_time || '5 min');
const tags = computed(() => bodyData.value.extra?.tags || []);

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};


</script>

<style scoped>
.tracking-wide { letter-spacing: 0.1em; }
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5rem 0; }
</style>