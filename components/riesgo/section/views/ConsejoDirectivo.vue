<script setup lang="ts">
import { computed } from 'vue';
import SectionTitle from '../title/SectionTitle.vue';
import { formatImageUrl } from '@shared/helpers/url';
const props = defineProps<{
  data: any
}>();

// --- PROPIEDADES COMPUTADAS REACTIVAS ---
const title = computed(() => props.data?.title || 'Consejo Directivo');
const introText = computed(() => props.data?.introText || 'El Consejo Directivo es el órgano encargado de dirigir, administrar y representar legalmente a la Red. Su función principal es ejecutar los acuerdos de la Asamblea General de Rectores y evaluar la admisión de nuevas universidades miembro.');
const subtitle = computed(() => props.data?.subtitle || 'Directorio Actual (Periodo 2024 - 2027)');
const directorio = computed(() => props.data?.directorio || []);


</script>

<template>
  <div class="consejo-section">
    <div class="max-w-container">
      <SectionTitle v-if="title" :title="title" :padding-bottom="10" />
      <!-- <h1 class="main-title" v-if="title">
        {{ title }}
        <span class="title-bar">
          <span class="bar-red"></span>
          <span class="bar-blue"></span>
        </span>
      </h1> -->

      <p class="intro-text" v-if="introText">
        {{ introText }}
      </p>
      <SectionTitle v-if="subtitle" :title="subtitle" :padding-bottom="10" :padding-top="20" />
      <!-- <div class="subtitle-wrapper" v-if="subtitle">
        <h2 class="sub-title">
          {{ subtitle }}
          <span class="title-bar">
            <span class="bar-red"></span>
            <span class="bar-blue"></span>
          </span>
        </h2>
      </div> -->

      <div class="directorio-grid" v-if="directorio.length > 0">
        <div 
          v-for="(miembro, index) in directorio" 
          :key="index"
          class="miembro-card"
        >
          <div class="avatar-gradient">
            <div class="avatar-inner">
              <img 
                v-if="miembro.photo_url" 
                :src="formatImageUrl(miembro.photo_url)" 
                :alt="miembro.nombre" 
                class="avatar-img"
              />
              <svg v-else class="avatar-svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <div class="card-body-content">
            <div>
              <h3 class="member-name">
                {{ miembro.nombre }}
              </h3>

              <span class="member-cargo">
                {{ miembro.cargo }}
              </span>

              <p class="member-institution">
                {{ miembro.institucion }}
              </p>
            </div>

            <div class="contact-footer">
              <div v-if="miembro.emails && miembro.emails.length > 0" class="email-list">
                <i  class="bi bi-envelope-fill email-icon"></i>
                <div class="contact_footer_card_etc">
                    <div 
                    v-for="(email, eIdx) in miembro.emails" 
                    :key="eIdx"
                    class="email-item"
                  >
                    
                    <!-- <span v class="email-spacer"></span> -->
                    <a :href="`mailto:${email}`" class="email-link">{{ email }}</a>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-email">
                <svg class="no-email-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ---
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* =========================================================================
   🎨 MAQUETACIÓN PREMIUM CON PURE CSS (SOLUCIÓN EMBEBIDA SIN TAILWIND)
   ========================================================================= */
.contact_footer_card_etc{
  display: flex;
  flex-direction: column;
}
.consejo-section {
  text-align: center;
  width: 100%;
  background-color: transparent;
  /* padding: 10px 0; */
  padding: 50px 0;
  box-sizing: border-box;

}

.max-w-container {
  width: 100%;
  max-width: 1152px; /* Equivale a max-w-6xl */
  margin: 0 auto;
}

/* ── Títulos y Barras Bicolores ── */
.main-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #111827;
  position: relative;
  display: inline-block;
  padding-bottom: 6px;
  letter-spacing: -0.025em;
  margin: 0;
}

.sub-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: #111827;
  position: relative;
  display: inline-block;
  padding-bottom: 6px;
  letter-spacing: -0.025em;
  margin: 0;
}

.title-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  display: flex;
}

.bar-red {
  width: 55%;
  background-color: #d91d36;
}

.bar-blue {
  width: 45%;
  background-color: #2b4c99;
}

.intro-text {
  margin-top: 1.5rem;
  font-size: 20px;
  color: #111827;
  max-width: 1024px; /* max-w-5xl */
  font-family: var(--font-bricolage) !important;
  margin-left: auto;
  margin-right: auto;
  /* line-height: 1.625; */
  font-weight: 400;
}

.subtitle-wrapper {
  margin-top: 3rem;
  margin-bottom: 4rem;
}

/* ── Rejilla Dinámica de Autoridades ── */
.directorio-grid {
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: center;
  align-items: stretch;

  gap: 24px 61px;

  width: 100%;

  margin-top: 24px;
}

/* ── Tarjeta Corporativa Individual ── */
.miembro-card {
  width: 310px;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 28px 22px;

  background: #ffffff;
  border-radius: 8px;

  box-shadow: 0 6px 18px rgba(0,0,0,.12);

  box-sizing: border-box;

  text-align: center;
}

