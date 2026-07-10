<script setup lang="ts">
import { computed } from 'vue';

interface SectionData {
  bgType: 'color' | 'image' | 'gradient';
  bgColor: string;
  bgImage: string;
  bgGradient: string;
  padding: {
    top: number;
    bottom: number;
  };
  imageLeft: string;
  buttonText: string;
  buttonUrl: string;
  buttonTarget: '_self' | '_blank';
  spaceHeight: number;
  imageRight: string;
}

const props = defineProps<{
  data: SectionData
}>();

const sectionStyle = computed(() => {
  const style: Record<string, string> = {
    paddingTop: `${props.data.padding.top}px`,
    paddingBottom: `${props.data.padding.bottom}px`,
  };
  if (props.data.bgType === 'color') style.backgroundColor = props.data.bgColor;
  else if (props.data.bgType === 'gradient') style.backgroundImage = props.data.bgGradient;
  else if (props.data.bgType === 'image' && props.data.bgImage) {
    style.backgroundImage = `url(${props.data.bgImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }
  return style;
});
</script>

<template>
  <div class="sppb-section dpa-multimodalidad-section d-flex align-items-center" :style="sectionStyle">
    <div class="container-fluid p-0">
      <div class="row g-0 align-items-center">

        <div class="col-12 col-md-6 position-relative d-flex justify-content-center align-items-center column-container">
          <div class="wrapper-izquierdo">
            <img
              class="img-principal"
              :src="props.data.imageLeft"
              alt="3 modalidades"
            />
            
            <div class="contenedor-boton">
              <a
                :href="props.data.buttonUrl"
                :target="props.data.buttonTarget"
                class="btn-info-modalidades"
              >
                {{ props.data.buttonText }}
              </a>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 d-flex justify-content-center align-items-center column-container">
          <div class="wrapper-derecho">
            <img
              class="img-principal"
              :src="props.data.imageRight"
              alt="Detalle modalidades"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Estructura Base ── */
.dpa-multimodalidad-section {
  width: 100%;
  min-height: 80vh;
  overflow: hidden;
  display: flex;
}

.column-container {
  min-height: 80vh;
  padding: 40px; /* Un poco más de aire para que no pegue a los bordes */
}

.wrapper-izquierdo, .wrapper-derecho {
  position: relative;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-principal {
  width: 100%;
  height: auto;
  max-height: 75vh;
  object-fit: contain;
}

/* ── El Botón: Control Preciso ── */
.contenedor-boton {
  position: absolute;
  /* En pantallas grandes (Desktop), lo ubicamos sobre la imagen */
  bottom: 22%; 
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.btn-info-modalidades {
  background-color: #f6323e;
  color: white;
  padding: 12px 30px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(246, 50, 62, 0.4);
  border: none;
  white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
}

.btn-info-modalidades:hover {
  background-color: #d1222d;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(246, 50, 62, 0.6);
  color: white;
}

/* ── Responsive Tablet (Pantallas medianas) ── */
@media (max-width: 1199px) {
  .contenedor-boton {
    bottom: 18%; /* Ajustamos el porcentaje porque la proporción cambia */
  }
}

@media (max-width: 991px) {
  .contenedor-boton {
    bottom: 15%;
  }
  .btn-info-modalidades {
    padding: 10px 20px;
    font-size: 0.8rem;
  }
}

/* ── Responsive Móvil (Stack vertical) ── */
@media (max-width: 767px) {
  .dpa-multimodalidad-section {
    min-height: auto;
  }
  .column-container {
    min-height: auto;
    padding: 30px 15px;
    width: 100%;
  }
  
  /* Aquí el botón deja de flotar y se pone DEBAJO de la imagen */
  .contenedor-boton {
    position: relative;
    bottom: 0;
    margin-top: -20px; /* Lo subimos un poquito para que pegue a la imagen */
    padding-bottom: 20px;
  }
  
  .img-principal {
    max-height: 50vh; /* En móvil que no sea tan gigante */
  }
}
</style>