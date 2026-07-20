<script setup lang="ts">
import { computed } from 'vue';
import { formatImageUrl } from '@shared/helpers/url';

const props = defineProps<{
  data: any
}>();

// --- MAPEO DE CONTENIDO REACTIVO ---
const visionTitle = computed(() => props.data?.visionTitle || 'Nuestra Visión');
const visionText = computed(() => props.data?.visionText || '');
const visionImageUrl = computed(() => props.data?.visionImageUrl || '/placeholder-vision.png');

const misionTitle = computed(() => props.data?.misionTitle || 'Nuestra Misión');
const misionText = computed(() => props.data?.misionText || '');
const misionImageUrl = computed(() => props.data?.misionImageUrl || '/placeholder-mision.png');
</script>

<template>
  <section class="mision-vision-section">
    <div class="mision-vision-wrapper">

      <!-- VISIÓN -->
      <article class="info-card info-card--vision">
        <div class="corner-blue"></div>

        <div class="info-content">
          <div class="icon-box icon-box--blue">
            <i class="las la-eye"></i>
          </div>

          <h3 class="info-title">
            {{ visionTitle }}
          </h3>

          <p class="info-text">
            {{ visionText }}
          </p>
        </div>

        <div class="image-box">
          <img
            :src="visionImageUrl"
            :alt="visionTitle"
            class="info-image"
          />
        </div>
      </article>

      <!-- MISIÓN -->
      <article class="info-card info-card--mision">
        <div class="corner-red"></div>

        <div class="image-box">
          <img
            :src="formatImageUrl(misionImageUrl)"
            :alt="misionTitle"
            class="info-image"
          />
        </div>

        <div class="info-content">
          <div class="icon-box icon-box--red">
            <i class="las la-flag"></i>
          </div>

          <h3 class="info-title">
            {{ misionTitle }}
          </h3>

          <p class="info-text">
            {{ misionText }}
          </p>
        </div>
      </article>

    </div>
  </section>
</template>
<style scoped>
.mision-vision-section {
  width: 100%;
  background: #ffffff;
  padding: 0 0 60px;
  box-sizing: border-box;
}

.mision-vision-wrapper {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 40px 53px;

  background: #f2f7ff;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 35px;
}

/* CARD GENERAL */

.info-card {
  position: relative;

  width: 100%;
  min-height: 310px;

  background: #ffffff;
  border-radius: 8px;

  padding: 40px 80px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;

  box-sizing: border-box;
  overflow: hidden;
}

/* ESQUINAS */

.corner-blue {
  position: absolute;
  top: 0;
  right: 0;

  width: 50px;
  height: 50px;

  background: #c7d5f4;

  border-bottom-left-radius: 100%;
}

.corner-red {
  position: absolute;
  top: 0;
  left: 0;

  width: 50px;
  height: 50px;

  background: #efc8d6;

  border-bottom-right-radius: 100%;
}

/* CONTENIDO */

.info-content {
  width: 50%;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

/* ICONO */

.icon-box {
  width: 66px;
  height: 66px;

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 18px;
}

.icon-box i {
  font-size: 31px;
  color: #ffffff;
}

.icon-box--blue {
  background: #274E9D;
}

.icon-box--red {
  background: #E1113F;
}

/* TITULO */

.info-title {
  margin: 0 0 16px;

  font-family: var(--font-bricolage) !important;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;

  color: #111111;
}

/* TEXTO */

.info-text {
  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;

  color: #111111;

  text-align: justify;
}

/* IMAGEN */

.image-box {
  width: 288px;
  /* height: 230px; */
  flex-shrink: 0;

  display: flex;
  justify-content: center;
}

.info-image {
  width: 288px;
  height: 230px;

  object-fit: cover;

  border-radius: 8px;

  display: block;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .info-card,
  .info-card--mision {
    flex-direction: column;
    gap: 30px;
    padding: 35px 25px;
  }

  .info-card--mision {
    flex-direction: column-reverse;
  }

  .info-content {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .mision-vision-wrapper {
    padding: 20px;
    gap: 24px;
  }

  .info-card {
    padding: 28px 18px;
  }

  .info-title {
    font-size: 18px;
  }

  .info-text {
    font-size: 14px;
  }

  .image-box,
  .info-image {
    width: 100%;
    max-width: 288px;
    height: auto;
    aspect-ratio: 288 / 230;
  }

  .corner-blue,
  .corner-red {
    width: 70px;
    height: 70px;
  }
}
</style>