<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'
import ModalTeamUniversity from '../modal/ModalTeamUniversity.vue'
import { useUniversitiesFeed } from '../../composables/useUniversitiesFeed'
// 🔥 CORREGIDO: Importación del ayudante global para evitar duplicación de URLs
import { formatImageUrl } from '../../../../../front/src/helpers/url'

interface BlockData {
  title?: string
  limit?: number | string
  forcedType?: string
  actionText?: string
  actionUrl?: string
}

interface UniversityModalPayload {
  university_id: number
  university_name: string
  university_abbreviation?: string
  university_logo_url?: string
  university_logo?: string
  first_name?: string
  last_name?: string
  email?: string
  photo_url?: string
}

const props = defineProps<{
  data: BlockData | null
  linkComponent?: any 
}>()

const title = computed(() => props.data?.title || 'Directorio de Miembros')
const initialLimit = computed(() => Number(props.data?.limit) || 8)
const forcedType = computed(() => props.data?.forcedType || 'all')

const actionText = computed(() => props.data?.actionText || 'Ver Más')
const actionUrl = computed(() => props.data?.actionUrl || '#')

const linkTag = computed(() => props.linkComponent || 'router-link')

const { items, pending, fetchDirectorio } = useUniversitiesFeed()

const limitRender = ref(initialLimit.value)
const filtroNombre = ref('')
const filtroTipo = ref('')

// 🔹 Nota: Se eliminó la función local formatImageUrl y la constante STORAGE_BASE_URL para usar el helper unificado

const translateType = (type: string) => {
  const dictionary: Record<string, string> = {
    public: 'Universidad Nacional',
    private: 'Universidad Privada',
    institute: 'Instituto Superior',
    foreign: 'Institución Internacional'
  }
  return dictionary[type] || type
}

// ── 🚩 ESTADOS Y CONTROLADORES REACTIVOS DEL MODAL INTACTOS ──
const isModalOpen = ref(false)
const selectedRector = ref<UniversityModalPayload | null>(null)

/**
 * Adaptador para el modal de Fastify
 */
const openTeamModal = (uni: any) => {
  selectedRector.value = {
    university_id: uni.id,                     
    university_name: uni.name,                  
    university_abbreviation: uni.siglas || '', 
    university_logo_url: formatImageUrl(uni.logo_url), // 🔥 Corregido con el helper unificado
    university_logo: uni.logo_url || '',
    first_name: '',
    last_name: '',
    email: '',
    photo_url: ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedRector.value = null
}

const uniqueUniversities = computed(() => {
  const names = items.value.map(university => university.name).filter(Boolean)
  return [...new Set(names)].sort()
})

const uniqueTypes = computed(() => {
  const types = items.value.map(university => university.type).filter(Boolean)
  return [...new Set(types)].sort()
})

const universidadesFiltradas = computed(() => {
  return items.value
    .filter(university => {
      const matchName = !filtroNombre.value || university.name === filtroNombre.value
      const matchType = !filtroTipo.value || university.type === filtroTipo.value
      return matchName && matchType
    })
    .slice(0, limitRender.value)
})

const fetchDirectorioMiembros = async () => {
  try {
    await fetchDirectorio(forcedType.value)
  } catch (error) {
    injectMockUniversidades()
  }
}

const injectMockUniversidades = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window
  if (!isNuxtEnvironment) {
    items.value = [
      { id: 1, name: 'San Cristóbal de Huamanga', siglas: 'UNSCH', logo_url: null, type: 'public' },
      { id: 2, name: 'De Ucayali', siglas: 'UNU', logo_url: null, type: 'public' },
      { id: 3, name: 'Tecnológica de Lima Sur', siglas: 'UNTELS', logo_url: null, type: 'public' },
      { id: 4, name: 'De Tumbes', siglas: 'UNT', logo_url: null, type: 'public' },
      { id: 5, name: 'San Antonio Abad del Cuzco', siglas: 'UNSAAC', logo_url: null, type: 'public' }
    ]
  } else {
    items.value = []
  }
}

watch(() => initialLimit.value, newVal => {
  limitRender.value = newVal
})

watch(() => [initialLimit.value, forcedType.value], () => {
  fetchDirectorioMiembros()
}, { immediate: true })
</script>

