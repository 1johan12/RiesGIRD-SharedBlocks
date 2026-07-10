<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

const title = computed(() => props.data?.title || '¿Cómo estructuramos la oferta?');
const introText = computed(() => props.data?.introText || 'El camino hacia una oferta consolidada ha sido progresivo...');
const ofertas = computed(() => props.data?.ofertas || []);
</script>

<template>
  <section class="oferta-section" v-if="ofertas.length > 0">
    <div class="container-fluid-o">
      
      <div class="header-block">
        <h2 class="main-title" v-if="title">{{ title }}</h2>
        <p class="section-intro" v-if="introText">
          {{ introText }}
        </p>
      </div>

      <div class="oferta-grid" :style="{ gridTemplateColumns: ofertas.length === 1 ? '1fr' : 'repeat(2, 1fr)' }">
        <div 
          v-for="(item, index) in ofertas" 
          :key="item.id || index" 
          class="oferta-card"
        >
          <span class="nivel-tag" v-if="item.nivelTag">{{ item.nivelTag }}</span>
          
          <div class="avatar-circle" v-if="item.icon">
            <i :class="[item.icon, 'avatar-icon-native']"></i>
          </div>

          <h3 class="card-subtitle" v-if="item.subtitle">{{ item.subtitle }}</h3>
          <p class="card-description" v-if="item.description">{{ item.description }}</p>
          
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>

.oferta-section {
  width: 100%;
  background: #ffffff;
  padding: 20px 0px 40px 0px;
  box-sizing: border-box;
}

.container-fluid-o {
  width: min(100%, 760px);
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

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;

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
  max-width: 620px;

  margin: 25px auto 0;

  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;

  color: #1b1b1b;

  text-align: center;
}

.oferta-grid {
  display: grid;
  gap: 24px;

  max-width: 660px;

  margin: 0 auto;
}

.oferta-card {
  width: 310px;
  min-height: 270px;

  padding: 18px 22px 24px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 8px;

  border: 1px solid #efefef;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 18px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  text-align: center;
}

.nivel-tag {
  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 400;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.avatar-circle {
  width: 72px;
  height: 72px;

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

.avatar-icon-native {
  font-size: 56px;
  color: #ffffff;
  line-height: 1;
}

.card-subtitle {
  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;

  color: #111111;
}

.card-description {
  margin: 0;

  font-family: var(--font-raleway) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;

  color: #3f3f3f;

  text-align: left;
}

@media (max-width: 850px) {
  .oferta-grid {
    grid-template-columns: 1fr !important;
    justify-items: center;
  }

  .main-title {
    font-size: 24px;
  }

  .section-intro {
    font-size: 14px;
  }

  .oferta-card {
    width: 100%;
    max-width: 310px;
  }
}
</style>