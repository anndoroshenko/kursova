<script setup>
import { useRecipesStore } from './stores/recipes.js'

const store = useRecipesStore()
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <RouterLink class="logo" :to="{ name: 'home' }">YummySpace</RouterLink>

      <nav class="main-nav" aria-label="Головна навігація">
        <ul class="nav-list">
          <li><RouterLink class="nav-link" :to="{ name: 'about' }">Про сайт</RouterLink></li>
          <li><RouterLink class="nav-link" :to="{ name: 'home' }">Рецепти</RouterLink></li>
          <li><RouterLink class="nav-link" :to="{ name: 'my-recipes' }">Мої рецепти</RouterLink></li>
        </ul>
      </nav>

      <p class="favorites-counter" aria-live="polite">
        Обране: {{ store.favoriteCount }}
      </p>
    </aside>

    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>