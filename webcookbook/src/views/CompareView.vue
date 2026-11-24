<script setup>
import { computed, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { CATEGORY_NAMES } from '../utils/categories.js'
import DataState from '../components/DataState.vue'

const store = useRecipesStore()

const leftId = ref('')
const rightId = ref('')

const left = computed(() => store.itemById(leftId.value))
const right = computed(() => store.itemById(rightId.value))
</script>

<template>
  <section>
    <h1 class="page-title">Порівняння рецептів</h1>
    <p class="section-text">Оберіть два рецепти, щоб порівняти їх.</p>

    <DataState>
      <div class="compare-controls">
        <div class="form-field">
          <label class="form-label" for="compare-left">Перший рецепт</label>
          <select id="compare-left" v-model="leftId" class="form-control">
            <option value="">Оберіть рецепт</option>
            <option v-for="item in store.items" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="compare-right">Другий рецепт</label>
          <select id="compare-right" v-model="rightId" class="form-control">
            <option value="">Оберіть рецепт</option>
            <option v-for="item in store.items" :key="item.id" :value="item.id">
              {{ item.title }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="!left || !right" class="state-message">
        Оберіть обидва рецепти, щоб побачити порівняння.
      </p>

      <div v-else class="compare-wrapper">
        <table class="compare-table">
          <caption class="visually-hidden">Порівняння двох рецептів</caption>
          <thead>
            <tr>
              <th scope="col">Показник</th>
              <th scope="col">{{ left.title }}</th>
              <th scope="col">{{ right.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Категорія</th>
              <td>{{ CATEGORY_NAMES[left.category] }}</td>
              <td>{{ CATEGORY_NAMES[right.category] }}</td>
            </tr>
            <tr>
              <th scope="row">Час приготування</th>
              <td>{{ left.time }} хв</td>
              <td>{{ right.time }} хв</td>
            </tr>
            <tr>
              <th scope="row">Кількість інгредієнтів</th>
              <td>{{ left.ingredients.length }}</td>
              <td>{{ right.ingredients.length }}</td>
            </tr>
            <tr>
              <th scope="row">Кількість кроків</th>
              <td>{{ left.steps.length }}</td>
              <td>{{ right.steps.length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DataState>
  </section>
</template>