import { defineStore } from 'pinia'
import { fetchRecipes } from '../services/recipesApi.js'
import { WEEK_DAYS, createEmptyPlan } from '../utils/weekdays.js'
import { calculateNorm } from '../utils/calories.js'
import {
  readFavoriteIds, writeFavoriteIds,
  readViewedIds, writeViewedIds,
  readShoppingItems, writeShoppingItems,
  readPlan, writePlan,
  readProfile, writeProfile,
  readDiary, writeDiary,
} from '../utils/storage.js'

const MAX_VIEWED = 20
const MAX_PLAN_PER_DAY = 10

// Некоректні або недоступні дані сховища не повинні ламати застосунок
function restore(reader, fallback) {
  try {
    return reader()
  } catch (error) {
    console.error(error)
    return fallback()
  }
}

function persist(writer, value) {
  try {
    writer(value)
  } catch (error) {
    console.error(error)
  }
}

export const useRecipesStore = defineStore('recipes', {
  state: () => ({
    items: [],
    favoriteIds: restore(readFavoriteIds, () => []),
    viewedIds: restore(readViewedIds, () => []),
    shoppingItems: restore(readShoppingItems, () => []),
    plan: restore(readPlan, createEmptyPlan),
    profile: restore(readProfile, () => null),
    diary: restore(readDiary, () => []),
    loading: false,
    error: '',
    hasLoaded: false,
  }),

  getters: {
    favoriteCount: (state) => state.favoriteIds.length,
    isFavorite: (state) => (id) => state.favoriteIds.includes(id),

    // Параметри URL і значення select приходять рядками, тому id порівнюємо як рядки
    itemById: (state) => (id) =>
      state.items.find((entry) => String(entry.id) === String(id)),

    favoriteItems: (state) =>
      state.items.filter((item) => state.favoriteIds.includes(item.id)),

    viewedItems: (state) =>
      state.viewedIds
        .map((id) => state.items.find((item) => item.id === id))
        .filter(Boolean),

    shoppingLeft: (state) =>
      state.shoppingItems.filter((entry) => !entry.done).length,

    // Добова норма: null, доки користувач не зберіг профіль
    dailyNorm: (state) => (state.profile ? calculateNorm(state.profile) : null),

    // Записи щоденника разом із рецептом і підрахованими поживними речовинами
    diaryRows: (state) =>
      state.diary
        .map((entry) => {
          const recipe = state.items.find((item) => item.id === entry.recipeId)

          if (!recipe) {
            return null
          }

          return {
            ...entry,
            recipe,
            kcal: recipe.kcal * entry.portions,
            protein: recipe.protein * entry.portions,
            fat: recipe.fat * entry.portions,
            carbs: recipe.carbs * entry.portions,
          }
        })
        .filter(Boolean),

    diaryTotals() {
      return this.diaryRows.reduce(
        (sum, row) => ({
          kcal: sum.kcal + row.kcal,
          protein: sum.protein + row.protein,
          fat: sum.fat + row.fat,
          carbs: sum.carbs + row.carbs,
        }),
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
      )
    },
  },

  actions: {
    // ---------- Обране ----------
    toggleFavorite(id) {
      this.favoriteIds = this.favoriteIds.includes(id)
        ? this.favoriteIds.filter((favoriteId) => favoriteId !== id)
        : [...this.favoriteIds, id]

      persist(writeFavoriteIds, this.favoriteIds)
    },

    // ---------- Історія переглядів: останні зверху, без повторів ----------
    addViewed(id) {
      this.viewedIds = [id, ...this.viewedIds.filter((viewedId) => viewedId !== id)]
        .slice(0, MAX_VIEWED)

      persist(writeViewedIds, this.viewedIds)
    },

    clearViewed() {
      this.viewedIds = []
      persist(writeViewedIds, this.viewedIds)
    },

    // ---------- Список покупок ----------
    // Повертає кількість доданих позицій (дублікати не додаються)
    addIngredientsToShopping(recipe) {
      const existing = new Set(this.shoppingItems.map((entry) => entry.text))
      const added = recipe.ingredients
        .filter((text) => !existing.has(text))
        .map((text) => ({
          id: `shop-${crypto.randomUUID()}`,
          text,
          done: false,
        }))

      if (added.length > 0) {
        this.shoppingItems = [...this.shoppingItems, ...added]
        persist(writeShoppingItems, this.shoppingItems)
      }

      return added.length
    },

    toggleShoppingItem(id) {
      this.shoppingItems = this.shoppingItems.map((entry) =>
        entry.id === id ? { ...entry, done: !entry.done } : entry
      )
      persist(writeShoppingItems, this.shoppingItems)
    },

    removeShoppingItem(id) {
      this.shoppingItems = this.shoppingItems.filter((entry) => entry.id !== id)
      persist(writeShoppingItems, this.shoppingItems)
    },

    clearShopping() {
      this.shoppingItems = []
      persist(writeShoppingItems, this.shoppingItems)
    },

    // ---------- Меню на тиждень: кілька страв на день ----------
    // Повертає true, якщо страву додано
    addPlanItem(dayKey, recipeId) {
      const dayItems = this.plan[dayKey]

      if (!dayItems || dayItems.includes(recipeId) || dayItems.length >= MAX_PLAN_PER_DAY) {
        return false
      }

      this.plan = { ...this.plan, [dayKey]: [...dayItems, recipeId] }
      persist(writePlan, this.plan)
      return true
    },

    removePlanItem(dayKey, recipeId) {
      this.plan = {
        ...this.plan,
        [dayKey]: this.plan[dayKey].filter((id) => id !== recipeId),
      }
      persist(writePlan, this.plan)
    },

    clearPlan() {
      this.plan = createEmptyPlan()
      persist(writePlan, this.plan)
    },

    // ---------- Калорійний калькулятор ----------
    saveProfile(profile) {
      this.profile = { ...profile }
      persist(writeProfile, this.profile)
    },

    addDiaryEntry({ recipeId, meal, portions }) {
      this.diary = [
        ...this.diary,
        { id: `log-${crypto.randomUUID()}`, recipeId, meal, portions },
      ]
      persist(writeDiary, this.diary)
    },

    removeDiaryEntry(id) {
      this.diary = this.diary.filter((entry) => entry.id !== id)
      persist(writeDiary, this.diary)
    },

    clearDiary() {
      this.diary = []
      persist(writeDiary, this.diary)
    },

    // ---------- Очищення id, яких більше немає в каталозі ----------
    cleanupMissingIds() {
      const exists = (id) => this.items.some((item) => item.id === id)

      const favorites = this.favoriteIds.filter(exists)
      if (favorites.length !== this.favoriteIds.length) {
        this.favoriteIds = favorites
        persist(writeFavoriteIds, favorites)
      }

      const viewed = this.viewedIds.filter(exists)
      if (viewed.length !== this.viewedIds.length) {
        this.viewedIds = viewed
        persist(writeViewedIds, viewed)
      }

      const diary = this.diary.filter((entry) => exists(entry.recipeId))
      if (diary.length !== this.diary.length) {
        this.diary = diary
        persist(writeDiary, diary)
      }

      const plan = {}
      let planChanged = false
      WEEK_DAYS.forEach((day) => {
        plan[day.key] = this.plan[day.key].filter(exists)
        if (plan[day.key].length !== this.plan[day.key].length) {
          planChanged = true
        }
      })
      if (planChanged) {
        this.plan = plan
        persist(writePlan, plan)
      }
    },

    // ---------- Завантаження каталогу ----------
    async loadItems(force = false) {
      if (this.loading) return
      if (this.hasLoaded && !force) return

      this.loading = true
      this.error = ''

      try {
        this.items = await fetchRecipes()
        this.hasLoaded = true
        this.cleanupMissingIds()
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