<template>
  <thead>
  <tr>
    <th></th>
    <th v-for="(category, index) in jsonData?.header?.categories" :key="category.name"
        :colspan="category?.isColumnVisible || index === 0 ? 2 : 2">

      {{ category.name }}
      <button @click="clearColumn(category)" class="clear-column">0</button>
      <button @click="hideColumn(category)" class="hide-column">-</button>
    </th>
  </tr>
  <tr>
    <th></th>
    <th v-for="label in jsonData?.header?.labels" :key="label">
      {{ label }}
    </th>
  </tr>
  </thead>
</template>

<script setup>
import {ref, defineProps, computed, watch} from 'vue';

const props = defineProps(['jsonData']);
const jsonData = ref(props.jsonData);

const visibleCategories = computed(() => {
  return jsonData.value?.header?.categories.filter(category => category.isColumnVisible) || [];
});

const visibleCategoriesToClear = computed(() => {
  return jsonData.value?.header?.categories.filter(category => category.isColumnVisible).map(category => ({...category})) || [];
});

const hideColumn = (category) => {
  const categoryIndex = jsonData.value?.header?.categories.indexOf(category);

  if (categoryIndex !== undefined && categoryIndex !== -1) {
    const startIndex = categoryIndex + 1;

    if (visibleCategories.value.length > 1) {
      jsonData.value.header.categories[categoryIndex].isColumnVisible = !jsonData.value.header.categories[categoryIndex].isColumnVisible;

      if (!jsonData.value.header.categories[categoryIndex].isColumnVisible) {
        jsonData.value.header.categories.splice(categoryIndex, 1);

        jsonData.value.table.forEach(row => {
          row.splice(startIndex, 2);
        });

        jsonData.value.header.labels.splice(startIndex, 2);
        jsonData.value.table.forEach(row => {
          row.splice(startIndex, 0);
        });
      }
    }
  }

  jsonData.value.header.categories = [...jsonData.value.header.categories];
  jsonData.value.header.labels = [...jsonData.value.header.labels];
  jsonData.value.table = [...jsonData.value.table];
};


const clearColumn = (category) => {
  const categoryIndex = jsonData.value?.header?.categories.findIndex(cat => cat.name === category.name);

  if (categoryIndex !== undefined && categoryIndex !== -1) {
    const startIndex = categoryIndex * 2 + 1;
    jsonData.value.header.categories[categoryIndex].clickCount = (jsonData.value.header.categories[categoryIndex].clickCount || 0) + 1;

    if (jsonData.value.header.categories[categoryIndex].clickCount >= 1) {
      jsonData.value.table.forEach((row, rowIndex) => {
        if (rowIndex) {
          jsonData.value.table[rowIndex][startIndex] = '';
          jsonData.value.table[rowIndex][startIndex + 1] = '';
        }
      });

      jsonData.value.table[0][startIndex] = '';
      jsonData.value.table[0][startIndex + 1] = '';
    }
  }
}


watch(() => props.jsonData, (newVal) => {
  jsonData.value = newVal;
});

</script>


<style scoped>


table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.hide-column {
  border: none;
  background: #b5b5ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.clear-column {
  border: none;
  background: #dc3333;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

</style>
