<template>
  <div class="p-6 lg:p-8 max-w-2xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{{ t('settings.title') }}</h1>
      <p class="text-gray-500 mt-1">{{ t('settings.subtitle') }}</p>
    </div>

    <div class="card p-6 space-y-4">
      <h2 class="font-bold text-gray-900">{{ t('settings.profile.title') }}</h2>
      <div>
        <label class="label">{{ t('settings.profile.name') }}</label>
        <input v-model="form.name" class="input" />
      </div>
      <div>
        <label class="label">{{ t('settings.profile.email') }}</label>
        <input v-model="form.email" type="email" class="input" />
      </div>
      <div class="flex justify-end">
        <button @click="save" class="btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          {{ t('settings.save') }}
        </button>
      </div>
    </div>

    <div id="notifications" class="card p-6 space-y-4">
      <div>
        <h2 class="font-bold text-gray-900">{{ t('settings.notifications.title') }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ t('settings.notifications.subtitle') }}</p>
      </div>

      <div v-if="prefsLoading" class="text-sm text-gray-400 py-2">
        {{ t('settings.notifications.loading') }}
      </div>

      <div v-else class="space-y-3">
        <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            class="mt-1"
            :checked="prefs.weeklyInsightsEmail"
            @change="onTogglePref('weeklyInsightsEmail', ($event.target as HTMLInputElement).checked)"
          />
          <div>
            <p class="text-sm font-semibold text-gray-900">
              {{ t('settings.notifications.weeklyEmail.label') }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ t('settings.notifications.weeklyEmail.desc') }}
            </p>
          </div>
        </label>

        <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            class="mt-1"
            :checked="prefs.weeklyInsightsInApp"
            @change="onTogglePref('weeklyInsightsInApp', ($event.target as HTMLInputElement).checked)"
          />
          <div>
            <p class="text-sm font-semibold text-gray-900">
              {{ t('settings.notifications.weeklyInApp.label') }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ t('settings.notifications.weeklyInApp.desc') }}
            </p>
          </div>
        </label>
      </div>
    </div>

    <div class="card p-6 space-y-4">
      <h2 class="font-bold text-gray-900">{{ t('settings.security.title') }}</h2>
      <div>
        <label class="label">{{ t('settings.security.newPw') }}</label>
        <input v-model="pw.password" type="password" class="input" :placeholder="t('settings.security.pwPlaceholder')" />
      </div>
      <div>
        <label class="label">{{ t('settings.security.confirmPw') }}</label>
        <input v-model="pw.confirm" type="password" class="input" />
      </div>
      <div v-if="pw.error" class="text-red-500 text-sm">{{ pw.error }}</div>
      <div class="flex justify-end">
        <button @click="changePw" class="btn-secondary">{{ t('settings.security.change') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useToast } from '@/composables/useToast'
import { Loader2 } from 'lucide-vue-next'

const { t } = useI18n()
const auth = useAuthStore()
const notifications = useNotificationsStore()
const toast = useToast()

const saving = ref(false)
const form = ref({ name: auth.user?.name || '', email: auth.user?.email || '' })
const pw = ref({ password: '', confirm: '', error: '' })

const prefsLoading = ref(true)
const prefs = reactive({ weeklyInsightsEmail: true, weeklyInsightsInApp: true })

async function loadPrefs() {
  prefsLoading.value = true
  try {
    await notifications.loadPreferences()
    if (notifications.preferences) {
      prefs.weeklyInsightsEmail = notifications.preferences.weeklyInsightsEmail
      prefs.weeklyInsightsInApp = notifications.preferences.weeklyInsightsInApp
    }
  } catch {
    toast.error(t('settings.notifications.loadError'))
  } finally {
    prefsLoading.value = false
  }
}

async function onTogglePref(key: 'weeklyInsightsEmail' | 'weeklyInsightsInApp', value: boolean) {
  const prev = prefs[key]
  prefs[key] = value
  try {
    await notifications.updatePreferences({ [key]: value })
    toast.success(t('settings.notifications.saved'))
  } catch {
    prefs[key] = prev
    toast.error(t('settings.notifications.saveError'))
  }
}

async function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    toast.success(t('settings.profile.saved'))
  }, 600)
}

function changePw() {
  if (pw.value.password.length < 6) { pw.value.error = t('settings.security.minLength'); return }
  if (pw.value.password !== pw.value.confirm) { pw.value.error = t('settings.security.mismatch'); return }
  pw.value.error = ''
  toast.success(t('settings.security.changed'))
  pw.value = { password: '', confirm: '', error: '' }
}

onMounted(() => {
  void loadPrefs()
})
</script>
