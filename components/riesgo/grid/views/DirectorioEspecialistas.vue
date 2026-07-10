<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'
// Capa unificada de rutas planas importada desde tu archivo central
import { PUBLIC_API_URL } from '../../../../config/apiConfig'
import { formatImageUrl } from '../../../../../front/src/helpers/url.js';

interface BlockData {
  title?: string
  limit?: number | string
  forcedType?: string
  actionText?: string
  actionUrl?: string
}

export interface SpecialistMember {
  id: number
  university_id?: number
  position_id?: number | null
  first_name: string
  last_name: string
  position_name: string
  hierarchy_level: number
  email: string
  phone: string
  photo_url: string
  type: string | null        
  person_type: 'specialist' | 'board_member' | 'both' 
  location: string | null     
  university_name: string
  university_logo_url?: string
  university_logo?: string
}

const props = defineProps<{
  data: BlockData | null
  linkComponent?: any 
}>()

// 🔥 JSON ESTÁTICO MAESTRO DE DEPARTAMENTOS DEL PERÚ
const peru_departments = [
  'Amazonas', 'Ancash', 'Apurímac', 'Arequipa', 'Ayacucho', 
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
]

const title = computed(() => props.data?.title || 'Plana de Especialistas')
const initialLimit = computed(() => Number(props.data?.limit) || 6)

const actionText = computed(() => props.data?.actionText || 'Ver Más')
const actionUrl = computed(() => props.data?.actionUrl || '#')

const linkTag = computed(() => props.linkComponent || 'router-link')

const items = ref<SpecialistMember[]>([])
const pending = ref(false)
const limitRender = ref(initialLimit.value)

// 🔥 VARIABLES REACTIVAS DE FILTRADO LOCAL (FRONT-END)
const filtroUniversidad = ref('')
const filtroRegion = ref('')
const filtroCargo = ref('')

// 🔥 FUNCIÓN DEFENSIVA MUTIMEDIA: Sanea URLs duplicadas de la base de datos
const cleanImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (url.includes('http') && url.lastIndexOf('http') > 0) {
    return url.slice(url.lastIndexOf('http'))
  }
  return formatImageUrl(url)
}

/**
 * 🛰️ ACCESO ASÍNCRONO DIRECTO A FASTIFY ENDPOINT
 */
const fetchDirectorioEspecialistas = async () => {
  pending.value = true
  try {
    const url = `${PUBLIC_API_URL}/teams?person_type=specialist&limit=50`
    const response = await fetch(url)
    console.log('🔥 Fetching especialistas from Fastify:', url, response.status, response.ok)

    if (response.ok) {
      const resData = await response.json()
      items.value = resData?.data || resData || []
    } else {
      injectMockEspecialistas()
    }
  } catch (error) {
    console.error('Error devorando la plana de especialistas desde Fastify:', error)
    injectMockEspecialistas()
  } finally {
    pending.value = false
  }
}

const uniqueUniversities = computed(() => {
  const names = items.value.map(u => u.university_name).filter(Boolean)
  return [...new Set(names)].sort()
})

const uniquePositions = computed(() => {
  const positions = items.value.map(u => u.position_name).filter(Boolean)
  return [...new Set(positions)].sort()
})

// =============================================================================
// 🔥 MOTOR COMPUTADO INTECO: Filtra de manera cruzada 100% en caliente (UI)
// =============================================================================
const especialistasVisibles = computed(() => {
  if (!items.value) return []

  return items.value
    .filter(p => {
      const matchUni = !filtroUniversidad.value || p.university_name === filtroUniversidad.value
      const matchRegion = !filtroRegion.value || p.location === filtroRegion.value
      const matchCargo = !filtroCargo.value || p.position_name === filtroCargo.value
      return matchUni && matchRegion && matchCargo
    })
    .slice(0, limitRender.value)
})

const verMas = () => {
  limitRender.value += 4
}

const injectMockEspecialistas = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window
  if (!isNuxtEnvironment) {
    items.value = [
      {
        id: 101,
        university_id: 1,
        position_id: null,
        first_name: 'Carlos Alberto',
        last_name: 'Mendoza Riva',
        position_name: 'Especialista en Vulcanología',
        hierarchy_level: 5,
        university_name: 'UNSA',
        email: 'cmendoza@unsa.edu.pe',
        phone: '958412356',
        photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
        type: 'Persona de Contacto',
        person_type: 'specialist',
        location: 'Arequipa',
        university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Escudo_de_la_Universidad_Nacional_Mayor_de_San_Marcos.svg'
      },
      {
        id: 102,
        university_id: 2,
        position_id: null,
        first_name: 'Gabriela',
        last_name: 'Mallqui Ramos',
        position_name: 'Secretario Técnico',
        hierarchy_level: 2,
        university_name: 'UNCP',
        email: 'gmallqui@uncp.edu.pe',
        phone: '---',
        photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
        type: 'Secretario Técnico',
        person_type: 'both', 
        location: 'Junín',
        university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Escudo_de_la_Universidad_Nacional_Mayor_de_San_Marcos.svg'
      }
    ]
  } else {
    items.value = []
  }
}

