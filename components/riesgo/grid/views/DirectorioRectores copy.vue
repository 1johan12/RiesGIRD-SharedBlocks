<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatImageUrl } from '@/helpers/url'; 
import ModalTeamUniversity from '../modal/ModalTeamUniversity.vue'; 

// 1. Interfaces de Estructura de Datos Estricta
interface BlockData {
  title?: string;
  introText?: string;
  limit?: number | string;
}

interface RectorMember {
  id: number;
  university_id: number;
  position_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo_url: string;
  university_logo_url?: string;
  university_logo?: string;
  university_name: string;
}

const props = defineProps<{
  data: BlockData | null
}>();

// --- CONFIGURACIÓN DE FILTROS DEL BLOQUE ---
const title = computed(() => props.data?.title || 'Directorio');
const introText = computed(() => props.data?.introText || 'Sección destinada al registro y archivo oficial de las actividades, acuerdos y reuniones sostenidas por los directivos en el marco de la red.');
const limit = computed(() => Number(props.data?.limit) || 4);

// --- ESTADOS REACTIVOS TIPADOS ---
const items = ref<RectorMember[]>([]);
const pending = ref(false);

// --- CONTROL DEL DIÁLOGO INDEPENDIENTE ---
const isModalOpen = ref(false);
const selectedRector = ref<RectorMember | null>(null);

/**
 * 🛰️ CONSULTA 1: Listado de Rectores (hierarchy_level=1) consumiendo Fastify
 */
