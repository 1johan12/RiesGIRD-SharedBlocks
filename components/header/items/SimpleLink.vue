<template>
  <li class="nav-item px-3">
    <a 
      class="nav-link text-secondary nav-hover-effect" 
      :href="href || '#'" 
      :target="openInNewTab ? '_blank' : '_self'"
    >
      {{ label }}
      <i v-if="hasArrow" class="bi bi-chevron-down ms-1 icon-arrow"></i>
    </a>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  href?: string;
  hasArrow?: boolean;
  openInNewTab?: boolean;  
}>();
</script>

<style scoped lang="scss">
$esan-color: #c40d36;

.nav-link {
    color: #444 !important;
    position: relative;
    padding-bottom: 25px;
    margin-bottom: -15px;
    transition: color 0.3s;
    display: flex; align-items: center;

    .icon-arrow {
        font-size: 0.7em; transition: transform 0.3s ease; opacity: 0.5; margin-left: 5px;
    }

    &::after {
        content: ''; position: absolute; width: 0; height: 2px; bottom: 15px; left: 50%;
        background-color: $esan-color; transition: all 0.3s ease-in-out; transform: translateX(-50%);
    }

    &:hover {
        color: $esan-color !important;
        &::after { width: 80%; }
        .icon-arrow { transform: rotate(180deg); opacity: 1; color: $esan-color; }
    }
}
</style>
