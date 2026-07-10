import { ref } from 'vue'
import { PUBLIC_API_URL } from '../../../config/apiConfig.ts';

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
      // 🎯 CORREGIDO: Como PUBLIC_API_URL ya es 'http://localhost:4000/api/public', solo concatenas el recurso
      let url = `${PUBLIC_API_URL}/universities?limit=100`
      
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