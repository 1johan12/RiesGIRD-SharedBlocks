<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: {
    visionTitle: string
    visionText: string
    visionFutureTitle: string
    visionFutureText: string
    misionTitle: string
    misionText: string
    misionHowTitle: string
    misionHowText: string
  }
}>()

const visionTitle = computed(() => props.data?.visionTitle || 'Nuestra Visión')
const visionText = computed(() => props.data?.visionText || '')
const visionFutureTitle = computed(() => props.data?.visionFutureTitle || '')
const visionFutureText = computed(() => props.data?.visionFutureText || '')
const misionTitle = computed(() => props.data?.misionTitle || 'Nuestra Misión')
const misionText = computed(() => props.data?.misionText || '')
const misionHowTitle = computed(() => props.data?.misionHowTitle || '')
const misionHowText = computed(() => props.data?.misionHowText || '')
</script>

<template>
  <section class="mission-vision">
    <div class="mission-vision__wrapper">
      <!-- FILA 1: ROJA -->
      <div class="mission-vision__row">
        <article class="card card--small card--red card--circle-right">
          <div class="circle circle--red" />

          <div class="icon-box">
            <i class="las la-bullseye"></i>
          </div>

          <h3 class="title">{{ misionTitle }}</h3>
          <p class="text">{{ misionText }}</p>
        </article>

        <article class="card card--large card--red card--circle-left">
          <div class="circle circle--red" />

          <h3 class="title">{{ misionHowTitle }}</h3>
          <p class="text">{{ misionHowText }}</p>
        </article>
      </div>

      <!-- FILA 2: AZUL -->
      <div class="mission-vision__row">
        <article class="card card--large card--blue card--circle-right">
          <div class="circle circle--blue" />

          <h3 class="title">{{ visionFutureTitle }}</h3>
          <p class="text">{{ visionFutureText }}</p>
        </article>

        <article class="card card--small card--blue card--circle-left">
          <div class="circle circle--blue" />

          <div class="icon-box icon-box--blue">
            <i class="las la-eye"></i>
          </div>

          <h3 class="title">{{ visionTitle }}</h3>
          <p class="text">{{ visionText }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mission-vision {
  width: 100%;
}

.mission-vision__wrapper {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 28px;
  background: #f2f7ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-sizing: border-box;
}

.mission-vision__row {
  display: flex;
  gap: 22px;
  align-items: stretch;
}

.card {
  position: relative;
  background: #ffffff;
  border-radius: 8px;
  padding: 38px 28px;
  border: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.card--small {
  width: 315px;
  align-items: center;
}

.card--large {
  flex: 1;
  justify-content: center;
}

.card--red .icon-box {
  background: linear-gradient(90deg, #E1113F 0%, #274E9D 100%);
}

.card--blue .icon-box {
  background: linear-gradient(90deg, #274E9D 0%, #E1113F 100%);
}

.circle {
  position: absolute;
  top: 0;
  width: 64px;
  height: 64px;
}

.circle--red {
  background: #efc8d6;
}

.circle--blue {
  background: #c7d5f4;
}

.card--circle-right .circle {
  right: 0;
  border-bottom-left-radius: 100%;
}

.card--circle-left .circle {
  left: 0;
  border-bottom-right-radius: 100%;
}

.icon-box {
  width: 66px;
  height: 66px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  z-index: 1;
  flex-shrink: 0;
}

.icon-box i {
  color: #ffffff;
  font-size: 31px;
}

.title {
  margin: 0 0 16px;
  font-family: var(--font-bricolage) !important;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: #111111;
  text-align: center;
}

.text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
  text-align: justify;
}

@media (max-width: 900px) {
  .mission-vision__row {
    flex-direction: column;
  }

  .card--small,
  .card--large {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .mission-vision__wrapper {
    padding: 20px;
  }

  .card {
    padding: 28px 18px;
  }

  .title {
    font-size: 18px;
  }

  .text {
    font-size: 14px;
  }

  .icon-box {
    width: 58px;
    height: 58px;
  }

  .icon-box i {
    font-size: 26px;
  }

  .circle {
    width: 52px;
    height: 52px;
  }
}
</style>