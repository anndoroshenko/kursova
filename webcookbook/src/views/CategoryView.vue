<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import DataState from '../components/DataState.vue'
import RecipeList from '../components/RecipeList.vue'

const route = useRoute()
const store = useRecipesStore()

// Невідомий ключ у URL дає undefined і повідомлення «не знайдено»
const categoryName = computed(() =>
  Object.keys(CATEGORY_NAMES).includes(route.params.key)
    ? CATEGORY_NAMES[route.params.key]
    : ''
)

const categoryItems = computed(() =>
  store.items.filter((item) => item.category === route.params.key)
)
</script>

<template>
  <section>
    <template v-if="categoryName">
      <RouterLink class="back-link" :to="{ name: 'categories' }">← До категорій</RouterLink>
      <h1 class="page-title">{{ categoryName }}</h1>

      <DataState>
        <p v-if="categoryItems.length === 0" class="empty-message">
          У цій категорії поки немає рецептів.
        </p>
        <RecipeList v-else :items="categoryItems" />
      </DataState>
    </template>

    <div v-else>
      <h1 class="page-title">Категорію не знайдено</h1>
      <p class="section-text">Такої категорії немає на сайті.</p>
      <RouterLink class="button" :to="{ name: 'categories' }">До списку категорій</RouterLink>
    </div>
  </section>
</template>