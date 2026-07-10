<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import HttpClient from "@/helpers/http-client";


interface MenuItem {
  id: string | number;
  title: string;
  link: string;
  type?: string;
  slug?: string;
  parent_id?: string | number | null;
  children?: MenuItem[];
}

const isMenuOpen = ref(false);
const activeDropdown = ref<number | string | null>(null);
const menuItems = ref<MenuItem[]>([]); 
const allCategories = ref<any[]>([]); 

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value;
const closeMenu = () => { isMenuOpen.value = false; activeDropdown.value = null; };

const toggleDropdown = (id: number | string) => {
    activeDropdown.value = activeDropdown.value === id ? null : id;
};

const isExternal = (link: string) => link && (link.startsWith('http') || link.startsWith('


const processedMenu = computed(() => {
    return menuItems.value.map(item => {
        const newItem = { ...item };
        if (newItem.type === 'dynamic_group') {
            newItem.children = allCategories.value
                .filter(cat => cat.type === newItem.slug)
                .map(cat => ({
                    id: 'cat-' + cat.id,
                    title: cat.name,
                    
                    link: newItem.slug === 'course' ? `/course/${cat.slug}` : (newItem.slug === 'news' ? `/noticias/${cat.slug}` :`/${cat.slug}`),
                    type: 'category'
                }));
        }
        return newItem;
    });
});

onMounted(async () => {
  try {
    const ts = Date.now();
    const [resMenu, resCats] = await Promise.all([
        HttpClient.get(`public-menu?t=${ts}`),
        HttpClient.get(`categories-simple?t=${ts}`) 
    ]);
    const rawMenu = resMenu.data.data || resMenu.data;
    menuItems.value = buildTreeSafe(rawMenu);
    allCategories.value = resCats.data.data || resCats.data;
  } catch (e) {
    console.error("Error cargando navegación", e);
  }
});


const buildTreeSafe = (data: any[]): MenuItem[] => {
  if (!Array.isArray(data)) return [];
  const items: MenuItem[] = JSON.parse(JSON.stringify(data));
  const map: Record<string, MenuItem> = {};
  const roots: MenuItem[] = [];

  items.forEach((item) => { 
    map[item.id] = item; 
    if(!item.children) item.children = []; 
  });
  
  items.forEach((item) => {
    if (item.parent_id && map[item.parent_id.toString()]) {
      map[item.parent_id.toString()].children?.push(item);
    } else if (!item.parent_id) {
      roots.push(item);
    }
  });
  return roots;
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom py-0 main-nav-container">
    <div class="container">
      <router-link to="/" class="navbar-brand py-2">
        <img src="@/assets/images/LogoHorizontal.png" alt="ESAN" class="menu-logo-img" />
      </router-link>

      <button class="navbar-toggler text-dark" type="button" @click="toggleMenu">
        <i class="fas fa-bars"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-end" :class="{ 'show': isMenuOpen }">
        <ul class="navbar-nav gap-2">
          <template v-for="item in processedMenu" :key="item.id">
            
            <li v-if="item.children && item.children.length > 0" 
                class="nav-item dropdown"
                :class="{ 'show': activeDropdown === item.id }">
              
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 @click.prevent="toggleDropdown(item.id)">
                {{ item.title }}
                <i class="fas fa-chevron-down ms-1 small-icon" :class="{ 'rotate-icon': activeDropdown === item.id }"></i>
              </a>

              <ul class="dropdown-menu shadow-sm" :class="{ 'show': activeDropdown === item.id }">
                <li v-for="child in item.children" :key="child.id">
                  <component 
                    :is="isExternal(child.link) ? 'a' : 'router-link'" 
                    :to="!isExternal(child.link) ? child.link : undefined"
                    :href="isExternal(child.link) ? child.link : undefined"
                    :target="isExternal(child.link) ? '_blank' : undefined"
                    class="dropdown-item"
                    @click="closeMenu"> 
                    {{ child.title }}
                  </component>
                </li>
              </ul>
            </li>

            <li v-else class="nav-item">
              <component 
                :is="isExternal(item.link) ? 'a' : 'router-link'" 
                :to="!isExternal(item.link) ? item.link : undefined"
                :href="isExternal(item.link) ? item.link : undefined"
                class="nav-link"
                @click="closeMenu"> 
                {{ item.title }}
              </component>
            </li>

          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
$esan-blue: #1a4b70;
$esan-red: #f51445;

.main-nav-container {
  min-height: 80px;
}

.menu-logo-img {
  height: 55px;
  object-fit: contain;
}

.nav-link {
  color: #444 !important;
  font-weight: 300;
  font-size: 0.85rem;
  text-transform: uppercase;
  padding: 1.5rem 0.5rem !important;
  transition: all 0.2s;
  cursor: pointer;

  &:hover { color: $esan-red !important; }
}

.small-icon {
  font-size: 0.6rem;
  transition: transform 0.3s ease;
}

.rotate-icon { transform: rotate(180deg); }

.dropdown-menu {
  border: none;
  border-top: 3px solid $esan-red;
  border-radius: 0;
  margin-top: 0;
  
  .dropdown-item {
    font-size: 1rem;
    padding: 10px 20px;
  font-weight: 400;
  font-family: 'Arial';
    
    &:hover {
      background-color: $esan-red;
      color: white;
    }
  }
}


/* Hover en desktop para que sea Pro */
@media (min-width: 992px) {
  .nav-item.dropdown:hover > .dropdown-menu {
    display: block;
    margin-top: 0;
    cursor: pointer;  
  }
}
</style>