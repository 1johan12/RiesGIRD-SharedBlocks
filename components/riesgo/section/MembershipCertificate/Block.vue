<template>
  <section class="membership-certificate">
    <div class="membership-certificate__container">
      <div class="membership-certificate__card">

        <div class="membership-certificate__icon-box">
          <i class="bi bi-check-circle membership-certificate__icon" />
        </div>

        <div class="membership-certificate__content">
          <h3 class="membership-certificate__title">
            {{ data.title }}
          </h3>

          <p class="membership-certificate__description">
            {{ data.description }}
          </p>

          <a
            :href="data.buttonUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="membership-certificate__button"
          >
            {{ data.buttonText }}

            <i class="bi bi-arrow-right-short" />
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
  }
}>()
</script>

<style scoped>
.membership-certificate {
  width: 100%;
}

.membership-certificate__container {
  max-width: 1116px;
  margin: 0 auto;
  /* margin-top: 130px; */
  background: white !important;
  border-radius: 14px 14px 0 0;
  padding: 40px 40px 0;
  box-sizing: border-box;

}

.membership-certificate__card {
  width: 100%;
  min-height: 164px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 32px 34px;
  box-sizing: border-box;
}

.membership-certificate__icon-box {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.membership-certificate__icon {
  font-size: 42px;
  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.membership-certificate__content {
  display: flex;
  flex-direction: column;
}

.membership-certificate__title {
  margin: 0;

  font-family: var(--font-raleway);
  font-size: 18px;
  font-weight: 700;

  color: #ffffff;
}

.membership-certificate__description {
  margin: 8px 0 14px;

  max-width: 620px;

  font-family: var(--font-raleway);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;

  color: #ffffff;
}

.membership-certificate__button {
  width: 166px;
  height: 29px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  font-family: var(--font-raleway);
  font-size: 12px;
  font-weight: 700;

  /* Solución maestra: Capa 1 (Gradiente para el texto), Capa 2 (Blanco para el fondo) */
  background: 
    linear-gradient(90deg, #E1113F 0%, #274E9D 100%) padding-box, 
    #ffffff;
  
  -webkit-background-clip: text, border-box;
  background-clip: text, border-box;

  color: transparent;
  -webkit-text-fill-color: transparent;
}

.membership-certificate__button i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .membership-certificate__card {
    flex-direction: column;
    text-align: center;
  }

  .membership-certificate__content {
    align-items: center;
  }
}
</style>