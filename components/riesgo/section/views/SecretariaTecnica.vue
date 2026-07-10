<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '../title/SectionTitle.vue'

type Leader = {
  nombre: string
  cargo: string
  institucion: string
  correo: string
  photo_url?: string
}

type CommitteeMember = {
  universidad: string
  nombre: string
  especialidad: string
  correo?: string
  photo_url?: string
  logoUniversidad?: string
}

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Secretaría Técnica')
const description1 = computed(
  () =>
    props.data?.description1 ||
    'La Secretaría Técnica es el brazo operativo y articulador de la RiesGIRD-ACC Perú. Está encargada de coordinar la ejecución del plan de trabajo, centralizar la información técnica y articular los esfuerzos de los equipos de especialistas de todas nuestras universidades miembro.'
)

const leaderTitle = computed(() => props.data?.leaderTitle || 'Liderazgo Actual')

const leader = computed<Leader>(() => props.data?.leader || {
  nombre: 'Prof. e investigadora Mary Mollo Medina',
  cargo: 'Secretaria Técnica Nacional',
  institucion: 'Universidad ESAN',
  correo: 'mmollo@esan.edu.pe',
  photo_url: ''
})

const description2 = computed(
  () =>
    props.data?.description2 ||
    'El verdadero valor de nuestra Secretaría Técnica radica en su pluralidad. No está conformada por una sola persona o institución, sino que es operada por un comité interinstitucional integrado por especialistas y gestores designados por cada universidad miembro de la Red. Este equipo de expertos es el encargado de aterrizar los acuerdos del Consejo Directivo y hacer realidad nuestros proyectos de investigación, formación y responsabilidad socio-ambiental en todo el país.'
)

const committeeTitle = computed(
  () => props.data?.committeeTitle || 'Comité Técnico Interinstitucional'
)

const comite = computed<CommitteeMember[]>(() => props.data?.comite || [])

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}
</script>

<template>
  <section class="secretaria-tecnica">
    <div class="secretaria-tecnica__shell">
      <div class="secretaria-tecnica__content">
        <SectionTitle v-if="title" :title="title" :padding-bottom="10" />

        <p v-if="description1" class="secretaria-tecnica__paragraph">
          {{ description1 }}
        </p>

        <SectionTitle
          v-if="leaderTitle"
          :title="leaderTitle"
          :font-size-title="26"
          :padding-top="20"
          :padding-bottom="20"
        />

        <article v-if="leader" class="leader-card">
          <div class="leader-card__avatar">
            <img
              v-if="leader.photo_url"
              :src="formatImageUrl(leader.photo_url)"
              :alt="leader.nombre"
              class="leader-card__avatar-img"
            />

            <svg v-else class="leader-card__avatar-icon" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>

          <h3 class="leader-card__name">
            {{ leader.nombre }}
          </h3>

          <span class="leader-card__role">
            {{ leader.cargo }}
          </span>

          <p class="leader-card__institution">
            {{ leader.institucion }}
          </p>

          <div v-if="leader.correo" class="leader-card__email">
            <i class="bi bi-envelope-fill leader-card__email-icon"></i>
            <a :href="`mailto:${leader.correo}`" class="leader-card__email-link">
              {{ leader.correo }}
            </a>
          </div>
        </article>

        <p v-if="description2" class="secretaria-tecnica__paragraph secretaria-tecnica__paragraph--wide">
          {{ description2 }}
        </p>

        <SectionTitle
          v-if="committeeTitle"
          :title="committeeTitle"
          :font-size-title="26"
          :padding-top="30"
          :padding-bottom="30"
        />

        <div v-if="comite.length > 0" class="committee-grid">
          <article
            v-for="(miembro, index) in comite"
            :key="index"
            class="committee-card"
          >
            <div class="committee-card__visual">
              <img
                v-if="miembro.photo_url"
                :src="formatImageUrl(miembro.photo_url)"
                :alt="miembro.nombre"
                class="committee-card__photo"
              />

              <svg v-else class="committee-card__avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>

              <div v-if="miembro.logoUniversidad" class="committee-card__badge">
                <img
                  :src="formatImageUrl(miembro.logoUniversidad)"
                  :alt="miembro.universidad"
                  class="committee-card__badge-img"
                />
              </div>
            </div>

            <div class="committee-card__divider"></div>

            <div class="committee-card__info">
              <span class="committee-card__university">
                {{ miembro.universidad }}
              </span>

              <h4 class="committee-card__name">
                {{ miembro.nombre }}
              </h4>

              <span class="committee-card__specialty">
                {{ miembro.especialidad }}
              </span>

              <div class="committee-card__email">
                <i class="bi bi-envelope-fill committee-card__email-icon"></i>
                <span class="committee-card__email-label">Correo:</span>
                <a
                  v-if="miembro.correo"
                  :href="`mailto:${miembro.correo}`"
                  class="committee-card__email-link"
                >
                  {{ miembro.correo }}
                </a>
                <span v-else class="committee-card__email-empty">---</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.secretaria-tecnica {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0 0 40px;
}

