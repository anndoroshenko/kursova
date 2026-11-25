<script setup>
import { computed, ref, watch } from 'vue'
import {
  PRODUCTS, BULK_PRODUCTS, LIQUID_PRODUCTS, VESSELS, FILLS,
  gramsPerVessel, formatApprox, formatNumber,
} from '../utils/units.js'

const mode = ref('toVessel')
const productKey = ref('flour')
const vesselKey = ref('glass')
const fillKey = ref('full')
const amount = ref(200)

const product = computed(() => PRODUCTS.find((item) => item.key === productKey.value))
const vessel = computed(() => VESSELS.find((item) => item.key === vesselKey.value))
const fill = computed(() => FILLS.find((item) => item.key === fillKey.value))

// «З гіркою» доступне лише для сипких продуктів
const availableFills = computed(() =>
  FILLS.filter((item) => !item.bulkOnly || product.value.bulk)
)

watch(availableFills, (list) => {
  if (!list.some((item) => item.key === fillKey.value)) {
    fillKey.value = 'full'
  }
})

const isValid = computed(
  () =>
    typeof amount.value === 'number' &&
    Number.isFinite(amount.value) &&
    amount.value > 0 &&
    amount.value <= 100000
)

// Скільки грамів міститься в одній одиниці вибраного посуду
const perVessel = computed(() => gramsPerVessel(product.value, vessel.value, fill.value))

const result = computed(() =>
  mode.value === 'toVessel'
    ? amount.value / perVessel.value
    : amount.value * perVessel.value
)

// Таблиця для всіх видів посуду одразу
const rows = computed(() =>
  VESSELS.map((item) => {
    const grams = gramsPerVessel(product.value, item, fill.value)
    const value = mode.value === 'toVessel' ? amount.value / grams : amount.value * grams

    return { key: item.key, name: item.name, ml: item.ml, grams, value }
  })
)
</script>

<template>
  <div class="calc-panel">
    <p class="section-text">
      Переведіть грами у ложки та склянки й навпаки. Значення наближені:
      густина продукту залежить від ущільнення та вологості.
    </p>

    <fieldset class="calc-fieldset">
      <legend class="calc-legend">Напрям розрахунку</legend>
      <div class="calc-radios">
        <div class="choice">
          <input id="mode-to-vessel" v-model="mode" type="radio" name="mode" value="toVessel">
          <label for="mode-to-vessel">Грами → посуд</label>
        </div>
        <div class="choice">
          <input id="mode-to-grams" v-model="mode" type="radio" name="mode" value="toGrams">
          <label for="mode-to-grams">Посуд → грами</label>
        </div>
      </div>
    </fieldset>

    <div class="calc-grid">
      <div class="form-field">
        <label class="form-label" for="unit-product">Продукт</label>
        <select id="unit-product" v-model="productKey" class="form-control">
          <optgroup label="Сипкі продукти">
            <option v-for="item in BULK_PRODUCTS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </optgroup>
          <optgroup label="Рідкі та густі продукти">
            <option v-for="item in LIQUID_PRODUCTS" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label" for="unit-amount">
          {{ mode === 'toVessel' ? 'Кількість, г' : 'Кількість посуду, шт.' }}
        </label>
        <input id="unit-amount" v-model.number="amount" class="form-control"
               type="number" min="0" step="any" inputmode="decimal">
      </div>

      <div class="form-field">
        <label class="form-label" for="unit-vessel">Посуд</label>
        <select id="unit-vessel" v-model="vesselKey" class="form-control">
          <option v-for="item in VESSELS" :key="item.key" :value="item.key">
            {{ item.name }} ({{ item.ml }} мл)
          </option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label" for="unit-fill">Наповнення</label>
        <select id="unit-fill" v-model="fillKey" class="form-control">
          <option v-for="item in availableFills" :key="item.key" :value="item.key">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <p v-if="!isValid" class="load-error" role="alert">
      Введіть додатне число не більше 100000.
    </p>

    <template v-else>
      <div class="result-box" aria-live="polite">
        <p v-if="mode === 'toVessel'" class="result-main">
          ≈ {{ formatApprox(result) }} × {{ vessel.name.toLowerCase() }}
        </p>
        <p v-else class="result-main">≈ {{ formatNumber(result) }} г</p>

        <p class="result-note" v-if="mode === 'toVessel'">
          Точніше: {{ formatNumber(result) }}. Наповнення: {{ fill.name.toLowerCase() }}.
          В одному посуді приблизно {{ formatNumber(perVessel) }} г.
        </p>
        <p class="result-note" v-else>
          {{ formatNumber(amount) }} × {{ vessel.name.toLowerCase() }}
          ({{ fill.name.toLowerCase() }}). В одному посуді приблизно
          {{ formatNumber(perVessel) }} г.
        </p>
      </div>

      <h2 class="subsection-title">У всіх видах посуду</h2>
      <div class="compare-wrapper">
        <table class="compare-table">
          <caption class="visually-hidden">Розрахунок для всіх видів посуду</caption>
          <thead>
            <tr>
              <th scope="col">Посуд</th>
              <th scope="col">1 шт., г</th>
              <th scope="col">{{ mode === 'toVessel' ? 'Потрібно, шт.' : 'Разом, г' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.key">
              <th scope="row">{{ row.name }} ({{ row.ml }} мл)</th>
              <td>{{ formatNumber(row.grams) }}</td>
              <td>
                {{ mode === 'toVessel' ? formatApprox(row.value) : formatNumber(row.value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>