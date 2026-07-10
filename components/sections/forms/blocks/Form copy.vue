<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import HttpClient from '../../../../helpers/http-client';

const props = defineProps<{
  themeColor: string;
  linkColor: string; 
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
    show_courses?: boolean;
    courses_list?: any[];
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
  curso_seleccionado: '', 
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
        curso_interes: props.config.show_courses ? formData.value.curso_seleccionado : '', 
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
      estudios_superiores: '', consulta: '', curso_seleccionado: '',
      acepta_condiciones: false, acepta_publicidad: false, condition:'https://www.ue.edu.pe/pregrado/politica-de-privacidad'
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
    
    <div class="row g-3 mb-3">
      
      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.first_name" @input="validateLetters('first_name')" placeholder="Nombres" required>
      </div>
      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.apellido_paterno" @input="validateLetters('apellido_paterno')" placeholder="Apellido paterno" required>
      </div>

      <div class="col-12 col-sm-6">
        <input type="text" class="form-control" v-model="formData.apellido_materno" @input="validateLetters('apellido_materno')" placeholder="Apellido materno" required>
      </div>
      
      <div :class="config.show_phone ? 'col-12 col-sm-6' : 'col-12'">
        <input type="email" class="form-control" v-model="formData.email" placeholder="Correo electrónico" required>
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
            class="form-control doc-input" 
            v-model="formData.numero_documento" 
            @input="validateDocument" 
            placeholder="Número" 
            required
          >
        </div>
      </div>

      <div v-if="config.show_phone" class="col-12 col-sm-6">
        <input type="tel" inputmode="numeric" class="form-control" v-model="formData.phone" @input="validatePhone" placeholder="Teléfono celular" required>
      </div>
      
    </div> <div class="col-12 mb-3">
      <select class="form-select" v-model="formData.estudios_superiores" required :class="{ 'text-placeholder': formData.estudios_superiores === '' }">
        <option value="Ninguno" disabled selected>Estudios superiores...</option>
        <option class="text-dark" value="Técnicos completos">Técnicos completos</option>
        <option class="text-dark" value="Técnicos incompletos">Técnicos incompletos</option>
        <option class="text-dark" value="Universitarios incompletos">Universitarios incompletos</option>
        <option class="text-dark" value="Universitarios completos">Universitarios completos</option>
        <option class="text-dark" value="Sin Estudios Superiores">Sin Estudios Superiores</option>
      </select>
    </div>

    <div v-if="config.show_courses && config.courses_list && config.courses_list.length > 0" class="col-12 mb-3">
      <select class="form-select" v-model="formData.curso_seleccionado" required :class="{ 'text-placeholder': formData.curso_seleccionado === '' }">
        <option value="" disabled selected>Carrera de interés...</option>
        <option class="text-dark" v-for="curso in config.courses_list" :key="curso.id" :value="curso.name">
          {{ curso.name }}
        </option>
      </select>
    </div>

    <div v-if="config.show_consult" class="col-12 mb-3">
      <textarea class="form-control" v-model="formData.consulta" placeholder="¿Cuál es tu consulta?" rows="3"></textarea>
    </div>

    <div class="d-flex flex-column gap-2 mb-4 mt-4">
      <div class="form-check custom-check d-flex align-items-start gap-2">
        <input class="form-check-input mt-1 shadow-none" type="checkbox" id="condiciones" v-model="formData.acepta_condiciones">
        <label class="form-check-label text-light" for="condiciones">
           <a :href="formData.condition" target="_blank" :style="{ color: linkColor }" class="text-decoration-underline fw-medium">Acepto las condiciones de tratamiento para mis datos personales</a>
        </label>
      </div>

      <div class="form-check custom-check d-flex align-items-start gap-2">
        <input class="form-check-input mt-1 shadow-none" type="checkbox" id="publicidad" v-model="formData.acepta_publicidad">
        <label class="form-check-label text-light" for="publicidad">
          Autorizo a UESAN a utilizar mis datos para el envío de publicidad sobre los servicios educativos y actividades que brinda, así como la realización de encuestas de satisfacción al cliente.
        </label>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button 
        type="submit" 
        class="btn text-white fw-bold px-5 py-2 border-0 transition-all text-uppercase w-100" 
        :style="{ backgroundColor: themeColor, borderRadius: '8px' }"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isSubmitting ? 'ENVIANDO...' : (config.button_text || 'ENVIAR') }}
      </button>
    </div>
  </form>
</template>

<style scoped>
/* --- ESTILOS BASE INPUTS --- */
.form-control, .form-select {
  border: 1px solid #ced4da; 
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #212529; 
  background-color: #fff;
  transition: border-color 0.2s ease-in-out;
}

.form-control::placeholder {
  color: #686969;
  opacity: 1;
}

.text-placeholder {
  color: #686969 !important;
}

.form-control:focus, .form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  outline: 0;
}

/* --- ESTILOS INPUT DNI COMBINADO --- */
.input-group {
  border: 1px solid #ced4da;
  border-radius: 6px;
  overflow: hidden; 
  display: flex;
}

.input-group .form-select.doc-select {
  border: none;
  border-radius: 0;
  border-right: 1px solid #ced4da;
  max-width: 90px;
  padding-right: 30px; 
  background-color: white;
}

.input-group .form-control.doc-input {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.input-group:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
.input-group:focus-within .form-select,
.input-group:focus-within .form-control {
  box-shadow: none; 
}

/* --- ESTILOS CHECKS --- */
.custom-check label {
  font-size: 0.9rem;
  line-height: 1.3;
}
.custom-check .form-check-input {
  cursor: pointer;
  border-color: #ced4da;
}
/* El checkbox pintado se adapta al themeColor por si no usas primary */
.custom-check .form-check-input:checked {
  background-color: v-bind(themeColor); 
  border-color: v-bind(themeColor);
}

/* --- BOTÓN --- */
.btn {
  letter-spacing: 0.5px;
}
.btn:hover:not(:disabled) {
  filter: brightness(0.9);
  transform: translateY(-1px);
}
</style>  