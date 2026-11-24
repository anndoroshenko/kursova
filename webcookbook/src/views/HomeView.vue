<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()

// Пошук, категорія й прапорець залишаються локальним станом сторінки
const query = ref('')
const category = ref('all')
const onlyFavorites = ref(false)

onMounted(() => store.loadItems())

// До завершення першого запиту показуємо «Завантаження», а не «Нічого не знайдено»
const isLoading = computed(
  () => store.loading || (!store.hasLoaded && !store.error)
)

const filteredRecipes = computed(() => {
  const text = query.value.trim().toLowerCase()
  return store.items.filter((item) =>
    (category.value === 'all' || item.category === category.value) &&
    (!onlyFavorites.value || store.isFavorite(item.id)) &&
    `${item.title} ${item.description}`.toLowerCase().includes(text)
  )
})

const emptyText = computed(() =>
  onlyFavorites.value && !query.value.trim() && category.value === 'all'
    ? 'В обраному поки немає рецептів.'
    : 'Нічого не знайдено.'
)
</script>

<template>
  <section>
    <div class="catalog-controls">
      <div class="form-field">
        <label class="visually-hidden" for="recipe-search">Пошук рецептів</label>
        <input id="recipe-search" v-model.trim="query" class="form-control"
               type="search" placeholder="Пошук" :disabled="isLoading || !!store.error">
      </div>

      <div class="form-field">
        <label class="visually-hidden" for="category-filter">Категорія</label>
        <select id="category-filter" v-model="category" class="form-control"
                :disabled="isLoading || !!store.error">
          <option value="all">Усі категорії</option>
          <option v-for="(name, key) in CATEGORY_NAMES" :key="key" :value="key">
            {{ name }}
          </option>
        </select>
      </div>
    </div>

    <div class="choice filter-toggle">
      <input id="only-favorites" v-model="onlyFavorites" type="checkbox"
             :disabled="isLoading || !!store.error">
      <label for="only-favorites">Лише обране</label>
    </div>

    <h1 class="page-title">Рецепти</h1>

    <p v-if="isLoading" class="state-message" role="status">Завантаження…</p>

    <div v-else-if="store.error" class="load-error" role="alert">
      <p>{{ store.error }}</p>
      <button class="button" type="button" @click="store.retry()">
        Спробувати ще раз
      </button>
    </div>

    <template v-else>
      <p class="results-count" aria-live="polite">
        Знайдено рецептів: {{ filteredRecipes.length }}
      </p>

      <p v-if="filteredRecipes.length === 0" class="empty-message">{{ emptyText }}</p>
      <RecipeList v-else :items="filteredRecipes" />
    </template>
  </section>
</template>