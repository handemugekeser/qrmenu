import { defineStore } from 'pinia'
import { ref } from 'vue'
import { menuApi, categoryApi, productApi } from '@/api'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<any[]>([])
  const current = ref<any | null>(null)
  const loading = ref(false)

  async function fetchAll(businessId: string) {
    loading.value = true
    try {
      const { data } = await menuApi.list(businessId)
      menus.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(businessId: string, menuId: string) {
    loading.value = true
    try {
      const { data } = await menuApi.get(businessId, menuId)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function create(businessId: string, payload: any) {
    const { data } = await menuApi.create(businessId, payload)
    menus.value.unshift(data)
    return data
  }

  async function update(businessId: string, id: string, payload: any) {
    const { data } = await menuApi.update(businessId, id, payload)
    const idx = menus.value.findIndex(m => m.id === id)
    if (idx !== -1) menus.value[idx] = { ...menus.value[idx], ...data }
    if (current.value?.id === id) current.value = { ...current.value, ...data }
    return data
  }

  async function remove(businessId: string, id: string) {
    await menuApi.delete(businessId, id)
    menus.value = menus.value.filter(m => m.id !== id)
    if (current.value?.id === id) current.value = null
  }

  // ─── Categories ─────────────────────────────────────
  async function addCategory(menuId: string, payload: any) {
    const { data } = await categoryApi.create(menuId, payload)
    if (current.value?.id === menuId) {
      current.value.categories = [...(current.value.categories || []), { ...data, products: [] }]
    }
    return data
  }

  async function updateCategory(menuId: string, id: string, payload: any) {
    const { data } = await categoryApi.update(menuId, id, payload)
    if (current.value) {
      const idx = current.value.categories?.findIndex((c: any) => c.id === id)
      if (idx !== -1) current.value.categories[idx] = { ...current.value.categories[idx], ...data }
    }
    return data
  }

  async function removeCategory(menuId: string, id: string) {
    await categoryApi.delete(menuId, id)
    if (current.value) {
      current.value.categories = current.value.categories?.filter((c: any) => c.id !== id)
    }
  }

  async function reorderCategories(menuId: string, ids: string[]) {
    await categoryApi.reorder(menuId, ids)
  }

  // ─── Products ────────────────────────────────────────
  async function addProduct(categoryId: string, payload: any) {
    const { data } = await productApi.create(categoryId, payload)
    if (current.value) {
      const cat = current.value.categories?.find((c: any) => c.id === categoryId)
      if (cat) cat.products = [...(cat.products || []), data]
    }
    return data
  }

  async function updateProduct(categoryId: string, id: string, payload: any) {
    const { data } = await productApi.update(categoryId, id, payload)
    if (current.value) {
      const cat = current.value.categories?.find((c: any) => c.id === categoryId)
      if (cat) {
        const idx = cat.products?.findIndex((p: any) => p.id === id)
        if (idx !== -1) cat.products[idx] = { ...cat.products[idx], ...data }
      }
    }
    return data
  }

  async function removeProduct(categoryId: string, id: string) {
    await productApi.delete(categoryId, id)
    if (current.value) {
      for (const cat of current.value.categories || []) {
        cat.products = cat.products?.filter((p: any) => p.id !== id)
      }
    }
  }

  return {
    menus, current, loading,
    fetchAll, fetchOne, create, update, remove,
    addCategory, updateCategory, removeCategory, reorderCategories,
    addProduct, updateProduct, removeProduct,
  }
})
