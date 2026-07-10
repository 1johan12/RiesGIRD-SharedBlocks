<script setup lang="ts">
import { ref, watch, computed } from 'vue';

// 1. Interfaces Estrictas para TypeScript
interface UniversityProp {
  university_id: number;
  university_name: string;
  university_logo_url?: string; // 🎯 Recibe el escudo real cruzado desde Fastify
  university_logo?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  photo_url?: string;
}

interface TeamMember {
  id: number;
  type: 'Rector' | 'Secretario Técnico' | 'Persona de Contacto';
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  phone?: string;
}

const props = defineProps<{
  isOpen: boolean;
  universityData: UniversityProp | null; 
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const teamMembers = ref<TeamMember[]>([]);
const loadingTeam = ref(false);

// Helper de formateo de imágenes locales de almacenamiento
const formatImageUrl = (url: string | undefined): string => {
  if (!url) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&h=250&q=80';
  if (url.startsWith('http')) return url;
  return `http://127.0.0.1:4000/storage/${url}`;
};

/* =========================================================================
    FETCH API (FASTIFY)
   ========================================================================= */
const fetchTeamFromFastify = async (universityId: number) => {
  loadingTeam.value = true;
  teamMembers.value = [];

  try {
    const url = `http://localhost:4000/api/public/teams?university_id=${universityId}`;
    const response = await fetch(url);

    if (response.ok) {
      const resData = await response.json();
      const records = resData?.data || resData || [];
      console.log(resData);
      if (records.length > 0) {
        teamMembers.value = sortTeamByHierarchy(records);
      } else {
        injectMockTeam();
      }
    } else {
      injectMockTeam();
    }
  } catch (error) {
    console.error('Error cargando equipo institucional:', error);
    injectMockTeam();
  } finally {
    loadingTeam.value = false;
  }
};

/* =========================================================================
    ORDEN Y JERARQUÍA EXIGIDA
   ========================================================================= */
const sortTeamByHierarchy = (members: TeamMember[]): TeamMember[] => {
  const order: Record<string, number> = {
    'Rector': 1,
    'Secretario Técnico': 2,
    'Persona de Contacto': 3
  };
  return [...members].sort((a, b) => (order[a.type] || 9) - (order[b.type] || 9));
};

/* =========================================================================
    COMPUTED PROPERTIES (ACCESO REALTTIME DE TU ESQUELETO)
   ========================================================================= */
const currentRector = computed(() =>
  teamMembers.value.find(m => m.type === 'Rector')
);

const secretario = computed(() =>
  teamMembers.value.find(m => m.type === 'Secretario Técnico')
);

const contactos = computed(() =>
  teamMembers.value.filter(m => m.type === 'Persona de Contacto')
);

const getTypeThemeClass = (type: string): string => {
  if (type === 'Rector') return 'theme-rector';
  if (type === 'Secretario Técnico') return 'theme-secretario';
  return 'theme-contacto';
};

/* =========================================================================
    MOCK DATA DE CONTINGENCIA (Poblado con imágenes reales para maquetar)
   ========================================================================= */
const injectMockTeam = () => {
  teamMembers.value = [
    {
      id: 201,
      type: 'Rector',
      first_name: props.universityData?.first_name || 'Hugo Cirilo',
      last_name: props.universityData?.last_name || 'Calizaya Calizaya',
      email: props.universityData?.email || 'rectorado@upt.edu.pe',
      photo_url: props.universityData?.photo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 202,
      type: 'Secretario Técnico',
      first_name: 'Gabriela',
      last_name: 'Mallqui',
      email: 'gamallqui@uncp.edu.pe',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150', 
      phone: 'Anexo 4102'
    },
    {
      id: 203,
      type: 'Persona de Contacto',
      first_name: 'Sofía',
      last_name: 'Castro Luna',
      email: 'scastro@universidad.edu.pe',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 
      phone: '987-654-321'
    },
    {
      id: 204,
      type: 'Persona de Contacto',
      first_name: 'Carlos',
      last_name: 'Mendoza',
      email: 'cmendoza@universidad.edu.pe',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 
      phone: '987-123-456'
    }
  ];
};

const closeModal = () => {
  emit('close');
  teamMembers.value = [];
};

watch(
  () => props.isOpen,
  (val) => {
    if (val && props.universityData) {
      fetchTeamFromFastify(props.universityData.university_id);
    }
  }
);
</script>

<template>
  <Teleport to="body">
  <transition name="fade">
    <div v-if="isOpen && universityData" class="backdrop" @click.self="closeModal">
      <div class="modal">
        
        <div class="header">
          <div class="header-identity-wrapper">
            <div class="modal-university-logo-container" v-if="universityData.university_logo_url || universityData.university_logo">
              <img :src="universityData.university_logo_url || universityData.university_logo" :alt="universityData.university_name" class="modal-logo-img" />
            </div>
            
            <div class="title-block">
              <h2>{{ universityData.university_name }}</h2>
              <p class="subtitle">Directorio Oficial de la Red</p>
            </div>
          </div>

          <button class="close-btn" @click="closeModal" title="Cerrar Ventana">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="width: 16px; height: 16px;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="divider"></div>

        <div class="body custom-scrollbar">
          
          <div v-if="loadingTeam" class="loading-container">
            <div class="spinner"></div>
            <p>Sincronizando con API Fastify...</p>
          </div>

          <div v-else class="layout-grid">
            
            <div class="left-panel">
              <div v-if="currentRector" class="rector-card-premium">
                <div class="image-wrapper">
                  <img :src="formatImageUrl(currentRector.photo_url)" :alt="currentRector.first_name" />
                  <div class="badge-role gold">MÁXIMA AUTORIDAD</div>
                </div>
                
                <div class="rector-info">
                  <span class="institution-tag">Rector de la Institución</span>
                  <h3>{{ currentRector.first_name }} {{ currentRector.last_name }}</h3>
                  
                  <a :href="`mailto:${currentRector.email}`" class="email-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" style="width:14px; height:14px; margin-right:4px;">
                      <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                      <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    {{ currentRector.email }}
                  </a>
                </div>
              </div>
            </div>

            <div class="right-panel">
              
              <div class="section-group" v-if="secretario">
                <div class="section-title text-slate">
                  <span class="dot slate"></span> Secretario Técnico
                </div>
                
                <div class="horizontal-card theme-secretario">
                  <div class="avatar-circle-container">
                    <img v-if="secretario.photo_url" :src="formatImageUrl(secretario.photo_url)" :alt="secretario.first_name" class="avatar-img-fit" />
                    <div v-else class="avatar-circle-fallback">
                      {{ secretario.first_name[0] }}{{ secretario.last_name[0] }}
                    </div>
                  </div>

                  <div class="card-details">
                    <h4>{{ secretario.first_name }} {{ secretario.last_name }}</h4>
                    <div class="meta-row">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px; height:13px; margin-right:2px; vertical-align:text-bottom;">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        {{ secretario.email }}
                      </span>
                      <span v-if="secretario.phone">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:13px; height:13px; margin-right:2px; vertical-align:text-bottom;">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.5-4.5c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        {{ secretario.phone }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section-group" v-if="contactos.length > 0">
                <div class="section-title text-red">
                  <span class="dot red"></span> Comité Técnico de Enlace
                </div>
                
                <div class="contacts-grid">
                  <div 
                    v-for="c in contactos" 
                    :key="c.id" 
                    class="horizontal-card"
                    :class="getTypeThemeClass(c.type)"
                  >
                    <div class="avatar-circle-container">
                      <img v-if="c.photo_url" :src="formatImageUrl(c.photo_url)" :alt="c.first_name" class="avatar-img-fit" />
                      <div v-else class="avatar-circle-fallback variant-red">
                        {{ c.first_name[0] }}{{ c.last_name[0] }}
                      </div>
                    </div>

                    <div class="card-details">
                      <h5>{{ c.first_name }} {{ c.last_name }}</h5>
                      <div class="meta-row stack">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:12px; height:12px; margin-right:2px; vertical-align:text-bottom;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                          {{ c.email }}
                        </span>
                        <span v-if="c.phone" class="phone-tag">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:12px; height:12px; margin-right:2px; vertical-align:text-bottom;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.5-4.5c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                          {{ c.phone }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
  </Teleport>
</template>

<style scoped>
/* =========================================================================
    DISEÑO DE INTERFAZ DE ALTA GAMA (CONSERVANDO TU ESENCIA 1:1)
   ========================================================================= */

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 99999;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);

  overflow: hidden;
}

