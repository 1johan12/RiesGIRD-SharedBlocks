<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import HttpClient from "@/helpers/http-client";
import CardGrid from '@/components/sections/ui/CardGrid.vue'; 

interface Category {
  id: number;
  name: string;
  slug: string;
  image_path: string;
  color: string;
  type: string;
}

const props = defineProps<{
  data: { 
    selectedType?: string;
    titleOverride?: string;
  }
}>();

const categories = ref<Category[]>([]);
const loading = ref(false);

const displayTitle = computed(() => {
  if (props.data.titleOverride) return props.data.titleOverride;
  const titles: Record<string, string> = {
    'news': 'Últimas Novedades',
    'post': 'Artículos de Interés',
    'course': 'Nuestros Cursos'
  };
  return titles[props.data.selectedType || ''] || 'Secciones Destacadas';
});

const fetchCategoriesByType = async () => {
  const targetType = props.data.selectedType || 'post';
  loading.value = true;
  try {
    const response = await HttpClient.get('categories-list');
    const allCategories = response.data.data || []; 
    categories.value = allCategories
      .filter((cat: Category) => cat.type === targetType)
      .slice(0, 3); 
  } catch (e) {
    console.error("Error cargando categorías:", e);
  } finally {
    loading.value = false;
  }
};

watch(() => props.data.selectedType, () => fetchCategoriesByType());
onMounted(() => fetchCategoriesByType());
</script>

<template>
  <section class="portal-container">
    <header class="section-header">
      <div class="header-content">
        <span class="header-subtitle">Explora nuestro contenido</span>
        <h2 class="section-title">{{ displayTitle }}</h2>
      </div>
      <div class="header-line"></div>
    </header>

    <div v-if="loading" class="portal-grid">
      <div v-for="i in 3" :key="i" class="skeleton-card"></div>
    </div>

    <div v-else class="portal-grid">
      <CardGrid 
        v-for="cat in categories" 
        :key="cat.id" 
        :category="cat"
        class="portal-item-wrapper" 
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
$accent-blue: #1d4e89;

.portal-container {
  padding: 80px 24px;
  max-width: 1300px; 
  width: 100%;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 

  .header-subtitle {
    font-size: 0.9rem;
    color: $accent-blue;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 700;
    opacity: 0.7;
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-weight: 800;
    color: $accent-blue;
    margin: 10px 0;
    line-height: 1.1;
  }

  .header-line {
    width: 80px;
    height: 6px;
    background: $accent-blue;
    border-radius: 50px;
  }
}

.portal-grid {
  display: grid;
  
  grid-template-columns: repeat(3, minmax(0, 300px)); 
  justify-content: space-between; 
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  } 
}

.portal-item-wrapper {
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-8px);
  }
}

/* Animaciones de flotación (Tus tiempos originales) */
.portal-item-wrapper:nth-child(odd) :deep(.visual-wrapper) {
  animation-duration: 7s; 
}
.portal-item-wrapper:nth-child(even) :deep(.visual-wrapper) {
  animation-duration: 9s;
  animation-delay: 0.5s;
}

.skeleton-card {
  height: 350px;
  background: linear-gradient(90deg, #edf2f7 25%, #f7fafc 50%, #edf2f7 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 20px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>