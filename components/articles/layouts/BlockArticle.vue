<template>
  <main class="article-page">
    <HeroDefault v-bind="pageData.hero" />
    <NewsArticle class="article" v-bind="pageData.article" />
    
    <NewsAside class="sidebar" v-bind="pageData.sidebar" />

  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NewsArticle from './components/NewsArticle.vue';
import NewsAside from './components/NewsAside.vue';
import HeroDefault from '@shared/components/riesgo/hero/default/Block.vue';
type AgreementColor = 'red' | 'blue'

interface Agreement {
  id: number
  title: string
  text: string
  color: AgreementColor
}
interface ArticleData {
  title: string
  coverImage: string
  introContent: string
  gallery: string[]
  bodyContent: string
  agreementsTitle: string
  agreementsDescription: string
  agreements: Agreement[]
  richTextContent: string
}

defineProps<{
  pageData: {
    hero: any
    article: ArticleData
    sidebar: any
  }
}>()
</script>

<style scoped>
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
  
  @media (max-width: 1360px) {
    .article-page {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
  }
  @media (max-width: 992px) {
    .article-page {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 768px) {
    .article-page {
      padding: 0px;
    }
  }
</style>