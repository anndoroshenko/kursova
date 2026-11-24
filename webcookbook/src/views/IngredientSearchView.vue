<script setup>
import { computed, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import DataState from '../components/DataState.vue'
import RecipeList from '../components/RecipeList.vue'

const store = useRecipesStore()
const query = ref('')

// Порожній запит нічого не шукає
const foundItems = computed(() => {
  const text = query.value.trim().toLowerCase()

  if (text === '') {
    return []
  }

  return store.items.filter((item) =>
    item.ingredients.some((ingredient) => ingredient.toLowerCase().includes(text))
  )
})
</script>

<template>
  <section>
    <h1 class="page-title">Пошук за інгредієнтом</h1>

    <div class="form-field limit-field">
      <label class="form-label" for="ingredient-search">Інгредієнт</label>
      <input id="ingredient-search" v-model.trim="query" class="form-control"
             type="search" placeholder="Наприклад, яйця або сметана">
    </div>

    <DataState>
      <p v-if="query.trim() === ''" class="state-message">
        Введіть назву інгредієнта, щоб знайти рецепти.
      </p>

      <template v-else>
        <p class="results-count" aria-live="polite">
          Знайдено рецептів: {{ foundItems.length }}
        </p>

        <p v-if="foundItems.length === 0" class="empty-message">Нічого не знайдено.</p>
        <RecipeList v-else :items="foundItems" />
      </template>
    </DataState>
  </section>
</template>