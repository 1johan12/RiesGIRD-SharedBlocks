<template>
  <div class="card h-100 border-0 shadow-sm product-card hover-up">
    
    <div class="position-relative overflow-hidden card-img-top-wrapper" style="height: 200px;">
      
      <div v-if="data.status_label" class="ribbon-wrapper">
        <div class="ribbon" :class="getRibbonClass(data.status_label)">
          <span>{{ data.status_label }}</span>
        </div>
      </div>
      
      <img :src="resolveImage(data.image)" 
           class="w-100 h-100 object-fit-cover transition-transform" 
           alt="Portada Curso"
           @error="handleImageError">
      
      <div class="overlay-hover"></div>
    </div>
    
    <div class="card-body d-flex flex-column p-0">
      
      <div class="p-3 bg-white" style="flex: 1;">
        <h6 class="course-title mb-2 fw-bold" style="min-height: 2.5em; line-height: 1.3;">
          <router-link :to="data.link" class="text-decoration-none hover-primary stretched-link">
            {{ data.title }}
          </router-link>
        </h6>
        
        <div class="d-flex align-items-center mt-3" v-if="data.teacher">
          <img :src="resolveImage(data.teacher.image, true)" 
               class="rounded-circle me-2 border" width="30" height="30">
          <small class="text-muted fw-bold" style="font-size: 0.75rem;">{{ data.teacher.name }}</small>
        </div>
      </div>

      <div class="d-flex border-top bg-light">
        <div class="flex-fill p-2 border-end text-center">
          <small class="d-block text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Inicio</small>
          <span class="fw-bold text-dark small">{{ data.startDate || 'Por definir' }}</span>
        </div>
        <div class="flex-fill p-2 text-center">
          <small class="d-block text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Duración</small>
          <span class="fw-bold text-dark small">{{ data.duration || 'N/A' }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

const BACKEND_URL = import.meta.env.VITE_API_URL

const props = defineProps<{
  data: {
    title: string;
    link: string;
    image: string | null; 
    status_label?: string; 
    startDate?: string;
    duration?: string;
    teacher?: { name: string; image: string | null; };
  }
}>();

/**
 * 🛠️ FUNCIÓN MAESTRA PARA CORREGIR RUTAS
 * Analiza por qué no sale la imagen y devuelve la ruta correcta.
 */
const resolveImage = (path: string | null | undefined, isAvatar = false) => {
  
  if (!path) {
    return isAvatar 
      ? 'https://ui-avatars.com/api/?background=random&name=User' 
      : 'https://placehold.co/600x400?text=Sin+Imagen';
  }

  
  if (path.includes('placeholder-course.jpg')) {
      return 'https://placehold.co/600x400?text=Curso+Disponible';
  }

  
  if (path.startsWith('http')) {
    return path;
  }

  
  if (path.startsWith('/storage')) {
    
    return `${BACKEND_URL}${path}`;
  }

  
  return path;
};


const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Error+Carga';
};


const getRibbonClass = (status?: string) => {
  if (!status) return 'ribbon-red';
  const s = status.toUpperCase(); 

  if (['OPEN', 'DISPONIBLE', 'INSCRIPCIONES ABIERTAS'].includes(s)) return 'ribbon-green';
  if (['EN VENTA', 'RESERVADO', 'PREVENTA EXCLUSIVA'].includes(s)) return 'ribbon-yellow';
  if (['AGOTADO', 'CERRADO', 'CLOSED', 'XD'].includes(s)) return 'ribbon-gray';
  if (['PRÓXIMAMENTE', 'COMING SOON'].includes(s)) return 'ribbon-blue';
  
  return 'ribbon-red';
};
</script>

<style scoped>
/* Estilos Base */
.product-card { border-radius: 8px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; background: white; min-width: 0; }
.hover-up:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.hover-primary:hover { color: var(--bs-primary) !important; }
.object-fit-cover { object-fit: cover; }

/* Imagen */
.card-img-top-wrapper img { width: 100%; height: 200px; object-fit: cover; display: block; background-color: #f8f9fa; }

/* Ribbons */
.ribbon-wrapper { width: 85px; height: 88px; overflow: hidden; position: absolute; top: -3px; left: -3px; z-index: 10; }
.ribbon { font: bold 10px Sans-Serif; color: #fff; text-align: center; transform: rotate(-45deg); position: relative; padding: 5px 0; top: 15px; left: -30px; width: 120px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3); text-transform: uppercase; }

/* Colores */
.ribbon-red    { background: #dc3545; }
/*.ribbon-yellow { background: #ffc107; color: #000; }*/
.ribbon-yellow { background: #ffc107; }
.ribbon-green  { background: #198754; }
.ribbon-blue   { background: #0dcaf0; }
.ribbon-gray   { background: #6c757d; }
</style>