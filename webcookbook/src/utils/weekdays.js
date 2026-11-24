export const WEEK_DAYS = [
  { key: 'mon', name: 'Понеділок' },
  { key: 'tue', name: 'Вівторок' },
  { key: 'wed', name: 'Середа' },
  { key: 'thu', name: 'Четвер' },
  { key: 'fri', name: 'П’ятниця' },
  { key: 'sat', name: 'Субота' },
  { key: 'sun', name: 'Неділя' },
]

// Порожнє меню: для кожного дня id рецепта або null
export function createEmptyPlan() {
  return Object.fromEntries(WEEK_DAYS.map((day) => [day.key, null]))
}