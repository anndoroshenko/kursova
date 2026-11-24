<script setup>
import { useRecipesStore } from '../stores/recipes.js'

const store = useRecipesStore()
</script>

<template>
  <section>
    <h1 class="page-title">Список покупок</h1>
    <p class="section-text">
      Додавайте інгредієнти зі сторінки рецепта. Список зберігається у вашому браузері.
    </p>

    <p class="results-count" aria-live="polite">
      Залишилось купити: {{ store.shoppingLeft }} із {{ store.shoppingItems.length }}
    </p>

    <div v-if="store.shoppingItems.length === 0">
      <p class="empty-message">Список покупок порожній.</p>
      <RouterLink class="button" :to="{ name: 'home' }">До каталогу рецептів</RouterLink>
    </div>

    <template v-else>
      <ul class="shopping-list">
        <li v-for="entry in store.shoppingItems" :key="entry.id" class="shopping-item">
          <div class="choice">
            <input :id="`shop-${entry.id}`" type="checkbox" :checked="entry.done"
                   @change="store.toggleShoppingItem(entry.id)">
            <label :for="`shop-${entry.id}`" :class="{ 'is-done': entry.done }">
              {{ entry.text }}
            </label>
          </div>
          <button class="delete-button" type="button"
                  :aria-label="`Видалити зі списку: ${entry.text}`"
                  @click="store.removeShoppingItem(entry.id)">
            Видалити
          </button>
        </li>
      </ul>

      <button class="button button-small" type="button" @click="store.clearShopping()">
        Очистити список
      </button>
    </template>
  </section>
</template>