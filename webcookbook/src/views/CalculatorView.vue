<script setup>
import { ref } from 'vue'
import DataState from '../components/DataState.vue'
import UnitConverter from '../components/UnitConverter.vue'
import CalorieCalculator from '../components/CalorieCalculator.vue'

const tab = ref('units')
</script>

<template>
  <section>
    <h1 class="page-title">Кулінарний калькулятор</h1>

    <div class="tabs" role="group" aria-label="Вибір калькулятора">
      <button class="tab-button" type="button"
              :class="{ 'is-active': tab === 'units' }"
              :aria-pressed="tab === 'units'"
              @click="tab = 'units'">
        Міри та вага
      </button>
      <button class="tab-button" type="button"
              :class="{ 'is-active': tab === 'calories' }"
              :aria-pressed="tab === 'calories'"
              @click="tab = 'calories'">
        Калорії
      </button>
    </div>

    <UnitConverter v-if="tab === 'units'" />

    <DataState v-else>
      <CalorieCalculator />
    </DataState>
  </section>
</template>