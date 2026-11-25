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

const sameRecipe = computed(
  () => !!left.value && !!right.value && left.value.id === right.value.id
)
const ready = computed(() => !!left.value && !!right.value && !sameRecipe.value)

function swap() {
  ;[leftId.value, rightId.value] = [rightId.value, leftId.value]
}

function reset() {
  leftId.value = ''
  rightId.value = ''
}

// Показники таблиці. better: яке значення вважається зручнішим (null — без оцінки)
const METRICS = [
  { key: 'time', name: 'Час приготування', unit: 'хв', better: 'lower', get: (r) => r.time },
  { key: 'kcal', name: 'Калорійність на порцію', unit: 'ккал', better: 'lower', get: (r) => r.kcal },
  { key: 'protein', name: 'Білки', unit: 'г', better: 'higher', get: (r) => r.protein },
  { key: 'fat', name: 'Жири', unit: 'г', better: null, get: (r) => r.fat },
  { key: 'carbs', name: 'Вуглеводи', unit: 'г', better: null, get: (r) => r.carbs },
  { key: 'ingredients', name: 'Кількість інгредієнтів', unit: '', better: 'lower', get: (r) => r.ingredients.length },
  { key: 'steps', name: 'Кількість кроків', unit: '', better: 'lower', get: (r) => r.steps.length },
]

const rows = computed(() => {
  if (!ready.value) {
    return []
  }

  return METRICS.map((metric) => {
    const a = metric.get(left.value)
    const b = metric.get(right.value)
    let leftBest = false
    let rightBest = false

    if (metric.better && a !== b) {
      const leftWins = metric.better === 'lower' ? a < b : a > b
      leftBest = leftWins
      rightBest = !leftWins
    }

    return { ...metric, a, b, leftBest, rightBest }
  })
})

// Короткі висновки за трьома головними показниками
const verdicts = computed(() => {
  const texts = {
    time: 'Швидше готується',
    kcal: 'Менше калорій на порцію',
    protein: 'Більше білків на порцію',
  }

  return rows.value
    .filter((row) => texts[row.key] && (row.leftBest || row.rightBest))
    .map((row) => {
      const winner = row.leftBest ? left.value : right.value
      return `${texts[row.key]}: ${winner.title}.`
    })
})

// Частка добової норми калорій, яку дає одна порція
function normPercent(recipe) {
  return store.dailyNorm ? Math.round((recipe.kcal / store.dailyNorm.kcal) * 100) : null
}

// Назва інгредієнта без кількості: «Борошно — 200 г» → «борошно»
function ingredientNames(recipe) {
  return recipe.ingredients.map((text) => text.split(' — ')[0].trim().toLowerCase())
}

const commonIngredients = computed(() => {
  if (!ready.value) {
    return []
  }

  const rightNames = ingredientNames(right.value)
  return ingredientNames(left.value).filter((name) => rightNames.includes(name))
})

const onlyLeft = computed(() =>
  ready.value
    ? ingredientNames(left.value).filter((name) => !commonIngredients.value.includes(name))
    : []
)

const onlyRight = computed(() =>
  ready.value
    ? ingredientNames(right.value).filter((name) => !commonIngredients.value.includes(name))
    : []
)
</script>

<template>
  <section>
    <h1 class="page-title">Порівняння рецептів</h1>
    <p class="section-text">
      Оберіть два рецепти, щоб порівняти час, калорійність, склад і складність.
    </p>

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

      <div class="compare-actions">
        <button class="button button-small" type="button"
                :disabled="!leftId && !rightId" @click="swap">
          Поміняти місцями
        </button>
        <button class="button button-small" type="button"
                :disabled="!leftId && !rightId" @click="reset">
          Очистити вибір
        </button>
      </div>

      <p v-if="sameRecipe" class="load-error" role="alert">
        Оберіть два різні рецепти.
      </p>
      <p v-else-if="!ready" class="state-message">
        Оберіть обидва рецепти, щоб побачити порівняння.
      </p>

      <template v-else>
        <div class="result-box" aria-live="polite">
          <p class="result-main">Коротко</p>
          <ul v-if="verdicts.length > 0" class="verdict-list">
            <li v-for="text in verdicts" :key="text">{{ text }}</li>
          </ul>
          <p v-else class="result-note">
            За часом, калоріями та білками рецепти однакові.
          </p>
        </div>

        <div class="compare-wrapper">
          <table class="compare-table">
            <caption class="visually-hidden">Порівняння двох рецептів</caption>
            <thead>
              <tr>
                <th scope="col">Показник</th>
                <th scope="col">
                  {{ left.title }}
                  <RouterLink class="compare-link"
                              :to="{ name: 'recipe', params: { id: left.id } }">
                    Докладніше
                  </RouterLink>
                </th>
                <th scope="col">
                  {{ right.title }}
                  <RouterLink class="compare-link"
                              :to="{ name: 'recipe', params: { id: right.id } }">
                    Докладніше
                  </RouterLink>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Категорія</th>
                <td>{{ CATEGORY_NAMES[left.category] }}</td>
                <td>{{ CATEGORY_NAMES[right.category] }}</td>
              </tr>
              <tr>
                <th scope="row">Порція</th>
                <td>{{ left.portion }}</td>
                <td>{{ right.portion }}</td>
              </tr>
              <tr v-for="row in rows" :key="row.key">
                <th scope="row">{{ row.name }}</th>
                <td :class="{ 'best-cell': row.leftBest }">
                  {{ row.a }} {{ row.unit }}
                  <span v-if="row.leftBest" class="best-mark" aria-label="зручніший показник">✓</span>
                </td>
                <td :class="{ 'best-cell': row.rightBest }">
                  {{ row.b }} {{ row.unit }}
                  <span v-if="row.rightBest" class="best-mark" aria-label="зручніший показник">✓</span>
                </td>
              </tr>
              <tr v-if="store.dailyNorm">
                <th scope="row">Частка добової норми</th>
                <td>{{ normPercent(left) }}%</td>
                <td>{{ normPercent(right) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="result-note compare-note">
          ✓ — зручніший показник: менше часу, калорій, інгредієнтів і кроків та більше
          білків. Оцінка умовна. Калорійність і БЖВ орієнтовні.
          <template v-if="!store.dailyNorm">
            Щоб бачити частку добової норми, розрахуйте її в розділі
            <RouterLink :to="{ name: 'calculator' }">«Кулінарний калькулятор»</RouterLink>.
          </template>
        </p>

        <h2 class="subsection-title">Інгредієнти</h2>
        <div class="compare-lists">
          <div class="card">
            <h3 class="card-title">Спільні</h3>
            <p v-if="commonIngredients.length === 0" class="result-note">
              Спільних інгредієнтів немає.
            </p>
            <ul v-else class="feature-list">
              <li v-for="name in commonIngredients" :key="name">{{ name }}</li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title">Лише в «{{ left.title }}»</h3>
            <p v-if="onlyLeft.length === 0" class="result-note">Немає.</p>
            <ul v-else class="feature-list">
              <li v-for="name in onlyLeft" :key="name">{{ name }}</li>
            </ul>
          </div>

          <div class="card">
            <h3 class="card-title">Лише в «{{ right.title }}»</h3>
            <p v-if="onlyRight.length === 0" class="result-note">Немає.</p>
            <ul v-else class="feature-list">
              <li v-for="name in onlyRight" :key="name">{{ name }}</li>
            </ul>
          </div>
        </div>
      </template>
    </DataState>
  </section>
</template>