<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { formatImageUrl, extractYoutubeId } from '../../../../helpers/url';
import { sanitizeHtml, stripHtml } from '../../../../helpers/sanitize';

const props = defineProps<{
  data: any;
}>();

const title = computed(() =>
  props.data?.title !== undefined ? String(props.data.title) : '¿Quiénes somos?'
);
const text = computed(() => (props.data?.text !== undefined ? String(props.data.text) : ''));
const hasDescription = computed(() => stripHtml(text.value).trim().length > 0);
const mediaType = computed<'image' | 'video'>(() =>
  props.data?.mediaType === 'video' ? 'video' : 'image'
);
const imageUrl = computed(() => String(props.data?.imageUrl || '').trim());
const videoUrl = computed(() => String(props.data?.videoUrl || '').trim());

const youtubeId = computed(() => extractYoutubeId(videoUrl.value));
const isVideoMode = computed(() => mediaType.value === 'video');
const posterUrl = computed(() => {
  if (imageUrl.value) return formatImageUrl(imageUrl.value);
  if (isVideoMode.value && youtubeId.value) {
    return `https://i.ytimg.com/vi/${youtubeId.value}/hqdefault.jpg`;
  }
  return '';
});
const youtubeEmbedUrl = computed(() =>
  youtubeId.value
    ? `https://www.youtube-nocookie.com/embed/${youtubeId.value}?autoplay=1&rel=0`
    : ''
);

const isHovered = ref(false);
const isVideoModalOpen = ref(false);

const openVideoModal = () => {
  if (!youtubeId.value) return;
  isVideoModalOpen.value = true;
};

const closeVideoModal = () => {
  isVideoModalOpen.value = false;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVideoModalOpen.value) {
    closeVideoModal();
  }
};

watch(isVideoModalOpen, (open) => {
  if (typeof window === 'undefined') return;
  if (open) {
    window.addEventListener('keydown', onKeyDown);
  } else {
    window.removeEventListener('keydown', onKeyDown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeyDown);
  }
});
</script>

<template>
  <section class="about-section">
    <h2 class="section-title" v-if="title.trim()">{{ title }}</h2>

    <div class="section-text" v-if="hasDescription" v-html="sanitizeHtml(text)"></div>

    <div
      v-if="isVideoMode ? (youtubeId || posterUrl) : posterUrl"
      class="image-container"
      :class="{
        'container-hover': isHovered,
        'video-poster-trigger': isVideoMode && !!youtubeId
      }"
      :role="isVideoMode && youtubeId ? 'button' : undefined"
      :tabindex="isVideoMode && youtubeId ? 0 : undefined"
      :aria-label="isVideoMode && youtubeId ? `Reproducir video: ${title || 'Video institucional'}` : undefined"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="isVideoMode && youtubeId ? openVideoModal() : undefined"
      @keydown.enter.prevent="isVideoMode && youtubeId ? openVideoModal() : undefined"
      @keydown.space.prevent="isVideoMode && youtubeId ? openVideoModal() : undefined"
    >
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="title.trim() || 'Contenido multimedia institucional'"
        loading="lazy"
        decoding="async"
        :style="{ filter: isHovered ? 'brightness(1.05)' : 'brightness(1)' }"
      />
      <div v-else class="video-fallback-bg"></div>

      <div v-if="isVideoMode && youtubeId" class="video-play-overlay">
        <span class="video-play-btn" aria-hidden="true">
          <i class="bi bi-play-fill"></i>
        </span>
        <span class="video-play-caption">Ver video</span>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isVideoModalOpen && youtubeEmbedUrl"
        class="yt-modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="title.trim() || 'Reproductor de video'"
        @click.self="closeVideoModal"
      >
        <div class="yt-modal-dialog">
          <div class="yt-modal-header">
            <span class="yt-modal-title">{{ title.trim() || 'Video Institucional' }}</span>
            <button
              type="button"
              class="yt-modal-close"
              aria-label="Cerrar video"
              @click="closeVideoModal"
            >
              &times;
            </button>
          </div>
          <div class="yt-modal-ratio">
            <iframe
              :src="youtubeEmbedUrl"
              :title="title.trim() || 'Video de YouTube'"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.about-section {
  width: 100%;
  max-width: 858px;
  margin: 0 auto;
  padding: 0 0 52px 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

/* ===== TÍTULO ===== */
.section-title {
  position: relative;
  display: inline-flex;
  flex-direction: column;

  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;

  color: #111111;

  text-align: center;
}

.section-title::after {
  content: "";

  width: 100%;
  height: 3px;

  margin-top: 10px;

  background: linear-gradient(
    90deg,
    #e1113f 0%,
    #274e9d 100%
  );
}

/* ===== TEXTO ===== */
.section-text {
  width: 100%;
  max-width: 760px;

  margin: 0;

  font-family: var(--font-bricolage) !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;

  color: #111111;

  text-align: center;
}

/* ===== IMAGEN / PORTADA VIDEO ===== */
.image-container {
  position: relative;
  width: 620px;
  height: 419px;

  overflow: hidden;
  border-radius: 8px;

  transition: transform 0.3s ease;

  flex-shrink: 0;
}

.video-poster-trigger {
  cursor: pointer;
}

.video-poster-trigger:focus-visible {
  outline: 3px solid #274e9d;
  outline-offset: 4px;
}

.container-hover {
  transform: translateY(-4px);
}

.image-container img,
.video-fallback-bg {
  width: 100%;
  height: 100%;

  object-fit: cover;
  display: block;

  transition:
    transform 0.45s ease,
    filter 0.3s ease;
}

.video-fallback-bg {
  background: linear-gradient(135deg, #162447 0%, #274e9d 100%);
}

.image-container:hover img {
  transform: scale(1.02);
}

.video-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.32);
  transition: background-color 0.25s ease;
}

.video-poster-trigger:hover .video-play-overlay {
  background: rgba(15, 23, 42, 0.46);
}

.video-play-btn {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e1113f 0%, #c80e37 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  padding-left: 4px;
  box-shadow: 0 12px 28px rgba(225, 17, 63, 0.45);
  transition: transform 0.25s ease;
}

.video-poster-trigger:hover .video-play-btn {
  transform: scale(1.08);
}

.video-play-caption {
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
}

/* ===== MODAL YOUTUBE ===== */
.yt-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(10, 15, 28, 0.84);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.yt-modal-dialog {
  width: 100%;
  max-width: 920px;
  background: #0f172a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.yt-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #111827;
  color: #f8fafc;
}

.yt-modal-title {
  font-size: 15px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 12px;
}

.yt-modal-close {
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.yt-modal-close:hover {
  background: #e1113f;
}

.yt-modal-ratio {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000000;
}

.yt-modal-ratio iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .about-section {
    gap: 32px;
  }

  .section-title {
    font-size: 24px;
  }

  .section-text {
    font-size: 15px;
    line-height: 1.5;
  }

  .image-container {
    width: 100%;
    max-width: 620px;
    height: auto;
    aspect-ratio: 620 / 419;
  }
}

@media (max-width: 480px) {
  .about-section {
    gap: 24px;
  }

  .section-title {
    font-size: 21px;
  }

  .section-text {
    font-size: 14px;
  }

  .video-play-btn {
    width: 58px;
    height: 58px;
    font-size: 28px;
  }
}
</style>
