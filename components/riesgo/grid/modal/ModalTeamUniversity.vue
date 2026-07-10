<script setup lang="ts">
import { computed, ref, watch } from 'vue';
// 🔥 IMPORTS CENTRALIZADOS SOLICITADOS ASIGNADOS CORRECTAMENTE
import { PUBLIC_API_URL } from '../../../../config/apiConfig';
import { formatImageUrl } from '../../../../shared/url';
// import { formatImageUrl } from '../../../../../front/src/helpers/url'

interface UniversityProp {
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

export interface TeamMember {
  id: number
  university_id: number
  position_id?: number | null
  first_name: string
  last_name: string
  position_name: string
  hierarchy_level: number
  email: string
  phone?: string | null
  photo_url?: string | null
  type: 'Rector' | 'Secretario Técnico' | 'Persona de Contacto' | string | null // Clasificación
  person_type: 'board_member' | 'specialist' | 'both' // Rol público
  location?: string | null // Región / Departamento
  university_name?: string
  university_logo_url?: string
  university_logo?: string
  university_abbreviation?: string
}

const props = defineProps<{
  isOpen: boolean
  universityData: UniversityProp | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const teamMembers = ref<TeamMember[]>([])
const loadingTeam = ref(false)

// 🔹 Nota: Se eliminó la función local formatImageUrl() ya que ahora se consume desde el import global

const buildAbbreviation = (name?: string): string => {
  if (!name) return ''
  const words = name
    .split(/\s+/)
    .map(word => word.trim())
    .filter(Boolean)

  if (!words.length) return ''

  return words
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 8)
}

const universityLogoUrl = computed(() => {
  return formatImageUrl(
    props.universityData?.university_logo_url || props.universityData?.university_logo
  )
})

const universityAbbreviation = computed(() => {
  return (
    props.universityData?.university_abbreviation ||
    buildAbbreviation(props.universityData?.university_name)
  )
})

const currentRector = computed(() =>
  teamMembers.value.find(member => member.type === 'Rector')
)

const secretario = computed(() =>
  teamMembers.value.find(member => member.type === 'Secretario Técnico')
)

const committeeMembers = computed(() =>
  teamMembers.value.filter(
    member => member.type !== 'Rector' && member.type !== 'Secretario Técnico'
  )
)

const rectorDisplay = computed(() => {
  const rector = currentRector.value
  console.log("Rector detectado en modal:", rector);
  
  return {
    first_name: rector?.first_name || props.universityData?.first_name || '---',
    last_name: rector?.last_name || props.universityData?.last_name || '',
    email: rector?.email || props.universityData?.email || '---',
    phone: rector?.phone || '---',
    photo_url: rector?.photo_url || ''  
  }
})

const rectorHeroFallbackIcon = computed(() => {
  return universityLogoUrl.value ? 'bi bi-building-fill' : 'bi bi-building-fill'
})

/**
 * 🛰️ ACCESO ASÍNCRONO RELACIONAL DESACOPLADO
 */
const fetchTeamFromFastify = async (universityId: number) => {
  loadingTeam.value = true
  teamMembers.value = []

  try {
    // 🎯 CORREGIDO: Consumimos la constante global de entorno para reventar puertos duros
    const url = `${PUBLIC_API_URL}/teams?university_id=${universityId}&limit=50`
    const response = await fetch(url)

    if (response.ok) {
      const resData = await response.json()
      const records = resData?.data || resData || []
      
      if (records.length > 0) {
        teamMembers.value = sortTeamByHierarchy(records)
      } else {
        injectMockTeam()
      }
    } else {
      injectMockTeam()
    }
  } catch (error) {
    console.error('Error cargando equipo institucional desde microservicio Fastify:', error)
    injectMockTeam()
  } finally {
    loadingTeam.value = false
  }
}

const sortTeamByHierarchy = (members: TeamMember[]): TeamMember[] => {
  const order: Record<string, number> = {
    Rector: 1,
    'Secretario Técnico': 2,
    'Persona de Contacto': 3
  }

  return [...members].sort((a, b) => (order[a.type || ''] || 9) - (order[b.type || ''] || 9))
}

const injectMockTeam = () => {
  teamMembers.value = [
    {
      id: 201,
      university_id: props.universityData?.university_id || 1,
      position_name: 'Rector',
      hierarchy_level: 1,
      type: 'Rector',
      person_type: 'board_member',
      first_name: props.universityData?.first_name || 'Hugo Cirilo',
      last_name: props.universityData?.last_name || 'Calizaya Calizaya',
      email: props.universityData?.email || 'rectorado@upt.edu.pe',
      phone: '---',
      photo_url:
        props.universityData?.photo_url ||
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 202,
      university_id: props.universityData?.university_id || 1,
      position_name: 'Secretario Técnico',
      hierarchy_level: 2,
      type: 'Secretario Técnico',
      person_type: 'specialist',
      first_name: 'Gabriela',
      last_name: 'Mallqui',
      email: 'gamallqui@uncp.edu.pe',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      phone: 'Anexo 4102'
    },
    {
      id: 203,
      university_id: props.universityData?.university_id || 1,
      position_name: 'Persona de Contacto',
      hierarchy_level: 3,
      type: 'Persona de Contacto',
      person_type: 'specialist',
      first_name: 'Sofía',
      last_name: 'Castro Luna',
      email: 'scastro@universidad.edu.pe',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      phone: '987-654-321'
    }
  ]
}

const closeModal = () => {
  emit('close')
  teamMembers.value = []
}

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
    <transition name="modal-fade">
      <div
        v-if="isOpen && universityData"
        class="team-modal__backdrop"
        @click.self="closeModal"
      >
        <div class="team-modal__surface" role="dialog" aria-modal="true">
          <div class="team-modal__content">
            <div v-if="loadingTeam" class="team-modal__loading">
              <div class="team-modal__spinner"></div>
              <p class="team-modal__loading-text">Sincronizando equipo institucional...</p>
            </div>

