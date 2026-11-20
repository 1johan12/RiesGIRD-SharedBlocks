<template>
    <article class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="mb-4 text-center">
                    <span v-if="record.category_name" class="badge bg-primary mb-3">{{ record.category_name }}</span>
                    <h1 class="fw-bold display-5 mb-3">{{ record.title }}</h1>
                    <p v-if="record.excerpt" class="lead text-muted">{{ record.excerpt }}</p>
                    
                    <div class="d-flex align-items-center justify-content-center gap-3 mt-4 text-muted small">
                        <div v-if="authorName" class="d-flex align-items-center">
                            <img v-if="authorAvatar" :src="formatImageUrl(authorAvatar)" class="rounded-circle me-2" width="30" height="30" style="object-fit: cover;">
                            <span class="fw-bold text-dark">{{ authorName }}</span>
                        </div>
                        <span>|</span>
                        <span><i class="las la-calendar"></i> {{ formatDate(record.start_date) }}</span>
                        <span>|</span>
                        <span><i class="las la-clock"></i> {{ readTime }}</span>
                    </div>
                </div>

                <img v-if="record.featured_image_path" :src="formatImageUrl(record.featured_image_path)" class="img-fluid rounded-4 shadow-sm w-100 mb-5 object-fit-cover" style="max-height: 500px;" :alt="record.title">

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
import { formatImageUrl } from '../../../helpers/url';
import { sanitizeHtml } from '../../../helpers/sanitize';

const props = defineProps<{
    data?: Record<string, any>;
    pageData?: Record<string, any>;
}>();

const record = computed<Record<string, any>>(() => props.data || props.pageData || {});

const bodyData = computed(() => {
    let parsed: any = record.value.body || record.value.content_blocks;
    for (let i = 0; i < 2 && typeof parsed === 'string'; i++) {
        try { parsed = JSON.parse(parsed); } catch { break; }
    }
    if (typeof parsed === 'string') return { html: parsed };
    return parsed || {};
});

const htmlContent = computed(() => sanitizeHtml(bodyData.value.html || ''));
const authorName = computed(() => bodyData.value.author?.name || '');
const authorAvatar = computed(() => bodyData.value.author?.avatar || '');
const readTime = computed(() => bodyData.value.extra?.read_time || '5 min');
const tags = computed(() => bodyData.value.extra?.tags || []);

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};
</script>

<style scoped>
.article-content :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; }
.article-content :deep(blockquote) { border-left: 4px solid #0d6efd; padding-left: 1rem; color: #6c757d; font-style: italic; }
</style>