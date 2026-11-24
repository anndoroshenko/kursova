<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'

const route = useRoute()
const store = useRecipesStore()

onMounted(() => store.loadItems())

const isLoading = computed(
  () => store.loading || (!store.hasLoaded && !store.error)
)

// Параметри URL приходять рядками, тому id порівнюємо як рядки
const item = computed(() =>
  store.items.find((entry) => String(entry.id) === String(route.params.id))
)
</script>

<template>
  <section>
    <p v-if="isLoading" class="state-message" role="status">Завантаження…</p>

    <div v-else-if="store.error" class="load-error" role="alert">
      <p>{{ store.error }}</p>
      <button class="button" type="button" @click="store.retry()">
        Спробувати ще раз
      </button>
    </div>

    <article v-else-if="item" class="recipe-detail">
      <RouterLink class="back-link" :to="{ name: 'home' }">← До каталогу</RouterLink>

      <img class="detail-image" :src="item.image" :alt="item.title">

      <p class="recipe-category">{{ CATEGORY_NAMES[item.category] }}</p>
      <h1 class="page-title">{{ item.title }}</h1>
      <p class="section-text">{{ item.description }}</p>
      <p class="recipe-time">Час приготування: {{ item.time }} хв</p>

      <button class="favorite-button" type="button"
              :class="{ 'is-active': store.isFavorite(item.id) }"
              :aria-pressed="store.isFavorite(item.id)"
              @click="store.toggleFavorite(item.id)">
        {{ store.isFavorite(item.id) ? 'В обраному' : 'До обраного' }}
      </button>

      <h2 class="subsection-title">Інгредієнти</h2>
      <ul class="feature-list">
        <li v-for="(ingredient, index) in item.ingredients" :key="index">
          {{ ingredient }}
        </li>
      </ul>

      <h2 class="subsection-title">Приготування</h2>
      <ol class="feature-list">
        <li v-for="(step, index) in item.steps" :key="index">{{ step }}</li>
      </ol>
    </article>

    <div v-else>
      <h1 class="page-title">Рецепт не знайдено</h1>
      <p class="section-text">Рецепта з таким номером немає в каталозі.</p>
      <RouterLink class="button" :to="{ name: 'home' }">Повернутися до каталогу</RouterLink>
    </div>
  </section>
</template>