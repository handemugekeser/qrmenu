<template>
  <div class="p-6 lg:p-8 space-y-6" v-if="business">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow">
          {{ business.name[0] }}
        </div>
        <div>
          <h1 class="text-2xl font-black text-gray-900">{{ business.name }}</h1>
          <p class="text-gray-400 text-sm">qrmenu.app/menu/{{ business.slug }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="showEdit = true" class="btn-secondary btn-sm"><Pencil :size="14" /> Düzenle</button>
      </div>
    </div>

    <!-- Menus -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">Menüler</h2>
        <button @click="openCreateMenu" class="btn-primary btn-sm"><Plus :size="16" /> Yeni Menü</button>
      </div>

      <div v-if="menuStore.loading" class="flex justify-center py-8">
        <Loader2 :size="24" class="animate-spin text-orange-400" />
      </div>
      <div v-else-if="menuStore.menus.length === 0" class="card p-10 text-center">
        <UtensilsCrossed :size="36" class="text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500 mb-3">Henüz menü yok</p>
        <button @click="openCreateMenu" class="btn-primary btn-sm"><Plus :size="16" /> İlk Menüyü Ekle</button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="menu in menuStore.menus" :key="menu.id" class="card p-5 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ background: menu.themeColor || '#FF6B35' }" />
              <h3 class="font-bold text-gray-900">{{ menu.name }}</h3>
            </div>
            <div class="flex items-center gap-1">
              <AppToggle :model-value="menu.isActive" @update:model-value="toggleMenu(menu, $event)" />
            </div>
          </div>
          <p v-if="menu.description" class="text-xs text-gray-500 mb-2 line-clamp-1">{{ menu.description }}</p>
          <div class="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span>{{ menu._count?.categories || 0 }} kategori</span>
            <span>·</span>
            <span>{{ menu._count?.qrCodes || 0 }} QR kod</span>
            <span>·</span>
            <span>{{ menu._count?.analytics || 0 }} görüntülenme</span>
          </div>
          <div class="flex items-center gap-2">
            <router-link :to="`/businesses/${business.id}/menus/${menu.id}`" class="btn-primary btn-sm flex-1 justify-center">
              <List :size="14" /> Düzenle
            </router-link>
            <button @click="openPublicMenu(menu)" class="btn-secondary btn-sm" title="Görüntüle">
              <ExternalLink :size="14" />
            </button>
            <router-link :to="`/businesses/${business.id}/menus/${menu.id}/qrcodes`" class="btn-secondary btn-sm">
              <QrCode :size="14" />
            </router-link>
            <router-link :to="`/businesses/${business.id}/menus/${menu.id}/analytics`" class="btn-secondary btn-sm">
              <BarChart3 :size="14" />
            </router-link>
            <button @click="deleteMenu(menu)" class="btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50">
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Business Modal -->
    <AppModal v-model="showEdit" title="İşletmeyi Düzenle" size="lg">
      <form class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">İşletme Adı</label>
            <input v-model="editForm.name" class="input" />
          </div>
          <div>
            <label class="label">Telefon</label>
            <input v-model="editForm.phone" class="input" />
          </div>
        </div>
        <div>
          <label class="label">Açıklama</label>
          <textarea v-model="editForm.description" class="input h-20 resize-none" />
        </div>
        <div>
          <label class="label">Adres</label>
          <input v-model="editForm.address" class="input" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Para Birimi</label>
            <select v-model="editForm.currency" class="input">
              <option value="TRY">TRY ₺</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
          <div>
            <label class="label">Varsayılan Dil</label>
            <select v-model="editForm.defaultLang" class="input">
              <option value="TR">Türkçe</option>
              <option value="EN">English</option>
              <option value="AR">العربية</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <button @click="showEdit = false" class="btn-secondary">İptal</button>
        <button @click="saveEdit" class="btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          Kaydet
        </button>
      </template>
    </AppModal>

    <!-- Delete Menu Confirm Modal -->
    <AppModal v-model="showDeleteConfirm" title="Menüyü Sil">
      <p class="text-gray-600">
        <span class="font-bold text-gray-900">{{ menuToDelete?.name }}</span> menüsünü silmek istediğinizden emin misiniz?
        Bu işlem geri alınamaz.
      </p>
      <template #footer>
        <button @click="showDeleteConfirm = false" class="btn-secondary">İptal</button>
        <button @click="confirmDelete" class="btn-primary bg-red-500! hover:bg-red-600!" :disabled="deleting">
          <Loader2 v-if="deleting" :size="16" class="animate-spin" />
          Sil
        </button>
      </template>
    </AppModal>

    <!-- Create Menu Modal -->
    <AppModal v-model="showCreateMenu" title="Yeni Menü Oluştur">
      <form @submit.prevent="createMenu" class="space-y-4">
        <div>
          <label class="label">Menü Adı</label>
          <input v-model="newMenu.name" class="input" placeholder="Örn: Ana Menü" required />
        </div>
        <div>
          <label class="label">Açıklama</label>
          <input v-model="newMenu.description" class="input" placeholder="Opsiyonel" />
        </div>
        <div>
          <label class="label">Tema Rengi</label>
          <div class="flex items-center gap-3">
            <input type="color" v-model="newMenu.themeColor" class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
            <span class="text-sm text-gray-500">{{ newMenu.themeColor }}</span>
          </div>
        </div>
      </form>
      <template #footer>
        <button @click="showCreateMenu = false" class="btn-secondary">İptal</button>
        <button @click="createMenu" class="btn-primary" :disabled="creatingMenu">
          <Loader2 v-if="creatingMenu" :size="16" class="animate-spin" />
          Oluştur
        </button>
      </template>
    </AppModal>

    <!-- Upgrade Modal -->
    <UpgradeModal v-model="showUpgrade" :message="upgradeMessage" />
  </div>

  <div v-else class="flex justify-center items-center h-64">
    <Loader2 :size="32" class="animate-spin text-orange-400" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/business'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import UpgradeModal from '@/components/ui/UpgradeModal.vue'
import {
  Pencil, ExternalLink, Plus, List, QrCode, BarChart3,
  Trash2, Loader2, UtensilsCrossed
} from 'lucide-vue-next'

const PLAN_LIMITS = {
  FREE: { maxMenus: 1 },
  PRO: { maxMenus: 5 },
  PREMIUM: { maxMenus: -1 },
}

const route = useRoute()
const businessStore = useBusinessStore()
const menuStore = useMenuStore()
const authStore = useAuthStore()
const toast = useToast()

const business = ref<any>(null)
const showEdit = ref(false)
const showCreateMenu = ref(false)
const saving = ref(false)
const creatingMenu = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)
const menuToDelete = ref<any>(null)
const editForm = ref<any>({})
const newMenu = ref({ name: '', description: '', themeColor: '#FF6B35' })
const showUpgrade = ref(false)
const upgradeMessage = ref('')

