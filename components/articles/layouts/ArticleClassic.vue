<template>
    <article class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="mb-4 text-center">
                    <span v-if="data.category_name" class="badge bg-primary mb-3">{{ data.category_name }}</span>
                    <h1 class="fw-bold display-5 mb-3">{{ data.title }}</h1>
                    <p v-if="data.excerpt" class="lead text-muted">{{ data.excerpt }}</p>
                    
                    <div class="d-flex align-items-center justify-content-center gap-3 mt-4 text-muted small">
                        <div v-if="authorName" class="d-flex align-items-center">
                            <img v-if="authorAvatar" :src="formatImageUrl(authorAvatar)" class="rounded-circle me-2" width="30" height="30" style="object-fit: cover;">
                            <span class="fw-bold text-dark">{{ authorName }}</span>
                        </div>
                        <span>|</span>
                        <span><i class="las la-calendar"></i> {{ formatDate(data.start_date) }}</span>
                        <span>|</span>
                        <span><i class="las la-clock"></i> {{ readTime }}</span>
                    </div>
                </div>

                <img v-if="data.featured_image_path" :src="formatImageUrl(data.featured_image_path)" class="img-fluid rounded-4 shadow-sm w-100 mb-5 object-fit-cover" style="max-height: 500px;" :alt="data.title">

                <div class="article-content fs-5" style="line-height: 1.8;" v-html="htmlContent"></div>
                
                <div v-if="tags.length" class="mt-5 pt-4 border-top">
                    <span v-for="tag in tags" :key="tag" class="badge bg-light text-dark border me-2 py-2 px-3">
                        <i class="las la-tag me-1"></i>{{ tag }}
                    </span>
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
const readTime = computed(() => bodyData.value.extra?.read_time || '5 min');
const tags = computed(() => bodyData.value.extra?.tags || []);

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};


</script>

<style scoped>
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; }
.article-content :deep(blockquote) { border-left: 4px solid #0d6efd; padding-left: 1rem; color: #6c757d; font-style: italic; }
</style>