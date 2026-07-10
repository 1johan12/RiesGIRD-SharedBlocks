<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data?: any
}>();



const bgColor = computed(() => props.data?.bgColor || '#151515');
const textColor = computed(() => props.data?.textColor || '#a3a3a3');
const leftText = computed(() => props.data?.leftText || '© Copyright 2024 - Universidad ESAN | Todos los derechos reservados.');
const rightText = computed(() => props.data?.rightText || 'Razón Social: Universidad ESAN | RUC: 20136507720');
</script>

<template>
  <footer class="footer-copyright" :style="{ backgroundColor: bgColor, color: textColor }">
    <div class="footer-container">
      
      <div class="footer-left">
        <p>{{ leftText }}</p>
      </div>
      
      <div class="footer-right">
        <p>{{ rightText }}</p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer-copyright {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer-copyright p {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.3px;
}

.footer-left {
  text-align: left;
}

.footer-right {
  text-align: right;
}

/* Modo Responsive (Celulares) */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    justify-content: center;
  }
  
  .footer-left, 
  .footer-right {
    text-align: center;
  }
}
</style>