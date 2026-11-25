export const SEX_OPTIONS = [
  { key: 'female', name: 'Жінка', offset: -161 },
  { key: 'male', name: 'Чоловік', offset: 5 },
]

export const ACTIVITY_LEVELS = [
  { key: 'none', name: 'Сидячий спосіб життя', factor: 1.2 },
  { key: 'light', name: 'Легка активність (1–3 тренування на тиждень)', factor: 1.375 },
  { key: 'medium', name: 'Помірна активність (3–5 тренувань на тиждень)', factor: 1.55 },
  { key: 'high', name: 'Висока активність (6–7 тренувань на тиждень)', factor: 1.725 },
]

export const GOALS = [
  { key: 'lose', name: 'Схуднути', factor: 0.85 },
  { key: 'keep', name: 'Підтримувати вагу', factor: 1 },
  { key: 'gain', name: 'Набрати вагу', factor: 1.15 },
]

export const MEALS = [
  { key: 'breakfast', name: 'Сніданок' },
  { key: 'lunch', name: 'Обід' },
  { key: 'dinner', name: 'Вечеря' },
  { key: 'snack', name: 'Перекус' },
]

export function createDefaultProfile() {
  return {
    sex: 'female',
    age: 25,
    weight: 60,
    height: 165,
    activity: 'light',
    goal: 'keep',
  }
}

function inRange(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max
}

export function isValidProfile(profile) {
  return (
    !!profile &&
    typeof profile === 'object' &&
    SEX_OPTIONS.some((item) => item.key === profile.sex) &&
    ACTIVITY_LEVELS.some((item) => item.key === profile.activity) &&
    GOALS.some((item) => item.key === profile.goal) &&
    inRange(profile.age, 14, 100) &&
    inRange(profile.weight, 30, 300) &&
    inRange(profile.height, 100, 250)
  )
}

// Формула Міффліна — Сан-Жеора. Результат орієнтовний.
// Розподіл БЖВ за калоріями: 20% білки, 30% жири, 50% вуглеводи.
export function calculateNorm(profile) {
  if (!isValidProfile(profile)) {
    return null
  }

  const sex = SEX_OPTIONS.find((item) => item.key === profile.sex)
  const activity = ACTIVITY_LEVELS.find((item) => item.key === profile.activity)
  const goal = GOALS.find((item) => item.key === profile.goal)

  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + sex.offset
  const kcal = Math.round(bmr * activity.factor * goal.factor)

  return {
    bmr: Math.round(bmr),
    kcal,
    protein: Math.round((kcal * 0.2) / 4),
    fat: Math.round((kcal * 0.3) / 9),
    carbs: Math.round((kcal * 0.5) / 4),
  }
}