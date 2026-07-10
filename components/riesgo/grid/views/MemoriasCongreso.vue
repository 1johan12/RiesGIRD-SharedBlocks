<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'

export interface DocumentoEntregable {
  tipo: 'PDF' | 'PPT' | 'VIDEO' | string
  titulo: string
  fileUrl?: string
}

export interface GaleriaMultimedia {
  id?: number | string
  imageUrl?: string
  actionUrl?: string
}

export interface CongresoNode {
  id?: number | string
  year: string
  eventName: string
  description: string
  photoUrl?: string
  imageUrl?: string
  reportFileUrl?: string
  documentos: DocumentoEntregable[]
  galerias: GaleriaMultimedia[]
}

export interface MemoriasBlockData {
  title?: string
  introText?: string
  historialCongresos?: CongresoNode[]
}

const props = defineProps<{
  data: MemoriasBlockData | null
}>()

const title = computed(() => props.data?.title || 'Memorias de Congresos Internacionales RiesGIRD-ACC')
const introText = computed(
  () =>
    props.data?.introText ||
    'Revive las ponencias, debates y acuerdos de nuestros principales espacios de articulación. Aquí encontrarás las presentaciones, actas y grabaciones de los congresos, foros y asambleas impulsados por la RIESGIRD-ACC Perú.'
)
const historialCongresos = computed(() => props.data?.historialCongresos || [])

const formatMediaUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}

const getDocumentIconClass = (tipo?: string): string => {
  const t = (tipo || '').toUpperCase()
  if (t === 'PDF') return 'bi bi-file-earmark-pdf-fill'
  if (t === 'PPT') return 'bi bi-file-earmark-ppt-fill'
  return 'bi bi-image-fill'
}

const getDocumentHref = (doc: DocumentoEntregable): string => {
  return formatMediaUrl(doc.fileUrl)
}

const getGalleryHref = (galeria: GaleriaMultimedia): string => {
  return formatMediaUrl(galeria.actionUrl || galeria.imageUrl)
}

const getCongressPhoto = (bloque: CongresoNode): string => {
  return formatMediaUrl(bloque.photoUrl || bloque.imageUrl)
}

const getDocumentsGridClass = (docs: DocumentoEntregable[] = []): string => {
  return docs.length <= 2
    ? 'documents-grid-layout documents-grid-layout--wide'
    : 'documents-grid-layout documents-grid-layout--compact'
}

const getDocumentCardClass = (docs: DocumentoEntregable[] = []): string => {
  return docs.length <= 2
    ? 'deliverable-mini-card deliverable-mini-card--wide'
    : 'deliverable-mini-card deliverable-mini-card--compact'
}

const getDocumentClickTarget = (doc: DocumentoEntregable): '_blank' | '_self' => {
  return doc.fileUrl ? '_blank' : '_self'
}

const getGalleryClickTarget = (galeria: GaleriaMultimedia): '_blank' | '_self' => {
  return galeria.actionUrl || galeria.imageUrl ? '_blank' : '_self'
}

const preventIfEmpty = (href: string, event: MouseEvent) => {
  if (!href || href === '#') {
    event.preventDefault()
  }
}
</script>

