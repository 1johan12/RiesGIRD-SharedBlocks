<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- LÓGICA REACTIVA DEL CANVAS ---
const title = computed(() => props.data?.title || '¿Cómo colaboramos?');
const introText = computed(
  () =>
    props.data?.introText ||
    'Nuestra red transforma la competencia académica en cooperación estratégica. Trabajamos bajo un esquema de apoyo mutuo que nos permite potenciar las capacidades de cada región:'
);
const cards = computed(() => props.data?.cards || []);
const wideCard = computed(() => props.data?.wideCard || null);

// Helper defensivo para formatear rutas multimedia de tu storage Fastify/Laravel
const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `http://127.0.0.1:4000/storage/${url}`;
};
</script>

<template>
  <section class="colaboramos-section">
    <div class="colaboramos-section__outer">
      <div class="colaboramos-section__inner">
        <header class="colaboramos-section__header">
          <h2 class="colaboramos-section__title" v-if="title">
            {{ title }}
          </h2>

          <p class="colaboramos-section__intro" v-if="introText">
            {{ introText }}
          </p>
        </header>

        <div class="colaboramos-section__cards" v-if="cards.length > 0">
          <article v-for="(item, index) in cards" :key="item.id || index" class="colaboramos-card">
            <div class="colaboramos-card__image-wrap">
              <img
                v-if="item.imageUrl"
                :src="formatImageUrl(item.imageUrl)"
                :alt="item.title"
                class="colaboramos-card__image"
              />
              <div v-else class="colaboramos-card__placeholder">
                <i class="las la-image"></i>
              </div>
            </div>

            <h3 class="colaboramos-card__title" v-if="item.title">
              {{ item.title }}
            </h3>

            <p class="colaboramos-card__text" v-if="item.text">
              {{ item.text }}
            </p>
          </article>
        </div>

        <article class="colaboramos-card colaboramos-card--wide" v-if="wideCard">
          <div class="colaboramos-card--wide__image-wrap">
            <img
              v-if="wideCard.imageUrl"
              :src="formatImageUrl(wideCard.imageUrl)"
              :alt="wideCard.title"
              class="colaboramos-card__image"
            />
            <div v-else class="colaboramos-card__placeholder colaboramos-card__placeholder--wide">
              <i class="las la-image"></i>
            </div>
          </div>

          <div class="colaboramos-card--wide__body">
            <h3 class="colaboramos-card__title" v-if="wideCard.title">
              {{ wideCard.title }}
            </h3>

            <p class="colaboramos-card__text" v-if="wideCard.text">
              {{ wideCard.text }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.colaboramos-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 20px 0 0;
}

.colaboramos-section__outer {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 38px 76px 30px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
}

.colaboramos-section__inner {
  width: min(100%, 858px);
  min-height: 387px;
  margin: 0 auto;
  padding: 50px 28px 40px;
  box-sizing: border-box;
  background: #ffffff;
}

.colaboramos-section__header {
  text-align: center;
  margin-bottom: 48px;
}

.colaboramos-section__title {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #111111;
}

.colaboramos-section__title::after {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 4px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
}

.colaboramos-section__intro {
  max-width: 680px;
  margin: 25px auto 0;

  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
  text-align: center;
}

.colaboramos-section__cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 372px);
  justify-content: center;
  gap: 24px;
}

.colaboramos-card {
  position: relative;
  width: 372px;
  /* min-height: 0px; */
  box-sizing: border-box;
  padding: 24px 22px 50px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(17, 17, 17, 0.10);
}

.colaboramos-card::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.colaboramos-card__image-wrap {
  width: 100px;
  height: 100px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}

.colaboramos-card__image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
}

.colaboramos-card__placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 3rem;
  color: #274e9d;
  background: transparent;
}

.colaboramos-card__placeholder--wide {
  width: 100px;
  height: 100px;
}

.colaboramos-card__title {
  margin: 0 0 10px;
  font-family: var(--font-bricolage) !important;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.25;
  text-align: center;

  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.colaboramos-card__text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  text-align: center;

  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.colaboramos-card--wide {
  width: 784px;
  height: 172px;
  margin: 24px auto 0;
  padding: 22px 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 22px;
  text-align: left;
}

.colaboramos-card--wide__image-wrap {
  width: 100px;
  height: 100px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
}

.colaboramos-card--wide__body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.colaboramos-card--wide .colaboramos-card__title {
  text-align: left;
  margin-bottom: 8px;
}

.colaboramos-card--wide .colaboramos-card__text {
  text-align: left;
  max-width: 620px;
}

@media (max-width: 980px) {
  .colaboramos-section__outer {
    padding: 28px 24px 24px;
  }

  .colaboramos-section__inner {
    width: 100%;
    min-height: auto;
    padding: 24px 20px 22px;
  }

  .colaboramos-section__cards {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .colaboramos-card,
  .colaboramos-card--wide {
    width: 100%;
    max-width: 372px;
  }

  .colaboramos-card--wide {
    height: auto;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .colaboramos-card--wide .colaboramos-card__title,
  .colaboramos-card--wide .colaboramos-card__text {
    text-align: center;
  }
}

@media (max-width: 640px) {
  .colaboramos-section__outer {
    padding: 20px 14px 18px;
  }

  .colaboramos-section__title {
    font-size: 24px;
  }

  .colaboramos-section__intro {
    font-size: 14px;
  }

  .colaboramos-card {
    height: auto;
    min-height: 338px;
  }

  .colaboramos-card--wide {
    max-width: 100%;
  }
}
</style>