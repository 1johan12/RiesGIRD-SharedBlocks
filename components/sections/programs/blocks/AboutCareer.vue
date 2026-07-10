<script setup lang="ts">
const props = defineProps<{
  data: {
    tag?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    bgColor?: string;
    textColor?: string;
    tagColor?: string;
  }
}>();
</script>

<template>
  <section class="about-career-wrapper" :style="{ backgroundColor: data.bgColor || '#ffffff' }">
    <div class="about-career-container">
      
      <div class="about-career-image">
        <div class="image-circle">
          <img :src="data.image || 'https://via.placeholder.com/500'" alt="Imagen de carrera">
        </div>
      </div>

      <div class="about-career-text" :style="{ color: data.textColor || '#1e1e1e' }">
        <span class="tag-text" :style="{ color: data.tagColor || '#8c357f' }">
          {{ data.tag }}
        </span>
        
        <h2 class="main-title">{{ data.title }}</h2>
        
        <p class="summary-bold">
          {{ data.subtitle }}
        </p>
        
        <p class="full-description">
          {{ data.description }}
        </p>
      </div>

    </div>
  </section>
</template>

<style scoped>
.about-career-wrapper {
  padding: 100px 0;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
}

.about-career-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 0 40px;
}

/* Imagen circular */
.about-career-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.image-circle {
  width: 450px;
  height: 450px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.image-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Bloque de texto */
.about-career-text {
  flex: 1.2;
}

.tag-text {
  display: block;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.main-title {
  font-size: 28px; /* Tamaño aumentado */
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 30px;
  text-transform: none !important;
}

.summary-bold {
  font-size: 20px; /* Tamaño aumentado */
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 25px;
}

.full-description {
  font-size: 18px; /* Tamaño aumentado */
  font-weight: 400;
  line-height: 1.7;
  opacity: 0.85;
}

/* Móvil */
@media (max-width: 992px) {
  .about-career-container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
    padding: 0 20px;
  }
  
  .image-circle {
    width: 320px;
    height: 320px;
  }

  .main-title { font-size: 20px; }
  .summary-bold { font-size: 18px; }
  .full-description { font-size: 16px; }
}
</style>