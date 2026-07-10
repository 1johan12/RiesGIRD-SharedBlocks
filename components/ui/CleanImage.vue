<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  src: string;
  alt?: string;
  className?: string;
  tolerance?: number; 
}>();

const processedSrc = ref<string>('');
const isLoading = ref(true);


const removeWhiteBackground = (imageSrc: string) => {
  const img = new Image();
  img.crossOrigin = "Anonymous"; 
  img.src = imageSrc;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    
    
    ctx.drawImage(img, 0, 0);
    
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const limit = props.tolerance || 230; 

    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];     
      const g = data[i + 1]; 
      const b = data[i + 2]; 
      
      
      if (r > limit && g > limit && b > limit) {
        data[i + 3] = 0; 
      }
    }

    
    ctx.putImageData(imgData, 0, 0);
    
    
    processedSrc.value = canvas.toDataURL();
    isLoading.value = false;
  };

  img.onerror = () => {
    
    processedSrc.value = props.src;
    isLoading.value = false;
  }
};

onMounted(() => {
  removeWhiteBackground(props.src);
});


watch(() => props.src, (newVal) => {
  isLoading.value = true;
  removeWhiteBackground(newVal);
});
</script>

<template>
  <div class="clean-img-wrapper" :class="className">
    <div v-if="isLoading" class="skeleton-loader"></div>
    
    <img 
      v-else
      :src="processedSrc" 
      :alt="alt"
      class="img-result"
    />
  </div>
</template>

<style scoped>
.clean-img-wrapper {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
}

.img-result {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.skeleton-loader {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.05);
  animation: pulse 1.5s infinite;
  border-radius: 8px;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}
</style>