<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
    <!-- Menu header bar -->
    <div v-if="menu" class="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: menu.themeColor || '#FF6B35' }" />
        <div>
          <h1 class="font-bold text-gray-900 text-sm leading-tight">{{ menu.name }}</h1>
          <p v-if="menu.description" class="text-xs text-gray-400 mt-0.5">{{ menu.description }}</p>
        </div>
      </div>
       <div class="flex items-center gap-2">
        <button @click="openPublicMenu(menu)" class="btn-secondary btn-sm" title="Görüntüle">
          <ExternalLink :size="14" /> Görüntüle
        </button>
        <button @click="openMenuSettings" class="btn-secondary btn-sm">
          <Settings :size="14" /> Menü Ayarları
        </button>
      </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
    <!-- Left: Category panel -->
    <div class="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center justify-between mb-1">
          <h2 class="font-bold text-gray-900 text-sm">Kategoriler</h2>
          <button @click="openAddCategory" class="p-1.5 rounded-lg bg-[#768dfb]/10 text-[#5b73e8] hover:bg-[#768dfb]/20">
            <Plus :size="16" />
          </button>
        </div>
        <p class="text-xs text-gray-400">Sürükleyerek sırala</p>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <div v-if="!menu" class="flex justify-center py-8">
          <Loader2 :size="20" class="animate-spin text-gray-300" />
        </div>
        <div v-else>
          <VueDraggable v-model="categories" handle=".drag-handle" @end="onCategoryReorder" class="space-y-1">
            <div
              v-for="cat in categories"
              :key="cat.id"
              :class="['flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all group',
                       selectedCat?.id === cat.id ? 'bg-[#768dfb]/10 text-[#5b73e8]' : 'hover:bg-gray-50 text-gray-700']"
              @click="selectedCat = cat"
            >
              <GripVertical :size="14" class="drag-handle cursor-grab text-gray-300 shrink-0" />
              <span class="flex-1 text-sm font-medium truncate">{{ cat.name }}</span>
              <span class="text-xs text-gray-400 shrink-0">{{ cat.products?.length || 0 }}</span>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                <button @click.stop="openEditCategory(cat)" class="p-1 rounded hover:bg-[#768dfb]/10 text-gray-400 hover:text-[#5b73e8]">
                  <Pencil :size="12" />
                </button>
                <button @click.stop="doDeleteCategory(cat)" class="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>

    <!-- Right: Products -->
    <div class="flex-1 overflow-y-auto bg-[#f8f8fb]">
      <div v-if="!selectedCat" class="flex flex-col items-center justify-center h-full text-center p-8">
        <LayoutGrid :size="40" class="text-gray-200 mb-3" />
        <p class="text-gray-500 font-medium">Bir kategori seçin</p>
        <p class="text-gray-400 text-sm mt-1">Sol panelden kategori seçerek ürünleri yönetin</p>
      </div>
      <div v-else class="p-6 space-y-4">
        <!-- Category header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">{{ selectedCat.name }}</h2>
            <p class="text-sm text-gray-400">{{ products.length }} ürün</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <AppToggle :model-value="selectedCat.isActive" @update:model-value="doToggleCategory" />
              <span class="text-sm text-gray-500">{{ selectedCat.isActive ? 'Aktif' : 'Pasif' }}</span>
            </div>
            <button @click="showProductModal = true; editingProduct = null" class="btn-primary btn-sm">
              <Plus :size="16" /> Ürün Ekle
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="products.length === 0" class="card p-12 text-center">
          <Package :size="36" class="text-gray-200 mx-auto mb-3" />
          <p class="text-gray-500 mb-3">Bu kategoride henüz ürün yok</p>
          <button @click="showProductModal = true; editingProduct = null" class="btn-primary btn-sm">
            <Plus :size="16" /> İlk Ürünü Ekle
          </button>
        </div>

        <!-- Product drag list -->
        <VueDraggable v-else v-model="products" handle=".prod-handle" @end="onProductReorder" class="space-y-3">
          <div v-for="prod in products" :key="prod.id" class="card p-4 hover:shadow-md transition-shadow group">
            <div class="flex items-start gap-3">
              <GripVertical :size="16" class="prod-handle cursor-grab text-gray-300 mt-1 shrink-0" />
              <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <img v-if="prod.imageUrl" :src="prod.imageUrl" class="w-full h-full object-cover" alt="" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon :size="22" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-bold text-gray-900">{{ prod.name }}</h3>
                      <span v-if="prod.isPopular" class="badge-orange text-xs">⭐ Popüler</span>
                      <span v-if="!prod.isAvailable" class="badge-red text-xs">Tükendi</span>
                    </div>
                    <p class="text-sm text-gray-400 mt-0.5 line-clamp-1">{{ prod.description }}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="font-bold text-[#5b73e8]">{{ fmt(prod.basePrice) }}</span>
                      <span v-if="prod.variants?.length" class="text-xs text-gray-400">{{ prod.variants.length }} varyant</span>
                      <span v-if="prod.extras?.length" class="text-xs text-gray-400">{{ prod.extras.length }} ekstra</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <AppToggle :model-value="prod.isAvailable" @update:model-value="doToggleProduct(prod, $event)" />
                    <button @click="openEditProduct(prod)" class="btn-ghost btn-sm opacity-0 group-hover:opacity-100"><Pencil :size="14" /></button>
                    <button @click="doDeleteProduct(prod)" class="btn-ghost btn-sm text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100"><Trash2 :size="14" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VueDraggable>
      </div>
    </div>

    </div><!-- end flex -->

    <!-- Menu Settings Modal -->
    <AppModal v-model="showMenuSettings" title="Menü Ayarları">
      <div class="space-y-4">
        <div>
          <label class="label">Menü Adı *</label>
          <input v-model="menuForm.name" class="input" placeholder="Örn: Ana Menü" />
        </div>
        <div>
          <label class="label">Açıklama</label>
          <textarea v-model="menuForm.description" class="input h-20 resize-none" placeholder="Opsiyonel" />
        </div>
        <div>
          <label class="label">Tema Rengi</label>
          <div class="flex items-center gap-3">
            <input type="color" v-model="menuForm.themeColor" class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
            <span class="text-sm text-gray-500">{{ menuForm.themeColor }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="showMenuSettings = false" class="btn-secondary">İptal</button>
        <button @click="doSaveMenuSettings" class="btn-primary" :disabled="savingMenu">
          <Loader2 v-if="savingMenu" :size="16" class="animate-spin" />
          Kaydet
        </button>
      </template>
    </AppModal>

    <!-- Category Modal -->
    <AppModal v-model="showCategoryModal" :title="editingCat ? 'Kategoriyi Düzenle' : 'Yeni Kategori'">
      <div class="space-y-4">
        <div>
          <label class="label">Kategori Adı *</label>
          <input v-model="catForm.name" class="input" placeholder="Örn: Başlangıçlar" />
        </div>
        <div>
          <label class="label">Açıklama</label>
          <input v-model="catForm.description" class="input" placeholder="Opsiyonel" />
        </div>
      </div>
      <template #footer>
        <button @click="showCategoryModal = false" class="btn-secondary">İptal</button>
        <button @click="doSaveCategory" class="btn-primary" :disabled="savingCat">
          <Loader2 v-if="savingCat" :size="16" class="animate-spin" />
          {{ editingCat ? 'Güncelle' : 'Ekle' }}
        </button>
      </template>
    </AppModal>

    <!-- Product Modal -->
    <ProductModal
      v-model="showProductModal"
      :product="editingProduct"
      :category-id="selectedCat?.id"
      @saved="onProductSaved"
      @plan-limit-exceeded="onProductLimitExceeded"
    />

    <!-- Upgrade Modal -->
    <UpgradeModal v-model="showUpgrade" :message="upgradeMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggable } from 'vue-draggable-plus'
import { useMenuStore } from '@/stores/menu'
import { useBusinessStore } from '@/stores/business'
import { useToast } from '@/composables/useToast'
import { categoryApi, productApi } from '@/api'
import AppModal from '@/components/ui/AppModal.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import ProductModal from '@/components/product/ProductModal.vue'
import UpgradeModal from '@/components/ui/UpgradeModal.vue'
import { Plus, GripVertical, ExternalLink, Pencil, Trash2, LayoutGrid, Package, Loader2, Image as ImageIcon, Settings } from 'lucide-vue-next'

const route = useRoute()
const menuStore = useMenuStore()
const businessStore = useBusinessStore()
const toast = useToast()

const menu = computed(() => menuStore.current)
const business = ref<any>(null)
const selectedCat = ref<any>(null)
const showCategoryModal = ref(false)
const showProductModal = ref(false)
const showMenuSettings = ref(false)
const showUpgrade = ref(false)
const upgradeMessage = ref('')
const editingCat = ref<any>(null)
const editingProduct = ref<any>(null)
const savingCat = ref(false)
const savingMenu = ref(false)
const catForm = ref({ name: '', description: '' })
const menuForm = ref({ name: '', description: '', themeColor: '#FF6B35' })

const categories = computed({
  get: () => menu.value?.categories || [],
  set: (val) => { if (menu.value) menu.value.categories = val },
})
const products = computed({
  get: () => selectedCat.value?.products || [],
  set: (val) => { if (selectedCat.value) selectedCat.value.products = val },
})

async function loadMenu() {
  const { businessId, menuId } = route.params as any
  selectedCat.value = null
  business.value = await businessStore.fetchOne(businessId)
  await menuStore.fetchOne(businessId, menuId)
  if (menu.value?.categories?.length) selectedCat.value = menu.value.categories[0]
}

watch(() => route.params.menuId, loadMenu)

onMounted(async () => {
  await loadMenu()
})
function openPublicMenu(menu: any) {
  window.open(`/menu/${business.value.slug}?menuId=${menu.id}`, '_blank')
}


function fmt(p: any) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(p))
}

