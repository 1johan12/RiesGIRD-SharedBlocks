<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'
import { formatImageUrl } from '@shared/helpers/url'

type CategoriaTab = {
  label: string
  value: string
  color?: string
}

type DocumentoItem = {
  tipo?: string
  titulo?: string
  fileUrl?: string
  imageUrl?: string
}

type DocumentosDictionary = Record<string, DocumentoItem[]>

type KnowledgeBlockData = {
  title?: string
  introText?: string
  categorias?: CategoriaTab[]
  documentos?: DocumentosDictionary
}

const props = defineProps<{
  data: KnowledgeBlockData | null
}>()

const title = computed(() => props.data?.title || 'Encuentre su Memoria')
const introText = computed(
  () =>
    props.data?.introText ||
    'Accede a los documentos oficiales que rigen el funcionamiento de nuestra Red, así como a los planes de trabajo, actas del Consejo Directivo y lineamientos técnicos internos para nuestras universidades miembro.'
)

const defaultCategoryColor = (index: number) =>
  index % 2 === 0 ? '#E1113F' : '#274E9D'

const categorias = computed<CategoriaTab[]>(() => {
  const raw = props.data?.categorias

  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((cat, index) => ({
      ...cat,
      color: cat.color || defaultCategoryColor(index)
    }))
  }

  return [
    {
      label: 'Documentos\nde Gobernanza',
      value: 'gobernanza',
      color: '#E1113F'
    },
    {
      label: 'Planes\nOperativos',
      value: 'planes',
      color: '#274E9D'
    },
    {
      label: 'Actas y\nResoluciones',
      value: 'actas',
      color: '#E1113F'
    }
  ]
})

const documentos = computed<DocumentosDictionary>(() => props.data?.documentos || {})

const categoriaActiva = ref('')

watch(
  categorias,
  (list) => {
    if (!list.length) return

    if (!categoriaActiva.value || !list.some((cat) => cat.value === categoriaActiva.value)) {
      categoriaActiva.value = list[0].value
    }
  },
  { immediate: true }
)

const docsActivos = computed<DocumentoItem[]>(() => {
  return documentos.value[categoriaActiva.value] ?? []
})

const getCategoryColor = (cat: CategoriaTab, index: number) => {
  return cat.color || defaultCategoryColor(index)
}

const handleCardClick = (doc: DocumentoItem, event: MouseEvent) => {
  if (!doc.fileUrl) {
    event.preventDefault()
  }
}
</script>

<template>
  <section class="memory-block">
    <div class="memory-block__container">
      <header class="memory-block__header">
        <SectionTitle
          v-if="title"
          :title="title"
        />

        <p
          v-if="introText"
          class="memory-block__intro"
        >
          {{ introText }}
        </p>
      </header>

      <div
        v-if="categorias.length"
        class="memory-block__filters"
      >
        <button
          v-for="(cat, index) in categorias"
          :key="cat.value"
          type="button"
          class="memory-block__filter"
          :class="{ 'memory-block__filter--active': categoriaActiva === cat.value }"
          :aria-pressed="categoriaActiva === cat.value"
          @click="categoriaActiva = cat.value"
        >
          <span class="memory-block__filter-label">
            {{ cat.label }}
          </span>

          <span
            class="memory-block__filter-divider"
            :style="{ backgroundColor: getCategoryColor(cat, index) }"
          />

          <span
            class="memory-block__filter-arrow"
            :style="{ color: getCategoryColor(cat, index) }"
          >
            <i class="bi bi-chevron-down"></i>
          </span>
        </button>
      </div>

      <div
        v-if="docsActivos.length"
        class="memory-block__grid"
      >
        <a
          v-for="(doc, index) in docsActivos"
          :key="doc.fileUrl ? `${index}-${doc.fileUrl}` : index"
          class="memory-block__card"
          :class="{ 'memory-block__card--disabled': !doc.fileUrl }"
          :href="formatImageUrl(doc.fileUrl)"
          :target="doc.fileUrl ? '_blank' : '_self'"
          :rel="doc.fileUrl ? 'noopener noreferrer' : undefined"
          @click="handleCardClick(doc, $event)"
        >
          <div class="memory-block__visual">
            <img
              v-if="doc.imageUrl"
              :src="formatImageUrl(doc.imageUrl)"
              :alt="doc.titulo || 'Documento'"
              class="memory-block__image"
            />

            <div
              v-else
              class="memory-block__avatar"
            >
              <span class="memory-block__avatar-ring">
                <i class="bi bi-person-fill"></i>
              </span>
            </div>
          </div>

          <span class="memory-block__divider"></span>

          <div class="memory-block__content">
            <span class="memory-block__type">
              {{ doc.tipo || 'Documento' }}
            </span>

            <h3
              v-if="doc.titulo"
              class="memory-block__title"
              :title="doc.titulo"
            >
              {{ doc.titulo }}
            </h3>
          </div>
        </a>
      </div>

      <div
        v-else
        class="memory-block__empty"
      >
        <i class="bi bi-folder2-open memory-block__empty-icon"></i>
        <p class="memory-block__empty-text">
          No se encontraron documentos en esta categoría.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.memory-block {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding-top:40px;
}

