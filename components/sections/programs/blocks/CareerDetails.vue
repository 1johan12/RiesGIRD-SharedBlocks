<script setup lang="ts">
const props = defineProps<{
  data: {
    image?: string;
    boxBgColor?: string;
    iconColor?: string;
    textColor?: string;
    items?: Array<{
      icon: string;
      text: string;
    }>;
  }
}>();
</script>

<template>
  <section class="career-info-section">
    <div class="career-info-container">
      
      <div class="image-column">
        <img :src="data.image || 'https://via.placeholder.com/600x600'" alt="Estudiante ESAN" class="main-image">
      </div>

      <div class="list-column">
        <div 
          v-for="(item, i) in data.items" 
          :key="i" 
          class="info-box"
          :style="{ backgroundColor: data.boxBgColor || '#fcf5fb' }"
        >
          <div class="icon-container">
            <i :class="item.icon" class="icon-watermark" :style="{ color: data.iconColor || '#8c357f' }"></i>
            <i :class="item.icon" class="icon-main" :style="{ color: data.iconColor || '#8c357f' }"></i>
          </div>
          
          <div class="text-content" :style="{ color: data.textColor || '#1e1e1e' }">
            {{ item.text }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.career-info-section {
  padding: 60px 0;
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
}

.career-info-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 40px;
  padding: 0 20px;
}

/* Columna Imagen */
.image-column {
  flex: 0 0 45%;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px; /* Redondeado estándar de la imagen */
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* Columna Lista */
.list-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 15px;
}

/* Caja individual */
.info-box {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-radius: 8px; /* Bordes ligeramente redondeados */
  transition: transform 0.2s ease;
}

.info-box:hover {
  transform: translateX(5px);
}

/* Área del Icono */
.icon-container {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.icon-main {
  font-size: 26px;
  position: relative;
  z-index: 2;
}

.icon-watermark {
  position: absolute;
  font-size: 55px;
  opacity: 0.1; /* Transparencia para efecto marca de agua */
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Texto */
.text-content {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

/* Responsive */
@media (max-width: 992px) {
  .career-info-container {
    flex-direction: column;
  }
  .image-column {
    height: 350px;
  }
}
</style>