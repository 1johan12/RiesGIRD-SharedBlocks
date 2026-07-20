<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SectionTitle from '../../section/title/SectionTitle.vue'
import { formatImageUrl } from '@shared/helpers/url';


interface BlockData {
  title?: string
  limit?: number | string
}

interface AliadoEntity {
  id: number
  name: string
  business_name: string
  tax_id: string
  email: string
  phone: string
  logo_url: string
  type: string
}

const props = defineProps<{
  data: BlockData | null
}>()

const title = computed(() => props.data?.title || 'Busca su Aliado')
const limit = computed(() => Number(props.data?.limit) || 12)

const items = ref<AliadoEntity[]>([])
const pending = ref(false)
const categoriaActiva = ref<string | null>(null)

const categorias = [
  { label: 'Empresa', value: 'empresa' },
  { label: 'Institución', value: 'institucion' },
  { label: 'Cooperación', value: 'cooperacion' },
  { label: 'ETC', value: 'etc' }
]


const displayCategoryLabel = (typeString: string) => {
  if (!typeString) return 'Aliado'

  const found = categorias.find(c => c.value === typeString.toLowerCase())
  return found ? found.label : typeString.charAt(0).toUpperCase() + typeString.slice(1)
}

const toggleCategoria = (value: string) => {
  categoriaActiva.value = categoriaActiva.value === value ? null : value
}

const aliadosFiltrados = computed(() => {
  if (!categoriaActiva.value) return items.value
  return items.value.filter(a => a.type?.toLowerCase() === categoriaActiva.value)
})

const fetchAliadosFromFastify = async () => {
  pending.value = true
  try {
    const url = `http://localhost:4000/api/public/partners?limit=${limit.value}`
    const response = await fetch(url)

    if (response.ok) {
      const resData = await response.json()
      items.value = resData?.data || resData || []
    } else {
      injectMockAliados()
    }
  } catch (error) {
    console.error('Error devorando el listado de aliados Fastify:', error)
    injectMockAliados()
  } finally {
    pending.value = false
  }
}

const injectMockAliados = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window
  if (!isNuxtEnvironment) {
    items.value = [
      {
        id: 1,
        name: 'Pacífico Seguros',
        business_name: 'Pacífico S.A.',
        tax_id: '2010',
        email: 'rectorado@upl.edu.pe',
        phone: '—',
        type: 'empresa',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Pac%C3%ADfico_Seguros_logo.svg/320px-Pac%C3%ADfico_Seguros_logo.svg.png'
      },
      {
        id: 2,
        name: 'RiesGird - ACC',
        business_name: 'RiesGird Org',
        tax_id: '2020',
        email: 'rectorado@untels.edu.pe',
        phone: '905452095',
        type: 'cooperacion',
        logo_url: 'https://riesgird.org/logo.png'
      },
      {
        id: 3,
        name: 'Colegio de Ingenieros del Perú',
        business_name: 'CIP Nacional',
        tax_id: '2030',
        email: 'rectorado@unjuu.edu.pe',
        phone: '936 759 046',
        type: 'institucion',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Colegio_de_Ingenieros_del_Per%C3%BA.svg/200px-Colegio_de_Ingenieros_del_Per%C3%BA.svg.png'
      },
      {
        id: 4,
        name: 'BID Mejorando Vidas',
        business_name: 'BID Corp',
        tax_id: '2040',
        email: 'rectorado@untumbes.edu.pe',
        phone: '—',
        type: 'institucion',
        logo_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Logo_BID_%28Inter-American_Development_Bank%29.svg/320px-Logo_BID_%28Inter-American_Development_Bank%29.svg.png'
      }
    ].slice(0, limit.value)
  } else {
    items.value = []
  }
}

watch(
  () => limit.value,
  () => {
    fetchAliadosFromFastify()
  },
  { immediate: true }
)
</script>

<template>
  <section class="aliados-section">
    <div class="aliados-section__outer">
      <div class="aliados-section__inner">
        <SectionTitle v-if="title" :title="title" :padding-bottom="10" />

        <div class="aliados-section__filters" v-if="items.length > 0">
          <button
            v-for="cat in categorias"
            :key="cat.value"
            type="button"
            class="filter-chip"
            :class="{
              'filter-chip--active': categoriaActiva === cat.value,
              'filter-chip--grey': cat.value === 'cooperacion' || cat.value === 'etc'
            }"
            @click="toggleCategoria(cat.value)"
          >
            <span class="filter-chip__label">{{ cat.label }}</span>

            <span class="filter-chip__divider"></span>

            <i class="bi bi-chevron-down filter-chip__arrow"></i>
          </button>
        </div>

        <div v-if="pending" class="aliados-section__loader">
          <div class="aliados-section__spinner"></div>
          <span class="aliados-section__loader-text">
            Consultando red de aliados institucionales...
          </span>
        </div>

        <div v-else-if="aliadosFiltrados.length > 0" class="aliados-section__grid">
          <article
            v-for="aliado in aliadosFiltrados"
            :key="aliado.id"
            class="aliado-card"
          >
            <div class="aliado-card__logo-wrap">
              <img
                v-if="aliado.logo_url"
                :src="formatImageUrl(aliado.logo_url)"
                :alt="aliado.name"
                class="aliado-card__logo"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />

              <div v-else class="aliado-card__logo-fallback">
                <i class="bi bi-building-fill aliado-card__fallback-icon"></i>
              </div>
            </div>

            <div class="aliado-card__divider"></div>

            <div class="aliado-card__info">
              <span class="aliado-card__category">
                {{ displayCategoryLabel(aliado.type) }}
              </span>

              <h3 class="aliado-card__name">
                {{ aliado.name }}
              </h3>

              <div class="aliado-card__contacts">
                <div v-if="aliado.email" class="aliado-card__contact">
                  <i class="bi bi-envelope-fill aliado-card__contact-icon"></i>
                  <span class="aliado-card__contact-text">{{ aliado.email }}</span>
                </div>

                <div
                  v-if="aliado.phone && aliado.phone !== '—'"
                  class="aliado-card__contact"
                >
                  <i class="bi bi-telephone-fill aliado-card__contact-icon"></i>
                  <span class="aliado-card__contact-text">{{ aliado.phone }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="aliados-section__empty">
          <i class="bi bi-folder-x aliados-section__empty-icon"></i>
          <p>No se encontraron aliados estratégicos para esta categoría en este momento.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aliados-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0;
}

