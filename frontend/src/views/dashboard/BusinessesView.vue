<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <div><h1 class="text-2xl font-black text-gray-900">İşletmeler</h1></div>
      <button @click="openCreate" class="btn-primary"><Plus :size="18" /> Yeni İşletme</button>
    </div>
    <div v-if="businessStore.loading" class="flex justify-center py-16"><Loader2 :size="28" class="animate-spin text-orange-400" /></div>
    <div v-else-if="!businessStore.businesses.length" class="card p-16 text-center">
      <Building2 :size="48" class="text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">Henüz işletme yok</p>
      <button @click="openCreate" class="btn-primary"><Plus :size="16" /> Oluştur</button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="biz in businessStore.businesses" :key="biz.id" class="card p-5 hover:shadow-md transition-shadow group relative">
        <router-link :to="`/businesses/${biz.id}`" class="flex items-start gap-4">
          <div class="w-12 h-12 bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0">{{ biz.name[0] }}</div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 group-hover:text-orange-500 transition-colors truncate">{{ biz.name }}</h3>
            <p class="text-xs text-gray-400 truncate">/menu/{{ biz.slug }}</p>
            <div class="flex gap-2 mt-2">
              <span class="badge-blue">{{ biz._count?.menus || 0 }} Menü</span>
              <span :class="biz.isActive ? 'badge-green' : 'badge-red'">{{ biz.isActive ? 'Aktif' : 'Pasif' }}</span>
            </div>
          </div>
        </router-link>
        <button
          @click.prevent="openDelete(biz)"
          class="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <AppModal v-model="showDeleteConfirm" title="İşletmeyi Sil">
      <p class="text-gray-600">
        <span class="font-bold text-gray-900">{{ bizToDelete?.name }}</span> işletmesini silmek istediğinizden emin misiniz?
        Tüm menüler, kategoriler ve ürünler de silinecek.
      </p>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn-secondary">İptal</button>
        <button @click="confirmDelete" :disabled="deleting" class="btn-primary bg-red-500! hover:bg-red-600!">
          <Loader2 v-if="deleting" :size="16" class="animate-spin" />
          Sil
        </button>
      </template>
    </AppModal>

    <!-- Create Modal -->
    <AppModal v-model="showCreate" title="Yeni İşletme">
      <div class="space-y-4">
        <div><label class="label">İşletme Adı</label><input v-model="form.name" @input="autoSlug" class="input" placeholder="Kebapçı Ahmet" /></div>
        <div>
          <label class="label">URL Slug</label>
          <div class="flex">
            <span class="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-400">/menu/</span>
            <input v-model="form.slug" class="input rounded-l-none" placeholder="kebapci-ahmet" />
          </div>
        </div>
        <div><label class="label">Telefon</label><input v-model="form.phone" class="input" /></div>
      </div>
      <template #footer>
        <button @click="showCreate = false" class="btn-secondary">İptal</button>
        <button @click="create" class="btn-primary" :disabled="creating"><Loader2 v-if="creating" :size="16" class="animate-spin" />Oluştur</button>
      </template>
    </AppModal>

    <!-- Upgrade Modal -->
    <UpgradeModal v-model="showUpgrade" :message="upgradeMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/business'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import UpgradeModal from '@/components/ui/UpgradeModal.vue'
import { Plus, Building2, Loader2, Trash2 } from 'lucide-vue-next'

const PLAN_LIMITS = {
  FREE: { maxBusinesses: 1 },
  PRO: { maxBusinesses: 3 },
  PREMIUM: { maxBusinesses: -1 },
}

const businessStore = useBusinessStore()
const authStore = useAuthStore()
const toast = useToast()
const showCreate = ref(false)
const creating = ref(false)
const form = ref({ name: '', slug: '', phone: '' })
const showDeleteConfirm = ref(false)
const bizToDelete = ref<any>(null)
const deleting = ref(false)
const showUpgrade = ref(false)
const upgradeMessage = ref('')

onMounted(async () => { await businessStore.fetchAll() })

async function openCreate() {
  if (businessStore.loading) {
    await businessStore.fetchAll()
  }

  const plan = (authStore.user?.plan || 'FREE') as 'FREE' | 'PRO' | 'PREMIUM'
  const limit = PLAN_LIMITS[plan]?.maxBusinesses ?? 1
  const count = businessStore.businesses.length

  if (limit !== -1 && count >= limit) {
    upgradeMessage.value = `${plan === 'FREE' ? 'Free planda' : 'Pro planda'} en fazla ${limit} işletme ekleyebilirsiniz. Daha fazla işletme eklemek için aboneliğinizi yükseltin.`
    showUpgrade.value = true
    return
  }
  showCreate.value = true
}

function autoSlug() {
  form.value.slug = form.value.name.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

async function create() {
  creating.value = true
  try {
    await businessStore.create(form.value)
    showCreate.value = false
    form.value = { name: '', slug: '', phone: '' }
    toast.success('Oluşturuldu!')
  } catch (e: any) {
    if (e.response?.status === 403) {
      showCreate.value = false
      upgradeMessage.value = e.response?.data?.message || 'Plan limitine ulaştınız.'
      showUpgrade.value = true
    } else {
      toast.error(e.response?.data?.message || 'Hata')
    }
  } finally {
    creating.value = false
  }
}

function openDelete(biz: any) {
  bizToDelete.value = biz
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await businessStore.remove(bizToDelete.value.id)
    showDeleteConfirm.value = false
    bizToDelete.value = null
    toast.success('İşletme silindi')
  } catch {
    toast.error('Hata oluştu')
  } finally {
    deleting.value = false
  }
}
</script>
