<script setup lang="ts">
const props = defineProps<{
  data: any
}>();
</script>

<template>
  <section class="future-professional-section" :style="{
    background: `radial-gradient(circle at center, ${data.bgGradient1 || '#311b92'} 0%, ${data.bgGradient2 || '#1a237e'} 70%, ${data.bgGradient3 || '#0d1246'} 100%)`
  }">
    
    <div class="background-overlay" :style="{
      backgroundImage: data.bgPattern ? `url(${data.bgPattern})` : 'none',
      opacity: data.bgPatternOpacity ?? 0.3
    }"></div>

    <div class="container position-relative z-index-2">
      <div class="row align-items-center">
        
        <div class="col-md-6 mb-5 mb-md-0">
          
          <h4 class="intro-text" v-if="data.introText" :style="{ color: data.textColor || '#ffffff' }">
            {{ data.introText }}
          </h4>
          
          <div class="spacer-empty"></div>
          
          <div class="text-center main-quote-wrapper" v-if="data.mainQuote">
            <span class="main-quote" :style="{ color: data.textColor || '#ffffff' }">
              "{{ data.mainQuote }}"
            </span>
          </div>

        </div>

        <div class="col-md-6 text-center">
          <img 
            v-if="data.featuredImage" 
            :src="data.featuredImage" 
            alt="Composición Futuro Profesional" 
            class="img-fluid featured-composition-img"
          >
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- ESTILOS DE LA SECCIÓN --- */
.future-professional-section {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 0;
}

.background-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  background-repeat: repeat;
  background-position: center;
}

.z-index-2 {
  z-index: 2;
}

/* --- TEXTOS --- */
.intro-text {
  font-size: 1.5rem; /* Tamaño estándar para un h4 */
  font-weight: 300;
  line-height: 1.4;
  margin-bottom: 0;
  white-space: pre-line; /* Permite saltos de línea del editor */
}

.spacer-empty {
  height: 50px; /* Simula los div de empty-space de tu PageBuilder */
  width: 100%;
}

.main-quote-wrapper {
  width: 100%;
}

.main-quote {
  font-size: 24pt; /* Exactamente el tamaño de tu HTML de referencia */
  font-weight: 700;
  line-height: 1.3;
  display: inline-block;
  white-space: pre-line; /* Maneja el \n del editor sin necesitar <br> */
}

/* --- IMAGEN --- */
.featured-composition-img {
  max-width: 100%;
  height: auto;
  display: inline-block;
  max-height: 550px; /* Evita que la imagen se desborde si suben una muy alta */
  object-fit: contain;
}

/* Ajustes adicionales si se necesita espacio en móviles */
@media (max-width: 767px) {
  .future-professional-section {
    padding: 60px 0;
  }
  .spacer-empty {
    height: 30px;
  }
}
</style>