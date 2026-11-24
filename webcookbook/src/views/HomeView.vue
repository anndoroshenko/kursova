<script setup>
import { computed, ref } from 'vue'
import { recipes } from '../data/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import RecipeList from '../components/RecipeList.vue'

const query = ref('')
const category = ref('all')

const filteredRecipes = computed(() => {
  const text = query.value.trim().toLowerCase()
  return recipes.filter((item) =>
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
               type="search" placeholder="Пошук">
      </div>

      <div class="form-field">
        <label class="visually-hidden" for="category-filter">Категорія</label>
        <select id="category-filter" v-model="category" class="form-control">
          <option value="all">Усі категорії</option>
          <option v-for="(name, key) in CATEGORY_NAMES" :key="key" :value="key">
            {{ name }}
          </option>
        </select>
      </div>
    </div>

    <h1 class="page-title">Рецепти</h1>
    <p class="results-count" aria-live="polite">
      Знайдено рецептів: {{ filteredRecipes.length }}
    </p>

    <p v-if="filteredRecipes.length === 0" class="empty-message">Нічого не знайдено.</p>
    <RecipeList v-else :items="filteredRecipes" />
  </section>
</template>