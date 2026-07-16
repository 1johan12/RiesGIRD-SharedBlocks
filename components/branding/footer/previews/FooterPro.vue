<script setup lang="ts">
import { computed } from 'vue';

// --- CONTRATOS DE TIPADO ESTRICTOS ---
interface LinkItem {
  text: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: LinkItem[];
}

interface FooterConfig {
  logoUrl?: string;
  logoHeight?: number | string;
  description?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  bulletColor?: string;
  bottomBgColor?: string;
  bottomTextColor?: string;
  footerColumns?: FooterColumn[];
  copyrightText?: string;
}

const props = defineProps<{ 
  config: FooterConfig | null;
  linkComponent?: any; // Permite inyectar NuxtLink o RouterLink desde el orquestador
}>();

// Mapeador reactivo defensivo para decidir la etiqueta de enrutamiento sin romper el SPA
const linkTag = computed(() => {
  if (props.linkComponent) return props.linkComponent;
  // Detecta defensivamente si corre en el entorno de Nuxt 3 o Vue 3 tradicional
  const isNuxt = typeof window !== 'undefined' && ('__NUXT__' in window || 'NuxtLink' in window);
  return isNuxt ? 'NuxtLink' : 'router-link';
});

// Helper reactivo que parcha nulos e inyecta los tokens cromáticos de la maqueta
const safeConfig = computed(() => ({
  logoUrl: props.config?.logoUrl || '',
  logoHeight: Number(props.config?.logoHeight) || 60,
  description: props.config?.description || '',
  bgColor: props.config?.bgColor || '#1e40af',        // Azul principal RiesGIRD
  textColor: props.config?.textColor || '#e0f2fe',    // Celeste claro legible
  accentColor: props.config?.accentColor || '#ffffff',  // Blanco para títulos
  bulletColor: props.config?.bulletColor || '#93c5fd',  // Azul claro para las viñetas
  bottomBgColor: props.config?.bottomBgColor || '#173287', // Base marina oscura
  bottomTextColor: props.config?.bottomTextColor || '#93c5fd',
  footerColumns: props.config?.footerColumns || [],
  copyrightText: props.config?.copyrightText || 'Riesgird - ACC | Todos los derechos reservados.'
}));
</script>

<template>
  <footer 
    class="main-footer" 
    :style="{
      '--f-bg': safeConfig.bgColor,
      '--f-text': safeConfig.textColor,
      '--f-accent': safeConfig.accentColor,
      '--f-bullet': safeConfig.bulletColor,
      '--f-bottom-bg': safeConfig.bottomBgColor,
      '--f-bottom-text': safeConfig.bottomTextColor
    }"
  >
    <div class="footer-container">
      <h5 hidden>FormalLP - AgenteJ</h5>
      <div class="footer-brand-column">
        <img 
          v-if="safeConfig.logoUrl" 
          :src="safeConfig.logoUrl" 
          alt="Logo Institucional" 
          class="footer-logo" 
          :style="{ height: safeConfig.logoHeight + 'px' }"
        />
        <h2 v-else class="fallback-brand-title">RIESGIRD</h2>
        <p class="brand-description-text">{{ safeConfig.description }}</p>
      </div>

      <div class="footer-links-grid" v-if="safeConfig.footerColumns.length > 0">
        <div 
          v-for="(col, i) in safeConfig.footerColumns" 
          :key="i" 
          class="links-column"
        >
          <h3 class="column-title">{{ col.title }}</h3>
          <ul class="links-list" v-if="col.links && col.links.length > 0">
            <li v-for="(link, li) in col.links" :key="li">
              <component :is="linkTag" :to="link.url" class="interactive-anchor">
                {{ link.text }}
              </component>
            </li>
          </ul>
        </div>
      </div>
      

    </div>

    <div class="footer-bottom-bar">
      <p class="copyright-text">
        © Copyright {{ new Date().getFullYear() }} - {{ safeConfig.copyrightText }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
/* =========================================================================
   🎨 MAQUETACIÓN NATIVA PREMIUM EN CSS PURO (DISEÑO BLINDADO 1:1)
   ========================================================================= */

.main-footer {
  background-color: var(--f-bg);
  width: 100%;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  padding-top: 50px;
  margin-top: 60px;
  overflow: hidden;
  box-sizing: border-box;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  box-sizing: border-box;
}

/* Columna de Identidad */
.footer-brand-column {
  flex-shrink: 0;
  width: 100%;
  max-width: 280px;
  text-align: left;
}

.footer-logo {
  max-width: 100%;
  width: auto;
  object-fit: contain;
  margin-bottom: 20px;
  display: block;
}

.fallback-brand-title {
  color: var(--f-accent);
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 15px 0;
  letter-spacing: -0.02em;
}

.brand-description-text {
  color: var(--f-text);
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.85;
}

/* Rejilla Modular de Enlaces */
.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Soporte nativo simétrico de 5 columnas en paralelo */
  gap: 24px;
  flex: 1;
}

.links-column {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.column-title {
  color: var(--f-accent);
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Viñetas esféricas calculadas en CSS nativo */
.links-list li {
  position: relative;
  padding-left: 14px;
}

.links-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--f-bullet);
  font-size: 1rem;
  top: -2px;
  line-height: 1;
}

.interactive-anchor {
  color: var(--f-text);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: color 0.2s ease, text-decoration 0.2s ease;
  line-height: 1.3;
  display: inline-block;
}

.interactive-anchor:hover {
  color: var(--f-accent);
  text-decoration: underline;
}

/* Franja Base del Copyright */
.footer-bottom-bar {
  background-color: var(--f-bottom-bg);
  width: 100%;
  padding: 18px 20px;
  margin: 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  box-sizing: border-box;
}

.copyright-text {
  color: var(--f-bottom-text);
  font-size: 0.85rem;
  margin: 0;
  font-weight: 500;
}

/* =========================================================================
   📱 DISEÑO RESPONSIVO INTEGRADO (ADAPTABILIDAD ALIENADA)
   ========================================================================= */

@media (max-width: 1100px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 35px;
  }
  .footer-brand-column {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-logo {
    margin-left: auto;
    margin-right: auto;
  }
  .footer-links-grid {
    width: 100%;
    grid-template-columns: repeat(3, 1fr); /* 3 columnas en pantallas intermedias */
    gap: 25px;
  }
  .links-column {
    text-align: center;
  }
  .links-list li {
    padding-left: 0;
  }
  .links-list li::before {
    display: none; 
  }
}

@media (max-width: 640px) {
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media (max-width: 440px) {
  .footer-links-grid {
    grid-template-columns: 1fr; /* Columna única vertical en celulares */
    gap: 20px;
  }
  .column-title {
    margin-bottom: 12px;
  }
}
</style>
