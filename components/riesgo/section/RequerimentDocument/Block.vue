<template>
  <section class="requirement-document">
    <div class="requirement-document__container">

      <div class="requirement-document__columns">

        <!-- REQUISITOS -->
        <div class="requirement-document__column">

          <div class="requirement-document__heading">
            <div class="requirement-document__file-icon-title">
              <i class="bi bi-envelope requirement-document__heading-icon" />
            </div>
            <h2 class="requirement-document__title">
              {{ data.titleRequirements }}
            </h2>
          </div>

          <div class="requirement-document__items">
            <div
              v-for="(item, index) in data.requirements"
              :key="index"
              class="requirement-document__requirement"
            >
              <div class="requirement-document__number">
                {{ index + 1 }}
              </div>

              <div class="requirement-document__requirement-text">
                {{ item.text }}
              </div>
            </div>
          </div>

        </div>

        <!-- DOCUMENTOS -->
        <div class="requirement-document__column">

          <div class="requirement-document__heading">
            <div class="requirement-document__file-icon-title">
              <i class="bi bi-envelope requirement-document__heading-icon" />
            </div>

            <h2 class="requirement-document__title">
              {{ data.titleDocuments }}
            </h2>
          </div>

          <div class="requirement-document__items">
            <a
              v-for="(doc, index) in data.documents"
              :key="index"
              :href="doc.file"
              target="_blank"
              rel="noopener noreferrer"
              class="requirement-document__document"
            >
              <div class="requirement-document__document-left">

                <div class="requirement-document__file-icon">
                  <i class="bi bi-file-earmark" />
                </div>

                <div>
                  <div class="requirement-document__document-title">
                    {{ doc.title }}
                  </div>

                  <div class="requirement-document__document-description">
                    {{ doc.description }}
                  </div>
                </div>

              </div>

              <i class="bi bi-file-earmark-arrow-down requirement-document__download" />
            </a>
          </div>

        </div>

      </div>

      <div class="requirement-document__divider" />

      <div class="requirement-document__footer">
        <a
          :href="data.buttonUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="requirement-document__button"
        >
          {{ data.buttonText }}
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    titleRequirements: string
    titleDocuments: string

    requirements: {
      text: string
    }[]

    documents: {
      title: string
      description: string
      file: string
    }[]

    buttonText: string
    buttonUrl: string
  }
}>()
</script>

<style scoped>
.requirement-document {
  width: 100%;
}

.requirement-document__container {
  width: 100%;
  max-width: 1116px;
  margin: 0 auto;
  background: #fff;
  border-radius: 0 0 14px 14px;
  padding: 40px 22px;
  box-sizing: border-box;
}

.requirement-document__columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.requirement-document__column {
  background: #F5F7FF;
  border-radius: 8px;
  padding: 28px;
}

.requirement-document__heading {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.requirement-document__heading-icon {
  font-size: 28px;
}

.requirement-document__title {
  margin: 0;

  font-family: var(--font-raleway);
  font-size: 24px;
  font-weight: 700;
}

.requirement-document__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-document__requirement {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;

  display: flex;
  align-items: center;
  gap: 14px;
}

.requirement-document__number {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  border-radius: 8px;

  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: sans-serif;
  font-size: 20px;
  font-weight: 600;
}

.requirement-document__requirement-text {
  font-family: var(--font-raleway);
  font-size: 14px;
  font-weight: 600;
}

.requirement-document__document {
  background: white;
  border-radius: 8px;

  padding: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  text-decoration: none;
}

.requirement-document__document-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.requirement-document__file-icon {
  width: 36px;
  height: 36px;

  border-radius: 8px;

  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}
.requirement-document__file-icon-title {
  width: 40px;
  height: 40px;

  border-radius: 8px;

  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

.requirement-document__document-title {
  font-family: var(--font-raleway);
  font-size: 14px;
  font-weight: 700;
  color: #000;
}

.requirement-document__document-description {
  margin-top: 4px;

  font-family: var(--font-raleway);
  font-size: 14px;
  font-weight: 500;

  color: #444;
}

.requirement-document__download {
  color: #E1113F;
  font-size: 18px;
}

.requirement-document__divider {
  margin: 32px 0;

  height: 3px;

  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );
}

.requirement-document__footer {
  display: flex;
  justify-content: center;
}

.requirement-document__button {
  width: 392px;
  min-height: 73px;

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;

  background: linear-gradient(
    90deg,
    #E1113F 0%,
    #274E9D 100%
  );

  color: white;

  font-family: var(--font-raleway);
  font-size: 20px;
  font-weight: 700;
}

@media (max-width: 992px) {
  .requirement-document__columns {
    grid-template-columns: 1fr;
  }

  .requirement-document__button {
    width: 100%;
  }
}
</style>