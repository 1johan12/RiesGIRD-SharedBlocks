<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});


const isScrolled = ref(false);


const navRef = ref<HTMLElement | null>(null);
const navHeight = ref(0);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};


const calculateHeight = () => {
  if (navRef.value) {
    navHeight.value = navRef.value.offsetHeight;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  nextTick(() => {
    calculateHeight();
    
    window.addEventListener('resize', calculateHeight);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateHeight);
});
</script>

<template>
  <div :style="{ height: data.isSticky ? `${navHeight}px` : 'auto' }">
    
    <nav 
      ref="navRef"
      class="navbar navbar-expand-lg transition-all w-100" 
      :class="{ 
        'fixed-top': data.isSticky,
        'shadow-sm': isScrolled && data.isSticky,
        'border-bottom': !isScrolled
      }"
      :style="{ backgroundColor: data.bgColor, zIndex: 1030 }"
    >
      <div class="container relative d-flex justify-content-between align-items-center py-1">
        
        <a class="navbar-brand d-flex align-items-center m-0" href="#">
          <img 
            v-if="data.logoImage" 
            :src="data.logoImage" 
            alt="Logo" 
            style="max-height: 55px; width: auto;"
          >
          <span v-else class="fw-bold text-dark fs-4">ESAN DPA</span>
        </a>

        <div class="d-flex" v-if="data.showButton">
          <a 
            :href="data.buttonLink" 
            class="btn fw-bold px-4 py-3 rounded-0 transition-all text-decoration-none"
            :style="{ 
              backgroundColor: data.buttonColor, 
              color: data.buttonTextColor,
              letterSpacing: '1px'
            }"
          >
            {{ data.buttonText.toUpperCase() }}
          </a>
        </div>
        
      </div>
    </nav>
  </div>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>