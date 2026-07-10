<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { formatImageUrl } from '@/helpers/url';

export interface SectorItem {
    id: number;
    title: string;
    image: string;
    url: string;
    color: string;
}

const props = defineProps<{
    items: SectorItem[];
}>();

const activeItem = ref<SectorItem | null>(null);

const initSelection = () => {
    if (props.items && props.items.length > 0) {
        activeItem.value = props.items[0];
    }
};

onMounted(initSelection);

watch(() => props.items, (newVal) => {
    if (newVal.length > 0 && !activeItem.value) {
        activeItem.value = newVal[0];
    }
});

const handleHover = (item: SectorItem) => {
    activeItem.value = item;
};
</script>

<template>
    <div class="interactive-wrapper">

        <div class="grid-controls">
            <div v-for="item in props.items" :key="item.id" class="control-item"
                :class="{ 'is-active': activeItem?.id === item.id }" @mouseenter="handleHover(item)"
                :style="{ '--sector-color': item.color }">
                <div class="icon-box">
                    <img v-if="item.image" :src="formatImageUrl(item.image)" class="control-img blend-multiply"
                        alt="icon" />
                    <i v-else class="las la-cube fs-3 text-dark"></i>
                </div>
                <span class="mini-label">{{ item.title }}</span>
            </div>
        </div>

        <div class="stage-area">
            <Transition name="fade-up" mode="out-in">

                <div v-if="activeItem" :key="activeItem.id" class="stage-content">

                    <div class="stage-info">
                        <div class="accent-line" :style="{ background: activeItem.color }"></div>

                        <h3 class="display-title" :style="{ color: activeItem.color }">
                            {{ activeItem.title }}
                        </h3>

                        <p style="font-size: 16px;" class="text-muted">Soluciones especializadas para {{ activeItem.title }}.</p>

                        <router-link :to="activeItem.url" class="btn-clean"
                            :style="{ '--btn-color': activeItem.color }">
                            Ver Sector <i class="las la-arrow-right"></i>
                        </router-link>
                    </div>

                    <div class="stage-visual">
                        <div class="bg-shape" :style="{ background: activeItem.color }"></div>
                        <img :src="formatImageUrl(activeItem.image)" class="hero-image blend-multiply"
                            alt="Sector Hero" />
                    </div>
                </div>
            </Transition>
        </div>

    </div>
</template>

<style scoped lang="scss">

.blend-multiply {
    mix-blend-mode: multiply;
    filter: contrast(1.05);
    display: block;
}

.stage-area {
    min-height: 350px;
}

.stage-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
}

.stage-info {
    text-align: left;
}

.accent-line {
    width: 50px;
    height: 4px;
    margin-bottom: 1.5rem;
    border-radius: 2px;
}

.grid-controls {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: space-evenly;
    gap: 1.5rem;
    padding: 1rem 1rem 2rem 1rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 3rem;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }
}

.control-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.3s ease;
    flex: 0 0 auto;
    width: 110px;
    vertical-align: top;
    scroll-snap-align: start;

    &:hover,
    &.is-active {
        opacity: 1;
        transform: translateY(-5px);
    }
}


.icon-box {
    width: 100px;
    height: 100px;
    background: #f8f9fa;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    flex-shrink: 0; 

    .control-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .control-item.is-active & {
        background: #fff;
        border-color: var(--sector-color);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    }
}

.mini-label {
    margin-top: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    color: #888;
    white-space: normal;
    line-height: 1.2;
    width: 100%;

    .control-item.is-active & {
        color: var(--sector-color);
    }
}


.display-title {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    letter-spacing: -1px;
    transition: color 0.3s ease;
}

.btn-clean {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 1.5rem;
    text-decoration: none;
    font-weight: 700;
    padding: 10px 24px;
    border: 2px solid var(--btn-color);
    color: var(--btn-color);
    background: white;
    border-radius: 50px;
    transition: all 0.3s ease;

    &:hover {
        background: var(--btn-color);
        color: #ffffff !important;
        transform: translateY(-2px);
    }
}


.stage-visual {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-shape {
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    opacity: 0.08;
    transform: scale(1);
    transition: background 0.5s ease;
}

.hero-image {
    position: relative;
    z-index: 2;
    max-width: 100%;
    max-height: 320px;
    object-fit: contain;
    animation: floatLight 5s ease-in-out infinite;
}

.fade-up-enter-active,
.fade-up-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-up-enter-from {
    opacity: 0;
    transform: translateY(15px);
}

.fade-up-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}

@keyframes floatLight {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}


@media (max-width: 992px) {
    .stage-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 2rem;
    }

    .stage-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        order: 2;
    }

    .stage-visual {
        order: 1;
        height: 250px;
    }

    .display-title {
        font-size: 2rem;
    }

    .grid-controls {
        padding-left: 0;
        justify-content: flex-start;
    }
}
</style>