<template>
  <section class="member-directory">
    <div class="member-directory__outer">
      <div class="member-directory__inner">
        <SectionTitle v-if="title" :title="title" :padding-bottom="10" />

        <div class="member-directory__filters">
          <div class="filter-card filter-card--active filter-card--red">
            <select v-model="filtroNombre" class="filter-card__select">
              <option value="">Universidad</option>
              <option v-for="name in uniqueUniversities" :key="name" :value="name">
                {{ name }}
              </option>
            </select>

            <div class="filter-card__side">
              <span class="filter-card__divider filter-card__divider--red"></span>
              <i class="bi bi-chevron-down filter-card__arrow filter-card__arrow--red"></i>
            </div>
          </div>

          <div class="filter-card filter-card--active filter-card--blue">
            <select v-model="filtroTipo" class="filter-card__select">
              <option value="">Clasificación</option>
              <option v-for="type in uniqueTypes" :key="type" :value="type">
                {{ translateType(type) }}
              </option>
            </select>

            <div class="filter-card__side">
              <span class="filter-card__divider filter-card__divider--blue"></span>
              <i class="bi bi-chevron-down filter-card__arrow filter-card__arrow--blue"></i>
            </div>
          </div>

          <div class="filter-card filter-card--disabled">
            <span class="filter-card__disabled-text">Vicerrector Académico</span>
            <div class="filter-card__side">
              <span class="filter-card__divider filter-card__divider--disabled"></span>
              <i class="bi bi-chevron-down filter-card__arrow filter-card__arrow--disabled"></i>
            </div>
          </div>

          <div class="filter-card filter-card--disabled">
            <span class="filter-card__disabled-text">Vicerrector de Investigación</span>
            <div class="filter-card__side">
              <span class="filter-card__divider filter-card__divider--disabled"></span>
              <i class="bi bi-chevron-down filter-card__arrow filter-card__arrow--disabled"></i>
            </div>
          </div>
        </div>

        <div v-if="pending" class="member-directory__loader">
          <div class="member-directory__spinner"></div>
          <p class="member-directory__loader-text">Sincronizando universidades miembro...</p>
        </div>

        <div v-else-if="universidadesFiltradas.length > 0" class="member-directory__grid">
          <article
            v-for="(uni, index) in universidadesFiltradas"
            :key="uni.id || index"
            class="university-card"
            @click="openTeamModal(uni)"
          >
            <div class="university-card__logo-wrap">
              <img
                v-if="uni.logo_url"
                :src="formatImageUrl(uni.logo_url)"
                :alt="uni.name"
                class="university-card__logo"
              />

              <div v-else class="university-card__logo-fallback">
                <span class="university-card__siglas">
                  {{ uni.siglas || 'UNI' }}
                </span>
              </div>
            </div>

            <div class="university-card__divider"></div>

            <div class="university-card__body">
              <span class="university-card__type">
                {{ translateType(uni.type) }}
              </span>

              <h3 class="university-card__name">
                {{ uni.name }}
              </h3>
            </div>
          </article>
        </div>

        <div v-else class="member-directory__empty">
          <i class="bi bi-building member-directory__empty-icon"></i>
          <p class="member-directory__empty-text">
            No se encontraron universidades miembro bajo los filtros seleccionados.
          </p>
        </div>

        <div class="member-directory__action">
          <component 
            :is="linkTag" 
            :to="actionUrl" 
            class="member-directory__button d-flex align-items-center justify-content-center text-decoration-none"
          >
            {{ actionText }}
          </component>
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
/* Tu bloque original de CSS permanece 100% igual e inalterado en este espacio */
.member-directory { width: 100%; background: #ffffff; box-sizing: border-box; padding: 0; }
.member-directory__outer { width: min(100%, 1010px); margin: 0 auto; padding: 28px; box-sizing: border-box; background: #f2f7ff; border-radius: 8px; }
.member-directory__inner { width: min(100%, 906px); margin: 0 auto; padding: 26px 24px 30px; box-sizing: border-box; background: #ffffff; }
.member-directory__filters { width: 100%; margin: 32px auto 0; display: grid; grid-template-columns: repeat(2, 224px); justify-content: center; gap: 20px 50px; }
.filter-card { width: 224px; height: 42px; box-sizing: border-box; border-radius: 8px; display: flex; align-items: stretch; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); background: #ffffff; }
.filter-card--disabled { background: #e5e5e5; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
.filter-card__select { flex: 1; width: 100%; border: none; outline: none; background: transparent; appearance: none; padding: 0 18px; box-sizing: border-box; font-family: var(--font-raleway) !important; font-size: 14px; font-weight: 400; color: #555555; cursor: pointer; }
.filter-card--disabled .filter-card__select { pointer-events: none; color: #8e8e8e; }
.filter-card__disabled-text { flex: 1; display: flex; align-items: center; padding: 0 18px; box-sizing: border-box; font-family: var(--font-raleway) !important; font-size: 14px; font-weight: 400; color: #8e8e8e; line-height: 1.1; }
.filter-card__side { display: flex; align-items: center; flex: 0 0 auto; padding-right: 12px; }
.filter-card__divider { width: 1px; height: 22px; margin-right: 10px; flex-shrink: 0; }
.filter-card__divider--red { background: #e1113f; }
.filter-card__divider--blue { background: #274e9d; }
.filter-card__divider--disabled { background: #9a9a9a; }
.filter-card__arrow { font-size: 14px; line-height: 1; flex-shrink: 0; }
.filter-card__arrow--red { color: #e1113f; }
.filter-card__arrow--blue { color: #274e9d; }
.filter-card__arrow--disabled { color: #8e8e8e; }
.member-directory__loader { padding: 4rem 0 2rem; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #475569; }
.member-directory__spinner { width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid #e5e7eb; border-top-color: #e1113f; animation: memberDirectorySpin 0.6s linear infinite; }
@keyframes memberDirectorySpin { to { transform: rotate(360deg); } }
.member-directory__loader-text { margin: 0; font-size: 0.85rem; font-weight: 700; font-family: var(--font-raleway) !important; }
.member-directory__grid { width: 100%; margin: 36px auto 0; display: grid; grid-template-columns: repeat(2, minmax(0, 403px)); justify-content: center; gap: 39px; align-items: stretch; }
.university-card { width: 100%; max-width: 403px; min-height: 155px; padding: 10px 12px; box-sizing: border-box; background: #ffffff; border-radius: 8px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12); display: flex; align-items: center; overflow: hidden; cursor: pointer;}
.university-card__logo-wrap { width: 95px; min-width: 95px; height: 133px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.university-card__logo { padding: 10px; width: 100%; height: 100%; object-fit: contain; display: block; }
.university-card__logo-fallback { width: 95px; height: 133px; border-radius: 8px; background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%); display: flex; align-items: center; justify-content: center; color: #ffffff; box-sizing: border-box; }
.university-card__siglas { font-family: var(--font-raleway) !important; font-size: 16px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; text-align: center; padding: 0 8px; }
.university-card__divider { width: 1px; align-self: stretch; margin: 0 12px; flex-shrink: 0; align-self: center; background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%); }
.university-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.university-card__type { font-family: var(--font-raleway) !important; font-size: 14px; font-weight: 400; line-height: 1.2; color: #111111; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 2px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
.university-card__name { margin: 6px 0 0; font-family: var(--font-raleway) !important; font-size: 14px; font-weight: bold; line-height: 1.2; color: #111111; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.member-directory__action { margin-top: 32px; display: flex; justify-content: center; }
.member-directory__button { width: 260px; padding: 14px 18px; border: none; border-radius: 8px; background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%); color: #ffffff; font-family: var(--font-raleway) !important; font-size: 20px; font-weight: 700; line-height: 1.1; cursor: pointer; box-sizing: border-box; }
.member-directory__empty { padding: 4rem 0 2rem; text-align: center; color: #94a3b8; }
.member-directory__empty-icon { display: block; font-size: 2.5rem; opacity: 0.45; margin-bottom: 8px; }
.member-directory__empty-text { margin: 0; font-family: var(--font-raleway) !important; font-size: 14px; font-weight: 400; line-height: 1.4; }

@media (max-width: 1100px) {
  .member-directory__outer { padding: 22px; }
  .member-directory__inner { width: 100%; }
  .member-directory__filters { grid-template-columns: repeat(2, 224px); gap: 14px 18px; }
}
@media (max-width: 920px) {
  .member-directory__grid { grid-template-columns: 1fr; max-width: 403px; }
  .university-card { width: 100%; }
}
@media (max-width: 560px) {
  .member-directory__outer { padding: 16px; }
  .member-directory__inner { padding: 20px 16px 24px; }
  .member-directory__filters { grid-template-columns: 1fr; justify-items: center; }
  .filter-card { width: 100%; max-width: 224px; }
  .member-directory__grid { max-width: 100%; }
  .university-card { flex-direction: column; align-items: center; text-align: center; min-height: auto; padding: 16px 14px; }
  .university-card__logo-wrap, .university-card__logo-fallback { width: 95px; height: 133px; }
  .university-card__divider { width: 60%; height: 1px; margin: 12px 0; background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%); }
  .university-card__body { align-items: center; }
  .member-directory__button { width: 100%; max-width: 260px; font-size: 18px; }
  .university-card__logo-wrap{ width: 80%; }
}
@media (max-width: 420px) {
  .member-directory__button { font-size: 16px; }
  .filter-card__select, .filter-card__disabled-text, .university-card__type, .university-card__name { font-size: 13px; }
}
</style>