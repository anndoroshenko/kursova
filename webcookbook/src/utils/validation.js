import { CATEGORY_NAMES } from './categories.js'

// Перевірка полів власного рецепта. Використовується і для даних форми,
// і для даних, відновлених із localStorage.
export function isValidUserFields(title, category, description) {
  if (
    typeof title !== 'string' ||
    typeof category !== 'string' ||
    typeof description !== 'string'
  ) {
    return false
  }

  const trimmedTitle = title.trim()
  const trimmedDescription = description.trim()

  return (
    trimmedTitle.length >= 3 &&
    trimmedTitle.length <= 80 &&
    trimmedDescription.length >= 10 &&
    trimmedDescription.length <= 500 &&
    Object.keys(CATEGORY_NAMES).includes(category)
  )
}