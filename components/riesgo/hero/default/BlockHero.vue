<template>
  <section
    class="hero"
    :style="heroStyle"
    aria-labelledby="hero-title"
  >
    <div class="hero__overlay" />

    <div class="hero__content">
      <h1
        id="hero-title"
        class="hero__title"
      >
        {{ data.title }}
      </h1>

      <p
        v-if="data.subtitle"
        class="hero__subtitle"
      >
        {{ data.subtitle }}
      </p>
    </div>

    <div class="hero__wave">
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
      >
        <path
          :fill="data.waveColor || '#ffffff'"
          d="
            M0,65

            C180,85
            340,100
            520,90

            C700,80
            850,45
            1020,55

            C1180,70
            1280,85
            1440,90

            L1440,180
            L0,180
            Z
          "
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any
}>()

const heroStyle = computed(() => ({
  backgroundImage: props.data.backgroundImage
    ? `url(${props.data.backgroundImage})`
    : 'none',

  minHeight: props.data.height || '500px'
}))
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  overflow: hidden;

  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero__overlay {
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.55);

  z-index: 1;
}

.hero__content {
  position: relative;
  z-index: 3;

  width: min(90%, 1000px);

  text-align: center;

  color: white;

  padding-inline: 1rem;
}

.hero__title {
  margin: 0;

  font-weight: 700;

  font-size: clamp(
    2rem,
    4vw,
    4rem
  );

  line-height: 1.1;

  letter-spacing: -0.03em;
}

.hero__subtitle {
  margin-top: 0.35rem;

  font-size: clamp(
    0.9rem,
    1.1vw,
    1.15rem
  );

  line-height: 1.4;

  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;

  color: rgba(255, 255, 255, 0.95);
}

.hero__wave {
  position: absolute;

  left: 0;
  bottom: -28px;

  width: 100%;

  z-index: 2;

  line-height: 0;

  pointer-events: none;
}

.hero__wave svg {
  display: block;

  width: 100%;
  height: 135px;
}

@media (min-width: 1440px) {
  .hero__wave {
    bottom: -35px;
  }

  .hero__wave svg {
    height: 150px;
  }
}

@media (max-width: 992px) {
  .hero {
    min-height: 420px !important;
  }

  .hero__title {
    font-size: clamp(
      1.8rem,
      5vw,
      3rem
    );
  }

  .hero__wave {
    bottom: -22px;
  }

  .hero__wave svg {
    height: 110px;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 320px !important;
  }

  .hero__content {
    width: 95%;
  }

  .hero__title {
    font-size: 2rem;
    line-height: 1.15;
  }

  .hero__subtitle {
    font-size: .9rem;
  }

  .hero__wave {
    bottom: -12px;
  }

  .hero__wave svg {
    height: 75px;
  }
}
</style>