onMounted(async () => {
  const id = route.params.businessId as string
  business.value = await businessStore.fetchOne(id)
  editForm.value = { ...business.value }
  await menuStore.fetchAll(id)
})

function openPublicMenu(menu: any) {
  window.open(`/menu/${business.value.slug}?menuId=${menu.id}`, '_blank')
}

function openCreateMenu() {
  const plan = (authStore.user?.plan || 'FREE') as 'FREE' | 'PRO' | 'PREMIUM'
  const limit = PLAN_LIMITS[plan]?.maxMenus ?? 1
  const count = menuStore.menus.length

  if (limit !== -1 && count >= limit) {
    upgradeMessage.value = `${plan === 'FREE' ? 'Free planda' : 'Pro planda'} en fazla ${limit} menü ekleyebilirsiniz. Daha fazla menü eklemek için aboneliğinizi yükseltin.`
    showUpgrade.value = true
    return
  }
  showCreateMenu.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    await businessStore.update(business.value.id, editForm.value)
    business.value = { ...business.value, ...editForm.value }
    showEdit.value = false
    toast.success('Kaydedildi!')
  } catch { toast.error('Hata oluştu') }
  finally { saving.value = false }
}

async function createMenu() {
  creatingMenu.value = true
  try {
    await menuStore.create(business.value.id, newMenu.value)
    showCreateMenu.value = false
    newMenu.value = { name: '', description: '', themeColor: '#FF6B35' }
    toast.success('Menü oluşturuldu!')
  } catch (e: any) {
    if (e.response?.status === 403) {
      showCreateMenu.value = false
      upgradeMessage.value = e.response?.data?.message || 'Plan limitine ulaştınız.'
      showUpgrade.value = true
    } else {
      toast.error('Hata oluştu')
    }
  }
  finally { creatingMenu.value = false }
}

async function toggleMenu(menu: any, val: boolean) {
  await menuStore.update(business.value.id, menu.id, { isActive: val })
  menu.isActive = val
}

function deleteMenu(menu: any) {
  menuToDelete.value = menu
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await menuStore.remove(business.value.id, menuToDelete.value.id)
    showDeleteConfirm.value = false
    menuToDelete.value = null
    toast.success('Menü silindi')
  } catch { toast.error('Hata oluştu') }
  finally { deleting.value = false }
}
</script>
