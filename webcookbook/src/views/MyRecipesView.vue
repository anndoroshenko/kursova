<script setup>
import { ref } from 'vue'
import { readUserItems, writeUserItems } from '../utils/storage.js'
import UserRecipeForm from '../components/UserRecipeForm.vue'
import UserRecipeCard from '../components/UserRecipeCard.vue'

const message = ref('')

// Відновлення даних перед першим показом. Після читання нічого не
// записуємо: порожній масив не повинен затерти пошкоджені дані.
let restored = []
try {
  restored = readUserItems()
} catch (error) {
  message.value = 'Не вдалося відновити записи. Список почато в пам’яті.'
  console.error(error)
}

const userItems = ref(restored)

// Спільна зміна списку: пам'ять, інтерфейс, потім запис у сховище.
function commit(nextItems) {
  userItems.value = nextItems

  try {
    writeUserItems(nextItems)
    return true
  } catch (error) {
    message.value = 'Зміни є в пам’яті, але не збережені після закриття сторінки.'
    console.error(error)
    return false
  }
}

function addUserItem(item) {
  if (commit([...userItems.value, item])) {
    message.value = 'Рецепт додано й збережено.'
  }
}

function deleteUserItem(id) {
  if (commit(userItems.value.filter((item) => item.id !== id))) {
    message.value = 'Рецепт видалено й зміни збережено.'
  }
}
</script>

<template>
  <section>
    <h1 class="page-title">Мої рецепти</h1>
    <p class="section-text">
      Додайте рецепти, які вам сподобалися або які ви хочете спробувати.
      Записи зберігаються у вашому браузері.
    </p>

    <UserRecipeForm @add="addUserItem" />

    <p class="user-message" role="status">{{ message }}</p>

    <h2 class="subsection-title">Збережені рецепти</h2>

    <p v-if="userItems.length === 0" class="empty-message">
      Власних рецептів поки немає.
    </p>
    <div v-else class="user-list">
      <UserRecipeCard v-for="item in userItems" :key="item.id" :item="item"
                      @delete="deleteUserItem" />
    </div>
  </section>
</template>