<script setup>
import { ref, watch } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import DataState from '../components/DataState.vue'
import RecipeCard from '../components/RecipeCard.vue'

const store = useRecipesStore()
const current = ref(null)

// Обирає випадковий рецепт, відмінний від поточного
function pickRandom() {
  const pool = store.items.filter(
    (item) => !current.value || item.id !== current.value.id
  )

  if (pool.length === 0) {
    return
  }

  current.value = pool[Math.floor(Math.random() * pool.length)]
}

// Перший вибір відбувається, коли каталог завантажено
watch(
  () => store.items,
  () => {
    if (!current.value) {
      pickRandom()
    }
  },
  { immediate: true }
)
</script>

<template>
  <section>
    <h1 class="page-title">Що приготувати?</h1>
    <p class="section-text">Не знаєте, що приготувати? Спробуйте випадковий рецепт.</p>

    <DataState>
      <div v-if="current" class="single-card">
        <RecipeCard :item="current" />
      </div>
      <p v-else class="empty-message">У каталозі поки немає рецептів.</p>

      <button v-if="current" class="button" type="button" @click="pickRandom">
        Інший рецепт
      </button>
    </DataState>
  </section>
</template>