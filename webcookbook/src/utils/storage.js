import { isValidUserFields } from './validation.js'

// Ключі localStorage
const KEY = 'yummyspace:my-recipes:v1'
const FAVORITES_KEY = 'yummyspace:favorites:v1'

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

// Якщо ключа немає, повертає []. Некоректні дані призводять до помилки.
export function readUserItems() {
  const raw = localStorage.getItem(KEY)

  if (raw === null) {
    return []
  }

  const value = JSON.parse(raw)

  if (!isUserItems(value)) {
    throw new Error('Некоректні записи')
  }

  return value
}

export function writeUserItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

// Обране: масив унікальних додатних цілих id
function isFavoriteIds(value) {
  return (
    Array.isArray(value) &&
    value.every((id) => Number.isInteger(id) && id > 0) &&
    new Set(value).size === value.length
  )
}

export function readFavoriteIds() {
  const raw = localStorage.getItem(FAVORITES_KEY)

  if (raw === null) {
    return []
  }

  const value = JSON.parse(raw)

  if (!isFavoriteIds(value)) {
    throw new Error('Некоректний список обраного')
  }

  return value
}

export function writeFavoriteIds(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}
