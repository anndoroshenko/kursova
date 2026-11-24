// Адресу можна перевизначити у локальному .env через VITE_API_URL
export const API_URL =
  import.meta.env.VITE_API_URL ||
  `${import.meta.env.BASE_URL}data/recipes.json`