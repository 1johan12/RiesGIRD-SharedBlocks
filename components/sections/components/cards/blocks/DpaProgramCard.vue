<script setup lang="ts">
interface Props {
  color: string;
  image: string; 
  link: string;
  name: string;
  icon: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="card-container">
    <div class="capa-1-fondo" :style="{ backgroundColor: props.color }"></div>

    <img :src="props.image" class="capa-2-imagen" alt="Carrera" />

    <div class="capa-3-caja-texto">
      <div class="seccion-info" :style="{ backgroundColor: props.color }">
        <div class="header-content">
          <img :src="props.icon" class="carrera-icon" />
          <h3 class="carrera-name">{{ props.name }}</h3>
        </div>
      </div>
      
      <div class="seccion-link" :style="{ backgroundColor: props.color }">
        <a target="_blank" :href="props.link" class="carrera-link">Conoce más aquí</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  position: relative;
  width: 320px;
  height: 250px;
  margin: 20px;
}

/* CAPA 1: El desfase visual trasero */
.capa-1-fondo {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 15px;
  width: 70%;
  height: 60%;
  border-radius: 20px;
  z-index: 1;
  opacity: 0.6; 
}

/* CAPA 2: Imagen (Empieza donde termina el desfase de la Capa 1) */
.capa-2-imagen {
  position: absolute;
  top: 15px;
  right: 0; 
  width: 90%; 
  height: 75%;
  border-radius: 20px;
  object-fit: cover;
  z-index: 2;
}

/* CAPA 3: Caja de texto (Anclada a la derecha para seguir a la imagen) */
.capa-3-caja-texto {
  position: absolute;
  bottom: 0;
  right: 0; 
  width: 80%; 
  margin-right: 15px;
  z-index: 3;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

/* --- SECCIONES CON TRANSICIÓN MÁS SUAVE --- */
.seccion-info {
  padding: 18px 20px; 
  min-height: 80px;   
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0); 
  transition: box-shadow 0.4s ease; /* Transición más prolongada y suave */
}

.seccion-link {
  padding: 12px 20px; /* Un poco más de aire para el centrado */
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.15); 
  transition: box-shadow 0.4s ease; /* Transición más prolongada y suave */
  
  /* Centrado perfecto del enlace */
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.carrera-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

.carrera-name {
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
  /*text-transform: uppercase;*/
  line-height: 1.1;
}

.carrera-link {
  color: white;
  font-size: 0.75rem;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  text-align: center; /* Refuerzo de centrado */
  transition: opacity 0.3s ease; /* Transición base por si el navegador lo requiere */
}

/* Opcional: Leve efecto visual extra en el link al hacer hover */
.carrera-link:hover {
  opacity: 0.9;
}

/* --- EFECTO HOVER INVERTIDO --- */
.capa-3-caja-texto:hover .seccion-info {
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.15);
}

.capa-3-caja-texto:hover .seccion-link {
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0);
}
</style>