<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '../../../helpers/url';

interface Category {
  id: number;
  name: string;
  slug: string;
  image_path: string;
  color: string;
}

const props = defineProps<{
  category: Category
}>();

const cardLink = computed(() => `/noticias/${props.category.slug}`);
const accentColor = computed(() => props.category.color || '#e31140');
</script>

<template>
  <router-link 
    :to="cardLink"
    class="std-card"
    :style="{ '--theme-color': accentColor }"
  >
    <div class="card-media">
      <img 
        :src="category.image_path ? formatImageUrl(category.image_path) : '/images/placeholder.jpg'" 
        :alt="category.name"
      >
      <span class="category-badge">Ver Sección</span>
    </div>

    <div class="card-info">
      <h3 class="card-title">{{ category.name }}</h3>
      
      <div class="card-footer">
        <span class="explore-text">Explorar</span>
        <div class="icon-circle">
          <i class="las la-arrow-right"></i>
        </div>
      </div>
    </div>

    <div class="color-bar"></div>

  </router-link>
</template>

<style scoped lang="scss">

$card-radius: 12px;
$transition-speed: 0.4s;

.std-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 36px 0 36px;
  overflow: hidden;
  text-decoration: none;
  height: 100%; /* Para que en grid todas midan igual */
  min-height: 320px;
  
  
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all $transition-speed cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0,0,0,0.04);

  
  &:hover {
    
    transform: translateY(-10px);
    
    
    box-shadow: 0 20px 40px -10px var(--theme-color); 
    
    
    border-color: var(--theme-color);

    .card-media img {
      transform: scale(1.1); 
    }

    .category-badge {
      background: var(--theme-color);
      color: white;
    }

    .card-title {
      color: var(--theme-color); 
      transform: translateX(5px);
    }

    .icon-circle {
      background: var(--theme-color);
      color: white;
      transform: translateX(0) scale(1.1);
    }

    .color-bar {
      height: 6px; 
    }
    
    .explore-text {
      opacity: 1;
      transform: translateX(0);
      color: #555;
    }
  }
}


.card-media {
  position: relative;
  height: 200px;
  overflow: hidden;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
}

.category-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  transition: all $transition-speed ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}


.card-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  justify-content: space-between;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.2;
  transition: all $transition-speed ease;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; 
}

.explore-text {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  opacity: 0;
  transform: translateX(-10px);
  transition: all $transition-speed ease;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-speed cubic-bezier(0.175, 0.885, 0.32, 1.275);
}


.color-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px; 
  background-color: var(--theme-color);
  transition: height $transition-speed ease;
}
</style>