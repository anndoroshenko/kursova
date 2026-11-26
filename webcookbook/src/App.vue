<script setup>
import { useRecipesStore } from './stores/recipes.js'
import NavIcon from './components/NavIcon.vue'

const store = useRecipesStore()

const navItems = [
  { route: 'about', label: 'Про сайт', icon: 'about' },
  { route: 'home', label: 'Рецепти', icon: 'recipes' },
  { route: 'categories', label: 'Категорії', icon: 'categories' },
  { route: 'quick', label: 'Швидкі рецепти', icon: 'quick' },
  { route: 'by-ingredient', label: 'Пошук за інгредієнтом', icon: 'ingredient' },
  { route: 'random', label: 'Що приготувати?', icon: 'random' },
  { route: 'calculator', label: 'Кулінарний калькулятор', icon: 'calculator' },
  { route: 'favorites', label: 'Обране', icon: 'favorites' },
  { route: 'my-recipes', label: 'Мої рецепти', icon: 'mine' },
  { route: 'shopping', label: 'Список покупок', icon: 'shopping' },
  { route: 'planner', label: 'Меню на тиждень', icon: 'planner' },
  { route: 'compare', label: 'Порівняння', icon: 'compare' },
  { route: 'history', label: 'Історія переглядів', icon: 'history' },
]
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <RouterLink class="logo" :to="{ name: 'home' }" aria-label="YummySpace — на головну">
        <svg class="logo-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 24 H42 A18 18 0 0 1 6 24 Z"/>
            <path d="M16 17 q-3 -5 0 -10"/>
            <path d="M24 17 q-3 -5 0 -10"/>
            <path d="M32 17 q-3 -5 0 -10"/>
          </g>
        </svg>
        <span class="logo-text">Yummy<span class="logo-accent">Space</span></span>
      </RouterLink>

      <nav class="main-nav" aria-label="Головна навігація">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.route">
            <RouterLink class="nav-link" :to="{ name: item.route }">
              <NavIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
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