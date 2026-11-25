import { isValidUserFields } from './validation.js'
import { WEEK_DAYS, createEmptyPlan } from './weekdays.js'
import { MEALS, isValidProfile } from './calories.js'

// Ключі localStorage (меню на тиждень змінило формат, тому ключ v2)
const KEY = 'yummyspace:my-recipes:v1'
const FAVORITES_KEY = 'yummyspace:favorites:v1'
const VIEWED_KEY = 'yummyspace:viewed:v1'
const SHOPPING_KEY = 'yummyspace:shopping:v1'
const PLAN_KEY = 'yummyspace:plan:v2'
const PROFILE_KEY = 'yummyspace:calorie-profile:v1'
const DIARY_KEY = 'yummyspace:diary:v1'

// Спільне читання: немає ключа — запасне значення, некоректні дані — помилка.
function readStored(key, isValid, fallback, errorText) {
  const raw = localStorage.getItem(key)

  if (raw === null) {
    return fallback
  }

  const value = JSON.parse(raw)

  if (!isValid(value)) {
    throw new Error(errorText)
  }

  return value
}

function writeStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ---------- Власні рецепти ----------
function isUserItems(value) {
  if (!Array.isArray(value)) {
    return false
  }

  const ids = new Set()

  return value.every((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return false
    }

    if (
      typeof item.id !== 'string' ||
      !item.id.startsWith('user-') ||
      item.id.length <= 5 ||
      ids.has(item.id)
    ) {
      return false
    }

    if (!isValidUserFields(item.title, item.category, item.description)) {
      return false
    }

    ids.add(item.id)
    return true
  })
}

export function readUserItems() {
  return readStored(KEY, isUserItems, [], 'Некоректні записи')
}

export function writeUserItems(items) {
  writeStored(KEY, items)
}

// ---------- Списки id (обране, історія): унікальні додатні цілі ----------
function isIdList(value) {
  return (
    Array.isArray(value) &&
    value.every((id) => Number.isInteger(id) && id > 0) &&
    new Set(value).size === value.length
  )
}

export function readFavoriteIds() {
  return readStored(FAVORITES_KEY, isIdList, [], 'Некоректний список обраного')
}

export function writeFavoriteIds(ids) {
  writeStored(FAVORITES_KEY, ids)
}

export function readViewedIds() {
  return readStored(VIEWED_KEY, isIdList, [], 'Некоректна історія переглядів')
}

export function writeViewedIds(ids) {
  writeStored(VIEWED_KEY, ids)
}

// ---------- Список покупок ----------
function isShoppingItems(value) {
  if (!Array.isArray(value)) {
    return false
  }

  const ids = new Set()

  return value.every((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return false
    }

    if (
      typeof item.id !== 'string' ||
      !item.id.startsWith('shop-') ||
      ids.has(item.id)
    ) {
      return false
    }

    if (
      typeof item.text !== 'string' ||
      item.text.trim() === '' ||
      item.text.length > 200
    ) {
      return false
    }

    if (typeof item.done !== 'boolean') {
      return false
    }

    ids.add(item.id)
    return true
  })
}

export function readShoppingItems() {
  return readStored(SHOPPING_KEY, isShoppingItems, [], 'Некоректний список покупок')
}

export function writeShoppingItems(items) {
  writeStored(SHOPPING_KEY, items)
}

// ---------- Меню на тиждень: для кожного дня список id ----------
function isPlan(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return (
    Object.keys(value).length === WEEK_DAYS.length &&
    WEEK_DAYS.every((day) => isIdList(value[day.key]) && value[day.key].length <= 10)
  )
}

export function readPlan() {
  return readStored(PLAN_KEY, isPlan, createEmptyPlan(), 'Некоректне меню на тиждень')
}

export function writePlan(plan) {
  writeStored(PLAN_KEY, plan)
}

// ---------- Профіль для розрахунку норми калорій ----------
export function readProfile() {
  return readStored(PROFILE_KEY, isValidProfile, null, 'Некоректний профіль')
}

export function writeProfile(profile) {
  writeStored(PROFILE_KEY, profile)
}

// ---------- Щоденник харчування ----------
const MEAL_KEYS = MEALS.map((meal) => meal.key)

function isDiary(value) {
  if (!Array.isArray(value)) {
    return false
  }

  const ids = new Set()

  return value.every((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return false
    }

    if (
      typeof entry.id !== 'string' ||
      !entry.id.startsWith('log-') ||
      ids.has(entry.id)
    ) {
      return false
    }

    if (!Number.isInteger(entry.recipeId) || entry.recipeId <= 0) {
      return false
    }

    if (!MEAL_KEYS.includes(entry.meal)) {
      return false
    }

    if (
      typeof entry.portions !== 'number' ||
      !Number.isFinite(entry.portions) ||
      entry.portions < 0.5 ||
      entry.portions > 20
    ) {
      return false
    }

    ids.add(entry.id)
    return true
  })
}

export function readDiary() {
  return readStored(DIARY_KEY, isDiary, [], 'Некоректний щоденник харчування')
}

export function writeDiary(entries) {
  writeStored(DIARY_KEY, entries)
}