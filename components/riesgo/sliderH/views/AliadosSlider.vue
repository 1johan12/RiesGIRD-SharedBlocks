<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

const title = computed(() => props.data?.title || 'Aliados');

const logos = computed(() => {
  if (Array.isArray(props.data?.logos)) {
    return props.data.logos;
  }
  return [];
});

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';

  if (
    url.startsWith('http') ||
    url.startsWith('https') ||
    url.startsWith('data:') ||
    url.startsWith('/')
  ) {
    return url;
  }

  return `http://127.0.0.1:4000/storage/${url}`;
};
</script>

<template>
  <section class="allies-section">
    <div class="allies-container">

      <div class="allies-content">

        <header class="allies-header">
          <h2
            v-if="title"
            class="allies-title"
          >
            {{ title }}
          </h2>
        </header>

        <div
          v-if="logos.length"
          class="allies-slider"
        >
          <div class="allies-track">

            <div
              v-for="(logo, index) in logos"
              :key="`first-${logo.id || index}`"
              class="allies-item"
            >
              <img
                :src="formatImageUrl(logo.src)"
                :alt="logo.name || 'Aliado'"
                class="allies-logo"
              />
            </div>

            <div
              v-for="(logo, index) in logos"
              :key="`second-${logo.id || index}`"
              class="allies-item"
            >
              <img
                :src="formatImageUrl(logo.src)"
                :alt="logo.name || 'Aliado'"
                class="allies-logo"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.allies-section {
  width: 100%;
  background: #ffffff;
  padding: 0 0 50px;
  box-sizing: border-box;
}

.allies-container {
  width: min(100%, 1076px);
  margin: 0 auto;
  padding: 20px 15px;
  background: #f2f7ff;
  box-sizing: border-box;
  border-radius: 8px;
}

.allies-content {
  width: min(100%, 1046px);
  margin: 0 auto;
  padding: 14px 0 24px;
  background: #ffffff;
  box-sizing: border-box;
}

.allies-header {
  text-align: center;
  margin-bottom: 50px;
}

.allies-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;

  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;

  color: #111111;
}

.allies-title::after {
  content: "";

  width: 100%;
  height: 3px;

  margin-top: 3px;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
}

/* ===== CARRUSEL ===== */

.allies-slider {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.allies-track {
  width: max-content;

  display: flex;
  align-items: center;

  animation: allies-scroll 28s linear infinite;
}

.allies-track:hover {
  animation-play-state: paused;
}

.allies-item {
  width: 284px;

  min-width: 284px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0 18px;

  box-sizing: border-box;
}

.allies-logo {
  max-width: 100%;
  max-height: 110px;

  width: auto;
  height: auto;

  object-fit: contain;

  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  opacity: 0.75;
}

.allies-item:hover .allies-logo {
  opacity: 1;
  transform: scale(1.05);
}

@keyframes allies-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

/* ===== TABLET ===== */

@media (max-width: 1024px) {
  .allies-container {
    padding: 20px;
  }

  .allies-item {
    width: 240px;
    min-width: 240px;
  }

  .allies-logo {
    max-height: 90px;
  }
}

/* ===== MOBILE ===== */

@media (max-width: 768px) {
  .allies-content {
    padding: 18px 0 20px;
  }

  .allies-title {
    font-size: 24px;
  }

  .allies-item {
    width: 180px;
    min-width: 180px;
    padding: 0 12px;
  }

  .allies-logo {
    max-height: 70px;
  }
}

@media (max-width: 480px) {
  .allies-title {
    font-size: 21px;
  }

  .allies-item {
    width: 150px;
    min-width: 150px;
  }

  .allies-logo {
    max-height: 55px;
  }
}
</style>