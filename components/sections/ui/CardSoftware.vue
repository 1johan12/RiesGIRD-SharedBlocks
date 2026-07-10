<script setup lang="ts">
import { formatImageUrl } from '@/helpers/url';

interface Course {
    id: number | string;
    title: string;
    description: string;
    image_path: string;
    category: { name: string };
}

const props = defineProps<{
    course: Course;
}>();

const emit = defineEmits<{
    (e: 'click-detail', course: Course): void;
}>();
</script>

<template>
    <div class="course-card">
        <div class="card-image-wrapper">
            <img 
                :src="formatImageUrl(course.image_path)" 
                :alt="course.title" 
                loading="lazy" 
            />
            <span class="category-badge">{{ course.category.name }}</span>
        </div>

        <div class="card-content">
            <h3 class="card-title text-uppercase fw-bold">{{ course.title }}</h3>
            <p class="card-desc">{{ course.description }}</p>
            
            <button class="btn-detail" @click="emit('click-detail', course)">
                Ver Detalle
                <i class="las la-arrow-right"></i>
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
$primary: #144c74;
$accent: #e31140;
$text-light: #666;
$bg-card: #ffffff;
$radius: 12px;

.course-card {
    background: $bg-card;
    border-radius: $radius;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0,0,0,0.1);
        
        .card-image-wrapper img {
            transform: scale(1.05);
        }
    }
}

.card-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.5s ease;
    }
}

.category-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba($primary, 0.9);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(4px);
}

.card-content {
    padding: 25px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: $primary;
    margin-bottom: 10px;
    line-height: 1.4;
}

.card-desc {
    font-size: 16px;
    color: $text-light;
    line-height: 1.6;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.btn-detail {
    margin-top: auto;
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid $primary;
    color: $primary;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    &:hover {
        background: $primary;
        color: white;
    }
}
</style>