<script setup>
import RecipeCard from './RecipeCard.vue'
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <div class="recipe-grid">
    <RecipeCard v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>