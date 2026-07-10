<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

type SectionHeaderData = {
  title?: string
  introText?: string
  paddingTop?: number
  paddingBottom?: number
  gap?: number
  maxWidth?: number
  backgroundColor?: string
  fontSize?: number
  fontSizeTitle?: number
}

const props = withDefaults(
  defineProps<{
    title?: string
    introText?: string
    paddingTop?: number
    paddingBottom?: number
    gap?: number
    maxWidth?: number
    backgroundColor?: string
    fontSize?: number
    fontSizeTitle?: number
    data?: SectionHeaderData
  }>(),
  {
    title: '',
    introText: '',
    paddingTop: 0,
    paddingBottom: 0,
    gap: 40,
    maxWidth: 760,
    backgroundColor: '#fff',
    fontSize: 16,
    fontSizeTitle: 28,
    data: undefined
  }
)

console.log("Props",props);

const resolvedTitle = computed(() => props.data?.title ?? props.title ?? '')
const resolvedIntroText = computed(() => props.data?.introText ?? props.introText ?? '')
const resolvedPaddingTop = computed(() => props.data?.paddingTop ?? props.paddingTop ?? 20)
const resolvedPaddingBottom = computed(() => props.data?.paddingBottom ?? props.paddingBottom ?? 20)
const resolvedGap = computed(() => props.data?.gap ?? props.gap ?? 40)
const resolvedMaxWidth = computed(() => props.data?.maxWidth ?? props.maxWidth ?? 760)
const resolvedBackgroundColor = computed(() => props.data?.backgroundColor ?? props.backgroundColor ?? 'transparent')
const resolvedFontSize = computed(
  () => props.data?.fontSize ?? props.fontSize ?? 16
);
const resolvedFontSizeTitle = computed(
  () => props.data?.fontSizeTitle ?? props.fontSizeTitle ?? 28
);

const introStyle = computed(() => ({
  fontSize: `${resolvedFontSize.value}px`
}));
const titleStyleFont = computed(() => ({
  fontSize: `${resolvedFontSizeTitle.value}px`
}));


const titleRef = ref<HTMLElement | null>(null)
const underlineWidth = ref(0)

let resizeObserver: ResizeObserver | null = null

const calculateUnderline = async () => {
  await nextTick()

  if (!titleRef.value) return

  const range = document.createRange()
  range.selectNodeContents(titleRef.value)

  const rects = Array.from(range.getClientRects()).filter(rect => rect.width > 0)

  if (!rects.length) {
    underlineWidth.value = 0
    return
  }

  underlineWidth.value = Math.ceil(rects[rects.length - 1].width)
  range.detach?.()
}

onMounted(() => {
  calculateUnderline()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      calculateUnderline()
    })

    if (titleRef.value) {
      resizeObserver.observe(titleRef.value)
    }
  }

  window.addEventListener('resize', calculateUnderline)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateUnderline)
  resizeObserver?.disconnect()
})

watch(resolvedTitle, () => {
  calculateUnderline()
})

watch(resolvedMaxWidth, () => {
  calculateUnderline()
})

const containerStyle = computed(() => ({
  paddingTop: `${resolvedPaddingTop.value}px`,
  paddingBottom: `${resolvedPaddingBottom.value}px`,
  backgroundColor: resolvedBackgroundColor.value
}))

const titleStyle = computed(() => ({
  maxWidth: `${resolvedMaxWidth.value}px`
}))

const introWrapStyle = computed(() => ({
  paddingTop: `${resolvedGap.value}px`,
  maxWidth: `${resolvedMaxWidth.value}px`
}))
</script>

<template>
  <div
    class="section-header"
    :style="containerStyle"
  >
    <div
      class="section-header__title"
      :style="titleStyle"
    >
      <h2
        ref="titleRef"
        class="section-header__text"
        :style="titleStyleFont"
      >
        {{ resolvedTitle }}
      </h2>

      <span
        class="section-header__line"
        :style="{ width: `${underlineWidth}px` }"
      />
    </div>

    <div
      v-if="resolvedIntroText"
      class="section-header__intro-wrap"
      :style="introWrapStyle"
    >
      <p class="section-header__intro" :style="introStyle">
        {{ resolvedIntroText }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.section-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.section-header__title {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-header__text {
  width: 100%;
  margin: 0;
  text-align: center;
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

.section-header__line {
  height: 3px;
  margin-top: 3px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  transition: width 0.2s ease;
}

.section-header__intro-wrap {
  width: 100%;
  box-sizing: border-box;
}

.section-header__intro {
  width: 100%;
  margin: 0;
  text-align: center;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 768px) {
  .section-header__text {
    font-size: 24px;
  }

  .section-header__intro {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .section-header__text {
    font-size: 20px;
  }

  .section-header__intro {
    font-size: 14px;
  }
}
</style>