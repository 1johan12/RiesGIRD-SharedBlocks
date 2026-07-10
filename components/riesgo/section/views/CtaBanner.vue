<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

const title = computed(() => props.data?.title || 'Sube tu investigación');
const buttonText = computed(() => props.data?.buttonText || 'Aporta al Repositorio');
const actionUrl = computed(() => props.data?.actionUrl || '#');
const targetBlank = computed(() => props.data?.targetBlank ?? true);
</script>

<template>
  <section class="cta-banner-section">
    <div class="cta-container">
      <div class="cta-content">
        <h2 v-if="title" class="cta-text">
          {{ title }}
        </h2>

        <a
          v-if="buttonText"
          :href="actionUrl"
          :target="targetBlank ? '_blank' : '_self'"
          :rel="targetBlank ? 'noopener noreferrer' : undefined"
          class="cta-button"
        >
          {{ buttonText }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-banner-section {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  padding-bottom: 50px;
  padding-top: 20px;
}

.cta-container {
  width: min(100%, 1100px);
  height: 116px;
  margin: 0 auto;
  background: var(--gradient-primary, linear-gradient(90deg, #e1113f 0%, #274e9d 100%));
  box-sizing: border-box;
}

.cta-content {
  width: 100%;
  height: 100%;
  padding: 0 48px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.cta-text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
}

.cta-button {
  width: 221px;
  height: 50px;
  box-sizing: border-box;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid #ffffff;
  background: rgba(255, 255, 255, 0.23);

  font-family: var(--font-raleway) !important;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: #ffffff;
  text-decoration: none;
  white-space: nowrap;
}

.cta-button:hover {
  opacity: 0.92;
}

.cta-button:active {
  opacity: 0.84;
}

@media (max-width: 768px) {
  .cta-container {
    height: auto;
  }

  .cta-content {
    min-height: 116px;
    padding: 18px 20px;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }

  .cta-text {
    text-align: center;
    font-size: 24px;
  }

  .cta-button {
    width: min(221px, 100%);
  }
}

@media (max-width: 480px) {
  .cta-content {
    padding: 16px 14px;
  }

  .cta-text {
    font-size: 21px;
  }
}
</style>