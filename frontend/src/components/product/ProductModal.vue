<template>
  <AppModal v-model="localOpen" :title="product ? 'Ürünü Düzenle' : 'Yeni Ürün'" size="lg">
    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
      <button v-for="tab in tabs" :key="tab.id"
        :class="['flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all',
                 activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700']"
        @click="activeTab = tab.id">
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Info -->
    <div v-if="activeTab === 'info'" class="space-y-4">
      <div>
        <label class="label">Ürün Adı *</label>
        <input v-model="form.name" class="input" placeholder="Örn: Adana Kebap" />
      </div>
      <div>
        <label class="label">Açıklama</label>
        <textarea v-model="form.description" class="input h-20 resize-none" placeholder="Ürün hakkında kısa açıklama..." />
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="label">Taban Fiyat (₺) *</label>
          <input v-model.number="form.basePrice" type="number" step="0.01" min="0" class="input" placeholder="0.00" />
        </div>
        <div class="w-36">
          <label class="label">Kalori (kcal)</label>
          <input v-model.number="form.calories" type="number" min="0" class="input" placeholder="Örn: 320" />
        </div>
      </div>

      <!-- Allergens -->
      <div>
        <label class="label">Alerjenler</label>
        <div class="grid grid-cols-3 gap-2">
          <label v-for="a in ALLERGENS" :key="a.id"
            class="flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all text-sm"
            :class="form.allergens.includes(a.id) ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'">
            <input type="checkbox" class="hidden" :checked="form.allergens.includes(a.id)" @change="toggleAllergen(a.id)" />
            <span>{{ a.emoji }}</span>
            <span class="font-medium text-xs">{{ a.label }}</span>
          </label>
        </div>
      </div>

      <!-- Image upload -->
      <div>
        <label class="label">Görsel</label>

        <!-- Preview (when image is set) -->
        <div v-if="form.imageUrl" class="relative rounded-xl overflow-hidden border border-gray-100 mb-2">
          <img :src="form.imageUrl" class="w-full h-40 object-cover" />
          <button
            type="button"
            @click="clearImage"
            class="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
            <X :size="14" />
          </button>
        </div>

        <!-- Drop zone (when no image) -->
        <div
          v-else
          :class="[
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
            isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInputRef?.click()">
          <div v-if="uploading" class="flex flex-col items-center gap-2">
            <Loader2 :size="24" class="text-orange-500 animate-spin" />
            <p class="text-sm text-gray-500">Yükleniyor...</p>
          </div>
          <div v-else class="flex flex-col items-center gap-1">
            <Upload :size="24" class="text-gray-400" />
            <p class="text-sm text-gray-600 mt-1">
              Sürükle bırak veya
              <span class="text-orange-500 font-medium">dosya seç</span>
            </p>
            <p class="text-xs text-gray-400">JPEG, PNG, WebP, GIF · Maks. 5MB</p>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="hidden"
            @change="handleFileSelect" />
        </div>

        <p v-if="uploadError" class="text-xs text-red-500 mt-1">{{ uploadError }}</p>

        <!-- URL input as fallback -->
        <input
          v-model="form.imageUrl"
          class="input mt-2 text-sm"
          placeholder="veya görsel URL'si yapıştırın: https://..." />
      </div>

      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2.5 cursor-pointer">
          <AppToggle v-model="form.isAvailable" />
          <span class="text-sm text-gray-700">Mevcut</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer">
          <AppToggle v-model="form.isPopular" />
          <span class="text-sm text-gray-700">⭐ Popüler</span>
        </label>
      </div>
    </div>

    <!-- Tab: Variants -->
    <div v-if="activeTab === 'variants'" class="space-y-3">
      <p class="text-sm text-gray-500">Farklı boyut veya seçenekler için varyant ekleyin.</p>
      <div v-for="(v, i) in variants" :key="i" class="flex items-center gap-3">
        <input v-model="v.name" class="input flex-1" placeholder="Örn: Küçük" />
        <div class="relative w-32">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
          <input v-model.number="v.price" type="number" step="0.01" min="0" class="input pl-7" placeholder="0.00" />
        </div>
        <label class="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
          <input type="radio" :name="`default-${i}`" :checked="v.isDefault" @change="setDefaultVariant(i)" class="accent-orange-500" />
          Varsayılan
        </label>
        <button @click="variants.splice(i, 1)" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
          <Trash2 :size="14" />
        </button>
      </div>
      <button @click="variants.push({ name: '', price: 0, isDefault: false })" class="btn-secondary btn-sm w-full justify-center">
        <Plus :size="14" /> Varyant Ekle
      </button>
    </div>

    <!-- Tab: Extras -->
    <div v-if="activeTab === 'extras'" class="space-y-3">
      <p class="text-sm text-gray-500">Opsiyonel ek malzemeler veya özelleştirmeler.</p>
      <div v-for="(e, i) in extras" :key="i" class="flex items-center gap-3">
        <input v-model="e.name" class="input flex-1" placeholder="Örn: Ekstra Sos" />
        <div class="relative w-28">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
          <input v-model.number="e.price" type="number" step="0.01" min="0" class="input pl-7" placeholder="0.00" />
        </div>
        <button @click="extras.splice(i, 1)" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
          <Trash2 :size="14" />
        </button>
      </div>
      <button @click="extras.push({ name: '', price: 0 })" class="btn-secondary btn-sm w-full justify-center">
        <Plus :size="14" /> Ekstra Ekle
      </button>
    </div>

    <!-- Tab: Translations -->
    <div v-if="activeTab === 'translations'" class="space-y-4">
      <p class="text-sm text-gray-500">Farklı dillerde ürün adı ve açıklaması.</p>
      <div v-for="lang in ['EN', 'AR']" :key="lang" class="border border-gray-100 rounded-xl p-4 space-y-3">
        <h4 class="font-semibold text-sm text-gray-700">{{ lang === 'EN' ? '🇬🇧 English' : '🇸🇦 العربية' }}</h4>
        <div>
          <label class="label">Ad</label>
          <input v-model="translations[lang].name" class="input" :placeholder="lang === 'AR' ? 'الاسم' : 'Name'" :dir="lang === 'AR' ? 'rtl' : 'ltr'" />
        </div>
        <div>
          <label class="label">Açıklama</label>
          <input v-model="translations[lang].description" class="input" :placeholder="lang === 'AR' ? 'الوصف' : 'Description'" :dir="lang === 'AR' ? 'rtl' : 'ltr'" />
        </div>
      </div>
    </div>

    <template #footer>
      <button @click="localOpen = false" class="btn-secondary">İptal</button>
      <button @click="save" class="btn-primary" :disabled="saving">
        <Loader2 v-if="saving" :size="16" class="animate-spin" />
        {{ product ? 'Güncelle' : 'Kaydet' }}
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppToggle from '@/components/ui/AppToggle.vue'
import { useMenuStore } from '@/stores/menu'
import { productApi, translationApi, uploadApi } from '@/api'
import { Plus, Trash2, Loader2, Upload, X } from 'lucide-vue-next'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const props = defineProps<{
  modelValue: boolean
  product?: any
  categoryId?: string
}>()
const emit = defineEmits(['update:modelValue', 'saved', 'plan-limit-exceeded'])

