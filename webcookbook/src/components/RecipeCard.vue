<script setup>
import { CATEGORY_NAMES } from '../utils/categories.js'
import { useRecipesStore } from '../stores/recipes.js'

defineProps({ item: { type: Object, required: true } })

const store = useRecipesStore()
</script>

<template>
  <article class="recipe-card">
    <img class="recipe-image" :src="item.image" :alt="item.title" loading="lazy">
    <div class="recipe-body">
      <p class="recipe-category">{{ CATEGORY_NAMES[item.category] }}</p>
      <h3 class="recipe-name">{{ item.title }}</h3>
      <p class="recipe-description">{{ item.description }}</p>
      <p class="recipe-time">Час приготування: {{ item.time }} хв</p>
      <p class="recipe-time">Калорійність: {{ item.kcal }} ккал на порцію</p>

      <div class="recipe-actions">
        <RouterLink class="button button-small"
                    :to="{ name: 'recipe', params: { id: item.id } }">
          Докладніше
        </RouterLink>
        <button class="favorite-button" type="button"
                :class="{ 'is-active': store.isFavorite(item.id) }"
                :aria-pressed="store.isFavorite(item.id)"
                @click="store.toggleFavorite(item.id)">
          {{ store.isFavorite(item.id) ? 'В обраному' : 'До обраного' }}
        </button>
      </div>
    </div>
  </article>
</template>