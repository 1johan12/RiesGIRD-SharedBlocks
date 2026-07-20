<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '../title/SectionTitle.vue';

type ObjectiveItem = {
  id?: string | number
  tag?: string
  text?: string
}

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Nuestros Objetivos')
const introText = computed(() => props.data?.introText || '')
const generalObjective = computed(() => props.data?.generalObjective || '')
const titleOE = computed(() => props.data?.titleOE || 'Nuestros Específicos')
const introTextOE = computed(() => props.data?.introTextOE || '')

const objetivosEspecificos = computed<ObjectiveItem[]>(() => {
  const raw = props.data?.objetivosEspecificos
  return Array.isArray(raw) ? raw : []
})

const getKey = (item: ObjectiveItem, index: number) => item.id ?? index
</script>

<template>
  <section class="objectives-section">
    <div class="objectives-section__shell">
      <div class="objectives-section__panel">
        <SectionTitle v-if="title" :title="title" />

        <p v-if="introText" class="objectives-section__intro">
          {{ introText }}
        </p>

        <div v-if="generalObjective" class="objective-general">
          <div class="objective-general__label">
            Objetivo General
          </div>

          <div class="objective-general__box">
            <p class="objective-general__text">
              “{{ generalObjective }}”
            </p>
          </div>
        </div>
      </div>

      <div class="objectives-section__panel">
        <SectionTitle v-if="titleOE" :title="titleOE" />

        <p v-if="introTextOE" class="objectives-section__intro">
          {{ introTextOE }}
        </p>

        <div v-if="objetivosEspecificos.length" class="specific-objectives">
          <article
            v-for="(obj, index) in objetivosEspecificos"
            :key="getKey(obj, index)"
            class="specific-objective"
          >
            <div v-if="obj.tag" class="specific-objective__tag">
              {{ obj.tag }}
            </div>

            <div class="specific-objective__box">
              <p v-if="obj.text" class="specific-objective__text">
                {{ obj.text }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.objectives-section {
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  background: #ffffff;
  margin-bottom: 40px;
}

.objectives-section__shell {
  width: min(100%, 1010px);
  margin: 0 auto;
  padding: 28px 28px 32px;
  box-sizing: border-box;
  background: #f2f7ff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.objectives-section__panel {
  width: min(100%, 906px);
  margin: 0 auto;
  padding: 28px 24px 30px;
  box-sizing: border-box;
  background: #ffffff;
}

.objectives-section__intro {
  max-width: 760px;
  margin: 14px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.35;
  color: #111111;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
  padding: 10px 0px;
}

.objective-general {
  position: relative;
  width: min(100%, 720px);
  margin: 30px auto 0;
  padding-top: 14px;
}

.objective-general__label {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  padding: 8px 20px;
  box-sizing: border-box;

  border-radius: 8px;
  border: 1.5px solid transparent;

  background-image:
    linear-gradient(#ffffff, #ffffff),
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  color: #111111;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.objective-general__box {
  padding: 22px 28px 24px;
  box-sizing: border-box;

  border-radius: 8px;
  border: 1.5px solid transparent;

  background-image:
    linear-gradient(#ffffff, #ffffff),
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;

  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.objective-general__text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.specific-objectives {
  width: min(100%, 100%);
  margin: 30px auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 42px 24px;
  align-items: start;
}

.specific-objective {
  position: relative;
  min-width: 0;
  padding-top: 14px;
}

.specific-objective__tag {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -60%);
  z-index: 100;

  width: 85%;
  padding: 8px 18px;
  box-sizing: border-box;

  background: #ffffff;
  border: 1.5px solid #274e9d;
  border-bottom: none;
  border-radius: 8px 8px 0 0;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  color: #111111;
  text-align: center;

  /* No sobrepasar el ancho */
  overflow: hidden;

  /* Solo una línea */
  white-space: nowrap;

  /* ... al final */
  text-overflow: ellipsis;
}

.specific-objective__tag::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffff;
}

.specific-objective__box {
  position: relative;

  min-height: 124px;
  padding: 30px 20px 20px;
  box-sizing: border-box;

  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
}

/* Triángulo invertido */
.specific-objective__box::before {
  content: "";
  position: absolute;

  top: -1px;
  left: 50%;
  transform: translateX(-50%);

  width: 25px;
  height: 15px;

  background: #ffffff;

  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.specific-objective__text {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.45;
  color: #ffffff;
  text-align: left;
  overflow-wrap: anywhere;
  word-break: break-word;
  width: 100%;
}

@media (max-width: 980px) {
  .objectives-section__shell {
    padding: 22px 18px 26px;
    gap: 32px;
  }

  .objectives-section__panel {
    padding: 24px 18px 26px;
  }

  .specific-objectives {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .objective-general {
    width: min(100%, 640px);
  }
}

@media (max-width: 640px) {
  .objectives-section__shell {
    padding: 18px 12px 20px;
    gap: 24px;
  }

  .objectives-section__panel {
    padding: 20px 14px 22px;
  }

  .objectives-section__intro,
  .objective-general__text,
  .specific-objective__text {
    font-size: 14px;
  }

  .objective-general__label,
  .specific-objective__tag {
    font-size: 15px;
  }
}
</style>