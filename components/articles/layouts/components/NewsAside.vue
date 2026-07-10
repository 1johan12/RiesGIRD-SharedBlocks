<template>
    <aside class="sidebar">
        <div class="sidebar__top">
            <button class="sidebar__back" @click="$router.go(-1)">
                <i class="bi bi-chevron-left"></i>
                <span>Volver</span>
            </button>
            <section class="sidebar__section">
                <div class="sidebar__heading">
                    Comparte:
                </div>
                <div class="sidebar__socials">
                    <a href="#" @click.prevent="shareOn('facebook')" class="share-facebook">
                        <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#" @click.prevent="shareOn('twitter')" class="share-twitter">
                        <i class="bi bi-twitter"></i>
                    </a>
                    <a href="#" @click.prevent="shareOn('linkedin')" class="share-linkedin">
                        <i class="bi bi-linkedin"></i>
                    </a>
                    <a href="#" @click.prevent="shareOn('whatsapp')" class="share-whatsapp">
                        <i class="bi bi-whatsapp"></i>
                    </a>
                </div>
            </section>
            <section class="sidebar__info">
                <div class="sidebar__card">
                    <div class="sidebar__card-icon sidebar__card-icon--red">
                        <i class="bi bi-clock"></i>
                    </div>
                    <div>
                        <div class="sidebar__card-title">
                            Fecha:
                        </div>
                        <div class="sidebar__card-text">
                          {{ date }}
                        </div>
                    </div>
                </div>
                <div class="sidebar__card">
                    <div class="sidebar__card-icon sidebar__card-icon--blue">
                        <i class="bi bi-geo-alt"></i>
                    </div>
                    <div>
                        <div class="sidebar__card-title">
                            Lugar
                        </div>
                        <div class="sidebar__card-text">
                            {{ place }}
                        </div>
                    </div>
                </div>
                <div class="sidebar__card">
                    <div class="sidebar__card-icon sidebar__card-icon--red">
                        <i class="bi bi-diagram-3"></i>
                    </div>
                    <div>
                        <div class="sidebar__card-title">
                            Institución Anfitrión
                        </div>
                        <div class="sidebar__card-text">
                            {{ hostInstitution }}
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div class="sidebar__bottom">
            <a :href="registrationUrl" target="_blank" rel="noopener noreferrer" class="sidebar__cta">
                <span>Inscribirse</span>
            </a>
        </div>
    </aside>
</template>

<script setup lang="ts">
defineProps<{
  date: string;
  place: string;
  hostInstitution: string;
  registrationUrl: string;
}>();

// Nueva funcionalidad para construir el link y compartir la URL actual
const shareOn = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
  const currentUrl = encodeURIComponent(window.location.href);
  let shareUrl = '';

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${currentUrl}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  }
};
</script>

<style scoped>
  .sidebar {
    width: 100%;
    max-width: 359px;
    justify-self: start;
    display: flex;
    flex-direction: column;
    gap: 22px;
    position: sticky;
    top: 16px;
  }
  .sidebar__top,
  .sidebar__bottom {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
  }

  .sidebar__bottom:hover {
    background-color: linear-gradient(90deg,
        #E1113F 0%,
        #274E9D 100%);;
  }
  .sidebar__top {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  /* ==========================
   BACK BUTTON
========================== */
  .sidebar__back {
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 8px;
    background: #d4d4d4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: .25s ease;
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #6b6b6b;
  }
  .sidebar__back:hover {
    background: #E1113F;
    color: white;
  }
  .sidebar__back i {
    font-size: 14px;
  }
  /* ==========================
   SHARE
========================== */
  .sidebar__heading {
    text-align: center;
    font-family: 'Raleway', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #4d4d4d;
    margin-bottom: 14px;
  }
  .sidebar__socials {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
  .sidebar__socials a {
    width: 50px;
    height: 50px;
    background: #ECF3FF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: background-color 0.25s ease, color 0.25s ease; /* Transición suave */
  }
  .sidebar__socials i {
    font-size: 18px;
    color: #5F5F5F;
    transition: color 0.25s ease;
  }

  /* 🌟 NUEVOS ESTILOS HOVER CORPORATIVOS 🌟 */
  .sidebar__socials a.share-facebook:hover {
    background-color: #1877F2;
  }
  .sidebar__socials a.share-twitter:hover {
    background-color: #1DA1F2;
  }
  .sidebar__socials a.share-linkedin:hover {
    background-color: #0077B5;
  }
  .sidebar__socials a.share-whatsapp:hover {
    background-color: #25D366;
  }
  /* Cambia el icono a blanco puro al hacer hover */
  .sidebar__socials a:hover i {
    color: #ffffff;
  }

  /* ==========================
   INFO CARDS
========================== */
  .sidebar__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .sidebar__card {
    width: 100%;
    height: 78px;
    padding-inline: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ECF3FF;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .sidebar__card-icon {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, .15);
  }
  .sidebar__card-icon--red {
    color: #E1113F;
  }
  .sidebar__card-icon--blue {
    color: #274E9D;
  }
  .sidebar__card-title {
    font-family: 'Raleway', sans-serif;
    font-size: 16.74px;
    font-weight: 700;
    color: #555555;
  }
  .sidebar__card-text {
    margin-top: 2px;
    font-family: 'Raleway', sans-serif;
    font-size: 16.74px;
    font-weight: 400;
    color: #757575;
  }
  /* ==========================
   CTA
========================== */
  .sidebar__cta {
    width: 221px;
    height: 58px;
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 8px;
    background: white;
    overflow: hidden;
  }
  .sidebar__cta::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 8px;
    background:
      linear-gradient(90deg,
        #E1113F 0%,
        #274E9D 100%);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  .sidebar__cta span {
    background:
      linear-gradient(90deg,
        #E1113F 0%,
        #274E9D 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Raleway', sans-serif;
    font-size: 20px;
    font-weight: 700;
  }

  .sidebar__cta:hover{
    background: linear-gradient(90deg,
        #E1113F 0%,
        #274E9D 100%);

  }

  .sidebar__cta:hover span{
    background: none;
    -webkit-text-fill-color: white;
    color: white;
  }
  @media (max-width: 992px) {
    .sidebar {
      position: static;
      max-width: none;
      width: 100%;
    }
  }
  @media (max-width: 768px) {
      .sidebar__cta {
          width: 100%;
      }
  }
</style>