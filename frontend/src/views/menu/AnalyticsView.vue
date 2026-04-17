<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div><h1 class="text-2xl font-bold text-gray-900">Analitik</h1><p class="text-gray-500 mt-1">Menü görüntülenme istatistikleri</p></div>
    <div v-if="loading" class="flex justify-center py-12"><Loader2 :size="28" class="animate-spin text-[#768dfb]" /></div>
    <div v-else-if="stats" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card p-5"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Toplam</p><p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p></div>
        <div class="card p-5"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Son 30 Gün</p><p class="text-3xl font-bold text-[#5b73e8]">{{ stats.last30Days }}</p></div>
        <div class="card p-5"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Son 7 Gün</p><p class="text-3xl font-bold text-emerald-500">{{ stats.last7Days }}</p></div>
      </div>
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h2>
        <div class="space-y-3">
          <div v-for="d in stats.byDevice" :key="d.device" class="flex items-center gap-3">
            <span class="text-sm text-gray-700 w-24">{{ { MOBILE:'Mobil', TABLET:'Tablet', DESKTOP:'Masaüstü', UNKNOWN:'Bilinmiyor' }[d.device] || d.device }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div class="h-full rounded-full bg-[#768dfb]" :style="{ width: `${Math.round((d.count/stats.total)*100)}%` }" />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-8 text-right">{{ d.count }}</span>
          </div>
        </div>
      </div>
      <div class="card p-6">
        <h2 class="font-semibold text-gray-900 mb-4">Son 30 Günlük Görüntülenme</h2>
        <div v-if="chartData.length" class="flex items-end gap-1 h-32">
          <div v-for="day in chartData" :key="day.date" class="flex-1 bg-[#768dfb] rounded-t hover:bg-[#5b73e8] transition-colors cursor-default"
               :style="{ height: `${day.height}%`, minHeight: '2px' }" :title="`${day.date}: ${day.count}`" />
        </div>
        <p v-else class="text-center text-gray-400 py-8 text-sm">Henüz yeterli veri yok</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { analyticsApi } from '@/api'
import { Loader2 } from 'lucide-vue-next'
const route = useRoute()
const stats = ref<any>(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data } = await analyticsApi.menu(route.params.menuId as string); stats.value = data } finally { loading.value = false }
})
const chartData = computed(() => {
  if (!stats.value?.dailyViews?.length) return []
  const max = Math.max(...stats.value.dailyViews.map((d: any) => d.count), 1)
  return stats.value.dailyViews.map((d: any) => ({ date: d.date, count: d.count, height: Math.max(4, Math.round((d.count/max)*100)) }))
})
</script>
