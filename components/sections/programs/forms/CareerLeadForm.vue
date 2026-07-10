<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import HttpClient from '@shared/helpers/http-client';

const props = defineProps<{
  themeColor: string;
  careerName: string;
  config: {
    campaign_id: number | null;
    title: string;
    subtitle: string;
    condition: string;
    button_text: string;
    success_title: string;
    success_message: string;
    show_phone: boolean;
    show_consult: boolean;
  };
}>();

const isSubmitting = ref(false);

const formData = ref({
  first_name: '',
  apellido_paterno: '',
  apellido_materno: '',
  tipo_documento: 'DNI',
  numero_documento: '',
  phone: '',
  email: '',
  estudios_superiores: '',
  consulta: '',
  acepta_condiciones: false,
  condition: 'https://www.ue.edu.pe/pregrado/politica-de-privacidad',
  acepta_publicidad: false
});



const validateLetters = (field: 'first_name' | 'apellido_paterno' | 'apellido_materno') => {
  formData.value[field] = formData.value[field].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};

const validatePhone = () => {
  let val = formData.value.phone.replace(/\D/g, ''); 
  if (val.length > 9) val = val.slice(0, 9);
  formData.value.phone = val;
};

const validateDocument = () => {
  let val = formData.value.numero_documento;
  if (formData.value.tipo_documento === 'DNI') {
    val = val.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
  } else if (formData.value.tipo_documento === 'CE') {
    val = val.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
  } else if (formData.value.tipo_documento === 'PAS') {
    val = val.replace(/[^a-zA-Z0-9]/g, ''); 
    if (val.length > 12) val = val.slice(0, 12);
  }
  formData.value.numero_documento = val;
};

const onDocumentTypeChange = () => {
  formData.value.numero_documento = '';
};


