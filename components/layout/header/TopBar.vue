<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalSearch } from '@/composables/useGlobalSearch';

const router = useRouter();
const searchContainer = ref<HTMLElement | null>(null);


const { search, results, loading } = useGlobalSearch();

const clearSearch = () => { search.value = ''; results.value = []; };


const goToFullSearch = () => {
  if (search.value.length >= 2) {
    router.push({ name: 'public.search', query: { q: search.value } });
    results.value = []; 
    
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    results.value = [];
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div class="top-bar py-1">
    <div class="container d-flex justify-content-between align-items-center">
      
      <div class="contact-info d-none d-md-flex align-items-center gap-2">
        <i class="las la-envelope fs-5"></i>
        <span class="small">servicedesk@esan.edu.pe</span>
      </div>

      <div class="search-wrapper" ref="searchContainer">
        <div class="search-input-group">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar cursos, noticias, páginas..." 
            @keyup.esc="clearSearch"
            @keyup.enter="goToFullSearch"
          />
          <i v-if="loading" class="las la-spinner spinner"></i>
          <i v-else class="las la-search" @click="goToFullSearch"></i>
        </div>

        <!--<ul v-if="search.length >= 3 && (results.length > 0 || !loading)" class="search-dropdown shadow-lg">
          <li v-for="item in results" :key="item.id">
            <router-link :to="item.url" class="d-flex align-items-center gap-2 p-2 text-decoration-none" @click="clearSearch">
              <img :src="item.image" class="thumb" v-if="item.image">
              <div class="info">
                <p class="m-0 fw-bold text-dark small">{{ item.title }}</p>
                <small class="text-muted" style="font-size: 0.7rem;">{{ item.type.toUpperCase() }}</small>
              </div>
            </router-link>
          </li>
          <li v-if="results.length === 0 && !loading" class="p-2 text-center small text-muted">
            No hay resultados
          </li>
        </ul>-->
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-bar {
  background-color: #1a4b70; 
  color: white;
  min-height: 40px; 
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px; 
}

.search-input-group {
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 2px 10px;
  
  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.85rem;
    color: #333;
    padding: 4px;
  }
  
  i { color: #666; }
}

.search-dropdown {
  position: absolute;
  top: 110%;
  right: 0;
  width: 100%;
  background: white;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  z-index: 2000;
  max-height: 300px;
  overflow-y: auto;
  
  .thumb { width: 35px; height: 35px; object-fit: cover; border-radius: 3px; }
  li:hover { background: #f8f9fa; }
}

.spinner { animation: rotate 1s linear infinite; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>