.secretaria-tecnica__shell {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 28px 52px 36px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
}

.secretaria-tecnica__content {
  width: min(100%, 906px);
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
}

.secretaria-tecnica__paragraph {
  max-width: 906px;
  margin: 18px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.35;
  color: #111111;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.secretaria-tecnica__paragraph--wide {
  margin-top: 28px;
}

.leader-card {
  width: min(100%, 310px);
  margin: 28px auto 34px;
  padding: 28px 22px 24px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.leader-card__avatar {
  width: 102px;
  height: 102px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.leader-card__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.leader-card__avatar-icon {
  width: 58px;
  height: 58px;
  color: #ffffff;
  display: block;
}

.leader-card__name {
  margin: 18px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.18;
  color: #111111;
}

.leader-card__role {
  display: inline-block;
  margin-top: 10px;
  font-family: var(--font-raleway) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.leader-card__institution {
  margin: 12px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.35;
  color: #111111;
}

.leader-card__email {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
}

.leader-card__email-icon {
  font-size: 14px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.leader-card__email-link {
  color: inherit;
  text-decoration: none;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.committee-grid {
  width: 100%;
  margin: 6px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  justify-content: center;
  gap: 24px 61px;
  align-items: stretch;
}

.committee-card {
  width: 100%;
  max-width: 403px;
  min-height: 152px;
  padding: 10px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.committee-card__visual {
  width: 133px;
  min-width: 133px;
  height: 133px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.committee-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.committee-card__avatar-icon {
  width: 72px;
  height: 72px;
  color: #ffffff;
  display: block;
}

.committee-card__badge {
  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 30px;
  height: 30px;
  padding: 3px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.committee-card__badge-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.committee-card__divider {
  width: 1px;
  align-self: stretch;
  margin: 0 10px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.committee-card__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.committee-card__university {
  margin-bottom: 2px;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: black;
  text-transform: uppercase;
  text-decoration: underline;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.committee-card__name {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.24;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.committee-card__specialty {
  margin-top: 4px;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: black;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.committee-card__email {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #7e7e7e;
}

.committee-card__email-icon {
  font-size: 10px;
  color: #7e7e7e;
  flex-shrink: 0;
}

.committee-card__email-link {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.committee-card__email-empty {
  color: #7e7e7e;
}

@media (max-width: 1024px) {
  .secretaria-tecnica__shell {
    padding: 24px 32px 32px;
  }

  .secretaria-tecnica__paragraph {
    font-size: 18px;
  }

  .committee-grid {
    gap: 24px 24px;
  }
}

@media (max-width: 820px) {
  .committee-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .committee-card {
    width: 100%;
    max-width: 403px;
  }
}

@media (max-width: 768px) {
  .secretaria-tecnica {
    padding-bottom: 28px;
  }

  .secretaria-tecnica__shell {
    padding: 20px 18px 26px;
  }

  .secretaria-tecnica__paragraph {
    font-size: 16px;
    line-height: 1.4;
  }

  .leader-card {
    margin: 24px auto 28px;
    padding: 24px 18px 22px;
  }

  .leader-card__name {
    font-size: 20px;
  }

  .leader-card__role {
    font-size: 15px;
  }

  .leader-card__institution {
    font-size: 15px;
  }

  .leader-card__email {
    font-size: 13px;
  }

  .committee-card__name {
    font-size: 13px;
  }

  .committee-card__email {
    font-size: 10px;
  }
}

@media (max-width: 560px) {
  .secretaria-tecnica__shell {
    padding: 18px 14px 24px;
  }

  .secretaria-tecnica__paragraph {
    font-size: 15px;
  }

  .leader-card {
    width: 100%;
    max-width: 310px;
  }

  .leader-card__avatar {
    width: 94px;
    height: 94px;
  }

  .leader-card__avatar-icon {
    width: 52px;
    height: 52px;
  }

  .committee-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 18px 14px;
  }

  .committee-card__visual {
    width: 133px;
    height: 133px;
  }

  .committee-card__divider {
    width: 100%;
    height: 1px;
    margin: 12px 0;
  }

  .committee-card__info {
    align-items: center;
    text-align: center;
  }

  .committee-card__email {
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .secretaria-tecnica__paragraph {
    font-size: 14px;
  }

  .leader-card__name {
    font-size: 18px;
  }

  .leader-card__role {
    font-size: 14px;
  }

  .leader-card__institution {
    font-size: 14px;
  }

  .committee-card {
    width: 100%;
  }
}
</style>