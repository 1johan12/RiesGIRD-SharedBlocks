<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: any
}>();

// --- LOGICA REACTIVA DEL PAGE BUILDER ---
const title = computed(() => props.data?.title || 'Estructura de la RiesGIRD-ACC/Perú');
const universidades = computed(() => props.data?.universidades || []);
</script>

<template>
  <section class="estructura-section">

    <div class="titulo-wrapper" v-if="title">
      <h2 class="titulo">{{ title }}</h2>
      <div class="titulo-barra">
        <span class="barra-roja" />
        <span class="barra-azul" />
      </div>
    </div>

    <div class="diagrama-top">

      <div class="col-izquierda">
        <div class="nodo nodo-md">
          <p class="nodo-titulo">Asamblea de Rectores</p>
          <p class="nodo-sub">(Rectores de las universidades miembros)</p>
        </div>
        <div class="conector-v">
          <span class="linea-v" />
          <i class="ti ti-chevron-down flecha" aria-hidden="true" />
        </div>
        <div class="nodo nodo-md">
          <p class="nodo-titulo">Consejo Directivo</p>
          <p class="nodo-sub">(3 Rectores elegidos como plancha de Gestión)</p>
        </div>
        <div class="conector-v">
          <span class="linea-v" />
          <i class="ti ti-chevron-down flecha" aria-hidden="true" />
        </div>
        <div class="nodo nodo-md" id="sec-tecnica">
          <p class="nodo-titulo">Secretaría Técnica nacional</p>
          <p class="nodo-sub">(El secretario técnico del presidente de la Red)</p>
        </div>
      </div>

      <div class="conector-h-wrapper">
        <div class="conector-h-linea" />
      </div>

      <div class="col-derecha">
        <div class="nodo nodo-sm nodo-dashed">
          <p class="nodo-titulo">Consejo Consultivo</p>
          <p class="nodo-sub">(Expertos)</p>
          <p class="nodo-titulo mt-1">(Comité Técnico Nacional)</p>
        </div>
        <div class="conector-v-sm">
          <span class="linea-v" />
        </div>
        <div class="nodo nodo-sm">
          <p class="nodo-titulo">Comité de fortalecimiento</p>
        </div>
        <div class="conector-v-sm">
          <span class="linea-v" />
        </div>
        <div class="nodo nodo-sm">
          <p class="nodo-titulo">Comité de ética e integridad</p>
        </div>
      </div>
    </div>

    <div class="conector-bottom" v-if="universidades.length > 0">
      <span class="linea-v-bottom" />
      <div class="linea-h-bottom" />
    </div>

    <div class="universidades-grid" v-if="universidades.length > 0" :style="{ gridTemplateColumns: `repeat(${universidades.length}, 1fr)` }">
      <div
        v-for="(uni, i) in universidades"
        :key="i"
        class="uni-col"
      >
        <div class="conector-desde-barra">
          <span class="linea-v" />
        </div>

        <div class="nodo nodo-uni">
          <p class="nodo-titulo">{{ uni }}</p>
        </div>
        <div class="conector-v-sm">
          <span class="linea-v" />
          <i class="ti ti-chevron-down flecha-sm" aria-hidden="true" />
        </div>
        <div class="nodo nodo-xs">
          <p class="nodo-titulo">Rector</p>
        </div>
        <div class="conector-v-sm">
          <span class="linea-v" />
          <i class="ti ti-chevron-down flecha-sm" aria-hidden="true" />
        </div>
        <div class="nodo nodo-xs">
          <p class="nodo-titulo">Secretario técnico designado</p>
        </div>
        <div class="conector-v-sm">
          <span class="linea-v" />
          <i class="ti ti-chevron-down flecha-sm" aria-hidden="true" />
        </div>
        <div class="nodo nodo-xs">
          <p class="nodo-titulo">Comité técnico inter áreas designados</p>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');

.estructura-section {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px 15px;
  font-family: inherit;
  background: transparent; /* Se vuelve transparente para heredar el content-wrapper blanco del layout */
}

/* ── Título ── */
.titulo-wrapper {
  text-align: center;
  margin-bottom: 40px;
}

.titulo {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111;
  display: inline-block;
  margin-bottom: 6px;
}

.titulo-barra {
  display: flex;
  height: 3px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.barra-roja { flex: 55; background: #D9043D; }
.barra-azul { flex: 45; background: #254C9E; }

/* ── Diagrama superior ── */
.diagrama-top {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  margin-bottom: 0;
}

.col-izquierda {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  flex-shrink: 0;
}

.conector-h-wrapper {
  display: flex;
  align-items: flex-start;
  padding-top: 80px;
  width: 40px;
  flex-shrink: 0;
}
.conector-h-linea { width: 100%; height: 1.5px; background: #f4afc8; }

.col-derecha {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 240px;
  flex-shrink: 0;
  border: 1.5px dashed #D9043D;
  border-radius: 10px;
  padding: 12px;
  gap: 0;
}

/* ── Nodos ── */
.nodo {
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid transparent;
  background-clip: padding-box;
  position: relative;
  text-align: center;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
}

/* Borde gradiente original */
.nodo::before {
  content: '';
  position: absolute;
  inset: -1.5px;
  border-radius: 11px;
  background: linear-gradient(to right, #D9043D, #254C9E);
  z-index: -1;
}

.nodo-dashed::before { background: none; }
.nodo-dashed { border: 1.5px solid #D9043D; box-shadow: none; }

.nodo-md { width: 240px; padding: 12px 16px; }
.nodo-sm { width: 100%; padding: 10px 12px; }
.nodo-xs { width: 160px; padding: 8px 10px; }
.nodo-uni { width: 160px; padding: 10px 12px; height: 100%; display: flex; align-items: center; justify-content: center; }

.nodo-titulo { font-size: 0.82rem; font-weight: 700; color: #111; margin: 0; line-height: 1.3; }
.nodo-sub { font-size: 0.75rem; font-weight: 500; color: #555; margin: 4px 0 0; line-height: 1.3; }

/* ── Conectores ── */
.conector-v { display: flex; flex-direction: column; align-items: center; gap: 0; height: 40px; }
.conector-v-sm { display: flex; flex-direction: column; align-items: center; height: 28px; }
.linea-v { display: block; width: 1.5px; flex: 1; background: #f4afc8; }

.flecha { font-size: 14px; color: #D9043D; line-height: 1; }
.flecha-sm { font-size: 11px; color: #D9043D; line-height: 1; }

/* ── Conector hacia universidades ── */
.conector-bottom { display: flex; flex-direction: column; align-items: center; margin: 0 auto; width: 100%; }
.linea-v-bottom { display: block; width: 1.5px; height: 24px; background: #f4afc8; }
.linea-h-bottom { width: 76%; height: 1.5px; background: linear-gradient(to right, #f4afc8, #93c5fd); }

/* ── Fila de universidades ── */
.universidades-grid {
  display: grid;
  gap: 12px;
  margin-top: 0;
  width: 100%;
}
.uni-col { display: flex; flex-direction: column; align-items: center; }
.conector-desde-barra { display: flex; flex-direction: column; align-items: center; height: 20px; }

/* --- RESPONSIVE DESIGN --- */
@media (max-width: 992px) {
  .universidades-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px;
  }
  .linea-h-bottom { display: none; }
}

@media (max-width: 768px) {
  .diagrama-top { flex-direction: column; align-items: center; }
  .conector-h-wrapper { display: none; }
  .col-derecha { width: 240px; margin-top: 20px; }
}

@media (max-width: 480px) {
  .universidades-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>