.modal {
  width: min(980px, calc(100vw - 40px));
  max-height: 85vh;

  background: #fff;
  border-radius: 24px;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  position: relative;

  transform: none;
  margin: 0;

  animation: modalScale 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScale {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* 🎯 CORRECCIÓN DEL HEADER: Inyección y alineación del Escudo de la Universidad */
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 28px; background: #ffffff;
}

.header-identity-wrapper {
  display: flex; align-items: center; gap: 18px;
}

.modal-university-logo-container {
  width: 60px; height: 60px; background-color: #ffffff;
  border: 1px solid #e2e8f0; border-radius: 14px; padding: 6px;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); flex-shrink: 0;
}

.modal-logo-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }

.title-block h2 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; letter-spacing: -0.3px; }
.subtitle { font-size: 0.82rem; color: #64748b; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }

.close-btn {
  background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center; color: #64748b; cursor: pointer; transition: all 0.2s ease;
}
.close-btn:hover { background: #e2e8f0; color: #0f172a; }

.divider { height: 4px; background: linear-gradient(to right, #25529a 40%, #475569 70%, #db143c 100%); }

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.body { padding: 28px; overflow-y: auto; background: #f8fafc; }

/* 🎯 TU ESTRUCTURA ASIMÉTRICA DE PANELES COMPLETA */
.layout-grid { display: grid; grid-template-columns: 310px 1fr; gap: 28px; }

/* RECTOR CARD */
.rector-card-premium {
  background: #ffffff; border-radius: 18px; overflow: hidden;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02); border: 1px solid #e2e8f0;
}
.image-wrapper { position: relative; width: 100%; height: 280px; background: #f1f5f9; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.badge-role { position: absolute; bottom: 12px; left: 12px; font-size: 0.68rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; }
.badge-role.gold { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }

.rector-info { padding: 22px; text-align: center; }
.institution-tag { font-size: 0.72rem; color: #25529a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.rector-info h3 { font-size: 1.15rem; color: #1e293b; margin: 6px 0 10px 0; font-weight: 700; }
.email-link { font-size: 0.85rem; color: #64748b; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; width: 100%; }
.email-link:hover { color: #25529a; text-decoration: underline; }

/* PANELES DERECHA */
.section-group { margin-bottom: 24px; }
.section-title { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.text-slate { color: #475569; }
.text-red { color: #db143c; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.slate { background: #475569; }
.dot.red { background: #db143c; }

/* HORIZONTAL CARDS */
.horizontal-card {
  display: flex; align-items: center; gap: 16px; padding: 16px 20px;
  background: #ffffff; border-radius: 14px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01); border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.horizontal-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04); border-color: #cbd5e1; }

.theme-rector { border-left: 5px solid #25529a; }
.theme-secretario { border-left: 5px solid #475569; }
.theme-contacto { border-left: 5px solid #db143c; }

/* 🎯 CORRECCIÓN DE AVATARES: Encaje perfecto de imagen circular o iniciales de respaldo */
.avatar-circle-container {
  width: 46px; height: 46px; flex-shrink: 0; position: relative;
}
.avatar-img-fit {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
  border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.avatar-circle-fallback {
  width: 100%; height: 100%; border-radius: 50%;
  background: #f1f5f9; color: #475569; font-weight: 700; font-size: 0.9rem;
  display: grid; place-items: center; border: 1px solid #e2e8f0; text-transform: uppercase;
}
.avatar-circle-fallback.variant-red { background: #fef2f2; color: #db143c; border-color: #fee2e2; }

.card-details h4, .card-details h5 { font-size: 0.98rem; color: #1e293b; margin: 0 0 3px 0; font-weight: 700; }
.meta-row { display: flex; gap: 16px; font-size: 0.82rem; color: #64748b; font-weight: 500; }
.meta-row.stack { flex-direction: column; gap: 4px; }
.phone-tag { color: #475569; font-weight: 600; }

.contacts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.loading-container { text-align: center; padding: 60px 0; color: #64748b; font-size: 0.9rem; }
.spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #25529a; border-radius: 50%; margin: 0 auto 12px auto; animation: spin 0.8s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 840px) {
  .layout-grid { grid-template-columns: 1fr; }
  .contacts-grid { grid-template-columns: 1fr; }
}
</style>