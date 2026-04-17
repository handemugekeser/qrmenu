<template>
  <div class="p-6 lg:p-8 max-w-2xl space-y-6">
    <div><h1 class="text-2xl font-bold text-gray-900">Ayarlar</h1><p class="text-gray-500 mt-1">Hesap bilgilerinizi düzenleyin</p></div>
    <div class="card p-6 space-y-4">
      <h2 class="font-bold text-gray-900">Profil Bilgileri</h2>
      <div><label class="label">Ad Soyad</label><input v-model="form.name" class="input" /></div>
      <div><label class="label">E-posta</label><input v-model="form.email" type="email" class="input" /></div>
      <div class="flex justify-end">
        <button @click="save" class="btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="16" class="animate-spin" />Kaydet
        </button>
      </div>
    </div>
    <div class="card p-6 space-y-4">
      <h2 class="font-bold text-gray-900">Güvenlik</h2>
      <div><label class="label">Yeni Şifre</label><input v-model="pw.password" type="password" class="input" placeholder="Min. 6 karakter" /></div>
      <div><label class="label">Şifre Tekrar</label><input v-model="pw.confirm" type="password" class="input" /></div>
      <div v-if="pw.error" class="text-red-500 text-sm">{{ pw.error }}</div>
      <div class="flex justify-end">
        <button @click="changePw" class="btn-secondary">Şifreyi Değiştir</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { Loader2 } from 'lucide-vue-next'
const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)
const form = ref({ name: auth.user?.name || '', email: auth.user?.email || '' })
const pw = ref({ password: '', confirm: '', error: '' })
async function save() {
  saving.value = true
  setTimeout(() => { saving.value = false; toast.success('Kaydedildi!') }, 600)
}
function changePw() {
  if (pw.value.password.length < 6) { pw.value.error = 'En az 6 karakter gerekli'; return }
  if (pw.value.password !== pw.value.confirm) { pw.value.error = 'Şifreler eşleşmiyor'; return }
  pw.value.error = ''
  toast.success('Şifre değiştirildi!')
  pw.value = { password: '', confirm: '', error: '' }
}
</script>
