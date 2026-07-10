<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ config: any }>();

const safeConfig = computed(() => ({
    bgColor: props.config?.bgColor || '#1e1e1e',
    textColor: props.config?.textColor || '#7e7e7e',
    linkColor: props.config?.linkColor || '#9ba8b5',
    iconColor: props.config?.iconColor || '#ffffff',
    links: props.config?.links || [],
    copyrightText: props.config?.copyrightText || '',
    socialLinks: props.config?.socialLinks || []
}));
</script>

<template>
    <footer class="footer-simple" :style="{
        '--fs-bg': safeConfig.bgColor,
        '--fs-text': safeConfig.textColor,
        '--fs-link': safeConfig.linkColor,
        '--fs-icon': safeConfig.iconColor
    }">
        <div class="container py-4">
            <div class="row align-items-center">
                
                <div class="col-12 col-md-9 text-center text-md-end mb-3 mb-md-0 pe-md-5">
                    
                    <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-end mb-2 fs-links-list">
                        <li v-for="(link, i) in safeConfig.links" :key="i" class="fs-link-item">
                            <a :href="link.url">{{ link.text }}</a>
                        </li>
                    </ul>
                    
                    <p class="mb-0 fs-copyright">{{ safeConfig.copyrightText }}</p>
                
                </div>

                <div class="col-12 col-md-3 text-center text-md-end">
                    <div class="d-flex justify-content-center justify-content-md-end gap-3 fs-socials">
                        <a v-for="(soc, i) in safeConfig.socialLinks" :key="i" :href="soc.url">
                            <i :class="soc.icon"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-simple {
    background-color: var(--fs-bg);
    color: var(--fs-text);
    font-family: sans-serif;
}

/* Enlaces horizontales con el separador | */
.fs-links-list {
    margin: 0;
    padding: 0;
}

.fs-link-item {
    display: inline-flex;
    align-items: center;
}

.fs-link-item a {
    color: var(--fs-link);
    text-decoration: none;
    font-size: 0.85rem;
    transition: opacity 0.2s;
}

.fs-link-item a:hover {
    opacity: 0.7;
}

/* El truco del separador | automático */
.fs-link-item:not(:last-child)::after {
    content: '|';
    color: var(--fs-text);
    opacity: 0.5;
    margin: 0 12px;
    font-size: 0.8rem;
}

.fs-copyright {
    font-size: 0.8rem;
    opacity: 0.8;
}

/* Iconos de Redes Sociales */
.fs-socials a {
    color: var(--fs-icon);
    font-size: 1.2rem;
    text-decoration: none;
    transition: transform 0.2s;
}

.fs-socials a:hover {
    transform: scale(1.1);
}
</style>