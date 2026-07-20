<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ModalTeamUniversity from '../modal/ModalTeamUniversity.vue'
import { PUBLIC_API_URL } from '../../../../config/apiConfig'
import { formatImageUrl } from '@shared/helpers/url';

interface BlockData {
  title?: string
  introText?: string
  limit?: number | string
}

interface RectorMember {
  id: number
  university_id: number
  position_name: string
  first_name: string
  last_name: string
  email: string
  phone: string
  photo_url: string
  university_logo_url?: string
  university_logo?: string
  university_abbreviation?: string
  university_name: string
}

const props = defineProps<{
  data: BlockData | null
}>()

const title = computed(() => props.data?.title || 'Directorio')
const introText = computed(
  () =>
    props.data?.introText ||
    'Sección destinada al registro y archivo oficial de las actividades, acuerdos y reuniones sostenidas por los directivos en el marco de la red.'
)
const limit = computed(() => Number(props.data?.limit) || 4)

const items = ref<RectorMember[]>([])
const pending = ref(false)

const isModalOpen = ref(false)
const selectedRector = ref<RectorMember | null>(null)


const getUniversityLogo = (persona: RectorMember) =>
  persona.university_logo_url || persona.university_logo || ''

const getUniversityBadgeLabel = (persona: RectorMember) =>
  persona.university_abbreviation || persona.university_name?.slice(0, 2).toUpperCase() || 'U'

/**
 * 🛰️ ACCESO ASÍNCRONO DIRECTO A FASTIFY ENDPOINT
 */
const fetchDirectorioFromFastify = async () => {
  pending.value = true
  try {
    const url = `${PUBLIC_API_URL}/teams?hierarchy_level=1&person_type=board_member&limit=${limit.value}`
    const response = await fetch(url)

    if (response.ok) {
      const resData = await response.json()
      const records = resData?.data || resData || []

      console.log(resData);

      if (records.length > 0) {
        items.value = records
      } else {
        injectMockRectores()
      }
    } else {
      injectMockRectores()
    }
  } catch {
    injectMockRectores()
  } finally {
    pending.value = false
  }
}

const openTeamModal = (rector: RectorMember) => {
  selectedRector.value = {
    ...rector,
    university_id: Number(rector.university_id),
    university_name: rector.university_name,
    university_logo_url: rector.university_logo_url,
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedRector.value = null
}

const injectMockRectores = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window

  if (!isNuxtEnvironment) {
    items.value = [
      {
        id: 1,
        university_id: 10,
        position_name: 'Rector UPT',
        first_name: 'Hugo Cirilo',
        last_name: 'Calizaya Calizaya',
        email: 'rectorado@upt.edu.pe',
        phone: '---',
        photo_url:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
        university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_del_CIP.png',
        university_name: 'Universidad Privada de Tacna',
        university_abbreviation: 'UPT',
      },
      {
        id: 2,
        university_id: 20,
        position_name: 'Rectora UNTELS',
        first_name: 'Gladys Marcionila',
        last_name: 'Cruz Yupanqui',
        email: 'rectorado@untels.edu.pe',
        phone: '905452206',
        photo_url:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        university_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo-bid-es.png',
        university_name: 'Universidad Nacional Tecnológica de Lima Sur',
        university_abbreviation: 'UNTELS',
      },
    ].slice(0, limit.value)
  } else {
    items.value = []
  }
}

watch([limit], () => {
  fetchDirectorioFromFastify()
}, { immediate: true })
</script>

