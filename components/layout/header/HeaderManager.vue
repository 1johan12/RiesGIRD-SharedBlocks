<template>
  <component 
    :is="selectedComponent" 
    :settings="settings" 
  />
</template>

<script setup>
import { computed } from 'vue';

import HeaderV1Default from './HeaderV1Default.vue';
import HeaderV2Centered from './HeaderV2Centered.vue'; 

const props = defineProps(['settings']);

const selectedComponent = computed(() => {
    const designs = {
        'v1_default': HeaderV1Default, 
        'v2_centered': HeaderV2Centered
    };
    return designs[props.settings.header_type] || HeaderV1Default;
});
</script>