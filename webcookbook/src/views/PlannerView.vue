<script setup>
import { computed, reactive } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { WEEK_DAYS } from '../utils/weekdays.js'
import DataState from '../components/DataState.vue'

const store = useRecipesStore()

// Вибраний у списку рецепт для кожного дня (рядок, порожній — нічого не вибрано)
const selected = reactive(Object.fromEntries(WEEK_DAYS.map((day) => [day.key, ''])))

const days = computed(() =>
  WEEK_DAYS.map((day) => {
    const ids = store.plan[day.key]
    const items = ids.map((id) => store.itemById(id)).filter(Boolean)

    return {
      ...day,
      items,
      kcal: items.reduce((sum, item) => sum + item.kcal, 0),
      time: items.reduce((sum, item) => sum + item.time, 0),
      options: store.items.filter((item) => !ids.includes(item.id)),
    }
  })
)

const totalKcal = computed(() => days.value.reduce((sum, day) => sum + day.kcal, 0))
const totalMinutes = computed(() => days.value.reduce((sum, day) => sum + day.time, 0))
const averageKcal = computed(() => Math.round(totalKcal.value / WEEK_DAYS.length))

function formatTime(minutes) {
  return `${Math.floor(minutes / 60)} год ${minutes % 60} хв`
}

function addItem(dayKey) {
  if (selected[dayKey] === '') {
    return
  }

  store.addPlanItem(dayKey, Number(selected[dayKey]))
  selected[dayKey] = ''
}

// Порівняння дня з добовою нормою (якщо її розраховано)
function normText(kcal) {
  const norm = store.dailyNorm

  if (!norm || kcal === 0) {
    return ''
  }

  const diff = Math.round(kcal - norm.kcal)

  return diff > 0
    ? `Понад норму на ${diff} ккал`
    : `У межах норми, запас ${-diff} ккал`
}
</script>

<template>
  <section>
    <h1 class="page-title">Меню на тиждень</h1>
    <p class="section-text">
      Додайте до кожного дня кілька страв. Калорії рахуються на одну порцію кожної
      страви. Меню зберігається у вашому браузері.
    </p>

    <DataState>
      <p v-if="store.dailyNorm" class="results-count">
        Ваша добова норма: {{ store.dailyNorm.kcal }} ккал.
      </p>
      <p v-else class="results-count">
        Щоб порівнювати дні з нормою, розрахуйте її в розділі
        <RouterLink :to="{ name: 'calculator' }">«Кулінарний калькулятор»</RouterLink>.
      </p>

      <div class="planner-grid">
        <article v-for="day in days" :key="day.key" class="card planner-day-card">
          <h2 class="card-title">{{ day.name }}</h2>

          <p v-if="day.items.length === 0" class="result-note">Страв ще не додано.</p>
          <ul v-else class="diary-list">
            <li v-for="item in day.items" :key="item.id" class="diary-row">
              <p class="diary-row-text">
                {{ item.title }}
                <span class="result-note">({{ item.kcal }} ккал, {{ item.time }} хв)</span>
              </p>
              <button class="delete-button" type="button"
                      :aria-label="`Прибрати з дня ${day.name}: ${item.title}`"
                      @click="store.removePlanItem(day.key, item.id)">
                Прибрати
              </button>
            </li>
          </ul>

          <div class="planner-add">
            <label class="visually-hidden" :for="`plan-${day.key}`">
              Додати страву: {{ day.name }}
            </label>
            <select :id="`plan-${day.key}`" v-model="selected[day.key]" class="form-control">
              <option value="">Оберіть страву</option>
              <option v-for="item in day.options" :key="item.id" :value="item.id">
                {{ item.title }} — {{ item.kcal }} ккал
              </option>
            </select>
            <button class="button button-small" type="button" @click="addItem(day.key)">
              Додати
            </button>
          </div>

          <p class="planner-total">
            Разом: {{ Math.round(day.kcal) }} ккал, {{ formatTime(day.time) }}
          </p>
          <p v-if="normText(day.kcal)"
             :class="day.kcal > (store.dailyNorm?.kcal ?? Infinity) ? 'is-over-norm' : 'is-ok'">
            {{ normText(day.kcal) }}
          </p>
        </article>
      </div>

      <div class="result-box" aria-live="polite">
        <p class="result-main">За тиждень: {{ Math.round(totalKcal) }} ккал</p>
        <p class="result-note">
          У середньому {{ averageKcal }} ккал на день. Загальний час приготування:
          {{ formatTime(totalMinutes) }}.
        </p>
      </div>

      <button class="button button-small" type="button" @click="store.clearPlan()">
        Очистити меню
      </button>
    </DataState>
  </section>
</template>