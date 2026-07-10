<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- LÓGICA DE CONTENIDO Y ESTILOS ---
const text = computed(() => props.data?.text || 'Únete a la Red');
const url = computed(() => props.data?.url || '#');
const targetBlank = computed(() => props.data?.targetBlank ? '_blank' : '_self');
const bgGradient = computed(() => props.data?.bgGradient || 'linear-gradient(135deg, #db143c 0%, #7e22ce 50%, #25529a 100%)');

const reverseGradient = computed(() => {
  const gradient = bgGradient.value

  const matches = gradient.match(/#[0-9A-Fa-f]{3,8}/g)

  if (!matches || matches.length < 2) {
    return gradient
  }

  return `linear-gradient(
    90deg,
    ${matches[matches.length - 1]} 0%,
    ${matches[0]} 100%
  )`
})
</script>

<template>
  <div class="cta-container">
    <a 
      :href="url" 
      :target="targetBlank" 
      rel="noopener noreferrer"
      class="cta-banner-button"
      :style="{
        '--gradient-a': bgGradient,
        '--gradient-b': reverseGradient
      }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-user-add">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>

      <span class="cta-text">{{ text }}</span>

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="icon-arrow">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </a>
  </div>
</template>

<style scoped>

/* --- CONTENEDOR DEL BANNER --- */
.cta-container {
  width: 100%;
  max-width: 1100px;
  height: 64px;
  margin: 0 auto 40px auto;
  padding: 0 10px;
}

/* --- BOTÓN PRINCIPAL CON GRADIENTE 1:1 --- */
.cta-banner-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  text-decoration: none;
  border: none;
  border-radius: 12px;
  padding: 18px 30px;

  color: #ffffff;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  box-shadow: 0 4px 20px rgba(219, 20, 60, 0.15);

  transition:
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s ease;
}

.cta-banner-button::before {
  content: "";
  position: absolute;
  inset: 0;

  width: 600%;
  height: 100%;

  left: -100%;

  background:
    var(--gradient-a),
    var(--gradient-b),
    var(--gradient-a),
    var(--gradient-b);

  background-repeat: no-repeat;

  background-size:
    25% 100%,
    25% 100%,
    25% 100%,
    25% 100%;

  background-position:
    0% 0%,
    33.333% 0%,
    66.666% 0%,
    100% 0%;

  animation: ribbon 8s linear infinite;

  z-index: 0;
}

@keyframes ribbon {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(16%);
  }
}

.cta-text,
.icon-user-add,
.icon-arrow {
  position: relative;
  z-index: 1;
}

/* --- TEXTO INTERNO --- */
.cta-text {
  font-size: clamp(24px, 1.66vw, 32px);
  font-weight: 700;
  letter-spacing: 0.5px;
  font-family: var(--font-bricolage) !important;
}

/* --- ICONOS (SVG) --- */
.icon-user-add {
  width: 26px;
  height: 26px;
  transition: transform 0.3s ease;
}

.icon-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

/* --- EFECTOS INTERACTIVOS (HOVER) --- */
.cta-banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 82, 154, 0.25);
  color: #ffffff; /* Evita heredar colores extraños de enlaces globales */
}

.cta-banner-button:hover .icon-user-add {
  transform: scale(1.1);
}

.cta-banner-button:hover .icon-arrow {
  transform: translateX(5px);
}

.cta-banner-button:active {
  transform: translateY(1px);
}

/* --- RESPONSIVE DESIGN --- */
@media (max-width: 768px) {
  .cta-banner-button {
    padding: 15px 20px;
    border-radius: 10px;
  }
  
  .cta-text {
    font-size: 1.15rem;
  }

  .icon-user-add {
    width: 22px;
    height: 22px;
  }

  .icon-arrow {
    width: 16px;
    height: 16px;
  }
}
</style>