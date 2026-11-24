<script setup>
import { ref } from 'vue'
import { CATEGORY_NAMES } from '../utils/categories.js'
import { isValidUserFields } from '../utils/validation.js'

const emit = defineEmits(['add'])

const title = ref('')
const category = ref('')
const description = ref('')
const titleField = ref(null)
const error = ref('')

function submitForm() {
  const cleanTitle = title.value.trim()
  const cleanDescription = description.value.trim()

  if (!isValidUserFields(cleanTitle, category.value, cleanDescription)) {
    error.value = 'Перевірте назву, категорію й опис.'
    titleField.value.focus()
    return
  }

  error.value = ''
  emit('add', {
    id: `user-${crypto.randomUUID()}`,
    title: cleanTitle,
    category: category.value,
    description: cleanDescription,
  })

  title.value = ''
  category.value = ''
  description.value = ''
  titleField.value.focus()
}
</script>

<template>
  <form class="request-form card" @submit.prevent="submitForm">
    <div class="form-field">
      <label class="form-label" for="user-title">
        Назва рецепта <span class="required-mark" aria-hidden="true">*</span>
      </label>
      <input id="user-title" ref="titleField" v-model="title" class="form-control"
             type="text" required minlength="3" maxlength="80" autocomplete="off">
    </div>

    <div class="form-field">
      <label class="form-label" for="user-category">
        Категорія <span class="required-mark" aria-hidden="true">*</span>
      </label>
      <select id="user-category" v-model="category" class="form-control" required>
        <option value="">Оберіть категорію</option>
        <option v-for="(name, key) in CATEGORY_NAMES" :key="key" :value="key">
          {{ name }}
        </option>
      </select>
    </div>

    <div class="form-field">
      <label class="form-label" for="user-description">
        Опис <span class="required-mark" aria-hidden="true">*</span>
      </label>
      <textarea id="user-description" v-model="description" class="form-control"
                rows="4" required minlength="10" maxlength="500"
                placeholder="Склад і спосіб приготування (від 10 символів)"></textarea>
    </div>

    <p v-if="error" class="load-error" role="alert">{{ error }}</p>

    <div class="form-actions">
      <button class="button" type="submit">Додати</button>
      <p class="form-note">
        <span class="required-mark" aria-hidden="true">*</span> — обов’язкові поля
      </p>
    </div>
  </form>
</template>