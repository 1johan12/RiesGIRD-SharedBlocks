export type BlockSourceType = 'static' | 'dynamic_api' | 'mixed';

export interface BlockGuideInfo {
  description: string;
  sourceType: BlockSourceType;
  endpointHint?: string;
  weight: 1 | 2 | 3;
  recommendedMaxPerPage?: number;
  warnLimitThreshold?: number;
}

const DEFAULT_GUIDE: BlockGuideInfo = {
  description: 'Sección editable cuyos textos e imágenes se guardan dentro de esta página.',
  sourceType: 'static',
  weight: 1,
};

export const BLOCK_GUIDES: Record<string, BlockGuideInfo> = {
  HeaderDynamic: {
    description: 'Cabecera institucional transparente con logotipo y enlaces principales.',
    sourceType: 'static',
    weight: 1,
    recommendedMaxPerPage: 1,
  },
  FooterSimple: {
    description: 'Pie de página simple con textos legales y enlaces rápidos.',
    sourceType: 'static',
    weight: 1,
    recommendedMaxPerPage: 1,
  },
  HeroCollage: {
    description: 'Portada principal con título institucional, logotipo y collage de 4 fotografías.',
    sourceType: 'static',
    weight: 2,
    recommendedMaxPerPage: 1,
  },
  HeroWelcome: {
    description: 'Banner Hero de bienvenida con gradiente, imagen y doble botón CTA.',
    sourceType: 'static',
    weight: 1,
  },
  HeroDefault: {
    description: 'Banner Hero clásico con imagen de fondo y ola inferior decorativa.',
    sourceType: 'static',
    weight: 1,
  },
  LeadFormHero: {
    description: 'Hero de captación con formulario integrado vinculado a campaña de marketing.',
    sourceType: 'mixed',
    endpointHint: 'POST /api/leads',
    weight: 2,
    recommendedMaxPerPage: 2,
  },
  QuienesSomos: {
    description: 'Sección institucional con título, descripción opcional (v-if) e imagen o video de YouTube en modal con lazy-loading.',
    sourceType: 'static',
    weight: 1,
  },
  MisionVision: {
    description: 'Bloque doble con tarjetas visuales para Visión y Misión.',
    sourceType: 'static',
    weight: 1,
  },
  NuestrosObjetivos: {
    description: 'Objetivo general destacado y lista de objetivos específicos etiquetados.',
    sourceType: 'static',
    weight: 1,
  },
  NuestrosObjetivos2: {
    description: 'Variante 2 del bloque de Objetivos con diseño alternativo de tarjetas.',
    sourceType: 'static',
    weight: 1,
  },
  Lineamientos: {
    description: 'Listado estructurado de lineamientos estratégicos.',
    sourceType: 'static',
    weight: 1,
  },
  StatsGrid: {
    description: 'Cuadrícula de cifras/métricas clave configurables manualmente.',
    sourceType: 'static',
    weight: 1,
  },
  CtaBanner: {
    description: 'Banner de llamado a la acción (botón externo o enlace interno) con gradiente.',
    sourceType: 'static',
    weight: 1,
  },
  CtaBannerSection: {
    description: 'Sección CTA en ancho completo con texto y enlace configurable.',
    sourceType: 'static',
    weight: 1,
  },
  BannerInformativo: {
    description: 'Franja informativa destacada para avisos o comunicados breves.',
    sourceType: 'static',
    weight: 1,
  },
  TestimonialSlider: {
    description: 'Carrusel interactivo de testimonios.',
    sourceType: 'static',
    weight: 2,
  },
  FasesProceso: {
    description: 'Línea de tiempo horizontal con fases del proceso institucional.',
    sourceType: 'static',
    weight: 1,
  },
  EstructuraOrganizacional: {
    description: 'Bloque visual de la estructura organizacional de la red.',
    sourceType: 'static',
    weight: 1,
  },
  EstructuraImagen: {
    description: 'Organigrama o esquema basado en imagen editable.',
    sourceType: 'static',
    weight: 1,
  },
  ConsejoDirectivo: {
    description: 'Sección descriptiva sobre el Consejo Directivo.',
    sourceType: 'static',
    weight: 1,
  },
  MembershipCertificate: {
    description: 'Sección informativa de certificado de membresía.',
    sourceType: 'static',
    weight: 1,
  },
  RequirementDocument: {
    description: 'Listado de requisitos y documentos para postulación o incorporación.',
    sourceType: 'static',
    weight: 1,
  },
  SecretariaTecnica: {
    description: 'Bloque informativo de la Secretaría Técnica.',
    sourceType: 'static',
    weight: 1,
  },
  CienciaExtremoExtremo: {
    description: 'Bloque informativo sobre investigación aplicada y alcance científico.',
    sourceType: 'static',
    weight: 1,
  },
  QueHacemosRedInvestigadores: {
    description: 'Sección editorial sobre la Red de Investigadores.',
    sourceType: 'static',
    weight: 1,
  },
  LineasInvestigacion: {
    description: 'Tarjetas con líneas prioritarias de investigación.',
    sourceType: 'static',
    weight: 1,
  },
  CasoExitoAlianza: {
    description: 'Sección para destacar un caso de éxito o alianza clave.',
    sourceType: 'static',
    weight: 1,
  },
  ComoColaboramos: {
    description: 'Sección explicativa sobre mecanismos de colaboración.',
    sourceType: 'static',
    weight: 1,
  },
  LaboratorioTerritorial: {
    description: 'Bloque descriptivo sobre el Laboratorio Territorial.',
    sourceType: 'static',
    weight: 1,
  },
  DocumentacionFormal: {
    description: 'Grilla de documentos formales cargados manualmente o por enlace.',
    sourceType: 'static',
    weight: 2,
  },
  EstructuraOferta: {
    description: 'Tarjetas de estructura de oferta académica o servicios.',
    sourceType: 'static',
    weight: 1,
  },
  NuestroRepositorio: {
    description: 'Acceso destacado y tarjetas hacia el repositorio documental.',
    sourceType: 'static',
    weight: 1,
  },
  GestionConocimiento: {
    description: 'Buscador y pestañas de memorias/documentos cargados en la sección.',
    sourceType: 'static',
    weight: 2,
  },
  MemoriasCongreso: {
    description: 'Tarjetas de memorias y actas de congresos configurables.',
    sourceType: 'static',
    weight: 2,
  },
  SectionTitleDescription: {
    description: 'Encabezado limpio con título y descripción introductoria.',
    sourceType: 'static',
    weight: 1,
  },
  SectionMissionVision: {
    description: 'Variante estructural de Misión y Visión.',
    sourceType: 'static',
    weight: 1,
  },
  // ── Bloques dinámicos conectados a Fastify BD ──────────────────────────────
  AliadosSlider: {
    description: 'Slider horizontal automático de aliados registrados en el módulo Aliados/Partners.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/partners',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  AliadosBuscar: {
    description: 'Grilla filtrable por categoría de todos los aliados desde la BD.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/partners',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  CooperacionSlider: {
    description: 'Slider horizontal de entidades de cooperación.',
    sourceType: 'mixed',
    endpointHint: 'GET /api/public/partners',
    weight: 2,
    recommendedMaxPerPage: 1,
  },
  EventosNoticias: {
    description: 'Tarjetas recientes de Noticias y Eventos leídas automáticamente desde Publicaciones.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/news',
    weight: 3,
    recommendedMaxPerPage: 2,
    warnLimitThreshold: 12,
  },
  NoticiasEventosHub: {
    description: 'Hub completo con buscador, slider destacado y múltiples grillas de noticias/eventos.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/news',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  DirectorioRectores: {
    description: 'Grilla de Rectores (nivel 1) ordenados por prioridad de Universidad (sort_order).',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/teams?hierarchy_level=1',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  AsambleaRectores: {
    description: 'Vista de Asamblea de Rectores conectada al catálogo de autoridades y universidades.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/teams',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  AsambleasGenerales: {
    description: 'Grilla de Asambleas Generales obtenidas desde publicaciones tipo assemblies.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/news?type=assemblies',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 20,
  },
  DirectorioMiembros: {
    description: 'Directorio de Universidades Miembro ordenado por sort_order desde la BD.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/universities',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 30,
  },
  DirectorioMiembrosAll: {
    description: 'Directorio completo y filtrable de Universidades Miembro.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/universities',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 50,
  },
  DirectorioAutoridades: {
    description: 'Directorio de Autoridades (Directorio) con filtro por universidad y cargo.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/teams',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 30,
  },
  DirectorioAutoridadesAll: {
    description: 'Vista extendida de todas las Autoridades de la Red desde la BD.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/teams',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 50,
  },
  DirectorioEspecialistas: {
    description: 'Directorio filtrable de Especialistas Técnicos desde Equipo Universitario.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/teams?person_type=specialist',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 30,
  },
  InvestigacionesProducidas: {
    description: 'Catálogo buscable de investigaciones conectado a Publicaciones o nodos propios.',
    sourceType: 'mixed',
    endpointHint: 'GET /api/public/news',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  DynamicContentGrid: {
    description: 'Grilla dinámica de recursos/publicaciones configurada por filtros.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/resources',
    weight: 3,
    recommendedMaxPerPage: 2,
    warnLimitThreshold: 24,
  },
  DynamicGridInfinite: {
    description: 'Grilla avanzada con carga infinita conectada a Recursos o Noticias.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/resources | /news',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 24,
  },
  AcuerdosScrollHub: {
    description: 'Hub desplazable de acuerdos conectado a Recursos filtrados por categoría.',
    sourceType: 'dynamic_api',
    endpointHint: 'GET /api/public/resources',
    weight: 3,
    recommendedMaxPerPage: 1,
    warnLimitThreshold: 20,
  },
};

export function getBlockGuide(type: string): BlockGuideInfo {
  return BLOCK_GUIDES[type] || DEFAULT_GUIDE;
}

export interface PageLoadWarning {
  level: 'warning' | 'danger';
  message: string;
}

export interface PageLoadSummary {
  totalBlocks: number;
  dynamicBlocks: number;
  totalWeight: number;
  payloadKb: number;
  status: 'optimal' | 'moderate' | 'heavy';
  statusLabel: string;
  warnings: PageLoadWarning[];
}

export function analyzePageLoad(blocks: Array<{ type: string; content?: Record<string, any> }>): PageLoadSummary {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  let dynamicBlocks = 0;
  let totalWeight = 0;
  const warnings: PageLoadWarning[] = [];
  const counts: Record<string, number> = {};

  for (const blk of safeBlocks) {
    const guide = getBlockGuide(blk.type);
    totalWeight += guide.weight;
    if (guide.sourceType === 'dynamic_api') dynamicBlocks += 1;

    counts[blk.type] = (counts[blk.type] || 0) + 1;

    const rawLimit = Number(blk.content?.limit ?? blk.content?.limitFetch ?? 0);
    if (guide.warnLimitThreshold && rawLimit > guide.warnLimitThreshold) {
      warnings.push({
        level: 'warning',
        message: `El bloque "${blk.type}" solicita ${rawLimit} ítems (recomendado ≤ ${guide.warnLimitThreshold}) y puede volver lenta la carga pública.`,
      });
    }
  }

  for (const [type, count] of Object.entries(counts)) {
    const guide = getBlockGuide(type);
    if (guide.recommendedMaxPerPage && count > guide.recommendedMaxPerPage) {
      warnings.push({
        level: 'warning',
        message: `Tienes ${count} bloques de "${type}" en la misma página (máximo sugerido: ${guide.recommendedMaxPerPage}).`,
      });
    }
  }

  if (dynamicBlocks > 3) {
    warnings.push({
      level: 'danger',
      message: `La página dispara ${dynamicBlocks} consultas automáticas a Fastify/BD al abrirse. Se recomienda mantener ≤ 3 grillas dinámicas por página.`,
    });
  }

  let payloadBytes = 0;
  try {
    payloadBytes = JSON.stringify(safeBlocks).length;
  } catch {
    payloadBytes = 0;
  }
  const payloadKb = Math.round((payloadBytes / 1024) * 10) / 10;

  if (payloadKb > 150) {
    warnings.push({
      level: 'danger',
      message: `El JSON de bloques pesa ${payloadKb} KB (> 150 KB). Evita pegar imágenes en base64; usa la Galería de Medios.`,
    });
  }

  let status: PageLoadSummary['status'] = 'optimal';
  let statusLabel = 'Carga Óptima';

  if (dynamicBlocks > 3 || payloadKb > 150 || totalWeight > 22) {
    status = 'heavy';
    statusLabel = 'Página Pesada';
  } else if (dynamicBlocks >= 2 || warnings.length > 0 || safeBlocks.length > 10) {
    status = 'moderate';
    statusLabel = 'Carga Moderada';
  }

  return {
    totalBlocks: safeBlocks.length,
    dynamicBlocks,
    totalWeight,
    payloadKb,
    status,
    statusLabel,
    warnings,
  };
}
