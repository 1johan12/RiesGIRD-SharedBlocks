<script setup lang="ts">
const props = defineProps<{
  data: any
}>();
</script>

<template>
  <section class="hero-dpa" :style="{ 
    backgroundImage: data.bgImage ? `url(${data.bgImage})` : 'none',
  }">
    <div class="hero-overlay"></div>

    <div class="hero-container">
      
      <div class="hero-content">
        <h1 class="hero-title" v-if="data.title">{{ data.title }}</h1>
        <p class="hero-subtitle" v-if="data.subtitle">{{ data.subtitle }}</p>
        
        <ul class="hero-list" v-if="data.items?.length">
          <li v-for="(item, i) in data.items" :key="i">
            <i class="las la-check-circle"></i> {{ item }}
          </li>
        </ul>

        <div class="hero-actions">
          <a v-if="data.primaryBtnText" :href="data.primaryBtnUrl" 
             class="btn-dpa" :style="{ backgroundColor: data.btnColor || '#ff2b2b' }">
            {{ data.primaryBtnText }}
          </a>
          <a v-if="data.secondaryBtnText" :href="data.secondaryBtnUrl" 
             class="btn-dpa" :style="{ backgroundColor: data.btnColor || '#ff2b2b' }">
            {{ data.secondaryBtnText }}
          </a>
        </div>
      </div>

      <div class="hero-image-wrapper" v-if="data.mainImage">
        <div class="cyan-glow"></div>
        <img :src="data.mainImage" alt="Hero Featured" class="hero-main-img">
      </div>

    </div>
  </section>
</template>

<style scoped>
.hero-dpa {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  color: #ffffff; 
  background-color: #003057; /* Fondo azul oscuro base */
}

/* El fondo principal con el corte diagonal oscuro */
.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  /* Recreando el fondo de tu imagen: azul profundo a la izquierda, corte diagonal */
  background: linear-gradient(110deg, #003a6c 0%, #004a80 50%, rgba(0, 74, 128, 0.4) 100%);
}

/* --- DETALLES DECORATIVOS EXACTOS --- */

/* Línea diagonal roja (centro-derecha de los textos) */
.hero-overlay::after {
  content: '';
  position: absolute;
  top: 32%;
  left: 48%; /* Ajustado para que quede entre el texto y la foto */
  width: 45px;
  height: 3px;
  background: #ff2b2b;
  transform: rotate(-45deg);
}

/* Línea diagonal morada/azul (abajo al centro) */
.hero-overlay::before {
  content: '';
  position: absolute;
  bottom: 12%;
  left: 43%;
  width: 100px;
  height: 3px;
  background: #8e24aa; /* Tono morado de la imagen */
  transform: rotate(-45deg);
}

/* --- CONTENEDOR PRINCIPAL --- */
.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1800px;
  height: 90vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Mitad texto, mitad imagen */
  gap: 40px;
  padding: 100px 40px 60px; /* Ajuste de padding asumiendo que el header va arriba por separado */
  align-items: center;
  width: 100%;
}

.hero-content {
  position: relative;
  padding-left: 20px;
}

.hero-title {
  font-size: clamp(36px, 4vw, 42px); /* Tamaño fiel a la imagen */
  font-weight: 800;
  margin-bottom: 15px;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-subtitle {
  font-size: 18px;
  margin-bottom: 35px;
  max-width: 500px;
  line-height: 1.4;
  font-weight: 300; /* Letra más delgada como en la captura */
  opacity: 0.9;
}

/* Botones */
.hero-actions {
  display: flex;
  flex-direction: column; /* Apilados verticalmente */
  gap: 15px;
  width: fit-content;
}

.btn-dpa {
  display: inline-block;
  text-decoration: none;
  color: white;
  padding: 12px 25px; 
  border-radius: 3px; /* Bordes ligeramente cuadrados */
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  text-align: center;
  min-width: 250px;
}

.btn-dpa:hover {
  filter: brightness(1.15);
  transform: translateY(-2px); 
}

/* --- IMAGEN Y EFECTO CIAN --- */
.hero-image-wrapper {
  display: flex;
  justify-content: flex-end;
  position: relative; 
  width: 100%;
}

/* El resplandor cian gigante a la derecha */
.cyan-glow {
  position: absolute;
  bottom: -30%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 220, 210, 0.8) 0%, rgba(0, 220, 210, 0) 65%);
  border-radius: 50%;
  z-index: -1; 
}

.hero-main-img {
  width: 100%;
  max-width: 900px; /* Imagen un poco más grande para ocupar bien el espacio */
  height: auto;
  border-radius: 0; /* Sin bordes redondeados, igual que la foto */
  display: block;
}

.hero-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.hero-list li {
  margin-bottom: 8px;
  font-size: 16px;
}

/* --- RESPONSIVE --- */
@media (max-width: 992px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 80px 20px 40px; 
  }
  .hero-content {
    padding-left: 0;
  }
  .hero-actions {
    margin: 0 auto;
    align-items: center;
  }
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-image-wrapper {
    margin-top: 40px;
    justify-content: center;
  }
  .hero-overlay::before,
  .hero-overlay::after {
    display: none; 
  }
}
</style>