const menuStore = useMenuStore()
const saving = ref(false)
const uploading = ref(false)
const uploadError = ref('')
const isDragging = ref(false)
const activeTab = ref('info')
const fileInputRef = ref<HTMLInputElement | null>(null)

const ALLERGENS = [
  { id: 'GLUTEN', label: 'Gluten', emoji: '🌾' },
  { id: 'MILK', label: 'Süt', emoji: '🥛' },
  { id: 'EGGS', label: 'Yumurta', emoji: '🥚' },
  { id: 'PEANUTS', label: 'Fıstık', emoji: '🥜' },
  { id: 'SOY', label: 'Soya', emoji: '🫘' },
  { id: 'FISH', label: 'Balık', emoji: '🐟' },
  { id: 'SHELLFISH', label: 'Kabuklu D.', emoji: '🦐' },
  { id: 'SESAME', label: 'Susam', emoji: '⚫' },
  { id: 'NUTS', label: 'Kuruyemiş', emoji: '🌰' },
  { id: 'CELERY', label: 'Kereviz', emoji: '🥬' },
  { id: 'MUSTARD', label: 'Hardal', emoji: '🌻' },
  { id: 'SULFITES', label: 'Sülfitler', emoji: '🧪' },
]

const tabs = [
  { id: 'info', label: 'Bilgi' },
  { id: 'variants', label: 'Varyantlar' },
  { id: 'extras', label: 'Ekstralar' },
  { id: 'translations', label: 'Çeviriler' },
]

const localOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const form = ref({
  name: '',
  description: '',
  basePrice: 0,
  calories: null as number | null,
  allergens: [] as string[],
  imageUrl: '',
  isAvailable: true,
  isPopular: false,
})
const variants = ref<any[]>([])
const extras = ref<any[]>([])
const translations = ref<Record<string, { name: string; description: string }>>({
  EN: { name: '', description: '' },
  AR: { name: '', description: '' },
})