const fetchDirectorioFromFastify = async () => {
  pending.value = true;
  try {
    const url = `https://api.redgirdaccperu.edu.pe/api/public/teams?hierarchy_level=1&limit=${limit.value}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const resData = await response.json();
      const records = resData?.data || resData || [];

      console.log("Respuesta de Fastify para Rectores:", resData);
      
      if (records.length > 0) {
        items.value = records;
      } else {
        injectMockRectores(); 
      }
    } else {
      injectMockRectores();
    }
  } catch (error) {
    console.error("Error consumiendo la API de Directorio Fastify:", error);
    injectMockRectores(); 
  } finally {
    pending.value = false;
  }
};

const openTeamModal = (rector: RectorMember) => {
  selectedRector.value = {
    ...rector,
    university_id: Number(rector.university_id), 
    university_name: rector.university_name,
    university_logo_url: rector.university_logo_url || rector.university_logo
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedRector.value = null;
};

// Inyección limpia de contingencia para entornos locales / SSG
const injectMockRectores = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window;
  if (!isNuxtEnvironment) {
    items.value = [
      { id: 1, university_id: 10, position_name: 'Rector UPT', first_name: 'Hugo Cirilo', last_name: 'Calizaya Calizaya', email: 'rectorado@upt.edu.pe', phone: '---', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200', university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_del_CIP.png', university_name: 'Universidad Privada de Tacna' },
      { id: 2, university_id: 20, position_name: 'Rectora UNTELS', first_name: 'Gladys Marcionila', last_name: 'Cruz Yupanqui', email: 'rectorado@untels.edu.pe', phone: '905452206', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo-bid-es.png', university_name: 'Universidad Nacional Tecnológica de Lima Sur' }
    ].slice(0, limit.value);
  } else {
    items.value = [];
  }
};

watch([limit], () => {
  fetchDirectorioFromFastify();
}, { immediate: true });
</script>

<template>
  <section class="directorio-section">
    <h2 class="section-title" v-if="title">{{ title }}</h2>
    
    <p class="intro-text" v-if="introText">{{ introText }}</p>

    <div v-if="pending" class="loading-state py-5">
      <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
      <span class="small fw-bold text-slate">Sincronizando autoridades con Fastify...</span>
    </div>

    <div v-else-if="items.length > 0" class="directorio-grid">
      <div 
        v-for="(persona, index) in items" 
        :key="persona.id || index" 
        class="directorio-card clickable-card"
        @click="openTeamModal(persona)"
      >
        
        <div class="photo-block" @click.stop>
          <div class="avatar-wrapper">
            <img 
              v-if="persona.photo_url"
              :src="formatImageUrl(persona.photo_url)" 
              :alt="`${persona.first_name} ${persona.last_name}`" 
              class="director-img" 
            />
            <div v-else class="placeholder-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="user-placeholder-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            
            <div class="institution-logo-badge" v-if="persona.university_logo_url || persona.university_logo">
              <img :src="formatImageUrl(persona.university_logo_url || persona.university_logo)" alt="Logo Universidad" class="badge-img" />
            </div>
          </div>
        </div>

        <div class="divider-bicolor-vertical">
          <div class="sub-linea-azul"></div>
          <div class="sub-linea-roja"></div>
        </div>

        <div class="info-block">
          <span class="cargo-tag" v-if="persona.position_name">{{ persona.position_name }}</span>
          <h3 class="director-name">{{ persona.first_name }} {{ persona.last_name }}</h3>
          
          <div class="contact-details">
            <div class="contact-item" v-if="persona.email">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="contact-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span class="contact-text text-truncate">{{ persona.email }}</span>
            </div>

            <div class="contact-item" v-if="persona.phone && persona.phone !== '---'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="contact-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.5-4.5c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span class="contact-text">{{ persona.phone }}</span>
            </div>
          </div>
          
          <span class="view-team-indicator mt-3 small fw-bold text-primary">
            <i class="bi bi-person-lines-fill me-1"></i> Ver Estructura Interna →
          </span>
        </div>

      </div>
    </div>

    <ModalTeamUniversity 
      :is-open="isModalOpen" 
      :university-data="selectedRector" 
      @close="closeModal" 
    />

  </section>
</template>

<style scoped>
.directorio-section { width: 100%; max-width: 1140px; margin: 0 auto; text-align: center; padding: 40px 20px; background: transparent; }
.section-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin-bottom: 20px; position: relative; display: inline-block; padding-bottom: 12px; }
.section-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(to right, #dc2626 50%, #1d4ed8 50%); border-radius: 2px; }
.intro-text { font-size: 1.05rem; color: #475569; line-height: 1.6; margin-bottom: 44px; max-width: 820px; margin-left: auto; margin-right: auto; }
.directorio-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%; }
.directorio-card { background-color: #ffffff; border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01); border: 1px solid #e2e8f0; text-align: left; }
.clickable-card { cursor: pointer; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s; }
.clickable-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); border-color: #cbd5e1; }
.photo-block { flex-shrink: 0; }
.avatar-wrapper { position: relative; width: 130px; height: 130px; }
.director-img { width: 100%; height: 100%; object-fit: cover; border-radius: 14px; position: relative; z-index: 2; background-color: #ffffff; border: 1px solid #f1f5f9; }
.placeholder-avatar { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #f8fafc; border-radius: 14px; z-index: 1; display: grid; place-items: center; border: 1px solid #e2e8f0; }
.user-placeholder-icon { width: 44px; height: 44px; color: #cbd5e1; }
.institution-logo-badge { position: absolute; bottom: -6px; left: -6px; width: 44px; height: 44px; background-color: #ffffff; border-radius: 10px; padding: 6px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12); z-index: 3; display: flex; justify-content: center; align-items: center; border: 1px solid #e2e8f0; }
.badge-img { max-width: 100%; max-height: 100%; object-fit: contain; }
.divider-bicolor-vertical { width: 3px; height: 110px; display: flex; flex-direction: column; flex-shrink: 0; border-radius: 4px; overflow: hidden; }
.sub-linea-azul { flex: 1; background-color: #1d4ed8; }
.sub-linea-roja { flex: 1; background-color: #dc2626; }
.info-block { flex: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.cargo-tag { font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; width: max-content; }
.director-name { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; line-height: 1.3; }
.contact-details { display: flex; flex-direction: column; gap: 6px; }
.contact-item { display: flex; align-items: center; gap: 8px; overflow: hidden; }
.contact-icon { width: 15px; height: 15px; color: #94a3b8; flex-shrink: 0; }
.contact-text { font-size: 0.85rem; color: #475569; }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.view-team-indicator { display: inline-flex; align-items: center; gap: 4px; opacity: 0.7; font-size: 0.82rem; transition: opacity 0.2s; }
.clickable-card:hover .view-team-indicator { opacity: 1; text-decoration: underline; }
.text-slate { color: #64748b; }

@media (max-width: 992px) { .directorio-grid { grid-template-columns: 1fr; gap: 20px; } }
@media (max-width: 520px) {
  .directorio-card { flex-direction: column; text-align: center; align-items: center; padding: 30px 20px; }
  .divider-bicolor-vertical { width: 80px; height: 3px; flex-direction: row; margin: 12px 0; }
  .cargo-tag { margin: 0 auto 6px auto; }
}
</style>