import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeView from '../views/RecipeView.vue'
import AboutView from '../views/AboutView.vue'
import MyRecipesView from '../views/MyRecipesView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import CategoryView from '../views/CategoryView.vue'
import RandomView from '../views/RandomView.vue'
import CalculatorView from '../views/CalculatorView.vue'
import QuickView from '../views/QuickView.vue'
import IngredientSearchView from '../views/IngredientSearchView.vue'
import ShoppingView from '../views/ShoppingView.vue'
import HistoryView from '../views/HistoryView.vue'
import PlannerView from '../views/PlannerView.vue'
import CompareView from '../views/CompareView.vue'
import NotFoundView from '../views/NotFoundView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/recipes' },
    { path: '/recipes', name: 'home', component: HomeView },
    { path: '/recipes/:id', name: 'recipe', component: RecipeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/my-recipes', name: 'my-recipes', component: MyRecipesView },
    { path: '/favorites', name: 'favorites', component: FavoritesView },
    { path: '/categories', name: 'categories', component: CategoriesView },
    { path: '/categories/:key', name: 'category', component: CategoryView },
    { path: '/random', name: 'random', component: RandomView },
    { path: '/calculator', name: 'calculator', component: CalculatorView },
    { path: '/quick', name: 'quick', component: QuickView },
    { path: '/by-ingredient', name: 'by-ingredient', component: IngredientSearchView },
    { path: '/shopping', name: 'shopping', component: ShoppingView },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/planner', name: 'planner', component: PlannerView },
    { path: '/compare', name: 'compare', component: CompareView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})