import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import MyRecipesView from '../views/MyRecipesView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/recipes' },
    { path: '/recipes', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/my-recipes', name: 'my-recipes', component: MyRecipesView },
  ],
})