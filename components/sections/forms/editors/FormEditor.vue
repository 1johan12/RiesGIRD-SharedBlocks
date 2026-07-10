<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import HttpClient from "../../../../helpers/http-client"; 
import { useAuthStore } from "../../../../../front/src/stores/auth"; 

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();


const localForm = ref({
  
  bgImage: props.modelValue?.bgImage || 'https://www.ue.edu.pe/img/home/fondo-carreras-dpa.jpg',
  themeColor: props.modelValue?.themeColor || '#ff2b2b',
  
  
  mainTitle: props.modelValue?.mainTitle || '¡TRANSFORMA TU FUTURO! DA EL PRIMER PASO HACIA TU EXCELENCIA PROFESIONAL',
  subTitle: props.modelValue?.subTitle || 'Déjanos tus datos y un asesor absolverá tus dudas.',
  marketingTitle: props.modelValue?.marketingTitle || 'INVIERTE EN TU EXCELENCIA', 

  
  campaign_id: props.modelValue?.campaign_id || null,
  cod_form_old: props.modelValue?.cod_form_old || '', 
  condition: props.modelValue?.condition || 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
  button_text: props.modelValue?.button_text || 'Enviar mis datos',
  success_title: props.modelValue?.success_title || '¡Solicitud enviada!',
  success_message: props.modelValue?.success_message || 'Un asesor se pondrá en contacto contigo muy pronto.',
  show_phone: props.modelValue?.show_phone ?? true,
  show_consult: props.modelValue?.show_consult ?? true,
  show_courses: props.modelValue?.show_courses ?? true,
  courses_list: props.modelValue?.courses_list || []
});


watch(localForm, (newVal) => {
  emit('update:modelValue', { ...newVal });
}, { deep: true });


interface Campaign {
  id: number;
  name: string;
}

const campaigns = ref<Campaign[]>([]);
const loading = ref(false);

const loadCampaigns = async () => {
  loading.value = true;
  try {
    const response = await HttpClient.get('marketing/campaigns', {
      params: { academic_unit_id: authStore.academicUnitId }
    });
    campaigns.value = response.data.data || response.data;
  } catch (e) {
    console.error("Error al cargar campañas", e);
  } finally {
    loading.value = false;
  }
};


const loadingCourses = ref(false);

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const response = await HttpClient.get('study-programs');
    const programs = response.data.data || response.data;
    
    localForm.value.courses_list = programs.map((p: any) => ({
        id: p.id,
        name: p.name 
    }));
  } catch (e) {
    console.error(e);
    alert("Error al cargar los programas de estudio desde la base de datos.");
  } finally {
    loadingCourses.value = false;
  }
};

onMounted(() => {
  loadCampaigns();
});
</script>

<template>
  <div class="card border-primary shadow-sm mb-3" style="border-width: 2px;">
    <div class="card-body p-3">
      <h6 class="fw-bold text-primary mb-3">
        <i class="las la-form"></i> Configuración del Hero Formulario
      </h6>
      
      <div class="bg-light p-2 rounded mb-3 border">
        <label class="small fw-bold text-primary d-block mb-2">Diseño Visual</label>
        <div class="row g-2">
          <div class="col-8">
            <label class="small text-muted mb-1">Imagen de Fondo (URL)</label>
            <input type="text" class="form-control form-control-sm" v-model="localForm.bgImage">
          </div>
          <div class="col-4">
            <label class="small text-muted mb-1">Color Principal</label>
            <input type="color" class="form-control form-control-sm form-control-color w-100" v-model="localForm.themeColor">
          </div>
        </div>
      </div>

      <div class="bg-light p-2 rounded mb-3 border">
        <label class="small fw-bold text-primary d-block mb-1">Campaña Marketing</label>
        <select class="form-select form-select-sm mb-2" v-model="localForm.campaign_id" :disabled="loading">
          <option :value="null">-- Selecciona una campaña --</option>
          <option v-for="camp in campaigns" :key="camp.id" :value="camp.id">
            {{ camp.name }}
          </option>
        </select>
        <small v-if="loading" class="text-muted mt-1 d-block mb-2">
          <i class="las la-spinner la-spin"></i> Cargando campañas...
        </small>

        <label class="small fw-bold text-primary d-block mb-1 mt-2">ID Formulario Legacy (cod_form_old)</label>
        <input type="text" class="form-control form-control-sm" v-model="localForm.cod_form_old" placeholder="Ej: 45">
      </div>

      <div class="row g-2 mb-3">
        <div class="col-12">
          <label class="small text-muted mb-1">Título Principal (Sobre el Form)</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.mainTitle">
        </div>
        <div class="col-12">
          <label class="small text-muted mb-1">Subtítulo</label>
          <textarea class="form-control form-control-sm" v-model="localForm.subTitle" rows="2"></textarea>
        </div>
        <div class="col-12">
          <label class="small text-muted mb-1">Texto SEO (Oculto)</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.marketingTitle">
        </div>
        <div class="col-6">
          <label class="small text-muted mb-1">Texto Botón</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.button_text">
        </div>
        <div class="col-6">
          <label class="small text-muted mb-1">Link de términos</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.condition">
        </div>
      </div>

      <div class="p-2 border rounded mb-3" style="background-color: #f0fff4;">
        <label class="small fw-bold text-success d-block mb-1">
          <i class="las la-check-circle"></i> Al finalizar el envío:
        </label>
        <input type="text" class="form-control form-control-sm mb-1" v-model="localForm.success_title" placeholder="Título éxito">
        <textarea class="form-control form-control-sm" v-model="localForm.success_message" rows="2" placeholder="Mensaje detalle"></textarea>
      </div>

      <div class="mt-3 p-2 bg-light border rounded">
        <label class="small fw-bold text-secondary d-block mb-2">Campos opcionales:</label>
        <div class="d-flex flex-wrap gap-3">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="localForm.show_phone" id="checkPhone">
            <label class="form-check-label small" for="checkPhone">Teléfono</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="localForm.show_consult" id="checkConsult">
            <label class="form-check-label small" for="checkConsult">Consulta</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" v-model="localForm.show_courses" id="checkCourses">
            <label class="form-check-label small fw-bold text-primary" for="checkCourses">Cursos</label>
          </div>
        </div>
      </div>

      <div v-if="localForm.show_courses" class="mt-3 p-3 border border-primary rounded shadow-sm" style="background-color: #f8fbff;">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <label class="small fw-bold text-primary m-0"><i class="las la-book"></i> Lista de Cursos</label>
          <span class="badge bg-primary rounded-pill">{{ localForm.courses_list?.length || 0 }} guardados</span>
        </div>
        <p class="text-muted mb-3" style="font-size: 0.75rem; line-height: 1.2;">
          Los cursos se guardarán en la configuración para cargar rápido sin hacer consultas extra.
        </p>
        <button class="btn btn-sm btn-primary w-100 fw-bold" @click="fetchCourses" :disabled="loadingCourses">
          <i v-if="loadingCourses" class="las la-spinner la-spin"></i>
          <i v-else class="las la-sync-alt"></i>
          {{ loadingCourses ? 'Obteniendo cursos...' : 'Actualizar Cursos desde BD' }}
        </button>
      </div>

    </div>
  </div>
</template>