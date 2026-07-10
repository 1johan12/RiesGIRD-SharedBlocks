<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps<{ config: any }>();

const safeConfig = computed(() => ({
    logoUrl: props.config?.logoUrl || '',
    logoHeight: props.config?.logoHeight || 60,
    description: props.config?.description || '',
    bgColor: props.config?.bgColor || '#1a1a1a',
    textColor: props.config?.textColor || '#ffffff',
    accentColor: props.config?.accentColor || '#cc0033',
    address: props.config?.address || '',
    phone: props.config?.phone || '',
    email: props.config?.email || '',
    socialLinks: props.config?.socialLinks || [],
    footerColumns: props.config?.footerColumns || [],
    copyrightText: props.config?.copyrightText || ''
}));
</script>

<template>
    <footer class="footer-pro" :style="{
        '--f-bg': safeConfig.bgColor,
        '--f-text': safeConfig.textColor,
        '--f-accent': safeConfig.accentColor
    }">
        <div class="container py-5">
            <div class="row g-4">
                <div class="col-lg-4">
                    <img v-if="safeConfig.logoUrl" :src="safeConfig.logoUrl" :style="{ height: safeConfig.logoHeight + 'px' }" class="mb-3 footer-logo">
                    <h5 v-else class="fw-bold mb-3 accent-text">INSTITUCIÓN</h5>
                    <p class="small opacity-75 mb-4">{{ safeConfig.description }}</p>
                    <div class="d-flex gap-2">
                        <a v-for="(soc, i) in safeConfig.socialLinks" :key="i" :href="soc.url" class="social-circle">
                            <i :class="soc.icon"></i>
                        </a>
                    </div>
                </div>

                <div v-for="(col, i) in safeConfig.footerColumns" :key="i" class="col-6 col-md-3 col-lg-2">
                    <h6 class="fw-bold mb-3 text-uppercase small accent-text">{{ col.title }}</h6>
                    <ul class="list-unstyled footer-links">
                        <li v-for="(link, li) in col.links" :key="li" class="mb-2">
                            <a :href="link.url">{{ link.text }}</a>
                        </li>
                    </ul>
                </div>

                <div class="col-lg-3 ms-auto">
                    <h6 class="fw-bold mb-3 text-uppercase small accent-text">Contacto</h6>
                    <ul class="list-unstyled small opacity-75 footer-contact">
                        <li class="mb-2"><i class="bi bi-geo-alt me-2"></i> {{ safeConfig.address }}</li>
                        <li class="mb-2"><i class="bi bi-telephone me-2"></i> {{ safeConfig.phone }}</li>
                        <li class="mb-0"><i class="bi bi-envelope me-2"></i> {{ safeConfig.email }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer-bottom py-3 border-top border-secondary border-opacity-25 text-center">
            <span class="small opacity-50">{{ safeConfig.copyrightText }}</span>
        </div>
    </footer>
</template>

<style scoped>
.footer-pro { background-color: var(--f-bg); color: var(--f-text); }
.accent-text { color: var(--f-accent); }
.social-circle {
    width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%; background: rgba(255,255,255,0.1); color: var(--f-text); text-decoration: none;
}
.social-circle:hover { background: var(--f-accent); }
.footer-links a { color: var(--f-text); text-decoration: none; opacity: 0.7; font-size: 0.85rem; }
.footer-links a:hover { opacity: 1; color: var(--f-accent); }
.footer-contact i { color: var(--f-accent); }
</style>