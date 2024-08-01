<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">X</button>

      <div class="tabs">
        <button
            v-for="(project, index) in projects"
            :key="index"
            @click="selectedProjectIndex = index"
            :class="{ active: selectedProjectIndex === index }"
        >
          {{ project.name }}
        </button>
      </div>

      <div v-if="projects[selectedProjectIndex]">
        <table>
          <thead>
          <tr>
            <th></th>
            <th v-for="(category, index) in projects[selectedProjectIndex].header.categories" :key="category.name"
                :colspan="category?.isColumnVisible ? 2 : 0">
              {{ category.name }}
            </th>
          </tr>
          <tr>
            <th></th>
            <th v-for="label in projects[selectedProjectIndex].header.labels" :key="label">
              {{ label }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, rowIndex) in projects[selectedProjectIndex].table" :key="rowIndex">
            <td :colspan="isSpecialRow(row) ? projects[selectedProjectIndex].header.labels.length + 1 : 1">
              {{ row[0] }}
            </td>
            <td v-if="!isSpecialRow(row)" v-for="(cell, cellIndex) in row.slice(1)" :key="cellIndex">
              {{ cell }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  projects: Array
});

const emit = defineEmits(['closeModal']);

const selectedProjectIndex = ref(0);
const isSpecialRow = (row) => {
  return row[0] === 'Отдельные виды работ';
};

watch(() => props.projects, (newProjects) => {
  if (newProjects && newProjects.length > 0) {
    selectedProjectIndex.value = 0;
  }
});

const closeModal = () => {
  emit('closeModal');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 1;
  background: #f00;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 5px 10px;
  cursor: pointer;
}

.tabs {
  margin-bottom: 10px;
}

.tabs button {
  margin-right: 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f4f4f4;
  cursor: pointer;
}

.tabs button.active {
  background: #ddd; /* Цвет фона активной вкладки */
  font-weight: bold; /* Жирный текст для активной вкладки */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

tr td {
  &:first-child {
    text-align: left;
    width: 10%;
  }
}

th {
  background-color: #f4f4f4;
}
</style>
