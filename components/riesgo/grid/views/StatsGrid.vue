<script setup lang="ts">
import { computed } from 'vue'

type MetricasItem = {
  id?: string | number
  numero?: string | number
  label?: string
}

const props = defineProps<{
  data: any
}>()

const metricas = computed<MetricasItem[]>(() => props.data?.metricas || [])
const cardBgColor = computed(() => props.data?.cardBgColor || '#db143c')

const hexToRgba = (hex: string, alpha = 1): string => {
  const normalized = hex.replace('#', '').trim()

  if (![3, 6].includes(normalized.length)) {
    return `rgba(17, 17, 17, ${alpha})`
  }

  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  const intVal = Number.parseInt(fullHex, 16)

  if (Number.isNaN(intVal)) {
    return `rgba(17, 17, 17, ${alpha})`
  }

  const r = (intVal >> 16) & 255
  const g = (intVal >> 8) & 255
  const b = intVal & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const metricsGap = computed(() => {
  const count = metricas.value.length

  if (count <= 4) return '54px'
  if (count === 5) return '36px'
  return '28px'
})

const gridStyle = computed(() => ({
  '--metrics-gap': metricsGap.value,
}))

const cardStyle = computed(() => ({
  backgroundColor: cardBgColor.value,
  '--card-shadow': hexToRgba(cardBgColor.value, 0.26),
}))
</script>

<template>
  <section v-if="metricas.length > 0" class="stats-section">
    <div class="stats-section__inner">
      <div class="stats-grid" :style="gridStyle">
        <article
          v-for="(item, index) in metricas"
          :key="item.id || index"
          class="stat-card"
          :style="cardStyle"
        >
          <h2 class="stat-number" v-if="item.numero !== undefined && item.numero !== null">
            {{ item.numero }}
          </h2>

          <p class="stat-label" v-if="item.label">
            {{ item.label }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
}

.stats-section__inner {
  width: min(100%, 950px);
  margin: 0 auto;
  transform: translateY(-45px);
}

.stats-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--metrics-gap, 54px);
}

.stat-card {
  width: clamp(139px, 9.65vw, 185px);
  min-height: clamp(134px, 9.3vw, 178px);
  box-sizing: border-box;
  padding: 16px 12px 14px;
  border-radius: 8px;
  background: #db143c;
  box-shadow: 0 8px 16px var(--card-shadow, rgba(17, 17, 17, 0.18));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 22px var(--card-shadow, rgba(17, 17, 17, 0.22));
}

.stat-number {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
  color: #ffffff;
  letter-spacing: -0.4px;
}

.stat-label {
  margin: 8px 0 0;
  max-width: 110px;
  font-family: var(--font-bricolage) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.15;
  color: #ffffff;
}

@media (max-width: 720px) {
  .stats-section {
    padding: 0 16px;
  }

  .stats-section__inner {
    transform: translateY(-28px);
  }

  .stats-grid {
    gap: 18px;
  }

  .stat-card {
    width: 139px;
    min-height: 134px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 13px;
  }
}

@media (max-width: 420px) {
  .stats-section__inner {
    transform: translateY(-22px);
  }

  .stats-grid {
    gap: 14px;
  }
}
</style>