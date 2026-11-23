import { computed, ref, watch, type Ref } from 'vue'

/**
 * Normaliza el límite inicial configurado en un bloque de directorio.
 * El valor `0` o `'all'` representa "Sin límite (mostrar todos)".
 */
export function resolveDirectoryLimit(rawLimit: unknown, fallback = 8): number {
  if (rawLimit === 0 || rawLimit === '0' || rawLimit === 'all' || rawLimit === null) {
    return 0
  }
  const parsed = Number(rawLimit)
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed)
  }
  return fallback
}

/**
 * Controla paginación progresiva infinita (de N en N) o visualización completa cuando el límite es 0.
 */
export function useDirectoryPagination<T>(
  filteredItems: Ref<T[]>,
  rawLimitGetter: () => unknown,
  defaultInitialLimit = 8,
  step = 4
) {
  const initialLimit = computed(() => resolveDirectoryLimit(rawLimitGetter(), defaultInitialLimit))
  const limitRender = ref(initialLimit.value)

  watch(initialLimit, (newLimit) => {
    limitRender.value = newLimit
  })

  const visibleItems = computed<T[]>(() => {
    if (limitRender.value === 0) {
      return filteredItems.value
    }
    return filteredItems.value.slice(0, limitRender.value)
  })

  const hasMore = computed(
    () => limitRender.value !== 0 && filteredItems.value.length > limitRender.value
  )

  const loadMore = () => {
    if (limitRender.value === 0) return
    limitRender.value += step
  }

  return {
    initialLimit,
    limitRender,
    visibleItems,
    hasMore,
    loadMore
  }
}
