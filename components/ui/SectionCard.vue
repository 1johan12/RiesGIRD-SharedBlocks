<script setup lang="ts">
import { formatImageUrl } from '@/helpers/url'; 

export interface SectorItem {
  id: number;
  title: string;
  image: string;
  url: string;
  color: string;
}

const props = defineProps<{
  item: SectorItem
}>();
</script>

<template>
  <router-link 
    :to="props.item.url" 
    class="text-decoration-none h-100 d-block sector-card-wrapper"
  >
    <div class="sector-card h-100 shadow-sm">
      
      <div class="card-img-wrapper position-relative overflow-hidden">
        <img 
          v-if="props.item.image"
          :src="formatImageUrl(props.item.image)" 
          :alt="props.item.title"
          class="sector-image"
          loading="lazy"    
          decoding="async"
        >
        <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted bg-light">
           <i class="las la-image fs-1 opacity-25"></i>
        </div>

        <div class="card-overlay"></div>
        
        <div class="view-more-icon">
          <i class="las la-plus"></i>
        </div>
      </div>

      <div 
        class="sector-content text-center p-3 text-white text-uppercase"
        :style="{ background: `linear-gradient(135deg, ${props.item.color || '#2c2c51'} 0%, #1a1a1a 100%)` }"
      >
        <div class="title-line mb-2 mx-auto"></div>
        <h6 class="fw-bold mb-0 small-text">{{ props.item.title }}</h6>
      </div>

    </div>
  </router-link>
</template>

<style scoped lang="scss">
.sector-card-wrapper {
  perspective: 1000px; 
}

.sector-card {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;
  border-radius: 12px; 
  border: none;
  background: white;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.12) !important;
    
    .sector-image {
      transform: scale(1.1);
      filter: grayscale(0%);
    }

    .card-overlay {
      background: rgba(0, 0, 0, 0.1);
    }

    .view-more-icon {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    .title-line {
      width: 40px;
    }
  }
}

.card-img-wrapper {
  height: 220px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.sector-image {
  width: 100%;
  height: 100%;
  object-fit: contain; 
  padding: 2.5rem; 
  transition: all 0.6s ease;
  filter: grayscale(20%); 
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}

.view-more-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 45px;
  height: 45px;
  background: white;
  color: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.sector-content {
  position: relative;
  z-index: 2;
  min-height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title-line {
  width: 20px;
  height: 2px;
  background: rgba(255,255,255,0.6);
  transition: width 0.3s ease;
}

.small-text {
  font-size: 0.8rem;
  letter-spacing: 1px;
}


@media (max-width: 768px) {
  .card-img-wrapper {
    height: 180px;
  }
  .sector-image {
    padding: 1.5rem;
  }
}
</style>