            <template v-else>
              <div class="team-modal__layout">
                <aside class="team-modal__left">
                  <div class="rector-card">
                    <div class="rector-card__hero">
                      <img
                        v-if="rectorDisplay.photo_url"  
                        :src="formatImageUrl(rectorDisplay.photo_url)"
                        :alt="universityData.university_name"
                        class="rector-card__hero-image"
                      />
                      <div v-else class="rector-card__hero-fallback">
                        <i :class="rectorHeroFallbackIcon" class="rector-card__hero-icon"></i>
                      </div>
                    </div>

                    <div class="rector-card__body">
                      <p class="rector-card__label">
                        Rector {{ universityAbbreviation ? universityAbbreviation : '' }}:
                      </p>

                      <h3 class="rector-card__name">
                        {{ rectorDisplay.first_name }} {{ rectorDisplay.last_name }}
                      </h3>

                      <div class="rector-card__line rector-card__line--email">
                        <i class="bi bi-envelope-fill rector-card__icon"></i>
                        <span class="rector-card__text">{{ rectorDisplay.email }}</span>
                      </div>

                      <div class="rector-card__line rector-card__line--phone">
                        <i class="bi bi-telephone-fill rector-card__icon"></i>
                        <span class="rector-card__text">{{ rectorDisplay.phone }}</span>
                      </div>

                      <img
                        v-if="universityLogoUrl"
                        :src="universityLogoUrl"
                        :alt="universityData.university_name"
                        class="rector-card__secondary-logo"
                      />
                    </div>
                  </div>
                </aside>

                <div class="team-modal__divider"></div>

                <main class="team-modal__right">
                  <section v-if="secretario" class="team-section">
                    <div class="team-section__title">
                      Secretario Técnico
                    </div>

                    <article class="member-card member-card--secretary">
                      <div class="member-card__visual">
                        <img
                          v-if="secretario.photo_url"
                          :src="formatImageUrl(secretario.photo_url)"
                          :alt="secretario.first_name"
                          class="member-card__photo"
                        />
                        <div v-else class="member-card__fallback">
                          <i class="bi bi-person-fill member-card__fallback-icon"></i>
                        </div>
                      </div>

                      <div class="member-card__divider"></div>

                      <div class="member-card__content">
                        <h4 class="member-card__name member-card__name--secretary">
                          {{ secretario.first_name }} {{ secretario.last_name }}
                        </h4>

                        <div class="member-card__meta member-card__meta--secretary">
                          <div class="member-card__row">
                            <i class="bi bi-envelope-fill member-card__icon"></i>
                            <span class="member-card__text">
                              {{ secretario.email || '---' }}
                            </span>
                          </div>

