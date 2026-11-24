<script setup>
import { computed, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import DataState from '../components/DataState.vue'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()
const maxTime = ref(30)

// Рецепти не довші за обраний час, від найшвидших
const quickItems = computed(() =>
  store.items
    .filter((item) => item.time <= maxTime.value)
    .sort((a, b) => a.time - b.time)
)
</script>

<template>
  <section>
    <h1 class="page-title">Швидкі рецепти</h1>

    <div class="form-field limit-field">
      <label class="form-label" for="max-time">Час приготування</label>
      <select id="max-time" v-model.number="maxTime" class="form-control">
        <option :value="30">до 30 хв</option>
        <option :value="60">до 60 хв</option>
        <option :value="120">до 120 хв</option>
      </select>
    </div>

    <DataState>
      <p class="results-count" aria-live="polite">
        Знайдено рецептів: {{ quickItems.length }}
      </p>

      <p v-if="quickItems.length === 0" class="empty-message">
        Рецептів за такий час не знайдено.
      </p>
      <RecipeList v-else :items="quickItems" />
    </DataState>
  </section>
</template>