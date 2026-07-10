<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import HttpClient from "@/helpers/http-client";
import { formatImageUrl } from '@/helpers/url';


export interface SectorItem {
    id: number;
    title: string;
    image: string;
    slug: string; 
    color: string;
}

interface Course {
    id: number;
    title: string;
    link: string;
    image_path: string;
    status_label?: string; 
    status_course?: string; 
    categoryName?: string;
    categoryColor?: string;
    startDate?: string;
    duration?: string;
    modality?: string;
    teacher?: { name: string; image: string; };
}

const props = defineProps<{
    items: SectorItem[];
}>();

const ProductCard = defineAsyncComponent(() => import('@/components/ui/ProductCard2.vue'));


const activeItem = ref<SectorItem | null>(null); 
const courses = ref<Course[]>([]);
const loading = ref(false);


const mapCourseData = (rawData: any[]) => {
    return rawData.map((item: any) => {
        const detailBlock = item.content_blocks?.find((b: any) => b.type === 'CourseDetailBlock');
        const content = detailBlock ? detailBlock.content : {};
        const mainTeacher = (content.teachers && content.teachers.length > 0) ? content.teachers[0] : null;

        return {
            id: item.id,
            title: item.subtitle ? `${item.subtitle} en Especialización de ${item.title}` : item.title,
            modality: item.modality,
            link: `/programas/${item.slug}`,
            image_path: item.image_path || item.image_url,
            categoryName: activeItem.value ? activeItem.value.title : (item.category?.name || 'General'),
            categoryColor: activeItem.value ? activeItem.value.color : (item.category?.color || '#01828f'),
            startDate: content.startDate || item.start_date,
            duration: content.duration || 'Por definir',
            status_label: item.status === 'published' ? 'EN VENTA' : 'BORRADOR',
            status_course: item.status_course === 'EN VENTA' ? 'EN VENTA' : 'PREVENTA',
            teacher: mainTeacher ? {
                name: mainTeacher.name,
                image: formatImageUrl(mainTeacher.image) 
            } : undefined
        };
    });
};


const fetchInitialCourses = async () => {
    loading.value = true;
    try {
        const response = await HttpClient.get(`courses-list2?limit=9`); 
        const rawData = response.data.data || response.data;
        courses.value = mapCourseData(rawData);
    } catch (e) {
        console.error("Error en carga inicial:", e);
    } finally {
        loading.value = false;
    }
};

const fetchCategoryData = async (slug: string) => {
    loading.value = true;
    try {
        const response = await HttpClient.get(`courses/category/${slug}`);
        const responseData = response.data;
        const rawData = responseData.courses?.data || responseData.courses || [];
        courses.value = mapCourseData(rawData);
    } catch (e) {
        console.error("Error por categoría:", e);
        courses.value = [];
    } finally {
        loading.value = false;
    }
};



const resetToGeneral = () => {
    if (activeItem.value === null) return; 
    activeItem.value = null;
    fetchInitialCourses();
    scrollToStage();
};


const scrollToStage = () => {
    const stage = document.querySelector('.grid-controls');
    if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};


const handleSelect = (item: SectorItem) => {
    if (activeItem.value?.id === item.id) {
        resetToGeneral();
        return;
    }
    courses.value = []; 
    activeItem.value = item;
    scrollToStage();
};;

onMounted(() => {
    fetchInitialCourses(); 
});

watch(activeItem, (newVal) => {
    if (newVal?.slug) {
        fetchCategoryData(newVal.slug);
    }
});
</script>