watch(() => initialLimit.value, (newVal) => {
  limitRender.value = newVal
})

watch(() => initialLimit.value, () => {
  fetchDirectorioEspecialistas()
}, { immediate: true })
</script>

<template>
  <section class="directorio-section-wrapper">
    <div class="directorio-fluid-container">
      <SectionTitle v-if="title" :title="title" :padding-bottom="10" :padding-top="20" />

      <div class="filters-row-grid text mt-5">
        
        <div class="custom-select-filter-card">
          <select v-model="filtroUniversidad" class="native-dropdown-select">
            <option value="">Universidad</option>
            <option v-for="uni in uniqueUniversities" :key="uni" :value="uni">
              {{ uni }}
            </option>
          </select>
          <div class="arrow-visual-wrap">
            <div class="divider-vertical-red"></div>
            <svg class="chevron-arrow-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="custom-select-filter-card">
          <select v-model="filtroRegion" class="native-dropdown-select">
            <option value="">Región</option>
            <option v-for="dep in peru_departments" :key="dep" :value="dep">
              📍 {{ dep }}
            </option>
          </select>
          <div class="arrow-visual-wrap">
            <div class="divider-vertical-blue"></div>
            <svg class="chevron-arrow-svg text-blue-arrow" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="custom-select-filter-card">
          <select v-model="filtroCargo" class="native-dropdown-select">
            <option value="">Especialidad</option>
            <option v-for="pos in uniquePositions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>
          <div class="arrow-visual-wrap">
            <div class="divider-vertical-blue"></div>
            <svg class="chevron-arrow-svg text-blue-arrow" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>

      <div class="loader-box-wrap" v-if="pending">
        <div class="spinner-loader"></div>
        <span class="loader-text">Sincronizando plana de especialistas...</span>
      </div>

      <div v-else-if="especialistasVisibles.length > 0" class="authorities-cards-grid">
        <div
          v-for="(persona, index) in especialistasVisibles"
          :key="persona.id || index"
          class="authority-profile-card"
        >
          <div class="avatar-frame-box force-no-pointer">
            <img v-if="persona.photo_url" :src="cleanImageUrl(persona.photo_url)" :alt="persona.first_name" class="director-img-fit" />
            <div v-else class="avatar-placeholder">
              <i class="bi bi-person-fill avatar-placeholder__icon"></i>
            </div>

            <div class="university-crest-badge" v-if="persona.university_logo_url || persona.university_logo">
              <img :src="cleanImageUrl(persona.university_logo_url || persona.university_logo)" :alt="persona.university_name" class="crest-img" />
            </div>
          </div>

          <div class="authority-divider"></div>

          <div class="profile-info-side force-no-pointer">
            <span class="cargo-tag-underline">
              {{ persona.position_name }} — {{ persona.university_name }}
            </span>

            <h3 class="authority-fullname">
              {{ persona.first_name }} {{ persona.last_name }}
            </h3>

            <div class="contact-channels-list">
              <div class="channel-item-row" v-if="persona.location">
                <i class="bi bi-geo-alt-fill text-danger channel-icon"></i>
                <span class="channel-text fw-semibold text-dark">Sede: {{ persona.location }}</span>
              </div>

              <div class="channel-item-row" v-if="persona.email">
                <i class="bi bi-envelope-fill channel-icon"></i>
                <span class="channel-text truncate-text">{{ persona.email }}</span>
              </div>

              <div class="channel-item-row" v-if="persona.phone && persona.phone !== '---'">
                <i class="bi bi-telephone-fill channel-icon"></i>
                <span class="channel-text">{{ persona.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-fallback-box">
        <i class="bi bi-person-xfallback fallback-icon-empty"></i>
        <p>No se encontraron especialistas registrados bajo los filtros seleccionados.</p>
      </div>

      <div class="member-directory__action" v-if="items.length > limitRender">
        <component 
          :is="linkTag" 
          :to="actionUrl" 
          class="member-directory__button d-flex align-items-center justify-content-center text-decoration-none"
          @click.prevent="verMas"
        >
          {{ actionText }}
        </component>
      </div>
    </div>
  </section>
</template>

<style scoped>

.member-directory__action {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
.member-directory__button {
  width: 260px;
  padding: 14px 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  color: #ffffff;
  font-family: var(--font-raleway) !important;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  cursor: pointer;
  box-sizing: border-box;
}
.directorio-section-wrapper {
  width: 100%;
  background-color: #ffffff;
  padding: 64px 20px;
  box-sizing: border-box;
}

.directorio-fluid-container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  text-align: center;
}

.filters-row-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  max-width: 1024px;
  margin: 0 auto 1rem;
  width: 100%;
}

.mb-gutter {
  margin-bottom: 4rem;
}

.custom-select-filter-card,
.disabled-placeholder-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  padding: 0px 20px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.7);
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  color: #555555;
}

