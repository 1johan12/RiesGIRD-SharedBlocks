<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  data: any
}>();


const bgType = computed(() => props.data?.bgType || 'color');
const bgColor = computed(() => props.data?.bgColor );
const bgImage = computed(() => props.data?.bgImage || '');
const bgGradient = computed(() => props.data?.bgGradient || '');

const titleColor = computed(() => props.data?.titleColor || '#ffffff');
const titleSize = computed(() => props.data?.titleSize || '1.8rem');
const quoteColor = computed(() => props.data?.quoteColor || '#f8f9fa');
const quoteSize = computed(() => props.data?.quoteSize || '1.1rem');
const authorColor = computed(() => props.data?.authorColor || '#cccccc');
const authorSize = computed(() => props.data?.authorSize || '0.9rem');

const sectionStyle = computed(() => {
  if (bgType.value === 'image' && bgImage.value) {
    return { backgroundImage: `url(${bgImage.value})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };
  } else if (bgType.value === 'gradient' && bgGradient.value) {
    return { backgroundImage: bgGradient.value };
  }
  return { backgroundColor: bgColor.value };
});


const title = computed(() => props.data?.title || '');
const testimonials = computed(() => props.data?.testimonials || []);

const activeIndex = ref(0);
let autoPlayInterval: any = null;

const goToSlide = (index: number) => {
  activeIndex.value = index;
  resetAutoPlay();
};

const nextSlide = () => {
  if (testimonials.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % testimonials.value.length;
};

const resetAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextSlide, 6000); 
};

onMounted(() => {
  resetAutoPlay();
});

onUnmounted(() => {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
});
</script>

<template>
  <section class="testimonial-section py-5" :style="sectionStyle">
    <div class="container py-4">
      
      <div class="row mb-4" v-if="title">
        <div class="col-12 text-center">
          <h2 class="text-uppercase fw-bold mx-auto mb-0" 
              :style="{ color: titleColor, fontSize: titleSize, maxWidth: '800px', lineHeight: '1.2' }">
            {{ title }}
          </h2>
        </div>
      </div>

      <div class="row justify-content-center" v-if="testimonials.length > 0">
        <div class="col-12 col-md-10 col-lg-8 position-relative">
          
          <div class="text-center testimonial-content transition-fade" :key="activeIndex">
            
            <p class="fst-italic mx-auto mb-4" 
               :style="{ color: quoteColor, fontSize: quoteSize, fontWeight: '300', lineHeight: '1.6' }">
              {{ testimonials[activeIndex].quote }}
            </p>
            
            <div class="avatar-wrapper mx-auto mb-3">
              <img v-if="testimonials[activeIndex].image" 
                   :src="testimonials[activeIndex].image" 
                   :alt="testimonials[activeIndex].name"
                   class="rounded-circle img-fluid shadow-sm object-fit-cover w-100 h-100">
              <div v-else class="rounded-circle w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white">
                <i class="las la-user fs-1"></i>
              </div>
            </div>

            <p class="mb-0" :style="{ color: authorColor, fontSize: authorSize }">
              <span class="fw-medium">{{ testimonials[activeIndex].name }}</span>
              <span v-if="testimonials[activeIndex].role">, {{ testimonials[activeIndex].role }}</span>
            </p>

          </div>

          <div class="d-flex justify-content-center gap-2 mt-5" v-if="testimonials.length > 1">
            <button 
              v-for="(_, index) in testimonials" 
              :key="'dot-'+index"
              @click="goToSlide(Number(index))"
              class="slider-indicator"
              :class="{ 'active': activeIndex === index }"
              :style="{ backgroundColor: activeIndex === index ? titleColor : authorColor }"
              aria-label="Ir al testimonio"
            ></button>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Transición suave al cambiar de slide */
.transition-fade {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tamaño de la foto de perfil */
.avatar-wrapper {
  width: 200px;
  height: 200px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 3px;
}

/* Indicadores de raya (Pills) inspirados en tu imagen */
.slider-indicator {
  width: 25px;
  height: 5px;
  border-radius: 10px;
  border: none;
  opacity: 0.4;
  transition: all 0.3s ease;
  padding: 0;
  cursor: pointer;
}

.slider-indicator.active {
  opacity: 1;
  width: 30px; /* Se hace un poquito más largo cuando está activo */
}

.slider-indicator:hover {
  opacity: 0.8;
}
</style>