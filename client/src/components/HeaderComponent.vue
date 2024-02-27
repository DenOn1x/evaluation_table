<template>
  <thead>
  <tr>
    <th></th>
    <th v-for="(category, index) in jsonData?.header?.categories" :key="category.name"
        :colspan="category?.isColumnVisible || index === 0 ? 2 : 2">

      {{ category.name }}
      <button @click="clearColumn(category)" class="clear-column">&#xae;</button>
      <button @click="hideColumn(category)"
              :class="{ 'hide-column': true, 'button-disabled': isLastHideColumn(category) }">
        &#x2613;
      </button>
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
import {useStore} from 'vuex';


const props = defineProps(['jsonData']);
const jsonData = ref(props.jsonData);
const store = useStore();


const visibleCategories = computed(() => {
  return jsonData.value?.header?.categories.filter(category => category.isColumnVisible) || [];
});

const hideColumn = (category) => {
  const categoryIndex = jsonData.value?.header?.categories.indexOf(category);

  if (categoryIndex !== undefined && categoryIndex !== -1) {
    const startIndex = categoryIndex * 2 + 1;
    const remainingVisibleCategories = visibleCategories.value.length - 1; // количество видимых столбцов после скрытия текущего

    if (visibleCategories.value.length > 2 && remainingVisibleCategories > 1) {
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

        updateCells();
        updateTotalTime();
        updateTotalPrice();
      }
    }
  }

  jsonData.value.header.categories = [...jsonData.value.header.categories];
  jsonData.value.header.labels = [...jsonData.value.header.labels];
  jsonData.value.table = [...jsonData.value.table];
};

const isLastHideColumn = () => visibleCategories.value.length <= 2;


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
      updateCells();
      updateTotalTime();
      updateTotalPrice();

    }
  }
}

const updateCells = () => {
  jsonData.value.table.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (rowIndex > 0 && cellIndex % 2 !== 0) {
        const columnIndex = (cellIndex - 2) / 2;
        const dataCellIndex = columnIndex * 2 + 1;

        if (!jsonData.value.table[0][dataCellIndex] === '') {
          jsonData.value.table[rowIndex][cellIndex] = '';
        }
      }
    });
  });
};


const updateTotalTime = () => {
  let sum = 0;
  if (jsonData.value && jsonData.value.table) {
    jsonData.value.table.forEach(row => {
      row.forEach((cell, index) => {
        if (index % 2 !== 0 && !isNaN(parseFloat(cell))) {
          sum += parseFloat(cell);
        }
      });
    });
  }
  store.commit('updateTotalTime', sum);
};

const updateTotalPrice = () => {
  let sum = 0;
  if (jsonData.value && jsonData.value.table) {
    jsonData.value.table.forEach(row => {
      row.forEach((cell, index) => {
        if (index % 2 === 0 && index !== 0 && !isNaN(parseFloat(cell))) {
          sum += parseFloat(cell);
        }
      });
    });
  }
  store.commit('updateTotalPrice', sum);
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
  min-width: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.clear-column {
  border: none;
  background: #d0ff00;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.button-disabled {
  background: #dc3333;
}

</style>
