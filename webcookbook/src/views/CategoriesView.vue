<script setup>
import { computed } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import DataState from '../components/DataState.vue'

const store = useRecipesStore()

// Кількість рецептів у кожній категорії
const counts = computed(() =>
  Object.fromEntries(
    Object.keys(CATEGORY_NAMES).map((key) => [
      key,
      store.items.filter((item) => item.category === key).length,
    ])
  )
)
</script>

<template>
  <section>
    <h1 class="page-title">Категорії</h1>
    <p class="section-text">Оберіть категорію, щоб переглянути її рецепти.</p>

    <DataState>
      <div class="category-grid">
        <RouterLink v-for="(name, key) in CATEGORY_NAMES" :key="key"
                    class="category-card"
                    :to="{ name: 'category', params: { key } }">
          <span class="category-name">{{ name }}</span>
          <span class="category-count">Рецептів: {{ counts[key] }}</span>
        </RouterLink>
      </div>
    </DataState>
  </section>
</template>