const submitForm = async () => {
  if (!formData.value.acepta_condiciones) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Debes aceptar las condiciones de tratamiento de datos para continuar.',
      confirmButtonColor: props.themeColor
    });
    return;
  }

  if (formData.value.tipo_documento === 'DNI' && formData.value.numero_documento.length < 8) {
    Swal.fire({ icon: 'warning', title: 'DNI Inválido', text: 'El DNI debe tener 8 dígitos.' });
    return;
  }
  
  if (props.config.show_phone && formData.value.phone.length < 9) {
    Swal.fire({ icon: 'warning', title: 'Celular Inválido', text: 'El celular debe tener al menos 9 dígitos.' });
    return;
  }

  isSubmitting.value = true;

  try {
    
    const pathArray = window.location.pathname.split('/').filter(p => p !== '');
    const currentSlug = pathArray.length > 0 ? pathArray[pathArray.length - 1] : '';

    const payloadForDB = {
      campaign_id: props.config.campaign_id, 
      first_name: formData.value.first_name.trim(),
      last_name: `${formData.value.apellido_paterno.trim()} ${formData.value.apellido_materno.trim()}`,
      email: formData.value.email.trim(),
      phone: props.config.show_phone ? formData.value.phone : '',
      
      
      slug_carrera: currentSlug, 

      payload: {
        tipo_documento: formData.value.tipo_documento,
        numero_documento: formData.value.numero_documento,
        estudios_superiores: formData.value.estudios_superiores,
        consulta: props.config.show_consult ? formData.value.consulta.trim() : '',
        programa_origen: props.careerName,
        acepta_publicidad: formData.value.acepta_publicidad,
        
        url_slug: currentSlug 
      }
    };

    const response = await HttpClient.post('leads', payloadForDB, {
      headers: {
        'IdentifyAcademicUnit': currentSlug 
      }
    });

    Swal.fire({
      icon: 'success',
      title: props.config.success_title || '¡Datos enviados!',
      text: props.config.success_message || response.data?.message || 'Nos contactaremos pronto.',
      confirmButtonColor: props.themeColor
    });

    
    formData.value = {
      first_name: '', apellido_paterno: '', apellido_materno: '',
      tipo_documento: 'DNI', numero_documento: '', phone: '', email: '', 
      estudios_superiores: '', consulta: '', acepta_condiciones: false, acepta_publicidad: false, condition:'https://www.ue.edu.pe/pregrado/politica-de-privacidad'
    };

  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Hubo un problema al enviar tus datos. Inténtalo más tarde.';
    Swal.fire({ 
      icon: 'error', 
      title: 'Error', 
      text: errorMsg 
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form id="comunicate" @submit.prevent="submitForm" class="lead-form">
    <div class="row g-2 mb-3">
      
      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.first_name" @input="validateLetters('first_name')" placeholder="Nombres" required>
      </div>
      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.apellido_paterno" @input="validateLetters('apellido_paterno')" placeholder="Apellido Paterno" required>
      </div>

      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.apellido_materno" @input="validateLetters('apellido_materno')" placeholder="Apellido Materno" required>
      </div>
      <div class="col-12 col-sm-6">
        <div class="input-group">
          <select class="form-select doc-select" v-model="formData.tipo_documento" @change="onDocumentTypeChange">
            <option value="DNI">DNI</option>
            <option value="CE">CE</option>
            <option value="PAS">PAS</option>
          </select>
          <input 
            type="text" 
            :inputmode="formData.tipo_documento !== 'PAS' ? 'numeric' : 'text'" 
            class="form-control" 
            v-model="formData.numero_documento" 
            @input="validateDocument" 
            placeholder="Número" 
            required
          >
        </div>
      </div>

      <div v-if="config.show_phone" class="col-12 col-sm-6">
        <input type="tel" inputmode="numeric" class="form-control" v-model="formData.phone" @input="validatePhone" placeholder="Celular" required>
      </div>
      
      <div :class="config.show_phone ? 'col-12 col-sm-6' : 'col-12'">
        <input type="email" class="form-control" v-model="formData.email" placeholder="Email" required>
      </div>

      <div class="col-12">
        <select class="form-select" v-model="formData.estudios_superiores" required>
          <option value="" disabled selected>Estudios superiores...</option>
          <option value="Universitarios Incompletos">Universitarios Incompletos</option>
          <option value="Universitarios Completos">Universitarios Completos</option>
          <option value="Técnicos">Técnicos</option>
          <option value="Ninguno">Ninguno</option>
        </select>
      </div>

      <div v-if="config.show_consult" class="col-12">
        <textarea class="form-control" v-model="formData.consulta" placeholder="Déjanos una consulta" rows="3"></textarea>
      </div>
    </div>

    <div class="d-flex flex-column gap-2 mb-4">
      <div class="form-check custom-check d-flex align-items-start gap-2">
        <input class="form-check-input mt-1" type="checkbox" id="condiciones" v-model="formData.acepta_condiciones">
        <label class="form-check-label text-muted" for="condiciones">
          Acepto las <a :href="formData.condition" target="_blank" :style="{ color: themeColor }" class="text-decoration-none">condiciones de tratamiento para mis datos personales</a>
        </label>
      </div>

      <div class="form-check custom-check d-flex align-items-start gap-2">
        <input class="form-check-input mt-1" type="checkbox" id="publicidad" v-model="formData.acepta_publicidad">
        <label class="form-check-label text-muted" for="publicidad">
          Autorizo a UESAN a utilizar mis datos para el envío de publicidad sobre los servicios educativos y actividades que brinda, así como la realización de encuestas de satisfacción al cliente.
        </label>
      </div>
    </div>

    <button 
      type="submit" 
      class="btn w-100 text-white fw-bold py-2 shadow-sm border-0 transition-all" 
      :style="{ backgroundColor: themeColor, borderRadius: '6px' }"
      :disabled="isSubmitting"
    >
      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      {{ isSubmitting ? 'Enviando...' : (config.button_text || 'Enviar mis datos') }}
    </button>
  </form>
</template>

<style scoped>
.form-control, .form-select {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  color: #495057;
}
.form-control::placeholder {
  color: #6c757d;
  opacity: 0.8;
}
.form-control:focus, .form-select:focus {
  border-color: #b0b0b0;
  box-shadow: none;
  z-index: 1;
}
.doc-select {
  max-width: 85px;
  padding-right: 24px; 
}
.custom-check label {
  font-size: 0.8rem;
  line-height: 1.4;
}
.custom-check .form-check-input {
  cursor: pointer;
}
.btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
</style>