function openMenuSettings() {
  menuForm.value = { name: menu.value.name, description: menu.value.description || '', themeColor: menu.value.themeColor || '#FF6B35' }
  showMenuSettings.value = true
}

async function doSaveMenuSettings() {
  if (!menuForm.value.name) return
  savingMenu.value = true
  try {
    const { businessId, menuId } = route.params as any
    await menuStore.update(businessId, menuId, menuForm.value)
    showMenuSettings.value = false
    toast.success('Menü güncellendi')
  } catch { toast.error('Hata oluştu') } finally { savingMenu.value = false }
}

function openAddCategory() { editingCat.value = null; catForm.value = { name: '', description: '' }; showCategoryModal.value = true }
function openEditCategory(cat: any) { editingCat.value = cat; catForm.value = { name: cat.name, description: cat.description || '' }; showCategoryModal.value = true }

async function doSaveCategory() {
  if (!catForm.value.name) return
  savingCat.value = true
  try {
    const menuId = route.params.menuId as string
    if (editingCat.value) {
      await menuStore.updateCategory(menuId, editingCat.value.id, catForm.value)
      toast.success('Kategori güncellendi')
    } else {
      const cat = await menuStore.addCategory(menuId, catForm.value)
      selectedCat.value = cat
      toast.success('Kategori eklendi')
    }
    showCategoryModal.value = false
  } catch { toast.error('Hata oluştu') } finally { savingCat.value = false }
}

