<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import HttpClient from "@/helpers/http-client"; 
import { useAuthStore } from "@/stores/auth"; 

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();

const localForm = ref({
  campaign_id: props.modelValue?.campaign_id || null,
  title: props.modelValue?.title || 'Comunícate',
  subtitle: props.modelValue?.subtitle || 'Déjanos tus datos y un asesor absolverá tus dudas.',
  condition: props.modelValue?.condition || 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
  button_text: props.modelValue?.button_text || 'Enviar mis datos',
  success_title: props.modelValue?.success_title || '¡Solicitud enviada!',
  success_message: props.modelValue?.success_message || 'Un asesor se pondrá en contacto contigo muy pronto.',
  show_phone: props.modelValue?.show_phone ?? true,
  show_consult: props.modelValue?.show_consult ?? true
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
      params: {
        academic_unit_id: authStore.academicUnitId 
      }
    });
    
    campaigns.value = response.data.data || response.data;
  } catch (e) {
    console.error("Error al cargar campañas", e);
  } finally {
    loading.value = false;
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
        <i class="las la-form"></i> Personalización del Formulario
      </h6>
      
      <div class="bg-light p-2 rounded mb-3 border">
        <label class="small fw-bold text-primary d-block mb-1">Campaña Marketing</label>
        
        <select 
          class="form-select form-select-sm" 
          v-model="localForm.campaign_id" 
          :disabled="loading"
        >
          <option :value="null">-- Selecciona una campaña --</option>
          <option v-for="camp in campaigns" :key="camp.id" :value="camp.id">
            {{ camp.name }}
          </option>
        </select>
        
        <small v-if="loading" class="text-muted mt-1 d-block">
          <i class="las la-spinner la-spin"></i> Cargando campañas...
        </small>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="small text-muted mb-1">Título Form</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.title">
        </div>
        <div class="col-6">
          <label class="small text-muted mb-1">Texto Botón</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.button_text">
        </div>
        <div class="col-12">
          <label class="small text-muted mb-1">Subtítulo</label>
          <textarea class="form-control form-control-sm" v-model="localForm.subtitle" rows="2"></textarea>
        </div>
        <div class="col-12">
          <label class="small text-muted mb-1">Link de términos y condiciones</label>
          <input type="text" class="form-control form-control-sm" v-model="localForm.condition">
        </div>
      </div>

      <div class="p-2 border rounded mb-0" style="background-color: #f0fff4;">
        <label class="small fw-bold text-success d-block mb-1"><i class="las la-check-circle"></i> Al finalizar el envío:</label>
        <input type="text" class="form-control form-control-sm mb-1" v-model="localForm.success_title" placeholder="Título éxito">
        <textarea class="form-control form-control-sm" v-model="localForm.success_message" rows="2" placeholder="Mensaje detalle"></textarea>
      </div>

      <div class="mt-3 d-flex gap-3">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="localForm.show_phone" id="checkPhone">
          <label class="form-check-label small" for="checkPhone">Teléfono</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" v-model="localForm.show_consult" id="checkConsult">
          <label class="form-check-label small" for="checkConsult">Consulta</label>
        </div>
      </div>

    </div>
  </div>
</template>