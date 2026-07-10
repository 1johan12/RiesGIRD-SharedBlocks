<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});


const embedUrl = computed(() => {
  const url = props.data.videoUrl || '';
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
});


const overlayStyle = computed(() => {
  
  
  return {
    backgroundColor: props.data.overlayColor,
    opacity: props.data.overlayOpacity
  };
});
</script>

<template>
  <section class="video-section position-relative py-5" :style="{ backgroundImage: `url(${data.bgImage})` }">
    
    <div class="overlay position-absolute top-0 start-0 w-100 h-100" :style="overlayStyle"></div>

    <div class="container position-relative z-1 py-5 text-center">
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8">
          <h2 class="fw-bold mb-3" :style="{ color: data.textColor }">{{ data.title }}</h2>
          <p class="fs-5" :style="{ color: data.textColor }">{{ data.description }}</p>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <div class="ratio ratio-16x9 shadow-lg rounded overflow-hidden" style="background-color: #000;">
            <iframe 
              v-if="embedUrl"
              :src="embedUrl" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
            <div v-else class="d-flex align-items-center justify-content-center w-100 h-100 text-white">
              <i class="bi bi-youtube fs-1 me-2 text-danger"></i>
              <span>Configura la URL del video en el administrador</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.video-section {
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Efecto Parallax opcional, queda muy bien */
  min-height: 500px;
}
</style>