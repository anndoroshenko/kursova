<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <section>
    <h1 class="page-title">Про сайт</h1>
    <p class="section-text">
      YummySpace — кулінарний довідник, у якому можна знайти рецепт за назвою,
      відфільтрувати страви за категорією та переглянути докладну інформацію.
    </p>
    <p class="section-text">
      Тут зібрано добірку простих і традиційних страв: від сніданків і перших
      страв до випічки та десертів.
    </p>

    <button class="button details-toggle" type="button"
            :aria-expanded="isOpen" aria-controls="extra-details"
            @click="isOpen = !isOpen">
      {{ isOpen ? 'Приховати' : 'Показати більше' }}
    </button>

    <div v-show="isOpen" id="extra-details" class="card extra-details">
      <h2 class="card-title">Що можна робити на сайті</h2>
      <ul class="feature-list">
        <li>Переглядати каталог рецептів у вигляді карток із фото, категорією та часом приготування.</li>
        <li>Шукати рецепт за назвою або описом.</li>
        <li>Фільтрувати страви за категорією: сніданки, перші та основні страви, випічка, десерти.</li>
        <li>Додавати власні рецепти на сторінці «Мої рецепти». Вони зберігаються у вашому браузері й не зникають після оновлення сторінки.</li>
        <li>Видаляти власні рецепти, коли вони більше не потрібні.</li>
      </ul>
    </div>
  </section>
</template>