.aliados-section__outer {
  margin: 0 auto;
  padding: 28px;
  box-sizing: border-box;
  border-radius: 8px;
}

.aliados-section__inner {
  width: min(100%, 906px);
  margin: 0 auto;
  padding: 26px 24px 30px;
  box-sizing: border-box;
  background: #ffffff;
}

.aliados-section__filters {
  width: 100%;
  margin: 32px auto 0;
  display: grid;
  grid-template-columns: repeat(4, 224px);
  justify-content: center;
  gap: 18px;
}

.filter-chip {
  width: 224px;
  height: 42px;
  padding: 15px 25px;
  box-sizing: border-box;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
}

.filter-chip--grey {
  background: #e7e7e7;
}

.filter-chip__label {
  flex: 1;
  min-width: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  color: #555555;
  text-align: center;
  line-height: 1.1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.filter-chip__divider {
  width: 1px;
  height: 22px;
  margin: 0 10px;
  flex-shrink: 0;
  background: #e1113f;
}

.filter-chip--active .filter-chip__divider {
  background: #274e9d;
}

.filter-chip--grey .filter-chip__divider {
  background: #9d9d9d;
}

.filter-chip__arrow {
  font-size: 14px;
  line-height: 1;
  color: #e1113f;
  flex-shrink: 0;
}

.filter-chip--active .filter-chip__arrow {
  color: #274e9d;
}

.filter-chip--grey .filter-chip__arrow {
  color: #9d9d9d;
}

.aliados-section__loader {
  padding: 4rem 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.aliados-section__spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2.5px solid #e5e7eb;
  border-top-color: #e1113f;
  animation: aliadosSpin 0.6s linear infinite;
}

@keyframes aliadosSpin {
  to {
    transform: rotate(360deg);
  }
}

.aliados-section__loader-text {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--font-raleway) !important;
}

.aliados-section__grid {
  width: 100%;
  margin: 36px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  justify-content: center;
  gap: 39px;
  align-items: stretch;
}

.aliado-card {
  width: 100%;
  max-width: 403px;
  min-height: 155px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
}

.aliado-card__logo-wrap {
  width: 95px;
  min-width: 95px;
  height: 155px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  box-sizing: border-box;
  margin: 0 20px;
  flex-shrink: 0;
}

.aliado-card__logo {
  width: 95px;
  height: 65px;
  object-fit: contain;
  /* padding: 0px 20px; */
  display: block;
}

.aliado-card__logo-fallback {
  width: 95px;
  height: 65px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.aliado-card__fallback-icon {
  font-size: 2rem;
  line-height: 1;
}

.aliado-card__divider {
  width: 1px;
  height: 133px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
}

.aliado-card__info {
  flex: 1;
  min-width: 0;
  padding: 16px 18px 16px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.aliado-card__category {
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #111111;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.aliado-card__name {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  color: #111111;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.aliado-card__contacts {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.aliado-card__contact {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: var(--font-raleway) !important;
  font-size: 10px;
  font-weight: 400;
  color: #7e7e7e;
  line-height: 1.2;
  overflow: hidden;
}

.aliado-card__contact-icon {
  font-size: 10px;
  color: #7e7e7e;
  flex-shrink: 0;
}

.aliado-card__contact-text {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.aliados-section__empty {
  padding: 4rem 0 2rem;
  text-align: center;
  color: #94a3b8;
}

.aliados-section__empty-icon {
  display: block;
  font-size: 2.5rem;
  opacity: 0.45;
  margin-bottom: 8px;
}

.aliados-section__empty p {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}

@media (max-width: 1100px) {
  .aliados-section__outer {
    padding: 22px;
  }

  .aliados-section__inner {
    width: 100%;
  }

  .aliados-section__filters {
    grid-template-columns: repeat(2, 224px);
    gap: 14px 18px;
  }
}

@media (max-width: 920px) {
  .aliados-section__grid {
    grid-template-columns: 1fr;
    max-width: 403px;
  }

  .aliado-card {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .aliados-section__outer {
    padding: 16px;
  }

  .aliados-section__inner {
    padding: 20px 16px 24px;
  }

  .aliados-section__filters {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .filter-chip {
    width: 100%;
    max-width: 224px;
  }

  .aliado-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: auto;
    padding: 16px 14px;
  }

  .aliado-card__logo-wrap {
    width: 100%;
    min-width: 0;
    height: auto;
    padding: 0;
    margin-bottom: 10px;
  }

  .aliado-card__divider {
    width: 60%;
    height: 1px;
    margin: 12px 0;
    background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  }

  .aliado-card__info {
    align-items: center;
    text-align: center;
    padding: 0;
  }

  .aliado-card__contacts {
    align-items: center;
  }

  .aliado-card__contact {
    justify-content: center;
  }
}

@media (max-width: 420px) {
  .filter-chip__label,
  .filter-chip__disabled-text,
  .aliado-card__category,
  .aliado-card__name,
  .aliado-card__empty p {
    font-size: 13px;
  }

  .member-directory__button {
    font-size: 16px;
  }
}
</style>