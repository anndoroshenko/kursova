<script setup>
import { computed, ref } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import {
  SEX_OPTIONS, ACTIVITY_LEVELS, GOALS, MEALS,
  createDefaultProfile, isValidProfile,
} from '../utils/calories.js'

const store = useRecipesStore()

const PORTION_OPTIONS = [0.5, 1, 1.5, 2, 3, 4]

function round(value) {
  return Math.round(value)
}

// ---------- Добова норма ----------
const start = store.profile ?? createDefaultProfile()
const sex = ref(start.sex)
const age = ref(start.age)
const weight = ref(start.weight)
const height = ref(start.height)
const activity = ref(start.activity)
const goal = ref(start.goal)

const profileError = ref('')
const profileMessage = ref('')

function saveProfile() {
  const profile = {
    sex: sex.value,
    age: age.value,
    weight: weight.value,
    height: height.value,
    activity: activity.value,
    goal: goal.value,
  }

  if (!isValidProfile(profile)) {
    profileMessage.value = ''
    profileError.value =
      'Перевірте дані: вік 14–100 років, вага 30–300 кг, зріст 100–250 см.'
    return
  }

  profileError.value = ''
  store.saveProfile(profile)
  profileMessage.value = 'Норму розраховано й збережено.'
}

const norm = computed(() => store.dailyNorm)

// ---------- Щоденник ----------
const recipeId = ref('')
const meal = ref('breakfast')
const portions = ref(1)
const diaryError = ref('')

function addEntry() {
  if (recipeId.value === '') {
    diaryError.value = 'Оберіть страву зі списку.'
    return
  }

  diaryError.value = ''
  store.addDiaryEntry({
    recipeId: recipeId.value,
    meal: meal.value,
    portions: portions.value,
  })
  recipeId.value = ''
}

const eaten = computed(() => store.diaryTotals)

const byMeal = computed(() =>
  MEALS.map((item) => {
    const rows = store.diaryRows.filter((row) => row.meal === item.key)

    return {
      ...item,
      rows,
      kcal: rows.reduce((sum, row) => sum + row.kcal, 0),
    }
  })
)

const remaining = computed(() => (norm.value ? norm.value.kcal - eaten.value.kcal : null))
const isOver = computed(() => remaining.value !== null && remaining.value < 0)

const summaryRows = computed(() => [
  { key: 'kcal', name: 'Калорії', unit: 'ккал', eaten: eaten.value.kcal, norm: norm.value?.kcal },
  { key: 'protein', name: 'Білки', unit: 'г', eaten: eaten.value.protein, norm: norm.value?.protein },
  { key: 'fat', name: 'Жири', unit: 'г', eaten: eaten.value.fat, norm: norm.value?.fat },
  { key: 'carbs', name: 'Вуглеводи', unit: 'г', eaten: eaten.value.carbs, norm: norm.value?.carbs },
])
</script>

