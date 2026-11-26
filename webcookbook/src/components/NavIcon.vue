<script setup>
// Прості контурні іконки 24×24. Колір береться з currentColor.
const ICONS = {
  about: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M12 11v5',
    'M12 7.5h.01',
  ],
  recipes: [
    'M12 6v14',
    'M12 6C10.5 4.8 8 4 4 4v14c4 0 6.5.8 8 2',
    'M12 6c1.5-1.2 4-2 8-2v14c-4 0-6.5.8-8 2',
  ],
  categories: [
    'M4.5 4h5v5h-5z',
    'M14.5 4h5v5h-5z',
    'M4.5 14h5v5h-5z',
    'M14.5 14h5v5h-5z',
  ],
  quick: [
    'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
    'M12 9v4l2.5 2',
    'M9.5 2h5',
  ],
  ingredient: [
    'M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z',
    'M16 16l5 5',
  ],
  random: [
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'M8 8h.01',
    'M16 8h.01',
    'M12 12h.01',
    'M8 16h.01',
    'M16 16h.01',
  ],
  calculator: [
    'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M8 7h8',
    'M8.5 12h.01',
    'M12 12h.01',
    'M15.5 12h.01',
    'M8.5 16h.01',
    'M12 16h.01',
    'M15.5 16h.01',
  ],
  favorites: [
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z',
  ],
  mine: [
    'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  ],
  shopping: [
    'M1 2h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 7H6',
    'M9.5 21h.01',
    'M19.5 21h.01',
  ],
  planner: [
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    'M16 2v4',
    'M8 2v4',
    'M3 10h18',
  ],
  compare: [
    'M3 8h16',
    'M15 4l4 4-4 4',
    'M21 16H5',
    'M9 12l-4 4 4 4',
  ],
  history: [
    'M3 12a9 9 0 1 0 2.6-6.4L3 8',
    'M3 3v5h5',
    'M12 7v5l3 2',
  ],
}

defineProps({ name: { type: String, required: true } })
</script>

<template>
  <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
      <path v-for="(d, index) in ICONS[name]" :key="index" :d="d" />
    </g>
  </svg>
</template>