                          <div class="member-card__row">
                            <i class="bi bi-telephone-fill member-card__icon"></i>
                            <span class="member-card__text">
                              {{ secretario.phone || '---' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </section>

                  <section v-if="committeeMembers.length" class="team-section">
                    <div class="team-section__title">
                      Comité Técnico
                    </div>

                    <div class="committee-grid">
                      <article
                        v-for="member in committeeMembers"
                        :key="member.id"
                        class="member-card member-card--committee"
                      >
                        <div class="member-card__visual">
                          <img
                            v-if="member.photo_url"
                            :src="formatImageUrl(member.photo_url)"
                            :alt="member.first_name"
                            class="member-card__photo"
                          />
                          <div v-else class="member-card__fallback">
                            <i class="bi bi-person-fill member-card__fallback-icon"></i>
                          </div>
                        </div>

                        <div class="member-card__divider"></div>

                        <div class="member-card__content">
                          <div class="member-card__top">
                            <span class="member-card__position">
                              {{ member.type || 'Miembro' }}
                              <!-- {{ member.position_name || member.type || 'Miembro' }} -->
                            </span>

                            <h4 class="member-card__name">
                              {{ member.first_name }} {{ member.last_name }}
                            </h4>
                          </div>

                          <div class="member-card__meta">
                            <div class="member-card__row">
                              <i class="bi bi-envelope-fill member-card__icon"></i>
                              <span class="member-card__text member-card__text--muted">
                                {{ member.email || '---' }}
                              </span>
                            </div>

                            <div class="member-card__row">
                              <i class="bi bi-telephone-fill member-card__icon"></i>
                              <span class="member-card__text member-card__text--muted">
                                {{ member.phone || '---' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>
                </main>
              </div>

              <div class="team-modal__footer">
                <button type="button" class="team-modal__back-btn" @click="closeModal">
                  Regresar
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.team-modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.team-modal__surface {
  width: min(1075px, calc(100vw - 24px));
  max-height: 100vh;
  background: #f5f7ff;
  border-radius: 10px;
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.18);
  overflow: hidden;
  box-sizing: border-box;
  padding: 31px;
}

.team-modal__content {
  width: min(1014px, 100%);
  min-height: 646px;
  max-height: calc(100vh - 62px);
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.team-modal__content::-webkit-scrollbar {
  width: 6px;
}

.team-modal__content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

.team-modal__loading {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #475569;
}

.team-modal__spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #dbe2ef;
  border-top-color: #274e9d;
  animation: teamSpin 0.8s linear infinite;
}

.team-modal__loading-text {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 600;
}

@keyframes teamSpin {
  to {
    transform: rotate(360deg);
  }
}

.team-modal__layout {
  width: fit-content;
  margin: 0 auto;
  padding: 24px 0 0;
  display: grid;
  grid-template-columns: 246px 1px 665px;
  column-gap: 26px;
  align-items: start;
}

.team-modal__left {
  width: 246px;
}

.rector-card {
  width: 246px;
  min-height: 523px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rector-card__hero {
  /* min-height: 304px; */
  background: #274e9d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 14px 16px;
  box-sizing: border-box;
}

.rector-card__hero-image {
  width: 185px;
  height: 185px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.rector-card__hero-fallback {
  width: 185px;
  height: 185px;
  border-radius: 8px;
  background: #274e9d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.rector-card__hero-icon {
  font-size: 5rem;
  line-height: 1;
}

.rector-card__body {
  flex: 1;
  padding: 16px 14px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.rector-card__label {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  color: #111111;
}

.rector-card__name {
  margin: 10px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
   display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Limita a 2 líneas */
  overflow: hidden;      /* Oculta el texto que sobrepasa */
  text-overflow: ellipsis; /* Añade los tres puntos (...) */
}

.rector-card__line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-family: var(--font-raleway) !important;
  text-decoration: none;
  color: #111111;
}

.rector-card__line--email {
  font-size: 14px;
  font-weight: 400;
}

.rector-card__line--phone {
  font-size: 14px;
  font-weight: 400;
}

.rector-card__icon {
  font-size: 14px;
  color: #111111;
  flex-shrink: 0;
}

.rector-card__text {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.rector-card__secondary-logo {

width: 89px;

height: auto;

object-fit: contain;

display: block;

/* margin-top: auto; */

padding-top: 20px;

} 



.team-modal__divider {
  width: 2px;
  min-height: 523px;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.team-modal__right {
  width: 665px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.team-section {
  width: 665px;
}

.team-section__title {
  width: 100%;
  padding: 9px 12px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #e1113f;
  color: #ffffff;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.1;
  text-align: center;
  margin-bottom: 10px;
}

.member-card {
  width: 328px;
  min-height: 105px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  padding: 13px 12px;
  box-sizing: border-box;
  overflow: hidden;
  /* margin-top: 15px !important; */
}

.member-card--secretary {
  width: 328px;
  margin: 0 auto;
}

.member-card--committee {
  width: 328px;
}

.member-card__visual {
  position: relative;
  width: 82px;
  height: 82px;
  min-width: 82px;
  border-radius: 8px;
  overflow: hidden;
  background: #274e9d;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.member-card__fallback {
  width: 100%;
  height: 100%;
  background: #274e9d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.member-card__fallback-icon {
  font-size: 3.25rem;
  line-height: 1;
}

.member-card__divider {
  width: 1px;
  align-self: stretch;
  margin: 0 10px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.member-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.member-card__top {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-card__position {
  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: #111111;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.member-card__name {
  margin: 0;
  font-family: var(--font-raleway) !important;
  color: #111111;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.member-card__name--secretary {
  font-size: 16px;
  font-weight: 600;
  -webkit-line-clamp: 2;
}

.member-card__name:not(.member-card__name--secretary) {
  font-size: 16px;
  font-weight: 600;
  -webkit-line-clamp: 2;
}

.member-card__meta {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-card__meta--secretary {
  margin-top: 6px;
}

.member-card__row {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-family: var(--font-raleway) !important;
  font-weight: 400;
  line-height: 1.2;
  color: #7e7e7e;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.member-card__row,
.member-card__row .member-card__text {
  font-size: 12px;
}

.member-card__row .member-card__icon {
  font-size: 12px;
  color: black;
  flex-shrink: 0;
}

.member-card__text {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.member-card__text--muted {
  color: black;
}

.member-card__badge {
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
}

.member-card__badge-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* .committee-grid {
  width: 665px;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  align-items: start;
  gap: 14px 9px;
  justify-content: center;
  align-items: stretch;
} */

.committee-grid {
  width: 665px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-content: center;
  align-items: stretch;

  max-height: 315px; /* un poquito más */
  overflow-y: auto;
  overflow-x: hidden;

  padding: 0 6px 16px 0; /* espacio inferior para el shadow */
  box-sizing: border-box;
}

.team-modal__footer {
  display: flex;
  justify-content: center;
  padding: 28px 0 0;
}

.team-modal__back-btn {
  width: 258px;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: #e1113f;
  color: #ffffff;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.1;
  cursor: pointer;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1060px) {
  .team-modal__surface {
    width: min(1075px, calc(100vw - 16px));
    padding: 24px;
  }

  .team-modal__content {
    width: 100%;
    max-height: calc(100vh - 48px);
  }

  .team-modal__layout {
    width: 100%;
    grid-template-columns: 246px 1px minmax(0, 1fr);
  }

  .team-modal__right {
    width: 100%;
  }

  .team-section {
    width: 100%;
  }

  .committee-grid {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 328px));
    justify-content: center;
  }
}

@media (max-width: 980px) {
  .team-modal__layout {
    grid-template-columns: 1fr;
    row-gap: 18px;
  }

  .team-modal__divider {
    display: none;
  }

  .team-modal__left {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .rector-card {
    width: min(246px, 100%);
  }

  .member-card--secretary {
    width: 100%;
    max-width: 328px;
  }

  .committee-grid {
    grid-template-columns: repeat(2, minmax(0, 328px));
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .team-modal__backdrop {
    padding: 8px;
  }

  .team-modal__surface {
    padding: 16px;
  }

  .team-modal__content {
    max-height: calc(100vh - 32px);
  }

  .team-modal__layout {
    padding-top: 18px;
  }

  .committee-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .member-card--committee {
    width: 100%;
    max-width: 328px;
  }

  .team-modal__footer {
    padding-top: 22px;
  }
}

@media (max-width: 560px) {
  .rector-card {
    height: auto;
  }

  .rector-card__hero {
    min-height: 250px;
    padding: 18px 12px 16px;
  }

  .rector-card__hero-image,
  .rector-card__hero-fallback {
    width: 160px;
    height: 160px;
  }

  .rector-card__body {
    padding: 14px 12px 16px;
  }

  .rector-card__name {
    font-size: 18px;
  }

  .member-card {
    height: auto;
    padding: 12px;
  }

  .member-card--secretary,
  .member-card--committee {
    width: 100%;
    max-width: 328px;
  }

  .member-card__visual {
    width: 82px;
    height: 82px;
    min-width: 82px;
  }

  .member-card__divider {
    margin: 0 8px;
  }

  .team-modal__back-btn {
    width: 100%;
    max-width: 258px;
  }

  .team-modal__footer {
    padding-top: 18px;
  }
}
</style>