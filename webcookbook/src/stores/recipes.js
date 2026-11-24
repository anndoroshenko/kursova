import { defineStore } from 'pinia'
import { fetchRecipes } from '../services/recipesApi.js'
import { readFavoriteIds, writeFavoriteIds } from '../utils/storage.js'

// Некоректні або недоступні дані сховища не повинні ламати застосунок
function restoreFavoriteIds() {
  try {
    return readFavoriteIds()
  } catch (error) {
    console.error(error)
    return []
  }
}

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    items: [],
    favoriteIds: restoreFavoriteIds(),
    loading: false,
    error: '',
    hasLoaded: false,
  }),

  getters: {
    favoriteCount: (state) => state.favoriteIds.length,
    isFavorite: (state) => (id) => state.favoriteIds.includes(id),
  },

  actions: {
    toggleFavorite(id) {
      this.favoriteIds = this.favoriteIds.includes(id)
        ? this.favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...this.favoriteIds, id]

      try {
        writeFavoriteIds(this.favoriteIds)
      } catch (error) {
        console.error(error)
      }
    },

    async loadItems(force = false) {
      if (this.loading) return
      if (this.hasLoaded && !force) return

      this.loading = true
      this.error = ''

      try {
        this.items = await fetchRecipes()
        this.hasLoaded = true

        // Прибираємо з обраного id, яких більше немає в каталозі
        const existingIds = this.favoriteIds.filter((id) =>
          this.items.some((item) => item.id === id)
        )

        if (existingIds.length !== this.favoriteIds.length) {
          this.favoriteIds = existingIds

          try {
            writeFavoriteIds(existingIds)
          } catch (error) {
            console.error(error)
          }
        }
      } catch (error) {
        this.items = []
        this.hasLoaded = false
        this.error = 'Не вдалося завантажити рецепти.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    retry() {
      return this.loadItems(true)
    },
  },
})
