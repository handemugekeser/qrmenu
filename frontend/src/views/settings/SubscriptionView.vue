<template>
  <div class="p-6 lg:p-8 space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Abonelik</h1>
      <p class="text-gray-500 mt-1">Planınızı yönetin</p>
    </div>

    <!-- Current Plan Banner -->
    <div class="card p-6 bg-[#768dfb]/5 border-[#768dfb]/20 flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-[#5b73e8] uppercase tracking-wider mb-1">Mevcut Plan</p>
        <h2 class="text-3xl font-bold text-gray-900">{{ auth.user?.plan }}</h2>
        <p v-if="auth.user?.planExpiresAt && auth.user?.plan !== 'FREE'" class="text-sm text-gray-500 mt-1">
          Yenileme: {{ new Date(auth.user.planExpiresAt).toLocaleDateString('tr-TR') }}
        </p>
      </div>
      <button
        v-if="auth.user?.plan !== 'FREE'"
        @click="showCancelConfirm = true"
        class="btn-secondary text-red-500 hover:bg-red-50 hover:border-red-200 shrink-0"
      >
        Aboneliği İptal Et
      </button>
    </div>

    <!-- Payment result toast -->
    <div v-if="paymentResult === 'success'" class="card p-4 bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700">
      <CheckCircle :size="20" />
      <p class="font-semibold">Ödeme başarılı! Planınız güncellendi.</p>
    </div>
    <div v-if="paymentResult === 'failed'" class="card p-4 bg-red-50 border border-red-200 flex items-center gap-3 text-red-700">
      <XCircle :size="20" />
      <p class="font-semibold">Ödeme başarısız. Lütfen tekrar deneyin.</p>
    </div>

    <!-- Plans -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="plan in plans" :key="plan.id"
           :class="['card p-6 flex flex-col relative', plan.id === auth.user?.plan ? 'ring-2 ring-[#768dfb]' : '']">
        <div v-if="plan.id === auth.user?.plan" class="absolute top-4 right-4 badge-blue text-xs">Aktif</div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ plan.name }}</h3>
        <div class="mb-4">
          <span class="text-3xl font-bold text-gray-900">{{ plan.price === 0 ? 'Ücretsiz' : `$${plan.price}` }}</span>
          <span v-if="plan.price > 0" class="text-gray-400 text-sm">/ay</span>
        </div>
        <ul class="space-y-2 mb-6 flex-1">
          <li v-for="f in plan.features" :key="f" class="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle :size="15" class="text-emerald-500 shrink-0" />{{ f }}
          </li>
        </ul>

        <!-- CTA button -->
        <button
          v-if="plan.id !== auth.user?.plan"
          @click="startCheckout(plan)"
          :disabled="!!checkingOut"
          class="btn-primary w-full justify-center"
        >
          <Loader2 v-if="checkingOut === plan.id" :size="16" class="animate-spin" />
          {{ plan.price === 0 ? 'Şimdi Dene' : 'Yükselt' }}
        </button>
        <div v-else class="btn-secondary w-full justify-center opacity-60 cursor-default text-center py-2 text-sm font-semibold">
          Aktif Plan
        </div>
      </div>
    </div>

    <!-- iyzico Payment Modal -->
    <AppModal v-model="showPaymentModal" title="Güvenli Ödeme" size="lg">
      <div v-if="checkoutLoading" class="flex justify-center py-12">
        <Loader2 :size="28" class="animate-spin text-[#768dfb]" />
      </div>
      <div v-else-if="checkoutFormContent" ref="iyzicoContainer" class="iyzico-form-wrap" />
      <div v-else class="text-center py-8 text-gray-500">Ödeme formu yüklenemedi.</div>
      <template #footer>
        <button @click="showPaymentModal = false" class="btn-secondary">Kapat</button>
      </template>
    </AppModal>

    <!-- Cancel Confirm Modal -->
    <AppModal v-model="showCancelConfirm" title="Aboneliği İptal Et">
      <p class="text-gray-600">
        Aboneliğinizi iptal etmek istediğinizden emin misiniz?
        <span class="font-semibold text-gray-900">FREE plana düşeceksiniz</span> ve tüm premium özelliklerinize erişiminiz kalkacak.
      </p>
      <template #footer>
        <button @click="showCancelConfirm = false" class="btn-secondary">Vazgeç</button>
        <button @click="cancelSubscription" :disabled="cancelling" class="btn-primary bg-red-500! hover:bg-red-600!">
          <Loader2 v-if="cancelling" :size="16" class="animate-spin" />
          İptal Et
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { subscriptionApi } from '@/api'
import { useToast } from '@/composables/useToast'
import AppModal from '@/components/ui/AppModal.vue'
import { CheckCircle, XCircle, Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const toast = useToast()
const route = useRoute()

const plans = ref<any[]>([])
const checkingOut = ref<string | false>(false)
const checkoutLoading = ref(false)
const showPaymentModal = ref(false)
const checkoutFormContent = ref<string>('')
const iyzicoContainer = ref<HTMLElement | null>(null)
const showCancelConfirm = ref(false)
const cancelling = ref(false)
const paymentResult = ref<'success' | 'failed' | null>(null)

onMounted(async () => {
  const { data } = await subscriptionApi.plans()
  plans.value = data

  // Handle redirect back from iyzico callback
  const result = route.query.payment as string
  if (result === 'success') {
    paymentResult.value = 'success'
    await auth.fetchMe()
  } else if (result === 'failed') {
    paymentResult.value = 'failed'
  }
})

async function startCheckout(plan: any) {
  if (plan.price === 0) return // FREE plan has no payment
  checkingOut.value = plan.id
  showPaymentModal.value = true
  checkoutLoading.value = true
  checkoutFormContent.value = ''
  try {
    const { data } = await subscriptionApi.createCheckout(plan.id)
    // Demo user: backend returns upgraded user directly (no checkoutFormContent)
    if (data.plan) {
      await auth.fetchMe()
      showPaymentModal.value = false
      paymentResult.value = 'success'
      return
    }
    checkoutFormContent.value = data.checkoutFormContent
  } catch {
    toast.error('Ödeme formu yüklenemedi. Lütfen tekrar deneyin.')
    showPaymentModal.value = false
  } finally {
    checkoutLoading.value = false
    checkingOut.value = false
  }
}

// Inject iyzico HTML+script into DOM when form content is ready
watch(checkoutFormContent, async (html) => {
  if (!html) return
  await nextTick()
  if (!iyzicoContainer.value) return
  iyzicoContainer.value.innerHTML = html
  // Execute any scripts in the injected HTML
  const scripts = iyzicoContainer.value.querySelectorAll('script')
  scripts.forEach((oldScript) => {
    const newScript = document.createElement('script')
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
    newScript.textContent = oldScript.textContent
    oldScript.parentNode?.replaceChild(newScript, oldScript)
  })
})

async function cancelSubscription() {
  cancelling.value = true
  try {
    await subscriptionApi.cancel()
    await auth.fetchMe()
    showCancelConfirm.value = false
    toast.success('Aboneliğiniz iptal edildi')
  } catch {
    toast.error('Hata oluştu')
  } finally {
    cancelling.value = false
  }
}
</script>

<style scoped>
.iyzico-form-wrap {
  min-height: 400px;
}
</style>
