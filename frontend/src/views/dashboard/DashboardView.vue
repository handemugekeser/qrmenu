<template>
  <div class="p-6 lg:p-8 space-y-8">
    <!-- Welcome -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Merhaba, {{ firstName }} 👋</h1>
        <p class="text-gray-500 mt-1">İşletmelerinize genel bakış</p>
      </div>
      <button @click="showCreateBusiness = true" class="btn-primary">
        <Plus :size="18" /> Yeni İşletme
      </button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ stat.label }}</span>
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', stat.bg]">
            <component :is="stat.icon" :size="18" :class="stat.color" />
          </div>
        </div>
        <p class="text-3xl font-black text-gray-900">{{ stat.value }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- Businesses list -->
    <div>
      <h2 class="text-lg font-bold text-gray-900 mb-4">İşletmeler</h2>
      <div v-if="businessStore.loading" class="flex justify-center py-12">
        <Loader2 :size="28" class="animate-spin text-orange-400" />
      </div>
      <div v-else-if="businessStore.businesses.length === 0" class="card p-12 text-center">
        <Building2 :size="40" class="text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500 mb-4">Henüz işletme oluşturmadınız</p>
        <button @click="showCreateBusiness = true" class="btn-primary">
          <Plus :size="18" /> İlk İşletmenizi Oluşturun
        </button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="biz in businessStore.businesses"
          :key="biz.id"
          :to="`/businesses/${biz.id}`"
          class="card p-5 hover:shadow-md transition-shadow group"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              {{ biz.name[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 group-hover:text-orange-500 transition-colors truncate">{{ biz.name }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">qrmenu.app/menu/{{ biz.slug }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span class="badge-blue">{{ biz._count?.menus || 0 }} Menü</span>
                <span :class="biz.isActive ? 'badge-green' : 'badge-red'">
                  {{ biz.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Create business modal -->
    <AppModal v-model="showCreateBusiness" title="Yeni İşletme">
      <form @submit.prevent="createBusiness" class="space-y-4">
        <div>
          <label class="label">İşletme Adı</label>
          <input v-model="newBiz.name" @input="autoSlug" class="input" placeholder="Örn: Kebapçı Ahmet" required />
        </div>
        <div>
          <label class="label">URL Slug</label>
          <div class="flex">
            <span class="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-400">
              /menu/
            </span>
            <input v-model="newBiz.slug" class="input rounded-l-none" placeholder="kebapci-ahmet" required
                   pattern="[a-z0-9-]+" />
          </div>
          <p v-if="slugStatus" :class="['text-xs mt-1', slugStatus === 'available' ? 'text-emerald-600' : 'text-red-500']">
            {{ slugStatus === 'available' ? '✓ Kullanılabilir' : '✗ Bu slug kullanılıyor' }}
          </p>
        </div>
        <div>
          <label class="label">Telefon (opsiyonel)</label>
          <input v-model="newBiz.phone" class="input" placeholder="+90 5XX XXX XX XX" />
        </div>
      </form>
      <template #footer>
        <button @click="showCreateBusiness = false" class="btn-secondary">İptal</button>
        <button @click="createBusiness" class="btn-primary" :disabled="creating">
          <Loader2 v-if="creating" :size="16" class="animate-spin" />
          Oluştur
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBusinessStore } from '@/stores/business'
import { businessApi } from '@/api'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import { Plus, Building2, UtensilsCrossed, QrCode, BarChart3, Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const businessStore = useBusinessStore()
const toast = useToast()

const showCreateBusiness = ref(false)
const creating = ref(false)
const slugStatus = ref<'available' | 'taken' | null>(null)
const newBiz = ref({ name: '', slug: '', phone: '' })

const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'Kullanıcı')

const stats = computed(() => [
  {
    label: 'İşletmeler',
    value: businessStore.businesses.length,
    sub: 'toplam',
    icon: Building2,
    bg: 'bg-orange-50',
    color: 'text-orange-500',
  },
  {
    label: 'Menüler',
    value: businessStore.businesses.reduce((a, b) => a + (b._count?.menus || 0), 0),
    sub: 'aktif menüler',
    icon: UtensilsCrossed,
    bg: 'bg-blue-50',
    color: 'text-blue-500',
  },
  {
    label: 'QR Kodlar',
    value: '—',
    sub: 'tüm işletmeler',
    icon: QrCode,
    bg: 'bg-purple-50',
    color: 'text-purple-500',
  },
  {
    label: 'Plan',
    value: auth.user?.plan || 'FREE',
    sub: 'mevcut plan',
    icon: BarChart3,
    bg: 'bg-emerald-50',
    color: 'text-emerald-500',
  },
])

function autoSlug() {
  newBiz.value.slug = newBiz.value.name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  slugStatus.value = null
}

let slugTimer: any
watch(() => newBiz.value.slug, async (slug) => {
  if (!slug) return
  clearTimeout(slugTimer)
  slugTimer = setTimeout(async () => {
    try {
      const { data } = await businessApi.checkSlug(slug)
      slugStatus.value = data.available ? 'available' : 'taken'
    } catch {}
  }, 500)
})

async function createBusiness() {
  if (slugStatus.value === 'taken') return
  creating.value = true
  try {
    await businessStore.create(newBiz.value)
    showCreateBusiness.value = false
    newBiz.value = { name: '', slug: '', phone: '' }
    toast.success('İşletme oluşturuldu!')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Hata oluştu')
  } finally {
    creating.value = false
  }
}

onMounted(() => businessStore.fetchAll())
</script>
