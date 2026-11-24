<script setup>
import { computed } from 'vue'
import { useRecipesStore } from '../stores/recipes.js'
import { WEEK_DAYS } from '../utils/weekdays.js'
import DataState from '../components/DataState.vue'

const store = useRecipesStore()

// Загальний час приготування за тиждень (у хвилинах)
const totalMinutes = computed(() =>
  WEEK_DAYS.reduce((sum, day) => {
    const item = store.itemById(store.plan[day.key])
    return sum + (item ? item.time : 0)
  }, 0)
)

const totalText = computed(
  () => `${Math.floor(totalMinutes.value / 60)} год ${totalMinutes.value % 60} хв`
)
</script>

<template>
  <section>
    <h1 class="page-title">Меню на тиждень</h1>
    <p class="section-text">
      Оберіть рецепт для кожного дня. Меню зберігається у вашому браузері.
    </p>

    <DataState>
      <ul class="planner-list">
        <li v-for="day in WEEK_DAYS" :key="day.key" class="planner-row">
          <label class="planner-day" :for="`plan-${day.key}`">{{ day.name }}</label>
          <select :id="`plan-${day.key}`" class="form-control"
                  :value="store.plan[day.key] ?? ''"
                  @change="store.setPlanDay(day.key, $event.target.value)">
            <option value="">Не вибрано</option>
            <option v-for="item in store.items" :key="item.id" :value="item.id">
              {{ item.title }} ({{ item.time }} хв)
            </option>
          </select>
        </li>
      </ul>

      <p class="results-count" aria-live="polite">
        Загальний час приготування за тиждень: {{ totalText }}
      </p>

      <button class="button button-small" type="button" @click="store.clearPlan()">
        Очистити меню
      </button>
    </DataState>
  </section>
</template>