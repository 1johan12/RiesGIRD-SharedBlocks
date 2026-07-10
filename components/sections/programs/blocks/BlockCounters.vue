<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  data: {
    title?: string;
    bgColor?: string;
    textColor?: string;
    counters?: Array<{
      prefix?: string;
      number: number;
      label: string;
      note?: string;
    }>;
  }
}>();

const sectionRef = ref<HTMLElement | null>(null);
const displayedNumbers = ref<number[]>([]);
let observer: IntersectionObserver | null = null;
let hasAnimated = false;

const initCounters = () => {
  displayedNumbers.value = (props.data?.counters || []).map(() => 0);
  hasAnimated = false;
};

initCounters();

watch(() => props.data?.counters, () => {
  initCounters();
  if (observer && sectionRef.value) observer.observe(sectionRef.value);
}, { deep: true });

const animateCounters = () => {
  if (hasAnimated || !props.data?.counters) return;
  hasAnimated = true;

  props.data.counters.forEach((counter, index) => {
    const target = Number(counter.number) || 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      displayedNumbers.value[index] = Math.floor(easeOut * target);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        displayedNumbers.value[index] = target;
      }
    };
    requestAnimationFrame(updateCounter);
  });
};

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      if (observer && sectionRef.value) observer.unobserve(sectionRef.value);
    }
  }, { threshold: 0.3 });

  if (sectionRef.value) observer.observe(sectionRef.value);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <section 
    ref="sectionRef" 
    class="esan-counters-section"
    :style="{ backgroundColor: data.bgColor || '#d31245', color: data.textColor || '#ffffff' }"
  >
    <div class="esan-container">
      
      <h3 v-if="data?.title" class="esan-title">
        {{ data.title }}
      </h3>
      
      <div class="esan-divider" :style="{ backgroundColor: data.textColor || '#ffffff', opacity: 0.3 }"></div>
      
      <div class="esan-grid">
        <div 
          v-for="(item, index) in data?.counters" 
          :key="index"
          class="esan-counter-item"
        >
          <div class="esan-number">
            <span v-if="item.prefix">{{ item.prefix }}</span>
            <span>{{ displayedNumbers[index] }}</span>
          </div>
          <div class="esan-label">
            {{ item.label }} <span v-if="item.note" class="esan-note">{{ item.note }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.esan-counters-section {
  padding: 60px 0;
  transition: all 0.3s ease;
  font-family: 'Arial', sans-serif;
}

.esan-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.esan-title {
  font-size: 32px; /* Tamaño aumentado */
  font-weight: 400;
  margin-bottom: 20px;
  text-transform: none;
}

.esan-divider {
  width: 100%;
  height: 1px;
  margin-bottom: 45px;
}

.esan-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.esan-counter-item {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.esan-number {
  font-size: 30px; /* Tamaño aumentado e impactante */
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1;
}

.esan-label {
  font-size: 30px; /* Tamaño aumentado para legibilidad */
  font-weight: 700;
  line-height: 1.2;
  white-space: pre-line;
}

.esan-note {
  font-size: 14px;
  vertical-align: top;
  margin-left: 2px;
}

@media (max-width: 768px) {
  .esan-title { font-size: 26px; }
  .esan-number { font-size: 36px; }
  .esan-label { font-size: 16px; }
}
</style>