<template>
  <section class="directorio-section">
    <div>
      <div class="directorio-section__content">
        <header class="directorio-header">
          <h2 v-if="title" class="section-title">{{ title }}</h2>
          <p v-if="introText" class="intro-text">{{ introText }}</p>
        </header>

        <div v-if="pending" class="loading-state py-5">
          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          <span class="small fw-bold text-slate">Sincronizando autoridades con Fastify...</span>
        </div>

        <div v-else-if="items.length > 0" class="directorio-grid">
          <article
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="user-placeholder-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>

                <div
                  class="institution-logo-badge"
                  v-if="getUniversityLogo(persona) || getUniversityBadgeLabel(persona)"
                >
                  <img
                    v-if="getUniversityLogo(persona)"
                    :src="formatImageUrl(getUniversityLogo(persona))"
                    alt="Logo Universidad"
                    class="badge-img"
                  />
                  <span v-else class="badge-placeholder">
                    {{ getUniversityBadgeLabel(persona) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="divider-bicolor-vertical"></div>

            <div class="info-block">
              <span class="cargo-tag" v-if="persona.position_name">{{ persona.position_name }}</span>
              <h3 class="director-name">{{ persona.first_name }} {{ persona.last_name }}</h3>

              <div class="contact-details">
                <div class="contact-item" v-if="persona.email">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="contact-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  <span class="contact-text text-truncate">{{ persona.email }}</span>
                </div>

                <div class="contact-item" v-if="persona.phone && persona.phone !== '---'">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="contact-icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.5-4.5c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <span class="contact-text">{{ persona.phone }}</span>
                </div>
              </div>
            </div>
          </article>
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
.directorio-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0 0 46px;
}
/* 
.directorio-section__surface {
  width: min(100%, 1076px);
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
} */

.directorio-section__content {
  width: min(100%, 1076px);
  margin: 0 auto;
  padding: 18px 0 22px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
}

.directorio-header {
  text-align: center;
  margin-bottom: 34px;
  padding: 0 18px;
}

.section-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
}

.section-title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 3px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.intro-text {
  max-width: 840px;
  margin: 14px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.35;
  color: #111111;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
}

.text-slate {
  color: #64748b;
}

.directorio-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 39px;
}

.directorio-card {
  width: 403px;
  box-sizing: border-box;
  padding: 10px 14px 10px 12px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: stretch;
  gap: 12px;
  border: 1px solid rgba(17, 17, 17, 0.04);
}

.clickable-card {
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.25s;
}

.clickable-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 24px -8px rgba(0, 0, 0, 0.12);
  border-color: rgba(37, 82, 154, 0.18);
}

.photo-block {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  position: relative;
  width: 133px;
  height: 133px;
  flex-shrink: 0;
}

.director-img {
  width: 133px;
  height: 133px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  background-color: #ffffff;
}

.placeholder-avatar {
  width: 133px;
  height: 133px;
  background-color: #f8fafc;
  border-radius: 8px;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
}

.user-placeholder-icon {
  width: 44px;
  height: 44px;
  color: #cbd5e1;
}

.institution-logo-badge {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 34px;
  height: 38px;
  border-radius: 0 8px 0 0px;
  background-color: #ffffff;
  /* box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12); */
  /* border: 1px solid #e2e8f0; */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.badge-img {
  max-width: 25px;
  max-height: 25px;
  object-fit: contain;
  display: block;
}

.badge-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-raleway) !important;
  font-size: 8px;
  font-weight: 700;
  line-height: 1;
  color: #25529a;
  padding: 0 2px;
  text-align: center;
}

.divider-bicolor-vertical {
  width: 1px;
  flex: 0 0 1px;
  align-self: stretch;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.info-block {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2px;
}

.cargo-tag {
  margin: 0 0 4px;
  width: fit-content;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #7e7e7e;
}

.director-name {
  margin: 0 0 10px;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: #111111;
  word-break: break-word;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
}

.contact-icon {
  width: 12px;
  height: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

.contact-text {
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #7e7e7e;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 980px) {
  .directorio-section__surface {
    padding: 12px;
  }

  .directorio-section__content {
    width: 100%;
  }

  .directorio-grid {
    gap: 20px;
  }

  .directorio-card {
    width: min(100%, 403px);
  }
}

@media (max-width: 560px) {
  .section-title {
    font-size: 24px;
  }

  .intro-text {
    font-size: 14px;
  }

  .directorio-card {
    width: 100%;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 22px 16px;
  }

  .divider-bicolor-vertical {
    width: 80px;
    height: 1px;
    flex-basis: 1px;
    align-self: center;
    background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  }

  .info-block {
    width: 100%;
    align-items: center;
    padding-left: 0;
  }

  .cargo-tag {
    margin-left: auto;
    margin-right: auto;
  }

  .contact-details {
    width: 100%;
    align-items: center;
  }
}
</style>