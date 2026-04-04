<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2.5 mb-2">
          <div class="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <span class="text-white font-black text-lg">Q</span>
          </div>
          <span class="font-black text-gray-900 text-2xl tracking-tight">QRmenu</span>
        </div>
        <p class="text-gray-500 text-sm mt-1">Ücretsiz başlayın</p>
      </div>

      <div class="card p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Hesap Oluştur</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="label">Ad Soyad</label>
            <input v-model="form.name" type="text" class="input" placeholder="Adınız" required />
          </div>
          <div>
            <label class="label">E-posta</label>
            <input v-model="form.email" type="email" class="input" placeholder="siz@example.com" required />
          </div>
          <div>
            <label class="label">Şifre</label>
            <input v-model="form.password" type="password" class="input" placeholder="Min. 6 karakter" required minlength="6" />
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle :size="16" />{{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center btn-lg" :disabled="loading">
            <Loader2 v-if="loading" :size="18" class="animate-spin" />
            {{ loading ? 'Oluşturuluyor...' : 'Kayıt Ol' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">Zaten hesabın var mı? </span>
          <router-link to="/login" class="text-sm font-semibold text-orange-500 hover:text-orange-600">Giriş Yap</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AlertCircle, Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ name: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.value.name, form.value.email, form.value.password)
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Kayıt başarısız'
  } finally {
    loading.value = false
  }
}
</script>