/* ── Avatares e Iniciales Circulares ── */
.avatar-gradient{
  width:100px;
  height:100px;

  margin-bottom:22px;

  background:linear-gradient(
      90deg,
      #E1113F 0%,
      #274E9D 100%
  );

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;
}

.avatar-inner{
  width:90px;
  height:90px;

  border-radius:50%;
  border:2px solid #fff;

  display:flex;
  align-items:center;
  justify-content:center;

  overflow:hidden;

  background:transparent;
}

.avatar-svg{
  width:56px;
  height:56px;

  color:#fff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* ── Bloque Informativo Interno ── */
.card-body-content {
  margin-top: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.member-name{
  margin:0;

  font-family:var(--font-raleway)!important;
  font-size:22px;
  font-weight:700;
  line-height:1.2;

  color:#111;

  overflow-wrap:anywhere;
}

.member-cargo{
  display:inline-block;

  margin-top:12px;

  font-family:var(--font-raleway)!important;
  font-size:16px;
  font-weight:700;

  background:linear-gradient(
      90deg,
      #E1113F 0%,
      #274E9D 100%
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;

  text-decoration:underline;
  text-decoration-thickness:1px;
  text-underline-offset:4px;
}

.member-institution{
  margin-top:16px;

  font-family:var(--font-raleway)!important;
  font-size:16px;
  font-weight:400;
  line-height:1.35;

  color:#111;

  overflow-wrap:anywhere;
}

/* ── Footer de Contactos e Íconos ── */
.contact-footer{
  margin-top:22px;

  width:100%;

  display:flex;
  justify-content:center;
}

.email-list{
  display:flex;
  flex-direction:row;
  align-items:center;

  gap:8px;
}

.email-item{
  display:flex;
  align-items:center;
  justify-content:center;

  gap:8px;

  font-family:var(--font-raleway)!important;
  font-size:14px;
  font-weight:400;

  overflow-wrap:anywhere;
}

.email-item:hover .email-link {
  text-decoration: underline;
}

.email-icon{
  font-size:14px;

  background:linear-gradient(
      90deg,
      #E1113F 0%,
      #274E9D 100%
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;

  flex-shrink:0;
}

.email-spacer {
  width: 20px;
  flex-shrink: 0;
}

.email-link{
  font-family:var(--font-raleway)!important;
  font-size:14px;
  font-weight:400;

  text-decoration:none;

  background:linear-gradient(
      90deg,
      #E1113F 0%,
      #274E9D 100%
  );

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.no-email {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  justify-content: center;
}

.no-email-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* ==========================================================
   RESPONSIVE
========================================================== */

@media (max-width: 1200px) {

  .max-w-container{
    padding:0 20px;
    box-sizing:border-box;
  }

  .consejo-section{
    padding:40px 0;
  }

  .intro-text{
    font-size:18px;
  }

  .directorio-grid{
    flex-wrap:wrap;
    justify-content:center;
    gap:32px;
  }

  .miembro-card{
    width:310px;
    max-width:calc(50% - 16px);
  }

}

@media (max-width: 900px){

  .intro-text{
    font-size:17px;
    line-height:1.45;
  }

  .directorio-grid{
    gap:28px;
  }

  .member-name{
    font-size:20px;
  }

  .member-cargo{
    font-size:15px;
  }

  .member-institution{
    font-size:15px;
  }

}

@media (max-width:768px){

  .consejo-section{
    padding:32px 0;
  }

  .max-w-container{
    padding:0 16px;
  }

  .intro-text{
    font-size:16px;
    line-height:1.45;
  }

  .directorio-grid{
    gap:24px;
  }

  .miembro-card{
    width:100%;
    max-width:310px;
    padding:24px 18px;
  }

  .avatar-gradient{
    width:90px;
    height:90px;
  }

  .avatar-inner{
    width:82px;
    height:82px;
  }

  .avatar-svg{
    width:50px;
    height:50px;
  }

  .member-name{
    font-size:20px;
  }

  .member-cargo{
    font-size:15px;
  }

  .member-institution{
    font-size:15px;
  }

  .email-link,
  .email-item{
    font-size:13px;
  }

}

@media (max-width:640px){

  .directorio-grid{
    flex-direction:column;
    align-items:center;
    gap:24px;
  }

  .miembro-card{
    width:100%;
    max-width:310px;
  }

  .email-list{
    flex-direction:column;
    align-items:center;
    gap:6px;
  }

  .email-icon{
    margin:0;
  }

}

@media (max-width:480px){

  .consejo-section{
    padding:28px 0;
  }

  .max-w-container{
    padding:0 12px;
  }

  .intro-text{
    font-size:15px !important;
    padding:0 6px;
  }

  .member-name{
    font-size:18px;
  }

  .member-cargo{
    font-size:14px;
  }

  .member-institution{
    font-size:14px;
  }

  .email-link,
  .email-item{
    font-size:12px;
  }

}
</style>