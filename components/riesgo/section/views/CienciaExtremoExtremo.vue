<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Ciencia enfocada en soluciones reales y territoriales.')
const description = computed(
  () =>
    props.data?.description ||
    'No investigamos solo para publicar papers; investigamos para resolver problemas. Nuestros lineamientos orientan los esfuerzos académicos hacia las necesidades urgentes del país y del Sistema Nacional de Gestión del Riesgo de Desastres (SINAGERD).'
)
const imageUrl = computed(() => props.data?.imageUrl || '')

const titleTextRef = ref<HTMLElement | null>(null)
const underlineWidth = ref(0)

let resizeObserver: ResizeObserver | null = null

const formatImageUrl = (url: string | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `http://127.0.0.1:4000/storage/${url}`
}

const calculateUnderline = async () => {
  await nextTick()

  if (!titleTextRef.value) {
    underlineWidth.value = 0
    return
  }

  const range = document.createRange()
  range.selectNodeContents(titleTextRef.value)

  const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0)

  if (!rects.length) {
    underlineWidth.value = 0
    range.detach?.()
    return
  }

  underlineWidth.value = Math.ceil(rects[rects.length - 1].width)
  range.detach?.()
}

onMounted(() => {
  calculateUnderline()

  if (titleTextRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      calculateUnderline()
    })

    resizeObserver.observe(titleTextRef.value)
  }

  window.addEventListener('resize', calculateUnderline)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateUnderline)

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

watch(title, () => {
  calculateUnderline()
})
</script>

<template>
  <section class="red-info-section">
    <div class="red-info-section__container">
      <h2 v-if="title" class="red-info-section__title">
        <span ref="titleTextRef" class="red-info-section__title-text">
          {{ title }}
        </span>

        <span
          class="red-info-section__underline"
          :style="{ width: `${underlineWidth}px` }"
        ></span>
      </h2>

      <div class="red-info-section__grid">
        <div v-if="description" class="red-info-section__text-side">
          <p class="red-info-section__description">
            {{ description }}
          </p>
        </div>

        <div class="red-info-section__image-side">
          <div v-if="imageUrl" class="red-info-section__image-frame">
            <img
              :src="formatImageUrl(imageUrl)"
              :alt="title"
              class="red-info-section__image"
            />
          </div>

          <div v-else class="red-info-section__placeholder">
            <div class="red-info-section__placeholder-content">
              <i class="bi bi-image red-info-section__placeholder-icon"></i>
              <p class="red-info-section__placeholder-text">
                Lienzo libre para fotografía o banner descriptivo
              </p>
              <span class="red-info-section__placeholder-subtext">
                Asigna un recurso desde el panel lateral derecho
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.red-info-section {
  width: 100%;
  box-sizing: border-box;
}

.red-info-section__container {
  width: min(100%, 1100px);
  margin: 0 auto;
  padding: 28px 34px 28px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 12px;
}

.red-info-section__title {
  width: 100%;
  max-width: 760px;
  margin: 0 auto 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.red-info-section__title-text {
  display: block;
  width: 100%;
  max-width: 100%;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #0b0b0b;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: normal;
  text-wrap: balance;
}

.red-info-section__underline {
  display: block;
  height: 3px;
  margin-top: 10px;
  background: linear-gradient(90deg, #e41f4b 0%, #2f5ea9 100%);
}

.red-info-section__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 326px;
  align-items: start;
  column-gap: clamp(42px, 6vw, 86px);
  row-gap: 28px;
}

.red-info-section__text-side {
  min-width: 0;
  padding-top: 58px;
}

.red-info-section__description {
  max-width: 520px;
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.25;
  color: #1f1f1f;
  text-align: justify;
  text-justify: inter-word;
}

.red-info-section__image-side {
  justify-self: end;
}

.red-info-section__image-frame {
  width: 326px;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
  background: #eef1f7;
}

.red-info-section__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.red-info-section__placeholder {
  width: 326px;
  aspect-ratio: 326 / 220;
  border-radius: 8px;
  border: 2px dashed #cdd5e1;
  background: #f8fafc;
  display: grid;
  place-items: center;
  box-sizing: border-box;
}

.red-info-section__placeholder-content {
  padding: 18px;
  text-align: center;
  color: #64748b;
}

.red-info-section__placeholder-icon {
  display: block;
  margin-bottom: 10px;
  font-size: 2.8rem;
  opacity: 0.45;
}

.red-info-section__placeholder-text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.red-info-section__placeholder-subtext {
  display: block;
  margin-top: 4px;
  font-family: var(--font-bricolage) !important;
  font-size: 0.75rem;
  line-height: 1.35;
  opacity: 0.82;
}

@media (max-width: 1024px) {
  .red-info-section__container {
    padding: 26px 28px 42px;
  }

  .red-info-section__title {
    margin-bottom: 42px;
  }

  .red-info-section__title-text {
    font-size: 26px;
  }

  .red-info-section__grid {
    grid-template-columns: minmax(0, 1fr) 300px;
    column-gap: 42px;
  }

  .red-info-section__text-side {
    padding-top: 40px;
  }

  .red-info-section__image-frame,
  .red-info-section__placeholder {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .red-info-section {
    padding: 18px 0 28px;
  }

  .red-info-section__container {
    padding: 22px 18px 30px;
    border-radius: 10px;
  }

  .red-info-section__title {
    margin-bottom: 28px;
  }

  .red-info-section__title-text {
    font-size: 22px;
  }

  .red-info-section__underline {
    margin-top: 8px;
  }

  .red-info-section__grid {
    grid-template-columns: 1fr;
    row-gap: 24px;
  }

  .red-info-section__text-side {
    padding-top: 0;
  }

  .red-info-section__description {
    max-width: none;
    text-align: left;
  }

  .red-info-section__image-side {
    justify-self: center;
  }

  .red-info-section__image-frame,
  .red-info-section__placeholder {
    width: min(100%, 326px);
  }
}

@media (max-width: 480px) {
  .red-info-section__container {
    padding: 20px 14px 26px;
  }

  .red-info-section__title-text {
    font-size: 20px;
  }

  .red-info-section__description {
    font-size: 15px;
    line-height: 1.35;
  }
}
</style>