.custom-select-filter-card {
  background: #ffffff;
}

.native-dropdown-select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  appearance: none;
  cursor: pointer;
  padding-right: 24px;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  color: #555555;
}

.arrow-visual-wrap {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding-right: 12px;
  pointer-events: none;
}

.divider-vertical-red,
.divider-vertical-blue,
.divider-vertical-disabled {
  height: 18px;
  border-left: 2px solid;
  margin-right: 8px;
}

.divider-vertical-red {
  border-color: #e1113f;
}

.divider-vertical-blue {
  border-color: #274e9d;
}

.divider-vertical-disabled {
  border-color: #a3a3a3;
}

.chevron-arrow-svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.text-blue-arrow {
  color: #274e9d;
}

.disabled-placeholder-card {
  background: rgba(243, 244, 246, 0.8);
  color: #555555;
}

.placeholder-label-text {
  font-size: 14px;
  font-weight: 400;
  white-space: normal;
  line-height: 1.15;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.text-left-d {
  text-align: left;
  width: 100%;
}

.text-slate-disabled {
  color: #9ca3af;
}

.authorities-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  gap: 24px 61px;
  justify-content: center;
  align-items: stretch;
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
}

.authority-profile-card {
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  box-sizing: border-box;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}

.clickable-card {
  cursor: pointer !important;
  user-select: none;
}

.clickable-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(43, 76, 153, 0.08);
}

.clickable-card:active {
  transform: translateY(-1px) scale(0.99);
}

.force-no-pointer {
  pointer-events: none !important;
}

.avatar-frame-box {
  position: relative;
  flex-shrink: 0;
  width: 133px;
  height: 133px;
  border-radius: 8px;
  overflow: visible;
  background: transparent;
}

.director-img-fit,
.avatar-placeholder {
  width: 133px;
  height: 133px;
  display: block;
  border-radius: 8px;
}

.director-img-fit {
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder__icon {
  font-size: 56px;
  color: #ffffff;
  line-height: 1;
}

.university-crest-badge {
  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 34px;
  height: 38px;
  background-color: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 20;
}

.crest-img {
  width: 20px;
  /* height: 25px; */
  object-fit: contain;
  display: block;
}

.authority-divider {
  width: 1px;
  align-self: stretch;
  margin: 0 10px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.profile-info-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 133px;
  overflow: hidden;
}

.cargo-tag-underline {
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  color: #111111;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

.authority-fullname {
  margin: 10px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #111111;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

.contact-channels-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 10px;
}

.channel-item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  color: #7e7e7e;
  min-width: 0;
}

.channel-icon {
  font-size: 10px;
  color: #7e7e7e;
  flex-shrink: 0;
}

.channel-text {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button-action-row {
  margin-top: 3rem;
}

.btn-premium-gradient {
  padding: 12px 40px;
  background: linear-gradient(to right, #e1113f, #274e9d);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: opacity 0.2s;
}

.btn-premium-gradient:hover {
  opacity: 0.9;
}

.loader-box-wrap {
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.spinner-loader {
  width: 24px;
  height: 24px;
  border: 2.5px solid #e5e7eb;
  border-top-color: #e1113f;
  border-radius: 50%;
  animation: spinDirectorios 0.6s linear infinite;
}

@keyframes spinDirectorios {
  to {
    transform: rotate(360deg);
  }
}

.loader-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}

.empty-fallback-box {
  padding: 4rem 0;
  color: #94a3b8;
}

.fallback-icon-empty {
  font-size: 2.5rem;
  opacity: 0.4;
  margin-bottom: 6px;
  display: block;
}

@media (max-width: 992px) {
  .filters-row-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 540px;
  }

  .mb-gutter {
    margin-bottom: 2rem;
  }

  .authorities-cards-grid {
    grid-template-columns: 1fr;
    max-width: 403px;
  }
}

@media (max-width: 540px) {
  .directorio-section-wrapper {
    padding: 48px 14px;
  }

  .filters-row-grid {
    grid-template-columns: 1fr;
  }

  .custom-select-filter-card,
  .disabled-placeholder-card {
    padding: 15px 18px;
  }

  .authority-profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .avatar-frame-box,
  .director-img-fit,
  .avatar-placeholder {
    width: 133px;
    height: 133px;
  }

  .profile-info-side {
    margin-top: 16px;
    min-height: auto;
    align-items: center;
    width: 100%;
  }

  .authority-divider {
    width: 100%;
    height: 1px;
    margin: 12px 0;
    background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  }

  .contact-channels-list {
    align-items: center;
  }

  .channel-item-row {
    justify-content: center;
  }
  .authority-divider{
    max-width: 50%;
    align-self: center;
  }
}
</style>