<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

const props = defineProps<{
  data: any
}>();

// --- LÓGICA REACTIVA DEL CANVAS ---
const title = computed(() => props.data?.title || 'Documentación Formal y Respaldo');
const introText = computed(() => props.data?.introText || 'Toda nuestra estrategia de transversalización está respaldada por marcos normativos nacionales e internacionales. Ponemos a disposición de la comunidad universitaria los siguientes documentos base:');
const documentos = computed(() => props.data?.documentos || []);

</script>

<template>
  <section class="documentacion-section" v-if="documentos.length > 0">
    <div class="container-fluid-d">
      
      <div class="header-block">
        <h2 class="main-title" v-if="title">{{ title }}</h2>
        <p class="section-intro" v-if="introText">
          {{ introText }}
        </p>
      </div>

      <div class="documentos-grid">
        <a 
          v-for="(doc, index) in documentos" 
          :key="doc.id || index" 
          :href="formatImageUrl(doc.fileUrl)"
          :target="doc.fileUrl ? '_blank' : '_self'"
          class="documento-card"
          :class="{ 'has-file': doc.fileUrl }"
          :title="doc.fileUrl ? 'Click para abrir documento' : ''"
        >
          
          <span class="pdf-tag" v-if="doc.tag">{{ doc.tag }}</span>

          <div class="avatar-circle">
            <svg v-if="doc.fileUrl" class="avatar-icon text-success-light" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <svg v-else class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/>
            </svg>
          </div>

          <h3 class="doc-title" v-if="doc.title">{{ doc.title }}</h3>
          <p class="doc-institution" v-if="doc.institution">{{ doc.institution }}</p>
          <p class="doc-desc" v-if="doc.desc">{{ doc.desc }}</p>

          <span class="download-indicator" v-if="doc.fileUrl">
            Ver recurso de libre acceso →
          </span>

        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.documentacion-section {
  width: 100%;
  background: #ffffff;
  padding: 0;
  box-sizing: border-box;
}

.container-fluid-d {
  width: min(100%, 1026px);
  margin: 0 auto;
}

.header-block {
  text-align: center;
  margin-bottom: 48px;
}

.main-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;

  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #111111;
}

.main-title::after {
  content: "";
  width: 100%;
  height: 3px;
  margin-top: 10px;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
}

.section-intro {
  max-width: 610px;

  margin: 25px auto 0;

  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;

  color: #1d1d1d;

  text-align: center;
}

.documentos-grid {
  display: grid;
  grid-template-columns: repeat(3, 310px);
  justify-content: center;

  gap: 24px;
}

.documento-card {
  width: 310px;
  min-height: 417px;
  padding: 18px 15px 24px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #efefef;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 8px 18px rgba(0,0,0,0.04);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  transition: box-shadow .2s ease;
}

.documento-card.has-file:hover {
  box-shadow:
    0 4px 12px rgba(0,0,0,0.08),
    0 12px 24px rgba(0,0,0,0.06);
}

.pdf-tag {
  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
  /* padding-top: 10px; */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.avatar-circle {
  width: 66px;
  height: 66px;

  border-radius: 50%;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;

  flex-shrink: 0;
}

.avatar-icon {
  width: 38px;
  height: 38px;
  color: #ffffff;
}

.avatar-icon.text-success-light {
  color: #ffffff;
}

.doc-title {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  color: black;
}

.doc-institution {
  margin: 0;
  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  color: #e1113f;
  text-decoration: underline;
}

.doc-desc {
  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;

  color: #4a4a4a;

  text-align: justify;
}

.download-indicator {
  display: none;
}

@media (max-width: 1080px) {
  .documentos-grid {
    grid-template-columns: repeat(2, 310px);
  }
}

@media (max-width: 720px) {
  .documentos-grid {
    grid-template-columns: 310px;
  }

  .main-title {
    font-size: 24px;
  }
}
</style>