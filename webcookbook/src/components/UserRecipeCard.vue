<script setup>
import { CATEGORY_NAMES } from '../utils/categories.js'

defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['delete'])
</script>

<template>
  <article class="card user-card">
    <p class="user-card-category">{{ CATEGORY_NAMES[item.category] }}</p>
    <h3 class="user-card-title">{{ item.title }}</h3>
    <p class="user-card-description">{{ item.description }}</p>
    <button class="delete-button" type="button"
            :aria-label="`Видалити рецепт «${item.title}»`"
            @click="emit('delete', item.id)">
      Видалити
    </button>
  </article>
</template>