<template>
  <section v-if="historialCongresos.length > 0" class="memorias-section">
    <div class="memorias-section__container">
      <header class="memorias-section__header">
        <SectionTitle v-if="title" :title="title" />

        <p v-if="introText" class="memorias-section__intro">
          {{ introText }}
        </p>
      </header>

      <div class="memorias-section__stack">
        <article
          v-for="(bloque, index) in historialCongresos"
          :key="bloque.id ?? `${bloque.year}-${index}`"
          class="congreso-block"
        >
          <div class="congreso-block__surface">
            <div class="congreso-block__body">
              <aside class="congreso-block__left">
                <div class="congreso-block__photo-wrap">
                  <img
                    v-if="getCongressPhoto(bloque)"
                    :src="getCongressPhoto(bloque)"
                    :alt="bloque.eventName"
                    class="congreso-block__photo"
                  />

                  <div v-else class="congreso-block__photo-fallback">
                    <span class="congreso-block__photo-ring">
                      <i class="bi bi-person-fill"></i>
                    </span>
                  </div>
                </div>

                <div class="congreso-block__year">
                  {{ bloque.year }}
                </div>

                <h3 class="congreso-block__event-name">
                  {{ bloque.eventName }}
                </h3>

                <p class="congreso-block__description">
                  {{ bloque.description }}
                </p>
              </aside>

              <section class="congreso-block__right">
                <div
                  v-if="bloque.documentos?.length"
                  :class="getDocumentsGridClass(bloque.documentos)"
                >
                  <a
                    v-for="(doc, docIndex) in bloque.documentos"
                    :key="doc.fileUrl ? `${docIndex}-${doc.fileUrl}` : docIndex"
                    :href="getDocumentHref(doc)"
                    :target="getDocumentClickTarget(doc)"
                    rel="noopener noreferrer"
                    :class="getDocumentCardClass(bloque.documentos)"
                    @click="preventIfEmpty(getDocumentHref(doc), $event)"
                  >
                    <template v-if="bloque.documentos.length <= 2">
                      <div class="deliverable-mini-card__icon-wrap">
                        <div class="deliverable-mini-card__icon-circle">
                          <i :class="getDocumentIconClass(doc.tipo)"></i>
                        </div>
                      </div>

                      <div class="deliverable-mini-card__divider"></div>

                      <div class="deliverable-mini-card__content">
                        <span class="deliverable-mini-card__type">
                          {{ doc.tipo }}
                        </span>

                        <h4 class="deliverable-mini-card__title">
                          {{ doc.titulo }}
                        </h4>
                      </div>
                    </template>

                    <template v-else>
                      <span class="deliverable-mini-card__type deliverable-mini-card__type--top">
                        [{{ doc.tipo }}]
                      </span>

                      <div class="deliverable-mini-card__icon-wrap deliverable-mini-card__icon-wrap--stacked">
                        <div class="deliverable-mini-card__icon-circle">
                          <i :class="getDocumentIconClass(doc.tipo)"></i>
                        </div>
                      </div>

                      <h4 class="deliverable-mini-card__title deliverable-mini-card__title--clamped">
                        {{ doc.titulo }}
                      </h4>
                    </template>
                  </a>
                </div>

                <div
                  v-if="bloque.galerias?.length"
                  class="gallery-grid-layout"
                >
                  <a
                    v-for="(galeria, gIdx) in bloque.galerias"
                    :key="galeria.id ?? galeria.imageUrl ?? `${index}-${gIdx}`"
                    :href="getGalleryHref(galeria)"
                    :target="getGalleryClickTarget(galeria)"
                    rel="noopener noreferrer"
                    class="gallery-card"
                    :class="gIdx % 2 === 0 ? 'gallery-card--crimson' : 'gallery-card--blue'"
                    :style="galeria.imageUrl ? { backgroundImage: `url(${formatMediaUrl(galeria.imageUrl)})` } : {}"
                    @click="preventIfEmpty(getGalleryHref(galeria), $event)"
                  >
                    <img
                      v-if="galeria.imageUrl"
                      :src="formatMediaUrl(galeria.imageUrl)"
                      alt=""
                      class="gallery-card__image"
                    />

                    <i
                      v-else
                      class="bi bi-image-fill gallery-card__icon"
                    ></i>
                  </a>
                </div>
              </section>
            </div>
          </div>

          <a
            :href="formatMediaUrl(bloque.reportFileUrl)"
            :target="bloque.reportFileUrl ? '_blank' : '_self'"
            rel="noopener noreferrer"
            class="congreso-block__report-btn"
            :class="{ 'congreso-block__report-btn--disabled': !bloque.reportFileUrl }"
            @click="preventIfEmpty(formatMediaUrl(bloque.reportFileUrl), $event)"
          >
            Descargar Oficial {{ bloque.year }} (PDF)
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.memorias-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0;
}

.memorias-section__container {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 0 20px 56px;
  box-sizing: border-box;
}

.memorias-section__header {
  width: 100%;
  text-align: center;
}

.memorias-section__intro {
  max-width: 1040px;
  margin: 20px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
  color: #111111;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.memorias-section__stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  margin-top: 32px;
}

