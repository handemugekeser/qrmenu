<template>
  <div class="min-h-screen flex items-center justify-center p-4" style="background:linear-gradient(135deg,#f0f3ff 0%,#ffffff 50%,#f4f0ff 100%)">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2.5 mb-2">
          <div class="flex flex-col items-center justify-center gap-0.5" style="width:44px;height:44px;border-radius:14px;background:linear-gradient(145deg,#8a9efc 0%,#6478f0 100%);box-shadow:0 4px 14px rgba(118,141,251,.38)">
            <span style="font-family:'Waldenburg','Waldenburg Fallback','Bricolage Grotesque',sans-serif;font-weight:800;font-size:21px;line-height:1;color:#fff;letter-spacing:-0.02em">Q</span>
          </div>
          <span style="font-family:'Waldenburg','Waldenburg Fallback','Bricolage Grotesque',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.03em;color:#111120">MenusFlow</span>
        </div>
        <p class="text-gray-500 text-sm mt-1">Dijital menülerinizi yönetin</p>
      </div>

      <div class="card p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Giriş Yap</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">E-posta</label>
            <input v-model="form.email" type="email" class="input" placeholder="siz@example.com" required />
          </div>
          <div>
            <label class="label">Şifre</label>
            <input v-model="form.password" type="password" class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle :size="16" />{{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center btn-lg" :disabled="loading">
            <Loader2 v-if="loading" :size="18" class="animate-spin" />
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">Hesabın yok mu? </span>
          <router-link to="/register" class="text-sm font-semibold text-[#768dfb] hover:text-[#5b73e8]">
            Kayıt Ol
          </router-link>
        </div>

        <!-- Demo hint -->
        <!-- <div class="mt-4 p-3 rounded-xl text-xs text-center" style="background:rgba(118,141,251,.08);color:#5b73e8">
          Demo: <strong>demo@qrmenu.app</strong> / <strong>password123</strong>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AlertCircle, Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.email, form.value.password)
    const redirect = (route.query.redirect as string) || '/app'
    router.push(redirect)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Giriş başarısız'
  } finally {
    loading.value = false
  }
}
</script>
