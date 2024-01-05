<template>
  <thead>
  <tr>
    <th></th>
    <th v-for="category in visibleCategories" :key="category.name" :colspan="2">
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
  const categoryIndex = jsonData.value?.header?.categories.indexOf(category);

  if (categoryIndex !== undefined && categoryIndex !== -1) {
    const startIndex = categoryIndex * 2 + 2;

    jsonData.value.header.categories[categoryIndex].isColumnVisible = true;

    jsonData.value.table.forEach(row => {
      row.splice(startIndex, 2, null, null);
    });

    jsonData.value.header.labels.splice(startIndex, 2, null, null);
  }

  jsonData.value.header.categories = [...jsonData.value.header.categories];
  jsonData.value.header.labels = [...jsonData.value.header.labels];
  jsonData.value.table = [...jsonData.value.table];
};


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
