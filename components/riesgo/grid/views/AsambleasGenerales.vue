<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SectionTitle from '../../section/title/SectionTitle.vue';
import { formatImageUrl } from '@shared/helpers/url';

const props = defineProps<{
  data: any
}>();

// --- CONFIGURACIÓN REACTIVA DESDE EL PAGE BUILDER ---
const title = computed(() => props.data?.title || 'Asambleas Generales');
const limit = computed(() => Number(props.data?.limit) || 6);
const postType = computed(() => props.data?.postType || 'assemblies');

// --- ESTADOS REACTIVOS DEL CONSUMIDOR ---
const items = ref<any[]>([]);
const pending = ref(false);
const selectedYear = ref('');

/**
 * 🛰️ CONSUMO MAESTRO DIRECTO POR API FETCH
 * Golpea tu backend en Fastify trayendo el slug e identificadores únicos
 */
const fetchAsambleasFromFastify = async () => {
  pending.value = true;
  try {
    let url = `http://localhost:4000/api/public/news?limit=${limit.value}&type=${postType.value}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const resData = await response.json();
      const records = resData?.data || resData || [];
      console.log(resData);
      
      if (records.length > 0) {
        // Mapeamos quirúrgicamente las columnas de la BD al molde de tu UI
        items.value = records.map((post: any) => {
          const dateRef = post.start_date || post.created_at;
          const anioCalculado = dateRef ? new Date(dateRef).getFullYear().toString() : '2026';
          
          return {
            id: post.id,
            slug: post.slug || '', // 🎯 RECUPERADO EL SLUG DE LA BASE DE DATOS
            anio: anioCalculado,
            titulo: post.title,
            lugar: post.location || 'Sede Institucional',
            documento: post.attachment_url || 'Acuerdos y Conclusiones',
            sub_titulo: post.excerpt || 'Acuerdos y Conclusiones',
            fileUrl: post.attachment_url || post.action_url || '',
            imagen: post.featured_image_path || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=500'
          };
        });
      } else {
        injectMockData();
      }
    } else {
      injectMockData();
    }
  } catch (error) {
    console.error("Error devorando el feed de asambleas desde Fastify:", error);
    injectMockData();
  } finally {
    pending.value = false;
  }
};

// Resguardo visual (Mocks) en desarrollo para previsualizar los clics en el panel
const injectMockData = () => {
  const isNuxtEnvironment = typeof window !== 'undefined' && '__NUXT__' in window;
  if (!isNuxtEnvironment) {
    items.value = [
      { id: 1, slug: 'asamblea-ordinaria-2024', anio: '2024', titulo: 'Asamblea General Ordinaria 2024', lugar: 'Universidad ESAN', documento: 'Acuerdos y Conclusiones', imagen: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=500' },
      { id: 2, slug: 'asamblea-extraordinaria-2025', anio: '2025', titulo: 'Asamblea General Extraordinaria 2025', lugar: 'Sede Universidad Nacional', documento: 'Acuerdos y Conclusiones', imagen: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=500' },
      { id: 3, slug: 'asamblea-plenaria-rectores-2026', anio: '2026', titulo: 'Asamblea Plenaria de Rectores y Delegados 2026', lugar: 'Auditorio Principal CIP', documento: 'Acuerdos y Conclusiones', imagen: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500' }
    ].slice(0, limit.value);
  } else {
    items.value = [];
  }
};

watch([limit, postType], () => {
  fetchAsambleasFromFastify();
}, { immediate: true });

// --- FILTROS DE CLIENTE ---
const filteredAsambleas = computed(() => {
  if (!selectedYear.value) return items.value;
  return items.value.filter(item => item.anio === selectedYear.value);
});

const dynamicYears = computed(() => {
  const years = items.value.map(item => item.anio).filter(Boolean);
  return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
});


</script>

<template>
  <section class="asambleas-section">
    <div class="max-width-wrapper">
      <div class="content-shell">
        <SectionTitle v-if="title" :title="title" />

        <div class="select-filter-block" v-if="dynamicYears.length > 0">
          <div class="custom-select-card">
            <select v-model="selectedYear" class="native-dropdown-select">
              <option value="">Seleccione el año</option>
              <option v-for="year in dynamicYears" :key="year" :value="year">{{ year }}</option>
            </select>

            <div class="custom-arrow-wrapper">
              <div class="vertical-divider-red"></div>
              <svg class="dropdown-chevron-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div v-if="pending" class="loader-box">
          <div class="spinner-mini"></div>
          <span>Sincronizando actas desde Fastify...</span>
        </div>

        <div v-else-if="filteredAsambleas.length > 0" class="asambleas-grid-layout">
          <router-link
            v-for="(asamblea, index) in filteredAsambleas"
            :key="asamblea.id || index"
            :to="asamblea.slug ? '/assemblies/' + asamblea.slug : '/assemblies'"
            class="asamblea-card-item"
          >
            <div class="card-image-wrap">
              <img
                :src="asamblea.imagen"
                :alt="asamblea.titulo"
                class="asamblea-img-render"
              />
            </div>

            <div class="card-separator"></div>

            <div class="card-body">
              <span class="card-year">{{ asamblea.anio }}</span>

              <h3 class="card-title" :title="asamblea.titulo">
                {{ asamblea.titulo }}
              </h3>

              <div class="card-meta">
                <div class="meta-row-item" v-if="asamblea.lugar">
                  <i class="bi bi-geo-alt-fill meta-icon"></i>
                  <span class="truncate-text-line">{{ asamblea.lugar }}</span>
                </div>

                <div class="meta-row-item meta-subtitle" v-if="asamblea.sub_titulo">
                  <i class="bi bi-check2-square meta-icon"></i>
                  <span class="truncate-text-line">{{ asamblea.sub_titulo }}</span>
                </div>

                <a
                  v-if="asamblea.fileUrl"
                  :href="formatImageUrl(asamblea.fileUrl)(asamblea.fileUrl)"
                  target="_blank"
                  class="file-link"
                  @click.stop
                >
                  <i class="bi bi-file-earmark-text meta-icon file-icon"></i>
                  <span class="truncate-text-line">{{ asamblea.documento }}</span>
                </a>
              </div>
            </div>

            <div class="card-signature" aria-hidden="true">
              <img src="../../../../assets/Vector.svg" alt="" height="100px">
            </div>
          </router-link>
        </div>

        <div v-else class="fallback-no-data">
          <i class="las la-folder-open fallback-icon"></i>
          <p>No se encontraron actas oficiales registradas para el año solicitado.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.asambleas-section {
  width: 100%;
  padding: 40px 10px;
  /* background: #f5f6fb; */
  box-sizing: border-box;
  margin-bottom: 50px;
}

.max-width-wrapper {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}


.select-filter-block {
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

.custom-select-card {
  position: relative;
  width: min(100%, 210px);
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
  border: 1px solid #eceef5;
  padding: 12px 16px 12px 18px;
  box-sizing: border-box;
}

.native-dropdown-select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  appearance: none;
  cursor: pointer;
  padding-right: 38px;
  color: #8b8b8b;
  font-family: var(--font-raleway);
  font-size: 14px;
  font-weight: 400;
}

.custom-arrow-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
  padding-right: 14px;
}

.vertical-divider-red {
  width: 2px;
  height: 100%;
  margin-right: 12px;
  background: #e1113f
}

.dropdown-chevron-icon {
  width: 18px;
  height: 18px;
  color: #e1113f;
}

.asambleas-grid-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 403px));
  justify-content: center;
  gap: 34px 36px;
  margin-top: 48px;
}

.asamblea-card-item {
  position: relative;
  display: flex;
  align-items: center;
  width: 403px;
  min-height: 155px;
  border-radius: 10px;
  background: #ffffff;
  padding: 11px 74px 11px 11px;
  box-sizing: border-box;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.asamblea-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
}

.card-image-wrap {
  width: 133px;
  height: 133px;
  flex: 0 0 133px;
  border-radius: 8px;
  overflow: hidden;
}

.asamblea-img-render {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-separator {
  width: 1px;
  height: 100%;
  margin: 0 14px 0 12px;
  background: linear-gradient(180deg, #e1113f 0%, #274e9d 100%);
  flex: 0 0 1px;
}

.card-body {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 2px;
}

.card-year {
  font-family: var(--font-raleway);
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  color: #000000;
}

.card-title {
  margin: 0;
  font-family: var(--font-raleway);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.1;
  color: #000000;
  max-width: 155px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}

.meta-row-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: var(--font-raleway);
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  color: #7e7e7e;
}

.meta-subtitle {
  color: #7e7e7e;
}

.meta-icon {
  font-size: 12px;
  line-height: 1;
  flex: 0 0 auto;
  color: currentColor;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  min-width: 0;
  font-family: var(--font-raleway);
  font-size: 10px;
  font-weight: 400;
  color: #7e7e7e;
  margin-top: 2px;
}

.file-link:hover .truncate-text-line {
  text-decoration: underline;
}

.file-icon {
  font-size: 12px;
}

.truncate-text-line {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-signature {
  position: absolute;
  top: 50%;
  right: -15px;
  transform: translateY(-50%);
  width: 74px;
  height: 100px;
  border-radius: 999px 0 0 999px;
  /* background: linear-gradient(180deg, #d9d9d9 0%, #cfcfcf 100%); */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.95;
  pointer-events: none;
}

.signature-pin {
  font-size: 7;
  color: rgba(255, 255, 255, 0.96);
  transform: translateX(8px);
}

.loader-box,
.fallback-no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 42px 0 10px;
  font-family: var(--font-raleway);
  font-size: 14px;
  color: #64748b;
}

.spinner-mini {
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-top-color: #274e9d;
  border-radius: 50%;
  animation: rotarSpin 0.6s linear infinite;
}

@keyframes rotarSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .asambleas-grid-layout {
    grid-template-columns: 1fr;
  }

  .asamblea-card-item {
    width: min(100%, 403px);
  }
}

@media (max-width: 560px) {
  .content-shell {
    padding: 32px 16px 36px;
  }

  .asamblea-card-item {
    width: 100%;
    min-height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
  }

  .card-image-wrap {
    width: 100%;
    height: 133px;
    flex-basis: auto;
  }

  .card-separator {
    width: 100%;
    height: 1px;
    margin: 12px 0;
  }

  .card-body {
    padding-top: 0;
  }

  .card-title {
    max-width: none;
  }

  .card-signature {
    display: none;
  }
}
</style>