.congreso-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.congreso-block__surface {
  width: min(100%, 1060px);
  background: #f5f7ff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

.congreso-block__body {
  width: 100%;
  display: grid;
  grid-template-columns: 285px minmax(0, 1fr);
  gap: 38px;
  align-items: stretch;
}

.congreso-block__left,
.congreso-block__right {
  background: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
}

.congreso-block__left {
  width: 285px;
  padding: 24px 20px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.congreso-block__photo-wrap {
  width: 100px;
  height: 100px;
  flex: 0 0 auto;
  margin-bottom: 16px;
}

.congreso-block__photo,
.congreso-block__photo-fallback {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  display: block;
}

.congreso-block__photo {
  object-fit: cover;
}

.congreso-block__photo-fallback {
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.congreso-block__photo-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.92);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  line-height: 1;
}

.congreso-block__year {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
}

.congreso-block__event-name {
  margin: 8px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.congreso-block__description {
  margin: 10px 0 0;
  font-family: var(--font-raleway) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.congreso-block__right {
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
}

.documents-grid-layout {
  width: 100%;
  display: grid;
  gap: 16px;
  align-items: stretch;
  box-sizing: border-box;
}

.documents-grid-layout--wide {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.documents-grid-layout--compact {
  width: fit-content;
  margin: 0 auto;
  grid-template-columns: repeat(3, 150px);
  justify-content: center;
}

.deliverable-mini-card {
  display: flex;
  text-decoration: none;
  color: inherit;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #ffffff;
  background-image:
    linear-gradient(#ffffff, #ffffff),
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  overflow: hidden;
}

.deliverable-mini-card--wide {
  min-height: 112px;
  padding: 14px 12px 14px 14px;
  align-items: center;
  gap: 12px;
}

.deliverable-mini-card--compact {
  width: 150px;
  min-height: 150px;
  padding: 10px 8px 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
}

.deliverable-mini-card__icon-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deliverable-mini-card__icon-wrap--stacked {
  margin-top: 2px;
}

.deliverable-mini-card--wide .deliverable-mini-card__icon-wrap {
  width: 60px;
  min-width: 60px;
}

.deliverable-mini-card--compact .deliverable-mini-card__icon-wrap {
  width: 60px;
  height: 60px;
}

.deliverable-mini-card__icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 40px;
  line-height: 1;
}

.deliverable-mini-card__divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
  flex-shrink: 0;
}

.deliverable-mini-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.deliverable-mini-card--compact .deliverable-mini-card__content {
  width: 100%;
  align-items: center;
  text-align: center;
}

.deliverable-mini-card__type {
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.15;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.deliverable-mini-card__type--top {
  margin-bottom: 2px;
}

.deliverable-mini-card__title {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.25;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.deliverable-mini-card__title--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
}

.gallery-grid-layout {
  width: fit-content;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 150px);
  justify-content: center;
  gap: 16px;
}

.gallery-card {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.gallery-card:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.gallery-card--crimson {
  background: #e1113f;
}

.gallery-card--blue {
  background: #274e9d;
}

.gallery-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.gallery-card__icon {
  font-size: 55px;
  color: #ffffff;
  line-height: 1;
}

.congreso-block__report-btn {
  width: 258px;
  margin: 24px auto 0;
  padding: 12px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  color: #ffffff;
  font-family: var(--font-raleway) !important;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.1;
  text-decoration: none;
  box-sizing: border-box;
}

.congreso-block__report-btn--disabled {
  opacity: 0.45;
  pointer-events: none;
  cursor: default;
}

@media (max-width: 980px) {
  .congreso-block__body {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .congreso-block__left {
    width: 100%;
  }

  .documents-grid-layout--wide {
    grid-template-columns: 1fr;
  }

  .documents-grid-layout--compact {
    justify-content: center;
  }

  .gallery-grid-layout {
    grid-template-columns: repeat(auto-fit, 150px);
  }
}

@media (max-width: 720px) {
  .memorias-section__container {
    padding-left: 14px;
    padding-right: 14px;
  }

  .memorias-section__intro {
    font-size: 18px;
  }

  .congreso-block__surface {
    padding: 16px;
  }

  .congreso-block__left {
    padding: 20px 16px 18px;
  }

  .congreso-block__year {
    font-size: 20px;
  }

  .congreso-block__event-name {
    font-size: 15px;
  }

  .congreso-block__description {
    font-size: 15px;
  }

  .congreso-block__report-btn {
    width: min(100%, 258px);
    font-size: 15px;
  }


  @media (max-width:1024px){
    .congreso-block__body{
        grid-template-columns:1fr;
        gap:24px;
    }

    .congreso-block__left{
        width:100%;
        max-width:none;
    }

    .congreso-block__right{
        width:100%;
    }

  }
  @media (max-width:768px){
    .documents-grid-layout--compact{
        width:100%;
        grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    }

    .gallery-grid-layout{
        width:100%;
        grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    }

    .deliverable-mini-card--compact{
        width:100%;
    }

    .gallery-card{
        width:100%;
        aspect-ratio:1;
        height:auto;
    }
  }

  @media (max-width:560px){
    .congreso-block__surface{
        padding:14px;
    }

    .congreso-block__right{
        padding:16px;
    }

    .documents-grid-layout--wide,
    .documents-grid-layout--compact,
    .gallery-grid-layout{
        grid-template-columns:1fr;
    }
    .deliverable-mini-card--compact{
        width:100%;
        min-height:120px;
    }
    .gallery-card{
        width:100%;
        max-width:none;
    }
    .congreso-block__report-btn{
        width:100%;
    }
    }
}
</style>