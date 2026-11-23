import { ref } from 'vue'
import { getPublicApiUrl } from '../../../config/apiConfig';

// ── 🧠 CONTRATO DE INTERFAZ ESTRICTO
export interface UniversityEntity {
  id: number
  name: string
  siglas?: string | null
  logo_url: string | null
  type: 'public' | 'private' | 'institute' | 'foreign' | string
}

export function useUniversitiesFeed() {
  const items = ref<UniversityEntity[]>([])
  const pending = ref(false)

  const fetchDirectorio = async (forcedType: string) => {
    pending.value = true
    try {
      let url = `${getPublicApiUrl()}/universities?limit=500`
      
      if (forcedType !== 'all') {
        url += `&type=${forcedType}`
      }

      const response = await fetch(url)
      
      if (response.ok) {
        const resData = await response.json()
        items.value = resData?.data || resData || []
      } else {
        throw new Error(`HTTP Error ${response.status}`)
      }
    } catch (error) {
      console.error('Error en capa composable al consumir Fastify:', error)
      throw error
    } finally {
      pending.value = false
    }
  }

  return {
    items,
    pending,
    fetchDirectorio
  }
}