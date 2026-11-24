<script setup>
import { useRecipesStore } from '../stores/recipes.js'
import DataState from '../components/DataState.vue'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()
</script>

<template>
  <section>
    <h1 class="page-title">Обране</h1>

    <DataState>
      <p class="results-count" aria-live="polite">
        Рецептів в обраному: {{ store.favoriteItems.length }}
      </p>

      <div v-if="store.favoriteItems.length === 0">
        <p class="empty-message">В обраному поки немає рецептів.</p>
        <RouterLink class="button" :to="{ name: 'home' }">До каталогу рецептів</RouterLink>
      </div>
      <RecipeList v-else :items="store.favoriteItems" />
    </DataState>
  </section>
</template>