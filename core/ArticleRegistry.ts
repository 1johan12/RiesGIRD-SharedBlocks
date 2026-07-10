import { defineAsyncComponent } from "vue";

export const ARTICLE_LAYOUT_REGISTRY: Record<string, any> = {
  default: {
    id: "default",
    label: "📖 Estilo Default",
    description:
      "Diseño tipo revista, imagen a un lado y contenido fluyendo al otro.",
    icon: "las la-book-open",
    component: defineAsyncComponent(
      () => import("../components/articles/layouts/Block.vue"),
    ),
  },

  classic: {
    id: "classic",
    label: "📰 Diseño Clásico",
    description:
      "Imagen principal arriba, título y texto a una columna debajo.",
    icon: "las la-newspaper",

    component: defineAsyncComponent(
      () => import("../components/articles/layouts/ArticleClassic.vue"),
    ),
  },
  // hero: {
  //     id: 'hero',
  //     label: '🔥 Moderno (Hero)',
  //     description: 'Imagen gigante de fondo ocupando toda la pantalla con título superpuesto.',
  //     icon: 'las la-image',
  //     component: defineAsyncComponent(() => import('../components/articles/layouts/ArticleHero.vue')),
  // },
  // editorial: {
  //     id: 'editorial',
  //     label: '📖 Estilo Editorial',
  //     description: 'Diseño tipo revista, imagen a un lado y contenido fluyendo al otro.',
  //     icon: 'las la-book-open',
  //     component: defineAsyncComponent(() => import('../components/articles/layouts/ArticleEditorial.vue')),
  // }
};

export const resolveArticleLayout = (type: string) => {
  return (
    ARTICLE_LAYOUT_REGISTRY[type]?.component ||
    ARTICLE_LAYOUT_REGISTRY["default"].component
  );
};

export const getAvailableArticleLayouts = () => {
  return Object.values(ARTICLE_LAYOUT_REGISTRY).map((layout) => ({
    id: layout.id,
    label: layout.label,
    description: layout.description,
    icon: layout.icon,
  }));
};