<template>
  <div class="calc-panel">
    <p class="section-text">
      Розрахунок орієнтовний і не замінює консультацію лікаря чи дієтолога.
      Калорійність страв наведено на одну порцію.
    </p>

    <h2 class="subsection-title">1. Добова норма</h2>

    <form class="request-form card" @submit.prevent="saveProfile">
      <div class="calc-grid">
        <div class="form-field">
          <label class="form-label" for="cal-sex">Стать</label>
          <select id="cal-sex" v-model="sex" class="form-control">
            <option v-for="item in SEX_OPTIONS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="cal-age">Вік, років</label>
          <input id="cal-age" v-model.number="age" class="form-control"
                 type="number" min="14" max="100" step="1" required>
        </div>

        <div class="form-field">
          <label class="form-label" for="cal-weight">Вага, кг</label>
          <input id="cal-weight" v-model.number="weight" class="form-control"
                 type="number" min="30" max="300" step="0.1" required>
        </div>

        <div class="form-field">
          <label class="form-label" for="cal-height">Зріст, см</label>
          <input id="cal-height" v-model.number="height" class="form-control"
                 type="number" min="100" max="250" step="1" required>
        </div>

        <div class="form-field">
          <label class="form-label" for="cal-activity">Активність</label>
          <select id="cal-activity" v-model="activity" class="form-control">
            <option v-for="item in ACTIVITY_LEVELS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="cal-goal">Мета</label>
          <select id="cal-goal" v-model="goal" class="form-control">
            <option v-for="item in GOALS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="profileError" class="load-error" role="alert">{{ profileError }}</p>

      <div class="form-actions">
        <button class="button" type="submit">Розрахувати норму</button>
        <p class="user-message" role="status">{{ profileMessage }}</p>
      </div>
    </form>

    <div v-if="norm" class="result-box">
      <p class="result-main">Ваша норма: {{ norm.kcal }} ккал на день</p>
      <p class="result-note">
        Базовий обмін речовин: {{ norm.bmr }} ккал. Орієнтовна норма БЖВ:
        білки {{ norm.protein }} г, жири {{ norm.fat }} г, вуглеводи {{ norm.carbs }} г.
      </p>
    </div>
    <p v-else class="state-message">Розрахуйте норму, щоб бачити залишок калорій.</p>

    <h2 class="subsection-title">2. Мій день</h2>

    <form class="request-form card" @submit.prevent="addEntry">
      <div class="calc-grid">
        <div class="form-field">
          <label class="form-label" for="diary-recipe">Страва</label>
          <select id="diary-recipe" v-model="recipeId" class="form-control">
            <option value="">Оберіть страву</option>
            <option v-for="item in store.items" :key="item.id" :value="item.id">
              {{ item.title }} — {{ item.kcal }} ккал
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="diary-meal">Прийом їжі</label>
          <select id="diary-meal" v-model="meal" class="form-control">
            <option v-for="item in MEALS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="diary-portions">Кількість порцій</label>
          <select id="diary-portions" v-model="portions" class="form-control">
            <option v-for="item in PORTION_OPTIONS" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="diaryError" class="load-error" role="alert">{{ diaryError }}</p>

      <div class="form-actions">
        <button class="button" type="submit">Додати до мого дня</button>
      </div>
    </form>

    <div v-for="item in byMeal" :key="item.key" class="diary-meal">
      <h3 class="diary-meal-title">
        {{ item.name }}
        <span class="diary-meal-total">{{ round(item.kcal) }} ккал</span>
      </h3>

      <p v-if="item.rows.length === 0" class="result-note">Поки нічого не додано.</p>
      <ul v-else class="diary-list">
        <li v-for="row in item.rows" :key="row.id" class="diary-row">
          <p class="diary-row-text">
            {{ row.recipe.title }}
            <span class="result-note">
              ({{ row.portions }} × {{ row.recipe.portion }})
            </span>
          </p>
          <strong>{{ round(row.kcal) }} ккал</strong>
          <button class="delete-button" type="button"
                  :aria-label="`Прибрати зі щоденника: ${row.recipe.title}`"
                  @click="store.removeDiaryEntry(row.id)">
            Прибрати
          </button>
        </li>
      </ul>
    </div>

    <h2 class="subsection-title">3. Підсумок за день</h2>

    <div class="result-box" aria-live="polite">
      <p class="result-main">З’їдено: {{ round(eaten.kcal) }} ккал</p>

      <template v-if="norm">
        <progress class="progress" :class="{ 'is-over': isOver }"
                  :value="Math.min(eaten.kcal, norm.kcal)" :max="norm.kcal"
                  aria-label="Скільки калорій із добової норми вже набрано">
          {{ round(eaten.kcal) }} із {{ norm.kcal }}
        </progress>
        <p :class="isOver ? 'is-over-norm' : 'is-ok'">
          <template v-if="isOver">Понад норму на {{ round(-remaining) }} ккал.</template>
          <template v-else>Залишилось {{ round(remaining) }} ккал із {{ norm.kcal }}.</template>
        </p>
      </template>
      <p v-else class="result-note">Розрахуйте норму, щоб порівняти з нею.</p>
    </div>

    <div class="compare-wrapper">
      <table class="compare-table">
        <caption class="visually-hidden">З’їдене порівняно з нормою</caption>
        <thead>
          <tr>
            <th scope="col">Показник</th>
            <th scope="col">З’їдено</th>
            <th scope="col">Норма</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in summaryRows" :key="row.key">
            <th scope="row">{{ row.name }}</th>
            <td>{{ round(row.eaten) }} {{ row.unit }}</td>
            <td>{{ row.norm !== undefined ? `${row.norm} ${row.unit}` : '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="button button-small page-action" type="button"
            @click="store.clearDiary()">
      Очистити день
    </button>
  </div>
</template>