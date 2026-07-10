<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: any }>();

const footerStyle = computed(() => ({
  backgroundColor: props.data?.bgColor || '#0a0a0a',
  color: props.data?.textColor || '#ffffff',
  fontFamily: props.data?.fontFamily || 'Montserrat, sans-serif' 
}));

const bottomBarStyle = computed(() => ({
  borderTop: `1px solid rgba(255,255,255,0.1)`,
  color: props.data?.textColor || '#ffffff'
}));
</script>

<template>
  <footer class="dark-footer" :style="footerStyle">
    <div class="container py-5">
      <div class="row g-4 justify-content-between">
        
        <div class="col-12 col-md-3 text-center text-md-start">
          <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mb-4">
            <a v-for="(item, idx) in data?.socials" :key="idx" 
               :href="item.url" target="_blank" 
               class="social-link border border-secondary rounded-circle d-flex align-items-center justify-content-center text-decoration-none"
               :style="{ color: data?.textColor, width: '38px', height: '38px' }">
              <i :class="item.icon"></i>
            </a>
          </div>
          
          <div v-if="data?.complaintsBookImg" class="complaints-section mt-4">
            <a :href="data?.complaintsBookUrl" target="_blank">
              <img :src="data?.complaintsBookImg" alt="Libro de Reclamaciones" class="img-fluid" style="max-height: 60px;">
            </a>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <h6 class="fw-bold text-uppercase mb-3 small">{{ data?.locationTitle }}</h6>
          <p class="mb-2 opacity-75 small">{{ data?.locationText }}</p>
          <p class="small">
            <span class="opacity-50">Email:</span> 
            <a :href="`mailto:${data?.locationEmail}`" class="text-decoration-none ms-1 opacity-75" :style="{ color: data?.textColor }">
              {{ data?.locationEmail }}
            </a>
          </p>
        </div>

        <div class="col-12 col-md-3">
          <h6 class="fw-bold text-uppercase mb-3 small">{{ data?.scheduleTitle }}</h6>
          <p class="opacity-75 small" style="white-space: pre-wrap;">{{ data?.scheduleText }}</p>
        </div>

      </div>
    </div>

    <div class="footer-bottom py-3 opacity-50" :style="bottomBarStyle">
      <div class="container">
        <div class="row g-2 align-items-center">
          <div class="col-12 col-md-6 text-center text-md-start">
            <span style="font-size: 0.75rem;">{{ data?.copyright }}</span>
          </div>
          <div class="col-12 col-md-6 text-center text-md-end">
            <span style="font-size: 0.75rem;">{{ data?.companyInfo }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.social-link {
  transition: all 0.2s ease;
  font-size: 1.1rem;
}
.social-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}
.footer-bottom {
  font-size: 0.8rem;
}
</style>