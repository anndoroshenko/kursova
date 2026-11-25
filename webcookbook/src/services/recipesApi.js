import { API_URL } from '../config/api.js'
import { CATEGORY_NAMES } from '../utils/categories.js'

const ALLOWED_CATEGORIES = Object.keys(CATEGORY_NAMES)

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function isStringList(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
}

function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

// Дозволено лише локальні шляхи на зразок "images/recipes/pngn1.png".
function isLocalImagePath(path) {
  return (
    isNonEmptyString(path) &&
    !/^([a-z][a-z0-9+.-]*:|\/)/i.test(path) &&
    !path.includes('..')
  )
}

function validateRecipes(data) {
  const seenIds = new Set()

  data.forEach((item, index) => {
    const label = `Запис №${index + 1}`

    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`${label}: очікується об’єкт`)
    }
    if (!Number.isInteger(item.id) || item.id <= 0) {
      throw new Error(`${label}: id має бути додатним цілим числом`)
    }
    if (seenIds.has(item.id)) {
      throw new Error(`${label}: id ${item.id} повторюється`)
    }
    seenIds.add(item.id)

    if (!isNonEmptyString(item.title)) {
      throw new Error(`${label}: title має бути непорожнім рядком`)
    }
    if (!ALLOWED_CATEGORIES.includes(item.category)) {
      throw new Error(`${label}: недопустима категорія "${item.category}"`)
    }
    if (!isNonEmptyString(item.description)) {
      throw new Error(`${label}: description має бути непорожнім рядком`)
    }
    if (!isLocalImagePath(item.image)) {
      throw new Error(`${label}: image має бути локальним шляхом`)
    }
    if (!isNonNegativeNumber(item.time)) {
      throw new Error(`${label}: time має бути невід’ємним числом`)
    }
    if (!isNonEmptyString(item.portion)) {
      throw new Error(`${label}: portion має бути непорожнім рядком`)
    }
    if (!isNonNegativeNumber(item.kcal) || item.kcal === 0) {
      throw new Error(`${label}: kcal має бути додатним числом`)
    }
    if (
      !isNonNegativeNumber(item.protein) ||
      !isNonNegativeNumber(item.fat) ||
      !isNonNegativeNumber(item.carbs)
    ) {
      throw new Error(`${label}: protein, fat і carbs мають бути невід’ємними числами`)
    }
    if (!isStringList(item.ingredients)) {
      throw new Error(`${label}: ingredients має бути непорожнім списком рядків`)
    }
    if (!isStringList(item.steps)) {
      throw new Error(`${label}: steps має бути непорожнім списком рядків`)
    }
  })
}

// Нормалізація: компоненти працюють лише з внутрішньою схемою
function normalizeRecipe(raw) {
  return {
    id: raw.id,
    title: raw.title.trim(),
    category: raw.category,
    description: raw.description.trim(),
    image: `${import.meta.env.BASE_URL}${raw.image}`,
    time: raw.time,
    portion: raw.portion.trim(),
    kcal: raw.kcal,
    protein: raw.protein,
    fat: raw.fat,
    carbs: raw.carbs,
    ingredients: raw.ingredients,
    steps: raw.steps,
  }
}

export async function fetchRecipes() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Очікується масив об’єктів')
  }

  validateRecipes(data)

  return data.map(normalizeRecipe)
}