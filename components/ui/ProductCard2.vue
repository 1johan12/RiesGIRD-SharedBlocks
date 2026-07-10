<template>
  <div class="col-lg-12">
    <router-link :to="data.link" class="item card-product-wao" :title="data.title" :style="{ '--accent-color': data.categoryColor || '#0f6eb6' }">
      <div class="course-one__single-wao">
        
        <div class="course-image-container">
          <img 
            :src="formatImageUrl(data.image_path )" 
            :alt="data.title" 
            class="course-img-top" 
          />
          
          <div class="image-overlay-tech"></div>
          <div class="tech-grid-overlay"></div>

          <div class="badge-category" :style="{ '--bg-cat': data.categoryColor || '#0f6eb6' }">
            {{ data.categoryName || 'General' }}
          </div>

          <div v-if="data.startDate" class="calendar-badge">
            <span class="day">{{ getDay(data.startDate) }}</span>
            <span class="month">{{ getMonth(data.startDate) }}</span>
          </div>

          <div v-if="data.status_course" class="ecommerce-ribbon-wao">
            <div class="ribbon-wao" :class="getNeonClass(data.status_course)">
              <span>{{ data.status_course }}</span>
            </div>
          </div>
        </div>

        <div class="course-one__content-wao">
          <div class="title-section">
            <h3 class="course-title" :style="{ '--accent-hover': data.categoryColor || '#0f6eb6' }">
              {{ truncateTitle(data.title) }}
            </h3>
          </div>

          <ul class="course-specs">
            <li>
              <i class="las la-clock"></i> 
              <span>{{ data.duration || 'Por definir' }}</span>
            </li>
            <li  >
              <i class="las la-terminal"></i>
              <span>
                {{ data.modality === 'Virtual' ? 'Virtual - En Vivo' : data.modality }}
              </span>
            </li>


            <li v-if="data.schedule" >
              <i class="las la-calendar-check"  ></i> 
              <span  >{{ data.schedule }}</span>
            </li>
          </ul>

          <div class="course-one__admin-wao">
            <div class="avatar-glow" :style="{ '--glow-color': data.categoryColor || '#0f6eb6' }">
              <img :src="data.teacher?.image || 'https://ui-avatars.com/api/?name=P'" alt="Docente">
            </div>
            <div class="teacher-info">
              <small class="instructor-label">Docente </small>
              <span class="teacher-name">{{ data.teacher?.name || 'Staff Académico' }}</span>
            </div>
          </div>
        </div>

        <div class="liquid-flash"></div>
        <div class="glow-corner"></div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { formatImageUrl } from "@/helpers/url";

const props = defineProps<{
  data: {
    id: number;
    title: string;
    image?: string;
    image_path?: string;
    image_url?: string;
    link: string | object;
    status_course?: string;
    startDate?: string;
    duration?: string;
    modality?: string;
    schedule?: string;
    categoryName?: string;
    categoryColor?: string;
    teacher?: { name: string; image: string; };
  }
}>();


const getDay = (dateStr: string) => {
  if (!dateStr) return '00';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '??' : date.getDate().toString().padStart(2, '0');
};

const getMonth = (dateStr: string) => {
  if (!dateStr) return '---';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '---' : date.toLocaleString('es', { month: 'short' }).replace('.', '');
};

const truncateTitle = (text: string) => {
  return text.length > 70 ? text.substring(0, 67) + '...' : text;
};

const getNeonClass = (status?: string) => {
  const s = status?.toUpperCase() || '';
  if (['EN VENTA', 'OPEN', 'PUBLICADO'].includes(s)) return 'neon-green';
  if (['PREVENTA', 'PROXIMAMENTE'].includes(s)) return 'neon-yellow';
  return 'neon-red';
};
</script>

<style scoped>
/* 1. CONTENEDOR PRINCIPAL */
.card-product-wao {
  display: block;
  text-decoration: none !important;
  height: 100%;
  perspective: 1000px;
}

.course-one__single-wao {
  background: #ffffff;
  border: 1px solid rgba(15, 110, 182, 0.1);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1;
}

/* 2. HEADER: IMAGEN Y ELEMENTOS FLOTANTES */
.course-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: #1a1a1a;
}

.course-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.8s ease;
}

.image-overlay-tech {
  position: absolute;
  inset: 0;
  /*background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 40%);*/
  background: linear-gradient(to top, rgba(255, 255, 255, 0.2) 0%, transparent 40%);
  z-index: 2;
}

.tech-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(15, 110, 182, 0.1) 1px, transparent 1px);
  background-size: 12px 12px;
  z-index: 1;
}

/* BADGE CALENDARIO */
.calendar-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border-radius: 10px;
  min-width: 50px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  z-index: 10;
  overflow: hidden;
}
.calendar-badge .day {
  display: block;
  font-size: 1.3rem;
  font-weight: 900;
  color: #1a1a1a;
  padding: 5px 5px 0 5px;
  line-height: 1;
}
.calendar-badge .month {
  display: block;
  background: #f1f5f9;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 800;
  padding: 3px 0;
  color: #64748b;
}

/* CATEGORIA BADGE */
.badge-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--bg-cat);
  color: white;
  padding: 5px 12px;
  font-size: 14px;
  font-weight: 800;
  border-radius: 6px;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 3. CUERPO DE LA TARJETA */
.course-one__content-wao {
  padding: 15px 22px 22px 22px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 15px;
  min-height: 52px;
  transition: color 0.3s ease;
}

.course-specs {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}
.course-specs li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 500;
}
.course-specs i {
  color: #0f6eb6;
  font-size: 1.1rem;
}

/* 4. INSTRUCTOR SECTION */
.course-one__admin-wao {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
}

.avatar-glow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 2px;
  border: 2px solid var(--glow-color);
  box-shadow: 0 0 10px var(--glow-color);
}
.avatar-glow img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.instructor-label {
  font-size: 9px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
}
.teacher-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

/* 5. RIBBONS Y ANIMACIONES */
.ecommerce-ribbon-wao {
  position: absolute;
  bottom: 12px;
  right: -5px;
  z-index: 10;
}
.ribbon-wao {
  padding: 3px 12px;
  font-size: 14px;
  font-weight: 900;
  color: #fff;
  border-radius: 4px 0 0 4px;
}
.neon-green { background: #00d26a; box-shadow: 0 0 10px rgba(0,210,106,0.4); }
.neon-yellow { background: #ffb300; box-shadow: 0 0 10px rgba(255,179,0,0.4); }
.neon-red { background: #ff3e3e; box-shadow: 0 0 10px rgba(255,62,62,0.4); }

.liquid-flash {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: skewX(-25deg);
  z-index: 5;
}

/* HOVERS */
.card-product-wao:hover .course-one__single-wao {
  transform: translateY(-10px) rotateX(2deg);
  box-shadow: 0 20px 40px rgba(15, 110, 182, 0.15);
  border-color: var(--accent-color) !important;
}

.card-product-wao:hover .course-img-top {
  transform: scale(1.1);
}

.card-product-wao:hover .liquid-flash {
  animation: flashSweep 0.8s ease-in-out forwards;
}

.card-product-wao:hover .course-title {
  color: var(--accent-hover);
}

@keyframes flashSweep {
  0% { left: -100%; }
  100% { left: 200%; }
}
</style>