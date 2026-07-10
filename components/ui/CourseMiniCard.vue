<template>
  <div class="card h-100 border-0 shadow-sm hover-lift transition-all group">
    <div class="position-relative overflow-hidden" style="height: 200px;">
      <img :src="data.image || 'https://placehold.co/600x400'" 
           class="w-100 h-100 object-fit-cover transition-transform" 
           alt="Curso">
      
      <div class="position-absolute top-0 end-0 m-3">
        <span class="badge bg-white text-danger shadow-sm fw-bold">NUEVO</span>
      </div>
    </div>

    <div class="card-body p-4 d-flex flex-column">
      <h5 class="card-title fw-bold text-dark mb-3 line-clamp-2 group-hover:text-primary">
        {{ data.title }}
      </h5>
      
      <p class="card-text text-muted small mb-4 line-clamp-3 flex-grow-1">
        {{ data.description || 'Sin descripción previa.' }}
      </p>

      <div class="mt-auto border-top pt-3">
        <router-link :to="data.link" class="btn btn-outline-primary w-100 fw-bold rounded-pill">
          VER DETALLE COMPLETO <i class="las la-arrow-right ms-1"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    description: string;
    image: string;
    link: string;
  }
}>();
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}
.transition-transform { transition: transform 0.5s ease; }
.card:hover .transition-transform { transform: scale(1.05); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>