<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="py-5" :style="{ backgroundColor: data.bgColor }">
    <div class="container">
      
      <div class="row align-items-center mb-5">
        <div class="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
          <div class="px-lg-4">
            <img 
              v-if="data.devImage" 
              :src="data.devImage" 
              :alt="data.devTitle" 
              class="img-fluid rounded-4 shadow-sm w-100"
              style="object-fit: cover; max-height: 450px;"
            >
            <div v-else class="bg-secondary rounded-4 w-100 d-flex align-items-center justify-content-center" style="height: 350px;">
              <i class="bi bi-image fs-1 text-white opacity-50"></i>
            </div>
          </div>
        </div>

        <div class="col-lg-6 order-2 order-lg-1">
          <h3 class="fw-bold mb-3Titulo__curriculum" :style="{ color: data.textColor }">{{ data.devTitle }}</h3>
          <p class="text-muted mb-4 fs-5">{{ data.devSubtitle }}</p>

          <ul class="list-unstyled">
            <li v-for="(item, index) in data.devItems" :key="index" class="d-flex align-items-start mb-3">
              <i class="bi bi-check-circle-fill me-3 mt-1 fs-5" :style="{ color: data.accentColor }"></i>
              <span class="text-muted fs-6">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="w-50 mx-auto my-5 opacity-25" :style="{ borderColor: data.accentColor }">

      <div class="row justify-content-center text-center mb-5">
        <div class="col-lg-8">
          <h3 class="fw-bold mb-3" :style="{ color: data.textColor }">{{ data.specTitle }}</h3>
          <p class="text-muted fs-6">{{ data.specSubtitle }}</p>
        </div>
      </div>

      <div class="row justify-content-center g-4">
        <div v-for="(spec, index) in data.specItems" :key="index" class="col-sm-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm rounded-4 text-center p-4 spec-card transition-all h-100">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <div class="icon-wrapper mb-4 d-flex align-items-center justify-content-center rounded-3" 
                   :style="{ backgroundColor: `${data.accentColor}15`, width: '80px', height: '80px' }">
                <i :class="spec.icon" class="fs-1" :style="{ color: data.accentColor }"></i>
              </div>
              <h5 class="fw-bold mb-0 mt-auto" :style="{ color: data.textColor }">{{ spec.title }}</h5>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.spec-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
}

.spec-card:hover .icon-wrapper i {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>