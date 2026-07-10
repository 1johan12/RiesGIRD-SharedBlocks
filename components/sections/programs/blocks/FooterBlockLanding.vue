<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const currentYear = computed(() => new Date().getFullYear());


const footerStyle = computed(() => {
  return {
    backgroundColor: props.data.bgColor,
    color: props.data.textColor,
    '--hover-color': props.data.iconHoverColor
  };
});
</script>

<template>
  <footer class="footer position-relative" :style="footerStyle">
    
    <div class="container py-5">
      <div class="row">
        <div class="col-lg-4 col-md-12">
          
          <a href="#" class="d-inline-block text-decoration-none focus-ring">
            <img 
              v-if="data.logoImage" 
              :src="data.logoImage" 
              alt="Logo Footer" 
              class="img-fluid" 
              style="max-height: 50px;"
            >
            <h4 v-else class="fw-bold m-0" :style="{ color: data.textColor }">DPA ESAN</h4>
          </a>
          
          <p class="mt-4 mb-4 opacity-75">{{ data.slogan }}</p>
          
          <ul class="list-inline mb-0">
            <li class="list-inline-item me-2" v-if="data.socialLinks?.linkedin">
              <a :href="data.socialLinks.linkedin" target="_blank" class="social-btn border border-secondary rounded d-flex align-items-center justify-content-center text-decoration-none transition-all">
                <i class="bi bi-linkedin fs-5"></i>
              </a>
            </li>
            <li class="list-inline-item me-2" v-if="data.socialLinks?.facebook">
              <a :href="data.socialLinks.facebook" target="_blank" class="social-btn border border-secondary rounded d-flex align-items-center justify-content-center text-decoration-none transition-all">
                <i class="bi bi-facebook fs-5"></i>
              </a>
            </li>
            <li class="list-inline-item me-2" v-if="data.socialLinks?.instagram">
              <a :href="data.socialLinks.instagram" target="_blank" class="social-btn border border-secondary rounded d-flex align-items-center justify-content-center text-decoration-none transition-all">
                <i class="bi bi-instagram fs-5"></i>
              </a>
            </li>
            <li class="list-inline-item me-2" v-if="data.socialLinks?.twitter">
              <a :href="data.socialLinks.twitter" target="_blank" class="social-btn border border-secondary rounded d-flex align-items-center justify-content-center text-decoration-none transition-all">
                <i class="bi bi-twitter-x fs-5"></i>
              </a>
            </li>
          </ul>

        </div>
        
        <div class="col-lg-8"></div>
        
      </div>
    </div>

    <div class="border-top border-secondary border-opacity-25 py-4">
      <div class="container text-center text-md-start">
        <p class="mb-0 opacity-75 small">
          © {{ currentYear }} {{ data.copyrightText }}
        </p>
      </div>
    </div>
    
  </footer>
</template>

<style scoped>
.social-btn {
  width: 40px;
  height: 40px;
  color: inherit;
  opacity: 0.7;
}

.transition-all {
  transition: all 0.3s ease;
}

/* El hover toma el color que configuramos en la variable CSS */
.social-btn:hover {
  background-color: var(--hover-color);
  border-color: var(--hover-color) !important;
  color: #ffffff !important;
  opacity: 1;
  transform: translateY(-2px);
}
</style>