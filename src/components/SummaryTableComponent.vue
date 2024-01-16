<template>
  <div v-if="jsonData">
    <table class="summary-table">
      <tbody>
      <tr>
        <td>Название проекта</td>
        <td><input v-model="jsonData.summaryTable[0].projectName"/></td>
      </tr>
      <tr>
        <td>Расчетная стоимость 1 часа, руб</td>
        <td><input v-model="jsonData.summaryTable[0].hourlyRate"/></td>
      </tr>
      <tr>
        <td>Суммарное количество часов</td>
        <td>{{ jsonData.summaryTable[0]?.totalHours || '-' }}</td>
      </tr>
      <tr>
        <td>Итоговая цена</td>
        <td class="total-sum">{{ totalSum || '-' }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';

const jsonData = ref(null);

onMounted(() => {
  fetchData();
});

const fetchData = () => {
  fetch('./dataResult.json')
      .then((response) => response.json())
      .then((data) => {
        jsonData.value = data;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
};

watch(() => jsonData.value, () => {
  updateTotalSum();
});

const updateTotalSum = () => {
  const totalRow = jsonData.value?.summaryTable?.find((row) => row[0] === 'Итого');
  if (totalRow) {
    jsonData.value.summaryTable[0].totalPrice = totalRow[1];
  }
};

</script>

<style scoped>
.summary-table {
  margin-bottom: 24px;
  border-collapse: collapse;
}

td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 16px;
  white-space: nowrap;
}

td:last-child {
  text-align: center;
}

input {
  display: flex;
  align-content: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  outline: none;
  background: none;
  border: none;
  box-sizing: border-box;
  color: #b5b5ff;
}

</style>