<template>
    <div class="interactive-wrapper py-5">
        <div class="container-fluid px-0 mb-5"> 
            <div class="grid-controls">
                <div v-for="item in props.items" :key="item.id" 
                    class="control-item"
                    :class="{ 'is-active': activeItem?.id === item.id }" 
                    @click="handleSelect(item)"
                    :style="{ '--sector-color': item.color }">
                    
                    <div class="icon-box">
                        <img v-if="item.image" :src="formatImageUrl(item.image)" class="control-img blend-multiply" :alt="item.title" />
                        <i v-else class="las la-cube fs-3"></i>
                    </div>
                    <span class="mini-label">{{ item.title }}</span>
                </div>
            </div>
        </div>

        <div class="stage-area container">
            <Transition name="fade-up" mode="out-in">
                <div :key="activeItem ? activeItem.id : 'general'" class="content-block">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 border-bottom pb-3 gap-3">
                        <div class="title-group">
                            <div class="accent-line" :style="{ background: activeItem ? activeItem.color : '#e31140' }"></div>
                            <h2 class="display-title mb-0" :style="{ color: activeItem ? activeItem.color : '#1e293b' }">
                                {{ activeItem ? activeItem.title : 'Nuestros Programas' }}
                            </h2>
                        </div>
                        
                        <button @click="resetToGeneral" class="btn-ver-todos w-auto border-2">
                            {{ activeItem ? 'Ver todos los programas' : 'Explorar toda la oferta' }} 
                            <i class="las la-arrow-right ms-2"></i>
                        </button>
                    </div>

                    <div v-if="loading" class="loader-container">
                        <div class="spinner-border" :style="{ color: activeItem ? activeItem.color : '#e31140' }" role="status"></div>
                    </div>

                    <div v-else class="row g-4">
                        <div v-for="course in courses" :key="course.id" class="col-md-6 col-lg-4">
                            <ProductCard :data="course" />
                        </div>
                        
                        <div v-if="courses.length === 0" class="col-12 text-center py-5 empty-state">
                            <i class="las la-box-open mb-3" :style="{ color: activeItem?.color || '#ccc' }"></i>
                            <p class="text-muted fw-bold">No se encontraron programas en esta sección.</p>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped lang="scss">
.interactive-wrapper { 
    /*background: #fff; */
    min-height: 700px; }
.blend-multiply { mix-blend-mode: multiply; }



.grid-controls {
    display: flex;
    flex-wrap: wrap;           
    justify-content: center;   
    gap: 1rem;                 
    padding: 1rem 0;
    width: 100%;

    @media (min-width: 992px) {
        gap: 2rem;
    }
}

.control-item {
    flex: 0 1 auto;
    width: calc(33.33% - 1rem);
    min-width: 90px;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    opacity: 0.5;

    @media (min-width: 768px) {
        width: 110px;
    }

    
    &:hover:not(.is-active) {
        opacity: 0.8;
        transform: translateY(-4px); 
        
        .icon-box {
            background: #fff;
            border-color: #cbd5e1; 
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
            
            .control-img {
                transform: scale(1.05); 
            }
        }
    }

    
    &.is-active {
        opacity: 1;
        transform: translateY(-8px); 
        .icon-box {
            background: #fff;
            border-color: var(--sector-color);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .mini-label { 
            color: var(--sector-color); 
            font-weight: 800;
        }
    }
}

.icon-box {
    width: 65px;
    height: 65px;
    margin: 0 auto 8px;
    background: #f1f5f9;
    transition: all 0.3s ease; 
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border: 2px solid transparent;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        width: 85px;
        height: 85px;
    }
    .control-img { width: 100%; height: 100%; 
        transition: transform 0.3s ease; object-fit: contain; }
}

.icon-box {
    width: 70px;
    height: 70px;
    margin: 0 auto 10px;
    background: #f1f5f9;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border: 2px solid transparent;
    transition: all 0.3s ease;

    @media (min-width: 768px) {
        width: 85px;
        height: 85px;
        border-radius: 24px;
    }
    .control-img { width: 100%; height: 100%; object-fit: contain; }
}

.mini-label { 
    font-size: 0.7rem; 
    font-weight: 700; 
    color: #475569; 
    display: block; 
    line-height: 1.1;
    text-transform: uppercase;
    @media (min-width: 768px) { font-size: 0.8rem; }
}


.display-title { 
    font-size: 1.8rem; 
    font-weight: 900; 
    letter-spacing: -1px;
    @media (min-width: 768px) { font-size: 2.5rem; }
}

.accent-line { width: 40px; height: 5px; border-radius: 10px; margin-bottom: 0.5rem; }


.btn-ver-todos {
    text-decoration: none;
    font-weight: 800;
    color: #e31140; 
    font-size: 0.85rem;
    border: 2px solid #e31140; 
    padding: 10px 24px;
    border-radius: 50px;
    display: inline-flex;
    align-items: center;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover { 
        background: #e31140; 
        color: #fff; 
        border-color: #e31140;
        box-shadow: 0 4px 12px rgba(227, 17, 64, 0.2);
        
        i { transform: translateX(5px); }
    }

    i { transition: transform 0.3s ease; }
}

.loader-container {
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    .spinner-border { width: 3rem; height: 3rem; }
}


.fade-up-enter-active, .fade-up-leave-active { transition: all 0.5s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-20px); }
</style>