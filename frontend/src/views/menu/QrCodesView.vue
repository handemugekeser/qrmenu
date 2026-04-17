<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">QR Kodlar</h1>
        <p class="text-gray-500 mt-1">Menünüz için QR kod oluşturun</p>
      </div>
      <button @click="showGenerate = true" class="btn-primary">
        <Plus :size="18" /> Yeni QR Kod
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <Loader2 :size="28" class="animate-spin text-[#768dfb]" />
    </div>
    <div v-else-if="qrCodes.length === 0" class="card p-12 text-center">
      <QrCode :size="48" class="text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500 font-medium mb-4">Henüz QR kod yok</p>
      <button @click="showGenerate = true" class="btn-primary"><Plus :size="16" /> Oluştur</button>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="qr in qrCodes" :key="qr.id" class="card p-5 flex flex-col items-center gap-4">
        <div class="w-40 h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
          <img v-if="qr.imageUrl" :src="qr.imageUrl" class="w-full h-full object-contain p-2" alt="" />
          <QrCode v-else :size="48" class="text-gray-300" />
        </div>
        <div class="text-center w-full">
          <p class="font-bold text-gray-900 truncate">{{ qr.label || 'Genel QR' }}</p>
          <p v-if="qr.tableNumber" class="text-sm text-gray-400">Masa {{ qr.tableNumber }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ qr.scanCount }} tarama</p>
        </div>
        <div class="flex gap-2 w-full">
          <a :href="qr.imageUrl" :download="`qr-${qr.label||'menu'}.png`" class="btn-secondary btn-sm flex-1 justify-center">
            <Download :size="14" /> İndir
          </a>
          <button @click="deleteQr(qr)" class="btn-ghost btn-sm text-red-400 hover:bg-red-50">
            <Trash2 :size="14" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <AppModal v-model="showDeleteConfirm" title="QR Kodu Sil">
      <p class="text-gray-600">
        <span class="font-bold text-gray-900">{{ qrToDelete?.label || 'Bu QR kodu' }}</span> silmek istediğinizden emin misiniz?
      </p>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn-secondary">İptal</button>
        <button @click="confirmDelete" class="btn-primary bg-red-500! hover:bg-red-600!">Sil</button>
      </template>
    </AppModal>

    <AppModal v-model="showGenerate" title="QR Kod Oluştur">
      <div class="space-y-4">
        <div>
          <label class="label">Etiket (opsiyonel)</label>
          <input v-model="genForm.label" class="input" placeholder="Masa 1, Bar, Bahçe..." />
        </div>
        <div>
          <label class="label flex items-center gap-2">
            Masa Numarası (opsiyonel)
            <span v-if="!isPro" class="inline-flex items-center gap-1 text-xs bg-[#768dfb]/10 text-[#5b73e8] px-2 py-0.5 rounded-full font-medium">
              <Zap :size="10" /> Pro
            </span>
          </label>
          <div v-if="isPro">
            <input v-model.number="genForm.tableNumber" type="number" min="1" class="input" placeholder="1" />
          </div>
          <div v-else
            @click="showTableQrUpgrade = true"
            class="input bg-gray-50 text-gray-400 cursor-pointer flex items-center gap-2 select-none">
            <Lock :size="14" class="text-gray-300" />
            Pro planda kullanılabilir
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showGenerate = false" class="btn-secondary">İptal</button>
        <button @click="generate" class="btn-primary" :disabled="generating">
          <Loader2 v-if="generating" :size="16" class="animate-spin" />
          Oluştur
        </button>
      </template>
    </AppModal>

    <!-- Upgrade Modal for table QR -->
    <UpgradeModal
      v-model="showTableQrUpgrade"
      message="Masa QR kodu özelliği yalnızca Pro ve Premium planlarda kullanılabilir. Her masa için özel QR kod oluşturmak ve hangi masadan sipariş geldiğini takip etmek için yükseltin."
    />

    <!-- Upgrade Modal for general limit -->
    <UpgradeModal v-model="showUpgrade" :message="upgradeMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { qrApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import UpgradeModal from '@/components/ui/UpgradeModal.vue'
import { Plus, QrCode, Download, Trash2, Loader2, Zap, Lock } from 'lucide-vue-next'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const qrCodes = ref<any[]>([])
const loading = ref(false)
const showGenerate = ref(false)
const showDeleteConfirm = ref(false)
const qrToDelete = ref<any>(null)
const generating = ref(false)
const genForm = ref({ label: '', tableNumber: undefined as number | undefined })
const menuId = route.params.menuId as string
const showTableQrUpgrade = ref(false)
const showUpgrade = ref(false)
const upgradeMessage = ref('')

const isPro = computed(() => authStore.user?.plan === 'PRO' || authStore.user?.plan === 'PREMIUM')

onMounted(async () => {
  loading.value = true
  try { const { data } = await qrApi.list(menuId); qrCodes.value = data } finally { loading.value = false }
})

async function generate() {
  generating.value = true
  try {
    const { data } = await qrApi.generate(menuId, genForm.value)
    qrCodes.value.unshift(data)
    showGenerate.value = false
    genForm.value = { label: '', tableNumber: undefined }
    toast.success('QR kod oluşturuldu!')
  } catch (e: any) {
    if (e.response?.status === 403) {
      showGenerate.value = false
      if (e.response?.data?.message?.includes('Masa QR')) {
        showTableQrUpgrade.value = true
      } else {
        upgradeMessage.value = e.response?.data?.message || 'Plan limitine ulaştınız.'
        showUpgrade.value = true
      }
    } else {
      toast.error('Hata oluştu')
    }
  } finally { generating.value = false }
}

function deleteQr(qr: any) {
  qrToDelete.value = qr
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  await qrApi.delete(menuId, qrToDelete.value.id)
  qrCodes.value = qrCodes.value.filter(q => q.id !== qrToDelete.value.id)
  showDeleteConfirm.value = false
  qrToDelete.value = null
  toast.success('Silindi')
}
</script>
