<template>
  <div class="col-lg-12">
    <router-link :to="data.link" class="item card-product-wao" :title="data.title">
      <div class="course-one__single-wao">
        
        <div class="course-image-section">
          <img 
            :src="formatImageUrl(data.image_path || data.image_url)" 
            :alt="data.title"
            class="main-course-img"
          />
          <div class="image-gradient-overlay"></div>
          
          <div class="category-tag-floating" :style="{ '--bg-cat': data.categoryColor || '#0f6eb6' }">
            {{ data.categoryName || 'General' }}
          </div>

          <div v-if="data.status_course" class="ecommerce-ribbon-wao">
            <div class="ribbon-wao" :class="getNeonClass(data.status_course)">
              <span>{{ data.status_course }}</span>
            </div>
          </div>
        </div>

        <div class="course-one__content-wao">
          <div class="title-section">
            <h3 class="course-title" :style="{ '--accent-color': data.categoryColor || '#0f6eb6' }">
              {{ truncateTitle(data.title) }}
            </h3>
          </div>
          
          <div class="course-one__admin-wao">
            <div class="avatar-glow" :style="{ '--glow-color': data.categoryColor || '#0f6eb6' }">
              <img :src="data.teacher?.image || 'https://ui-avatars.com/api/?name=P'" alt="Docente">
            </div>
            <div class="admin-info">
              <span class="label-instructor text-uppercase">Instructor</span>
              <span class="teacher-name">{{ data.teacher?.name || 'Instructor Expert' }}</span>
            </div>
          </div>

          <div class="course-one__meta-wao">
            <div class="meta-col">
              <div class="meta-label"><i class="las la-calendar"></i> INICIO</div>
              <div class="meta-val">{{ data.startDate || 'Pronto' }}</div>
            </div>
            <div class="meta-col border-start-wao">
              <div class="meta-label"><i class="las la-clock"></i> DURACIÓN</div>
              <div class="meta-val">{{ data.duration || 'N/A' }}</div>
            </div>
          </div>
        </div>

        <div class="liquid-flash"></div> 
        <div class="tech-grid"></div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { formatImageUrl } from "@/helpers/url"; 

const props = defineProps<{
  data: {
    id: number;
    title: string;
    link: string | object;
    status_course?: string;
    startDate?: string;
    duration?: string;
    categoryName?: string;
    categoryColor?: string;
    image_url?: string; 
    image_path?: string; 
    teacher?: { name: string; image: string; };
  }
}>();
const truncateTitle = (text: string) => {
  return text.length > 40 ? text.substring(0, 37) + '...' : text;
};

const getNeonClass = (status?: string) => {
  const s = status?.toUpperCase() || '';
  if (['EN VENTA', 'OPEN'].includes(s)) return 'neon-green';
  if (['PREVENTA'].includes(s)) return 'neon-yellow';
  return 'neon-red';
};
</script>

<style scoped>
/* Contenedor Principal */
.course-one__single-wao {
  background: #ffffff;
  border-radius: 24px; /* Bordes más redondeados para diseño moderno */
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Sección de Imagen */
.course-image-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.main-course-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%);
  z-index: 1;
}

/* Etiquetas flotantes */
.category-tag-floating {
  position: absolute;
  bottom: 15px;
  left: 20px;
  z-index: 2;
  background: var(--bg-cat);
  color: white;
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Título */
.course-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
  line-height: 1.4;
  min-height: 56px; /* Para que todas las cartas midan igual */
}

/* Sección Instructor */
.course-one__admin-wao {
  margin: 15px 0 20px 0;
  padding-top: 15px;
  border-top: 1px dashed rgba(0,0,0,0.1);
}

.label-instructor {
  display: block;
  font-size: 9px;
  color: #a0aec0;
  font-weight: 700;
  margin-bottom: -2px;
}

/* Meta Datos */
.course-one__meta-wao {
  margin-top: auto; /* Empuja el footer siempre al fondo */
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  padding: 12px 18px;
  border-radius: 16px;
}

/* HOVERS */
.card-product-wao:hover .course-one__single-wao {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(15, 110, 182, 0.15);
  border-color: var(--accent-color);
}

.card-product-wao:hover .main-course-img {
  transform: scale(1.1) rotate(1deg);
}

/* El destello líquido se mantiene igual pero se ve mejor sobre la imagen */
</style>