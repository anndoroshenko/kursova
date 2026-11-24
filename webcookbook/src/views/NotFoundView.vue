<template>
  <section>
    <h1 class="page-title">Сторінку не знайдено</h1>
    <p class="section-text">Такої адреси на сайті немає.</p>
    <RouterLink class="button" :to="{ name: 'home' }">До каталогу рецептів</RouterLink>
  </section>
</template>