watch(() => props.product, (p) => {
  activeTab.value = 'info'
  uploadError.value = ''
  if (p) {
    form.value = {
      name: p.name,
      description: p.description || '',
      basePrice: Number(p.basePrice),
      calories: p.calories ?? null,
      allergens: p.allergens || [],
      imageUrl: p.imageUrl || '',
      isAvailable: p.isAvailable,
      isPopular: p.isPopular,
    }
    variants.value = (p.variants || []).map((v: any) => ({ ...v }))
    extras.value = (p.extras || []).map((e: any) => ({ ...e }))
    const t = p.translations || []
    for (const lang of ['EN', 'AR']) {
      const nameT = t.find((x: any) => x.language === lang && x.field === 'name')
      const descT = t.find((x: any) => x.language === lang && x.field === 'description')
      translations.value[lang] = {
        name: nameT?.value || '',
        description: descT?.value || '',
      }
    }
  } else {
    form.value = { name: '', description: '', basePrice: 0, calories: null, allergens: [], imageUrl: '', isAvailable: true, isPopular: false }
    variants.value = []
    extras.value = []
    translations.value = { EN: { name: '', description: '' }, AR: { name: '', description: '' } }
  }
}, { immediate: true })

function clearImage() {
  form.value.imageUrl = ''
  uploadError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function uploadFile(file: File) {
  uploadError.value = ''

  if (!ALLOWED_TYPES.includes(file.type)) {
    uploadError.value = 'Sadece JPEG, PNG, WebP ve GIF dosyaları yüklenebilir.'
    return
  }
  if (file.size > MAX_SIZE) {
    uploadError.value = `Dosya boyutu en fazla 5MB olabilir (seçilen: ${(file.size / 1024 / 1024).toFixed(1)}MB).`
    return
  }

  uploading.value = true
  try {
    const res = await uploadApi.image(file)
    form.value.imageUrl = res.data.url
  } catch {
    uploadError.value = 'Dosya yüklenirken hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    uploading.value = false
  }
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}

function toggleAllergen(id: string) {
  const idx = form.value.allergens.indexOf(id)
  if (idx === -1) form.value.allergens.push(id)
  else form.value.allergens.splice(idx, 1)
}

function setDefaultVariant(idx: number) {
  variants.value.forEach((v, i) => (v.isDefault = i === idx))
}

async function save() {
  if (!form.value.name || !props.categoryId) return
  saving.value = true
  try {
    let saved: any
    if (props.product) {
      saved = await menuStore.updateProduct(props.categoryId, props.product.id, form.value)
      const existingIds = (props.product.variants || []).map((v: any) => v.id)
      for (const v of variants.value) {
        if (!v.id) await productApi.addVariant(props.categoryId, props.product.id, v)
      }
      for (const eid of existingIds) {
        if (!variants.value.find((v: any) => v.id === eid)) {
          await productApi.deleteVariant(props.categoryId, props.product.id, eid).catch(() => {})
        }
      }
      const existingExtraIds = (props.product.extras || []).map((e: any) => e.id)
      for (const e of extras.value) {
        if (!e.id) await productApi.addExtra(props.categoryId, props.product.id, e)
      }
      for (const eid of existingExtraIds) {
        if (!extras.value.find((e: any) => e.id === eid)) {
          await productApi.deleteExtra(props.categoryId, props.product.id, eid).catch(() => {})
        }
      }
    } else {
      saved = await menuStore.addProduct(props.categoryId, {
        ...form.value,
        variants: variants.value.filter(v => v.name),
        extras: extras.value.filter(e => e.name),
      })
    }

    const productId = saved.id || props.product?.id
    for (const lang of ['EN', 'AR']) {
      const t = translations.value[lang]
      if (t.name) await translationApi.upsert({ entityType: 'product', entityId: productId, language: lang, field: 'name', value: t.name }).catch(() => {})
      if (t.description) await translationApi.upsert({ entityType: 'product', entityId: productId, language: lang, field: 'description', value: t.description }).catch(() => {})
    }

    emit('saved', { ...saved, variants: variants.value, extras: extras.value })
  } catch (e: any) {
    if (e.response?.status === 403) {
      emit('plan-limit-exceeded', e.response?.data?.message)
    } else {
      console.error(e)
    }
  } finally {
    saving.value = false
  }
}
</script>
