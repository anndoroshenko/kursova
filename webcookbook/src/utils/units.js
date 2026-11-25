// Густина продуктів у г/мл. Значення наближені й залежать від ущільнення.
// bulk: true — сипкий продукт, для якого доречне «з гіркою».
export const PRODUCTS = [
  { key: 'flour', name: 'Борошно пшеничне', density: 0.53, bulk: true },
  { key: 'sugar', name: 'Цукор-пісок', density: 0.85, bulk: true },
  { key: 'powder', name: 'Цукрова пудра', density: 0.56, bulk: true },
  { key: 'salt', name: 'Сіль кухонна', density: 1.2, bulk: true },
  { key: 'rice', name: 'Рис', density: 0.8, bulk: true },
  { key: 'buckwheat', name: 'Гречана крупа', density: 0.72, bulk: true },
  { key: 'millet', name: 'Пшоно', density: 0.8, bulk: true },
  { key: 'semolina', name: 'Манна крупа', density: 0.8, bulk: true },
  { key: 'oats', name: 'Вівсяні пластівці', density: 0.3, bulk: true },
  { key: 'starch', name: 'Картопляний крохмаль', density: 0.65, bulk: true },
  { key: 'cocoa', name: 'Какао-порошок', density: 0.45, bulk: true },
  { key: 'soda', name: 'Харчова сода', density: 1.3, bulk: true },
  { key: 'yeast', name: 'Сухі дріжджі', density: 0.6, bulk: true },
  { key: 'cinnamon', name: 'Мелена кориця', density: 0.45, bulk: true },
  { key: 'raisins', name: 'Родзинки', density: 0.65, bulk: true },
  { key: 'oil', name: 'Олія соняшникова', density: 0.92, bulk: false },
  { key: 'butter', name: 'Вершкове масло (м’яке)', density: 0.91, bulk: false },
  { key: 'milk', name: 'Молоко', density: 1.03, bulk: false },
  { key: 'water', name: 'Вода', density: 1, bulk: false },
  { key: 'kefir', name: 'Кефір', density: 1.03, bulk: false },
  { key: 'cream', name: 'Сметана', density: 1, bulk: false },
  { key: 'honey', name: 'Мед', density: 1.4, bulk: false },
  { key: 'tomato', name: 'Томатна паста', density: 1.1, bulk: false },
  { key: 'vinegar', name: 'Оцет', density: 1, bulk: false },
  { key: 'curd', name: 'Сир кисломолочний', density: 0.95, bulk: false },
]

export const BULK_PRODUCTS = PRODUCTS.filter((product) => product.bulk)
export const LIQUID_PRODUCTS = PRODUCTS.filter((product) => !product.bulk)

// Посуд і об’єм у мілілітрах
export const VESSELS = [
  { key: 'tsp', name: 'Чайна ложка', ml: 5 },
  { key: 'dsp', name: 'Десертна ложка', ml: 10 },
  { key: 'tbsp', name: 'Столова ложка', ml: 15 },
  { key: 'shot', name: 'Чарка', ml: 50 },
  { key: 'coffee', name: 'Кавова чашка', ml: 100 },
  { key: 'faceted', name: 'Гранчаста склянка', ml: 200 },
  { key: 'glass', name: 'Склянка', ml: 250 },
  { key: 'mug', name: 'Кухоль', ml: 500 },
]

// Наповнення посуду; «з гіркою» доступне лише для сипких продуктів
export const FILLS = [
  { key: 'full', name: 'Повна, без гірки', factor: 1, bulkOnly: false },
  { key: 'heap', name: 'З гіркою', factor: 1.3, bulkOnly: true },
  { key: 'half', name: 'Половина', factor: 0.5, bulkOnly: false },
  { key: 'third', name: 'Третина', factor: 1 / 3, bulkOnly: false },
  { key: 'quarter', name: 'Чверть', factor: 0.25, bulkOnly: false },
]

// Скільки грамів продукту вміщує одна одиниця посуду з потрібним наповненням
export function gramsPerVessel(product, vessel, fill) {
  return vessel.ml * fill.factor * product.density
}

export function formatNumber(value) {
  return value.toLocaleString('uk-UA', { maximumFractionDigits: 1 })
}

// Округлення до чверті: 1 ½, 2 ¾, менше ¼
export function formatApprox(value) {
  const quarters = Math.round(value * 4)

  if (quarters === 0) {
    return 'менше ¼'
  }

  const whole = Math.floor(quarters / 4)
  const part = ['', '¼', '½', '¾'][quarters % 4]

  return [whole > 0 ? String(whole) : '', part].filter(Boolean).join(' ')
}