.memory-block__container {
  width: min(100%, 1200px);
  margin: 0 auto;
  padding: 0 20px 60px;
  box-sizing: border-box;
}

.memory-block__header {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.memory-block__intro {
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

.memory-block__filters {
  width: 100%;
  margin: 32px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px 22px;
}

.memory-block__filter {
  width: 224px;
  min-height: 52px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  align-items: stretch;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.memory-block__filter:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.14);
}

.memory-block__filter-label {
  flex: 1;
  padding: 10px 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.15;
  color: #555555;
  text-align: center;
  white-space: pre-line;
}

.memory-block__filter-divider {
  width: 2px;
  align-self: stretch;
  flex: 0 0 2px;
}

.memory-block__filter-arrow {
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  flex: 0 0 34px;
}

.memory-block__grid {
  width: min(100%, 845px);
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  justify-content: center;
  gap: 39px;
  align-items: start;
  overflow: visible;
}

.memory-block__card {
  min-width: 0;
  min-height: 156px;
  padding: 10px;
  border-radius: 8px;
  overflow: visible;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: stretch;
  gap: 11px;
  text-decoration: none;
  color: inherit;
  box-sizing: border-box;
}

.memory-block__card--disabled {
  opacity: 0.82;
  cursor: default;
}

.memory-block__visual {
  width: 133px;
  min-width: 133px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.memory-block__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.memory-block__avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.memory-block__avatar-ring {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 3.1rem;
  line-height: 1;
  box-sizing: border-box;
}

.memory-block__divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
  flex-shrink: 0;
}

.memory-block__content {
  flex: 1;
  min-width: 0;
  padding: 18px 18px 18px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.memory-block__type {
  margin: 0 0 4px;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #777777;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.memory-block__title {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.memory-block__empty {
  margin-top: 40px;
  text-align: center;
  color: #9ca3af;
}

.memory-block__empty-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.memory-block__empty-text {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}

@media (max-width: 980px) {
  .memory-block__grid {
    grid-template-columns: 1fr;
    max-width: 403px;
  }

  .memory-block__card {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .memory-block__container {
    padding-left: 14px;
    padding-right: 14px;
  }

  .memory-block__intro {
    font-size: 18px;
  }

  .memory-block__filter {
    width: min(100%, 224px);
  }

  .memory-block__grid {
    margin-top: 32px;
  }

  .memory-block__visual {
    width: 118px;
    min-width: 118px;
  }

  .memory-block__content {
    padding: 16px 14px 16px 0;
  }

  .memory-block__title {
    font-size: 13px;
  }
}
</style>