<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()

// Пошук і категорія залишаються локальним станом сторінки
const query = ref('')
const category = ref('all')

onMounted(() => store.loadItems())

// До завершення першого запиту показуємо «Завантаження», а не «Нічого не знайдено»
const isLoading = computed(
  () => store.loading || (!store.hasLoaded && !store.error)
)

const filteredRecipes = computed(() => {
  const text = query.value.trim().toLowerCase()
  return store.items.filter((item) =>
    (category.value === 'all' || item.category === category.value) &&
    `${item.title} ${item.description}`.toLowerCase().includes(text)
  )
})
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

      <p v-if="filteredRecipes.length === 0" class="empty-message">Нічого не знайдено.</p>
      <RecipeList v-else :items="filteredRecipes" />
    </template>
  </section>
</template>