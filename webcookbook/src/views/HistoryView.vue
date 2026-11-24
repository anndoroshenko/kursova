<script setup>
import { useRecipesStore } from '../stores/recipes.js'
import DataState from '../components/DataState.vue'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()
</script>

<template>
  <section>
    <h1 class="page-title">Історія переглядів</h1>

    <DataState>
      <div v-if="store.viewedItems.length === 0">
        <p class="empty-message">Ви ще не переглядали рецептів.</p>
        <RouterLink class="button" :to="{ name: 'home' }">До каталогу рецептів</RouterLink>
      </div>

      <template v-else>
        <button class="button button-small page-action" type="button"
                @click="store.clearViewed()">
          Очистити історію
        </button>
        <RecipeList :items="store.viewedItems" />
      </template>
    </DataState>
  </section>
</template>