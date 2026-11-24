import { isValidUserFields } from './validation.js'
import { WEEK_DAYS, createEmptyPlan } from './weekdays.js'

// Ключі localStorage
const KEY = 'yummyspace:my-recipes:v1'
const FAVORITES_KEY = 'yummyspace:favorites:v1'
const VIEWED_KEY = 'yummyspace:viewed:v1'
const SHOPPING_KEY = 'yummyspace:shopping:v1'
const PLAN_KEY = 'yummyspace:plan:v1'

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
// JSON може бути синтаксично правильним, але мати неправильну структуру,
// тому дані зі сховища перевіряються так само, як дані форми.
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

// ---------- Меню на тиждень ----------
function isPlan(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return (
    Object.keys(value).length === WEEK_DAYS.length &&
    WEEK_DAYS.every((day) => {
      const id = value[day.key]
      return id === null || (Number.isInteger(id) && id > 0)
    })
  )
}

export function readPlan() {
  return readStored(PLAN_KEY, isPlan, createEmptyPlan(), 'Некоректне меню на тиждень')
}

export function writePlan(plan) {
  writeStored(PLAN_KEY, plan)
}