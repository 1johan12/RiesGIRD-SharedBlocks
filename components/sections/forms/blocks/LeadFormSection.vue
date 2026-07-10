<script setup lang="ts">
import { computed } from 'vue';
import Form from './Form.vue';

const props = defineProps<{
  data: any
}>();


const bgImage = computed(() => props.data?.bgImage);
const formPosition = computed(() => props.data?.formPosition || 'izquierda'); 

const themeColor = computed(() => props.data?.themeColor || '#a00000'); 
const linkColor = computed(() => props.data?.linkColor || '#ff2b2b');   


const mainFormTitle = computed(() => props.data?.mainTitle);
const mainFormSubtitle = computed(() => props.data?.subTitle);


const marketingTitle = computed(() => props.data?.marketingTitle || 'INVIERTE EN TU EXCELENCIA');
const marketingImage = computed(() => props.data?.marketingImage || ''); 


const formConfig = computed(() => {
  return props.data?.formConfig || {
    campaign_id: null,
    condition: 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
    button_text: 'Enviar mis datos',
    success_title: '¡Solicitud enviada!',
    success_message: 'Un asesor se pondrá en contacto contigo muy pronto.',
    show_phone: true,
    show_consult: true,
    show_courses: true,
    courses_list: []
  };
});
</script>

<template>
  <section 
    class="hero-section position-relative d-flex align-items-center py-5"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="container position-relative z-index-2 h-100">
      
      <div class="row mb-5"></div>
      <div class="row mb-4"></div>

      <div class="row align-items-center min-vh-75">
        
        <div 
          class="col-lg-6 col-xl-6 mb-5 mb-lg-0" 
          :class="formPosition === 'izquierda' ? 'order-lg-1 me-auto' : 'order-lg-2 ms-auto'"
        >
          <div class="form-wrapper">
            <div class="text-white text-start mb-4">
              <h2 class="mb-2 text-uppercase title-transform shadow-sm-text">
                {{ mainFormTitle }}
              </h2>
              <p v-if="mainFormSubtitle" class="mb-0 text-white-50 small shadow-sm-text fw-medium" style="font-size: 0.95rem;">
                {{ mainFormSubtitle }}
              </p>
            </div>

            <div class="p-0">
              <Form 
                :config="formConfig" 
                :themeColor="themeColor"
                :linkColor="linkColor"
                careerName="Carrera de Interés"
              />
            </div>
          </div>
        </div>

        <div 
          class="col-lg-6 col-xl-6 d-none d-lg-flex flex-column justify-content-center align-items-center position-relative h-100"
          :class="formPosition === 'izquierda' ? 'order-lg-2' : 'order-lg-1'"
        >
          <h1 class="visually-hidden">
            {{ marketingTitle }}
          </h1>

          <img 
            v-if="marketingImage" 
            :src="marketingImage" 
            class="optional-marketing-img img-fluid mt-auto" 
            alt="Estudiante"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- ESTRUCTURA BASE (Tuya intacta) --- */
.hero-section {
  width: 100%;
  min-height: 800px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.min-vh-75 { min-height: 75vh; }
.z-index-2 { z-index: 2; }


/* --- TIPOGRAFÍA FORMULARIO (Tuya intacta) --- */
.title-transform {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 800;
}

.shadow-sm-text { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }

.form-wrapper {
  max-width: 800px; 
  margin: 0 auto;
}

/* --- CLASE NUEVA PARA LA IMAGEN OPCIONAL --- */
.optional-marketing-img {
  max-height: 700px;
  object-fit: contain;
  /* El drop-shadow ayuda a que un PNG sin fondo resalte sobre el fondo de la foto */
  filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.4)); 
}

/* --- RESPONSIVE (Tuya intacta) --- */
@media (max-width: 991.98px) {
  .hero-section {
    min-height: auto;
    background-image: none !important;
    background-color: #3b0008; 
  }
  .title-transform {
    font-size: 1.3rem;
    text-align: center;
  }
  .form-wrapper .text-start {
    text-align: center !important;
  }
}
</style>