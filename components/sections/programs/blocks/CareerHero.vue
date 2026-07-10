<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '../../../../helpers/url';
import CareerLeadForm from '../forms/CareerLeadForm.vue';


const getSafeImageUrl = (path: string) => {
  if (!path) return '';
  try { return formatImageUrl(path); } catch (e) { return path; }
};

interface CurriculumItem { 
  modality: string; 
  url: string; 
}

interface CareerData {
  name?: string;
  description?: string;
  branding_color?: string;
  bg_overlay?: string;
  image?: string;
  curriculum_json?: string | CurriculumItem[];
  
  form_config?: any; 
}

const props = defineProps<{ data: CareerData }>();

const safeData = computed(() => {
  let curriculum = props.data?.curriculum_json || [];
  if (typeof curriculum === 'string') {
    try { curriculum = JSON.parse(curriculum); } catch { curriculum = []; }
  }

  
  let formConfig = props.data?.form_config || {};
  if (typeof formConfig === 'string') {
    try { formConfig = JSON.parse(formConfig); } catch { formConfig = {}; }
  }
  
  return {
    name: props.data?.name || 'Nombre de la Carrera',
    description: props.data?.description || 'Descripción breve de la carrera...',
    branding_color: props.data?.branding_color || '#8c357f',
    bg_overlay: props.data?.bg_overlay || 'rgba(30, 10, 40, 0.8)',
    image: props.data?.image || '',
    curriculum: curriculum as CurriculumItem[],
    
    
    form_config: {
      campaign_id: formConfig.campaign_id || null,
      title: formConfig.title || 'Comunícate',
      subtitle: formConfig.subtitle || 'Déjanos tus datos y un asesor absolverá tus dudas.',
      button_text: formConfig.button_text || 'Enviar mis datos',
      success_title: formConfig.success_title || '¡Solicitud enviada!',
      success_message: formConfig.success_message || 'Un asesor se pondrá en contacto contigo muy pronto.',
      show_phone: formConfig.show_phone ?? true,
      show_consult: formConfig.show_consult ?? true
    }
  };
});

const dynamicStyles = computed(() => {
  const imageUrl = getSafeImageUrl(safeData.value.image);
  const overlay = safeData.value.bg_overlay;
  
  return {
    background: `linear-gradient(${overlay}, ${overlay}), url('${imageUrl}') center/cover no-repeat`,
  };
});
</script>

<template>
  <section class="career-hero py-5 position-relative" :style="dynamicStyles" id="comunicate">
    <div class="container py-lg-5">
      <div class="row align-items-center g-4">
        
        <div class="col-12 col-md-7 text-center text-md-start text-white">
          <span class="fs-4 fw-light d-block mb-1">Carrera de</span>
          <h1 class="display-3 fw-bold mb-4 text-uppercase">{{ safeData.name }}</h1>
          <p class="lead mb-5 opacity-75 fw-normal" style="max-width: 600px;">
            {{ safeData.description }}
          </p>

         <div class="d-flex flex-column gap-2 align-items-center align-items-md-start">
  <a v-for="(plan, index) in safeData.curriculum" :key="index"
     :href="plan.url" target="_blank"
     class="btn text-white border-0 text-start d-inline-flex align-items-center px-4 py-3 shadow-sm plan-btn"
     :style="{ backgroundColor: safeData.branding_color, borderRadius: '8px' }">
    <i class="bi bi-download me-2 fs-4"></i>
    <span>Descarga el plan de estudios <strong>{{ plan.modality }}</strong></span>
  </a>
</div>
        </div>

        <div class="col-12 col-md-5">
          <div class="card border-0 shadow-lg rounded-4 overflow-hidden mt-4 mt-md-0">
            <div :style="{ height: '8px', backgroundColor: safeData.branding_color }"></div>
            
            <div class="card-body p-4 p-lg-5 bg-white">
              <h3 class="fw-bold text-center mb-1">{{ safeData.form_config.title }}</h3>
              <p class="text-muted text-center small mb-4">{{ safeData.form_config.subtitle }}</p>
              
              <slot name="form">
                <CareerLeadForm 
                  :themeColor="safeData.branding_color" 
                  :careerName="safeData.name" 
                  :config="safeData.form_config"
                />
              </slot>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Tus estilos se mantienen intactos */
.career-hero { 
  min-height: 650px; 
  display: flex; 
  align-items: center; 
  transition: background 0.5s ease; 
}
.plan-btn {
  width: fit-content;
  max-width: 100%;
  transition: all 0.3s ease;
}
.plan-btn:hover { 
  filter: brightness(1.1); 
  transform: translateX(5px); 
}
@media (max-width: 768px) {
  .plan-btn:hover { transform: translateY(-3px); }
  .career-hero { padding-top: 80px !important; padding-bottom: 80px !important; }
}
</style>