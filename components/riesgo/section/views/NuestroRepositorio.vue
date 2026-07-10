<script setup lang="ts">
import { computed } from 'vue'

type EjeItem = {
  id?: string | number
  icono?: string
  titulo?: string
  descripcion?: string
}

const props = defineProps<{
  data: any
}>()

const title = computed(() => props.data?.title || 'Nuestro Repositorio')

const introText = computed(
  () =>
    props.data?.introText ||
    'Transferimos la ciencia a la práctica a través de recursos de libre acceso. Aquí se muestran las secciones de la biblioteca virtual.'
)

const ejes = computed<EjeItem[]>(() => {
  if (Array.isArray(props.data?.ejes)) return props.data.ejes
  if (Array.isArray(props.data?.items)) return props.data.items
  return []
})

const getKey = (item: EjeItem, index: number) => item.id ?? index
</script>

<template>
  <section v-if="ejes.length" class="repository-block">
    <div class="repository-block__surface">
      <header class="repository-block__header">
        <h2 v-if="title" class="repository-block__title">
          {{ title }}
        </h2>

        <p v-if="introText" class="repository-block__intro">
          {{ introText }}
        </p>
      </header>

      <div class="repository-block__grid">
        <article
          v-for="(eje, index) in ejes"
          :key="getKey(eje, index)"
          class="repository-block__card"
        >
          <div v-if="eje.icono" class="repository-block__icon-wrap">
            <i :class="eje.icono" class="repository-block__icon" aria-hidden="true"></i>
          </div>

          <h3 v-if="eje.titulo" class="repository-block__card-title">
            {{ eje.titulo }}
          </h3>

          <p v-if="eje.descripcion" class="repository-block__card-desc">
            {{ eje.descripcion }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.repository-block {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
}

.repository-block__surface {
  /* width: min(100%, 858px); */
  /* min-height: 697px; */
  /* margin: 0 auto; */
  padding: 80px 0 80px 0px;
  box-sizing: border-box;
  background: #ffffff;
}

.repository-block__header {
  text-align: center;
}

.repository-block__title {
  margin: 0;
  display: inline-block;
  padding-bottom: 4px;
  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  color: #0b0b0b;
  border-bottom: 3px solid transparent;
  border-image: var(--gradient-primary, linear-gradient(90deg, #e1113f 0%, #274e9d 100%)) 1;
}

.repository-block__intro {
  max-width: 680px;
  margin: 11px auto 0;
  font-family: var(--font-bricolage) !important;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.28;
  color: #111111;
}

/* .repository-block__grid {
  width: min(100%, 1000px);
  margin: 28px auto 0;
  display: grid;
  grid-template-columns: repeat(4, 230px);
  justify-content: center;
  gap: 0 20px;
  align-items: start;
} */

.repository-block__grid {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto 0;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 20px;
}

.repository-block__card {
  width: 230px;
  /* min-height: 246px;
  max-height: 246px; */

  padding: 18px 14px 14px;
  box-sizing: border-box;

  border-radius: 8px;
  background: var(
    --gradient-primary,
    linear-gradient(90deg, #e1113f 0%, #274e9d 100%)
  );

  color: #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  overflow: hidden;

  box-shadow: 0 6px 12px rgba(17, 17, 17, 0.18);
}

.repository-block__icon-wrap {
  width: 77px;
  height: 77px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  margin-bottom: 8px;
}

.repository-block__icon {
  font-size: 3.25rem;
  line-height: 1;
  color: #ffffff;
}

.repository-block__card-title {
  width: 100%;
  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.12;
  color: #ffffff;

  overflow-wrap: anywhere;
  word-break: break-word;
}

.repository-block__card-desc {
  width: 100%;
  margin: 10px 0 0;

  font-family: var(--font-bricolage) !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.22;
  color: #ffffff;
  text-align: justify;
  /* overflow-wrap: anywhere;
  word-break: break-word;

  overflow: hidden;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;

  text-overflow: ellipsis; */
}

@media (max-width: 1120px) {
  .repository-block__surface {
    width: min(100%, 858px);
    min-height: auto;
    padding: 30px 16px 22px;
  }

  /* .repository-block__grid {
    grid-template-columns: repeat(2, 230px);
    gap: 20px 20px;
  } */
}

@media (max-width: 720px) {
  .repository-block__surface {
    padding: 22px 14px 22px 18px;
  }

  .repository-block__title {
    font-size: 24px;
  }

  .repository-block__intro {
    font-size: 14px;
    line-height: 1.34;
  }

  /* .repository-block__grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 16px;
  } */

  .repository-block__card {
    width: 100%;
    max-width: 230px;
  }
}

@media (max-width: 420px) {
  .repository-block__surface {
    padding: 18px 12px 50px 16px;
  }

  .repository-block__title {
    font-size: 21px;
  }

  .repository-block__intro {
    font-size: 13px;
  }
}
</style>