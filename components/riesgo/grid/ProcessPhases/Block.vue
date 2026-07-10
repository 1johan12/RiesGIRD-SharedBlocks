<template>
  <section class="process-phases">
    <header class="process-phases__header">
      <h2 class="process-phases__title">
        {{ props.data.title }}
      </h2>

      <div class="process-phases__underline" />
    </header>

    <div class="process-phases__timeline" role="list">
      <template
        v-for="(card, index) in props.data.cards"
        :key="`${index}-${card.title}`"
      >
        <article
          class="process-phase"
          :class="{ 'is-highlighted': card.highlightBackground }"
          role="listitem"
        >
          <div class="process-phase__top">
            <div
              class="process-phase__number-box"
              :class="{ 'is-highlighted': card.highlightBackground }"
            >
              <span class="process-phase__number">
                {{ index + 1 }}
              </span>
            </div>
          </div>

          <div class="process-phase__body">
            <h3 class="process-phase__card-title">
              {{ card.title }}
            </h3>

            <p class="process-phase__description">
              {{ card.description }}
            </p>
          </div>

          <div class="process-phase__period-area">
            <div
              class="process-phase__period"
              :class="{ 'is-highlighted': card.highlightBackground }"
              v-html="card.periodText"
            />
          </div>
        </article>
<div
  v-if="index < props.data.cards.length - 1"
  class="process-phase__connector"
  aria-hidden="true"
>
  <svg
    viewBox="0 0 16 16"
    class="process-phase__connector-svg"
  >
    <defs>
      <linearGradient
        :id="`connectorGradient-${index}`"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stop-color="#E1113F" />
        <stop offset="100%" stop-color="#274E9D" />
      </linearGradient>
    </defs>

    <path
      fill-rule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
      :fill="`url(#connectorGradient-${index})`"
    />
  </svg>
</div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ProcessCard {
  title: string
  description: string
  periodText: string
  highlightBackground?: boolean
}

const props = defineProps<{
  data: {
    title: string
    cards: ProcessCard[]
  }
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&display=swap');

.process-phases {
  width: 100%;
  max-width: 1116px;
  min-height: 453px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 14px;
  box-sizing: border-box;
  padding: clamp(24px, 3.5vw, 44px);
}

.process-phases__header {
  text-align: center;
  margin-bottom: clamp(28px, 4vw, 54px);
}

.process-phases__title {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.75rem, 2.2vw, 28px);
  line-height: 1.1;
  font-weight: 700;
  color: #000000;
}

.process-phases__underline {
  width: 230px;
  max-width: 70%;
  height: 4px;
  margin: 8px auto 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #E1113F 0%, #274E9D 100%);
}

.process-phases__timeline {
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  gap: 0;
  flex-wrap: nowrap;
}

.process-phase {
  flex: 1 1 166px;
  min-width: 166px;
  min-height: 274px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 2px solid transparent;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(90deg, #E1113F 0%, #274E9D 100%) border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 13px 10px 16px;
  overflow: visible;
}

.process-phase.is-highlighted {
  background: linear-gradient(90deg, #E1113F 0%, #5d3078 52%, #274E9D 100%);
  border: none;
}

.process-phase__top {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 14px;
}

.process-phase__number-box {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(#ffffff, #ffffff) padding-box,
    linear-gradient(90deg, #E1113F 0%, #274E9D 100%) border-box;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.process-phase__number-box.is-highlighted {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.95);
}

.process-phase__number {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
  background: linear-gradient(90deg, #E1113F 0%, #274E9D 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.process-phase__number-box.is-highlighted .process-phase__number {
  background: none;
  color: #ffffff;
  -webkit-text-fill-color: #ffffff;
}

.process-phase__body {
  width: 100%;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.process-phase__card-title {
  margin: 0;
  width: 100%;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 16px;
  line-height: 1.12;
  font-weight: 700;
  color: #000000;
  text-align: center;
}

.process-phase.is-highlighted .process-phase__card-title {
  color: #ffffff;
}

.process-phase__description {
  margin: 10px 0 0;
  width: 100%;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  line-height: 1.28;
  font-weight: 600;
  color: #000000;
  text-align: justify;
  text-justify: inter-word;
  overflow-wrap: anywhere;
  word-break: normal;
  hyphens: auto;
}

.process-phase.is-highlighted .process-phase__description {
  color: #ffffff;
}

.process-phase__period-area {
  flex: 1 1 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.process-phase__period {
  width: 100%;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  line-height: 1.1;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(90deg, #E1113F 0%, #274E9D 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.process-phase__period.is-highlighted {
  background: none;
  color: #ffffff;
  -webkit-text-fill-color: #ffffff;
}

.process-phase__connector {
  flex: 0 0 clamp(40px, 4vw, 56px);

  display: flex;
  align-items: center;
  justify-content: center;
}

.process-phase__connector-svg {
  width: clamp(24px, 2vw, 32px);
  height: clamp(24px, 2vw, 32px);

  display: block;
}

@media (max-width: 992px) {
  .process-phases {
    min-height: auto;
  }

  .process-phases__timeline {
    flex-direction: column;
    align-items: center;
  }

  .process-phase {
    width: min(100%, 280px);
    min-width: 0;
    flex: 0 0 auto;
  }

  .process-phase__connector {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    max-width: none;
    min-width: 0;
    transform: rotate(90deg);
    align-self: center;
  }
}

@media (max-width: 640px) {
  .process-phase {
    width: min(100%, 240px);
  }

  .process-phase__card-title {
    font-size: 15px;
  }

  .process-phase__description {
    font-size: 12px;
  }

  .process-phase__period {
    font-size: 13px;
  }
}
</style>
