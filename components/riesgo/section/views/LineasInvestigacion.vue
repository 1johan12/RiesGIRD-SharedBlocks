<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '../title/SectionTitle.vue'

type LineaItem = {
  id?: string | number
  key?: string | number
  icon?: string
  title?: string
  desc?: string
}

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Nuestras Líneas Prioritarias de Investigación')

const introText = computed(
  () =>
    props.data?.introText ||
    'Todas las investigaciones respaldadas por la Red se enmarcan en las siguientes áreas clave:'
)

const lineas = computed<LineaItem[]>(() => {
  if (Array.isArray(props.data?.lineas)) return props.data.lineas
  if (Array.isArray(props.data?.items)) return props.data.items
  return []
});

const useContainer = computed(
  () => props.data?.useContainer ?? true
);

const getKey = (item: LineaItem, index: number) => item.id ?? item.key ?? index

const getIconClass = (icon?: string) => {
  if (icon && typeof icon === 'string' && icon.trim()) return icon
  return 'bi bi-grid-1x2-fill'
}
</script>

<template>
  <section
    v-if="lineas.length"
    class="research-lines"
    :class="{
      'research-lines--boxed': useContainer
    }"
  >
    <div class="research-lines__outer">
      <div class="research-lines__inner">
        <div class="research-lines__header">
          <SectionTitle  :title="title" />
          <!-- <h2 v-if="title" class="research-lines__title">
            <span class="research-lines__title-text">{{ title }}</span>
          </h2> -->

          <p v-if="introText" class="research-lines__intro">
            {{ introText }}
          </p>
        </div>

        <div class="research-lines__grid">
          <article
            v-for="(item, index) in lineas"
            :key="getKey(item, index)"
            class="research-lines__card"
          >
            <div v-if="item.icon" class="research-lines__icon-wrap">
              <i
                :class="getIconClass(item.icon)"
                class="research-lines__icon"
                aria-hidden="true"
              ></i>
            </div>

            <div class="research-lines__card-body">
              <h3 v-if="item.title" class="research-lines__card-title">
                {{ item.title }}
              </h3>

              <p v-if="item.desc" class="research-lines__card-desc">
                {{ item.desc }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.research-lines__outer {
  width: 100%;
}

.research-lines__inner {
  width: 100%;
}

.research-lines--boxed .research-lines__outer {
  width: min(100%, 1010px);
  min-height: 776px;
  margin: 0 auto;
  padding: 39px 76px;
  background: #f2f7ff;
  border-radius: 8px;
}

.research-lines--boxed .research-lines__inner {
  width: min(100%, 858px);
  min-height: 697px;
  margin: 0 auto;
  padding: 32px 28px 30px;
  background: #ffffff;
  border-radius: 2px;
}

.research-lines__inner {
  width: min(100%, 858px);
  min-height: 697px;
  margin: 0 auto;
  padding: 32px 28px 30px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.research-lines__header {
  width: 100%;
  text-align: center;
}

.research-lines__title {
  margin: 0;
  line-height: 1.15;
}

.research-lines__title-text {
  display: inline-block;
  padding-bottom: 4px;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  color: #0b0b0b;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, #e1113f 0%, #274e9d 100%) 1;
}

.research-lines__intro {
  margin: 14px 0 0;
  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  color: #111111;
}

.research-lines__grid {
  width: min(100%, 492px);
  margin: 31px auto 0;
  display: grid;
  grid-template-columns: repeat(2, 230px);
  gap: 24px 22px;
  justify-content: center;
  align-items: stretch;
}

.research-lines__card {
  width: 230px;
  min-height: 246px;
  box-sizing: border-box;
  padding: 18px 16px 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
  color: #ffffff;
  box-shadow: 0 6px 12px rgba(17, 17, 17, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.research-lines__icon-wrap {
  width: 66px;
  height: 66px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  /* margin-bottom: 10px; */
}

.research-lines__icon {
  font-size: 3rem;
  line-height: 1;
  color: #ffffff;
}

.research-lines__card-body {
  width: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.research-lines__card-title {
  margin: 0;
  font-family: var(--font-bricolage) !important;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.15;
  color: #ffffff;
}

.research-lines__card-desc {
  margin: auto 0 0;
  font-family: var(--font-bricolage) !important;
  font-size: 12px;
  padding-top: 5px;
  font-weight: 400 !important;
  line-height: 1.25;
  color: #ffffff;
  opacity: 0.98;
  text-align: justify;
}

@media (max-width: 1024px) {
  .research-lines__outer {
    width: min(100%, 1010px);
    min-height: auto;
    padding: 32px 28px;
  }

  .research-lines__inner {
    width: 100%;
    min-height: auto;
    padding: 28px 24px 26px;
  }

  .research-lines__title-text {
    font-size: 26px;
  }

  .research-lines__grid {
    width: min(100%, 492px);
    gap: 20px 18px;
  }
}

@media (max-width: 720px) {
  .research-lines__outer {
    padding: 22px 16px;
  }

  .research-lines__inner {
    padding: 22px 14px 20px;
  }

  .research-lines__title-text {
    font-size: 22px;
  }

  .research-lines__intro {
    font-size: 15px;
  }

  .research-lines__grid {
    grid-template-columns: 1fr;
    max-width: 230px;
  }

  .research-lines__card {
    width: 100%;
  }

  .research-lines--boxed .research-lines__outer{
    padding: 10px;
  }
}

@media (max-width: 420px) {
  .research-lines__outer {
    padding: 16px 12px;
  }

  .research-lines__inner {
    padding: 18px 12px 18px;
  }

  .research-lines__title-text {
    font-size: 20px;
  }

  .research-lines__intro {
    font-size: 14px;
    line-height: 1.4;
  }
}
</style>