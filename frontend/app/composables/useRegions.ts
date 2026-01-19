import { ref, readonly } from 'vue'

export interface RegionWithCount {
  region: string
  count: number
}

export function useRegions() {
  const regions = ref<RegionWithCount[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRegions() {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const response = await $fetch<{ regions: RegionWithCount[] }>(
        `${config.public.apiBase}/api/benefits/meta/regions`
      )
      regions.value = response.regions
    } catch (e) {
      error.value = '지역 목록을 불러오는데 실패했습니다'
      console.error('Failed to fetch regions:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    regions: readonly(regions),
    loading: readonly(loading),
    error: readonly(error),
    fetchRegions
  }
}
