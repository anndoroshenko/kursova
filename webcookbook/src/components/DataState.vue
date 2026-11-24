<script setup>
import { computed, onMounted } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'

const store = useRecipesStore()

onMounted(() => store.loadItems())

// До завершення першого запиту показуємо «Завантаження», а не порожній результат
const isLoading = computed(
  () => store.loading || (!store.hasLoaded && !store.error)
)
</script>

<template>
  <p v-if="isLoading" class="state-message" role="status">Завантаження…</p>

  <div v-else-if="store.error" class="load-error" role="alert">
    <p>{{ store.error }}</p>
    <button class="button" type="button" @click="store.retry()">
      Спробувати ще раз
    </button>
  </div>

  <slot v-else />
</template>