async function doDeleteCategory(cat: any) {
  if (!confirm(`"${cat.name}" silinsin mi?`)) return
  await menuStore.removeCategory(route.params.menuId as string, cat.id)
  if (selectedCat.value?.id === cat.id) selectedCat.value = null
  toast.success('Silindi')
}

async function onCategoryReorder() {
  await categoryApi.reorder(route.params.menuId as string, categories.value.map((c: any) => c.id))
}

function openEditProduct(p: any) { editingProduct.value = p; showProductModal.value = true }

async function doToggleProduct(prod: any, val: boolean) {
  await menuStore.updateProduct(selectedCat.value.id, prod.id, { isAvailable: val })
  prod.isAvailable = val
}
async function doToggleCategory(val: boolean) {
  await menuStore.updateCategory(route.params.menuId as string, selectedCat.value.id, { isActive: val })
  selectedCat.value.isActive = val
}
async function doDeleteProduct(prod: any) {
  if (!confirm(`"${prod.name}" silinsin mi?`)) return
  await menuStore.removeProduct(selectedCat.value.id, prod.id)
  toast.success('Ürün silindi')
}
async function onProductReorder() {
  await productApi.reorder(selectedCat.value.id, products.value.map((p: any) => p.id))
}
function onProductSaved(product: any) {
  if (!selectedCat.value.products) selectedCat.value.products = []
  const idx = selectedCat.value.products.findIndex((p: any) => p.id === product.id)
  if (idx !== -1) selectedCat.value.products[idx] = product
  else selectedCat.value.products.push(product)
  toast.success('Ürün kaydedildi!')
  showProductModal.value = false
  editingProduct.value = null
}

function onProductLimitExceeded(message: string) {
  showProductModal.value = false
  upgradeMessage.value = message || 'Plan limitine ulaştınız. Daha fazla ürün eklemek için aboneliğinizi yükseltin.'
  showUpgrade.value = true
}
</script>
