<template>
    <article class="article">
        <header class="article__header">
            <h1 class="article__title">
                {{ title }}
            </h1>
            <div class="article__title-line" />
        </header>
        
        <img class="article__cover" :src="coverImage" :alt="title">
        
        <div
          class="article__content"
          v-html="introContent"
        />
        
        <div v-if="gallery && gallery.length > 0" class="article__gallery">
            <img v-for="(image, index) in gallery" :key="index" :src="image" alt="Gallery image">
        </div>
        
        <div
          class="article__content"
          v-html="bodyContent"
        />
        
        <section v-if="agreements && agreements.length > 0" class="article__agreements">
            <h2 class="agreements__title">
                {{ agreementsTitle }}
            </h2>
            <div class="agreements__line" />
            <p class="agreements__description">
                {{ agreementsDescription }}
            </p>
            
            <div class="agreements__grid">
                <article 
                    v-for="agreement in agreements" 
                    :key="agreement.id" 
                    :class="['agreement-card', agreement.color === 'blue' ? 'agreement-card--blue' : 'agreement-card--red']"
                >
                    <div class="agreement-card__icon">
                        <i class="bi bi-search"></i>
                    </div>
                    <h3 class="agreement-card__title">
                        {{ agreement.title }}
                    </h3>
                    <p class="agreement-card__text">
                        {{ agreement.text }}
                    </p>
                </article>
            </div>
        </section>

        <div class="article__content" v-html="richTextContent"></div>
    </article>
</template>

<script setup lang="ts">

type AgreementColor = 'red' | 'blue'
interface Agreement {
  id: number | string;
  title: string;
  text: string;
  color: AgreementColor;
}

defineProps<{
  title: string;
  coverImage: string;
  introContent: string;
  bodyContent: string;
  gallery: string[];
  agreementsTitle: string;
  agreementsDescription: string;
  agreements: Agreement[];
  richTextContent: string; // This handles the custom HTML output from the mini-word editor
}>();
</script>

<style scoped>
 /* ======================================
   PAGE
====================================== */

  .article-page {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    background: #f5f7ff;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 359px);
    gap: 24px;
    align-items: start;
  }

  /* ======================================
   LEFT COLUMN
====================================== */

  .article {
    width: 100%;
    background: #fff;
    border-radius: 8px;
    padding: 28px 36px 32px;
    box-sizing: border-box;
  }

  /* ======================================
   HEADER
====================================== */

  .article__header {
    margin-bottom: 18px;
  }

  .article__title {
    margin: 0;
    text-align: center;
    font-family: 'Raleway', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    color: #242424;
  }

  .article__title-line {
    width: 520px;
    max-width: 100%;
    height: 3px;
    margin: 10px auto 0;
    background: linear-gradient(90deg, #E1113F 0%, #274E9D 100%);
  }

  /* ======================================
   COVER
====================================== */

  .article__cover {
    width: 882px;
    max-width: 100%;
    height: 207px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
  }

  /* ======================================
   TEXT & DYNAMIC RICH TEXT
====================================== */
  .article__content {
    max-width: 830px;
    margin-top: 18px;
    margin-left: auto;
    margin-right: auto;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.55;
    text-align: justify;
    color: #2d2d2d;
  }

  .article__content p {
    margin: 0 0 16px 0;
  }
  
  /* Deep selector to apply styles to the elements injected by v-html */
  .article__content :deep(h3.article__subsection-title), 
  .article__content :deep(h3) {
    margin: 48px 0 8px;
    font-family: 'Raleway', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #242424;
    text-align: left;
  }

  /* ======================================
   GALLERY
====================================== */

  /* .article__gallery {
    max-width: 830px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 46px;
    margin-bottom: 34px;
  } */

  .article__gallery {
    max-width: 830px;

    margin: 46px auto 34px;

    display: flex;

    flex-wrap: wrap;

    justify-content: center;

    gap: 20px;
  }

  .article__gallery img {
    width: 234px;
    height: 234px;
    object-fit: cover;
    border-radius: 8px;
  }

  /* ======================================
   AGREEMENTS
====================================== */

  .article__agreements {
    max-width: 830px;
    margin: 48px auto 0;
  }

  .agreements__title {
    margin: 0;
    text-align: center;
    font-family: "Helvetica Neue", "Raleway", sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #242424;
  }

  .agreements__line {
    width: 240px;
    height: 3px;
    margin: 10px auto 18px;
    background: linear-gradient(90deg, #e1113f 0%, #274e9d 100%);
    border-radius: 999px;
  }

  .agreements__description {
    margin: 0 0 22px;
    text-align: center;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #1f1f1f;
  }

  .agreements__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  /* ======================================
   CARD
====================================== */

  .agreement-card {
    min-height: 210px;
    border-radius: 8px;
    padding: 22px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .agreement-card--red {
    background: #ffdcea;
  }

  .agreement-card--blue {
    background: #dbe6fc;
  }

  .agreement-card__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    margin-bottom: 14px;
  }

  .agreement-card--red .agreement-card__icon {
    background: #e1113f;
  }

  .agreement-card--blue .agreement-card__icon {
    background: #274e9d;
  }

  .agreement-card__title {
    margin: 0 0 14px;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 20px;
    font-weight: 800;
  }

  .agreement-card--red .agreement-card__title {
    color: #e1113f;
  }

  .agreement-card--blue .agreement-card__title {
    color: #274e9d;
  }

  .agreement-card__text {
    margin: 0;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 16.74px;
    font-weight: 400;
    line-height: 1.45;
    color: #1f1f1f;
  }

  /* ======================================
   RESPONSIVE
====================================== */

  @media (max-width: 1360px) {
    .article-page {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
  }

  @media (max-width: 992px) {
    .article-page {
      grid-template-columns: 1fr;
    }
    .sidebar {
      position: static;
      max-width: none;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .article-page {
      padding: 0px;
    }
    .article {
      padding: 24px;
    }
    .article__gallery {
      gap: 20px;
    }
    .article__gallery img {
      width: 180px;
      height: 180px;
    }
    .article__content {
      font-size: 16px;
    }
    .sidebar__cta {
      width: 100%;
    }
    .agreements__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .article__gallery {
      flex-direction: column;
      align-items: center;
    }
    .article__gallery img {
      width: 234px;
      height: 234px;
    }
    .article__title-line {
      width: 260px;
    }
    .agreements__grid {
      grid-template-columns: 1fr;
    }
  }
</style>