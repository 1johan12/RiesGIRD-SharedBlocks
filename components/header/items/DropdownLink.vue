<template>
    <li class="nav-item dropdown px-3 position-relative">

        <a class="nav-link text-secondary nav-hover-effect" href="#" :id="id" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ label }}  
            <i class="bi bi-chevron-down ms-1 icon-arrow"></i>
        </a>

        <ul class="dropdown-menu shadow-lg border-0 mt-0 rounded-3 p-2 animate-slide" :aria-labelledby="id">
            <li v-for="(item, index) in items" :key="index">
                <a class="dropdown-item rounded-2 py-2" :href="item.href || '#'">
                    {{ item.label }}
                </a>
            </li>
        </ul>

    </li>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    id: string;
    items: { label: string; href?: string }[];
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
    display: flex;
    align-items: center;

    .icon-arrow {
        font-size: 0.7em;
        transition: transform 0.3s ease;
        opacity: 0.5;
        margin-left: 5px;
    }

    
    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 15px;
        left: 50%;
        background-color: $esan-color;
        transition: all 0.3s ease-in-out;
        transform: translateX(-50%);
    }

    
    &:hover {
        color: $esan-color !important;

        &::after {
            width: 80%;
        }

        .icon-arrow {
            transform: rotate(180deg);
            opacity: 1;
            color: $esan-color;
        }
    }
}

.dropdown-item {
    font-size: 0.85rem;
    color: #555;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background-color: #f8f9fa;
        color: $esan-color;
        transform: translateX(5px);
    }
}


@media (min-width: 992px) {

    
    .nav-item:hover>.dropdown-menu {
        display: block;
        margin-top: 0;
    }

    .nav-item:hover>.nav-link .icon-arrow {
        transform: rotate(180deg);
        opacity: 1;
        color: $esan-color;
    }

    .nav-item:hover>.nav-link::after {
        width: 80%;
    }

    .nav-item:hover>.nav-link {
        color: $esan-color !important;
    }

    
    .dropdown-menu {
        min-width: 200px;
        border: none !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        animation: fadeIn 0.3s ease;
    }
}


@media (max-width: 991px) {
    .dropdown-menu {
        border: none;
        box-shadow: none !important; 
        padding-left: 20px !important; 
        background-color: transparent; 
        margin-top: 0;
    }

    .nav-link {
        padding-bottom: 10px; 
        margin-bottom: 0;
        width: 100%;
        justify-content: space-between; 
    }

    
    .nav-link.show .icon-arrow {
        transform: rotate(180deg);
        color: $esan-color;
    }

    
    .nav-link::after {
        display: none;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>