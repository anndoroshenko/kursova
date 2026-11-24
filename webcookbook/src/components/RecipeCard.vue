<script setup>
import { CATEGORY_NAMES } from '../utils/categories.js'
defineProps({ item: { type: Object, required: true } })
</script>

<template>
  <article class="recipe-card">
    <img class="recipe-image" :src="item.image" :alt="item.title" loading="lazy">
    <div class="recipe-body">
      <p class="recipe-category">{{ CATEGORY_NAMES[item.category] }}</p>
      <h3 class="recipe-name">{{ item.title }}</h3>
      <p class="recipe-description">{{ item.description }}</p>
      <p class="recipe-time">Час приготування: {{ item.time }} хв</p>
    </div>
  </article>
</template>