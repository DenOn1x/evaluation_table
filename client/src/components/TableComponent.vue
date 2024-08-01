<template>
  <div v-if="jsonData && jsonData.table && jsonData.table.length">
    <table class="table-body">
      <HeaderComponent :jsonData="jsonData" />
      <tbody>
      <tr v-for="(row, rowIndex) in jsonData.table" :key="rowIndex" :class="{ 'total-row': isTotalRow(rowIndex) }">
        <template v-if="row[0] !== 'Отдельные виды работ'">
          <td>{{ row[0] }}</td>
          <td
              v-for="(cell, cellIndex) in row.slice(1)"
              :key="cellIndex"
              :class="{ 'price': isTotalRow(rowIndex) && (cellIndex % 2 !== 0), 'time': isTotalRow(rowIndex) && (cellIndex % 2 === 0) }"
          >
            <input
                type="text"
                :value="isTotalRow(rowIndex) ? getColumnSumInTotalRow(cellIndex + 1) : cell"
                @input="updateCellValue(rowIndex, cellIndex + 1, $event)"
            />
          </td>
        </template>
        <template v-else>
          <td class="table-head" colspan="13">Отдельные виды работ</td>
          <button @click="openAddRowBeforeSpecialRowModal" class="add-row">+</button>
        </template>
      </tr>
      </tbody>
    </table>
    <button @click="openAddRowModal" class="add-row">+</button>

    <ModalAddRowComponent
        :isOpen="isAddRowModalOpen"
        @addRow="addRow"
        modal-header-text="Введите вид работы"
        buttonText="Добавить поле"
    />
    <ModalAddRowComponent
        :isOpen="isAddRowBeforeSpecialRowModal"
        @addRowBeforeSpecialRow="addRowBeforeSpecialRow"
        :specialRow="true"
        modal-header-text="Введите название страницы"
        buttonText="Добавить поле"
    />
  </div>
  <div v-else>
    <p>Загрузите таблицу</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import HeaderComponent from './HeaderComponent';
import ModalAddRowComponent from './ModalAddRowComponent';

const props = defineProps({
  jsonData: Object
});

const isAddRowModalOpen = ref(false);
const isAddRowBeforeSpecialRowModal = ref(false);
const store = useStore();

const resetTotalRow = () => {
  if (props.jsonData && props.jsonData.table) {
    props.jsonData.table.forEach((row, rowIndex) => {
      if (isTotalRow(rowIndex)) {
        row.forEach((cell, cellIndex) => {
          if (cellIndex !== 0) {
            row[cellIndex] = '';
          }
        });
      }
    });
  }
};

const updateCellValue = (rowIndex, cellIndex, event) => {
  if (props.jsonData && props.jsonData.table && props.jsonData.table[rowIndex]) {
    const row = props.jsonData.table[rowIndex];
    const updatedRow = [...row];
    updatedRow[cellIndex] = event.target.value;
    props.jsonData.table[rowIndex] = updatedRow;

    updateTotalTime();
    updateTotalPrice();
  }
};

const isTotalRow = (rowIndex) => {
  return props.jsonData?.table[rowIndex]?.[0] === 'Итого';
};

const getColumnSumInTotalRow = (columnIndex) => {
  if (props.jsonData && props.jsonData.table) {
    return props.jsonData.table.reduce((sum, row) => sum + parseFloat(row[columnIndex] || 0), 0);
  }
  return 0;
};

const updateTotalTime = () => {
  let sum = 0;
  if (props.jsonData && props.jsonData.table) {
    props.jsonData.table.forEach(row => {
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
  if (props.jsonData && props.jsonData.table) {
    props.jsonData.table.forEach(row => {
      row.forEach((cell, index) => {
        if (index % 2 === 0 && index !== 0 && !isNaN(parseFloat(cell))) {
          sum += parseFloat(cell);
        }
      });
    });
  }
  store.commit('updateTotalPrice', sum);
};

const addRow = (newRowName) => {
  if (props.jsonData && props.jsonData.table) {
    const newRow = [newRowName, ...Array(props.jsonData.table[0].length - 1).fill('')];
    props.jsonData.table.push(newRow);
  }
};

const addRowBeforeSpecialRow = (newRowName) => {
  if (props.jsonData && props.jsonData.table) {
    const specialRowIndex = props.jsonData.table.findIndex(row => row[0] === 'Отдельные виды работ');
    if (specialRowIndex !== -1) {
      const newRow = [newRowName, ...Array(props.jsonData.table[0].length - 1).fill('')];
      props.jsonData.table.splice(specialRowIndex, 0, newRow);
    }
  }
};

const openAddRowModal = () => {
  isAddRowModalOpen.value = true;
};

const closeAddRowModal = () => {
  isAddRowModalOpen.value = false;
};

const openAddRowBeforeSpecialRowModal = () => {
  isAddRowBeforeSpecialRowModal.value = true;
};

const closeAddRowBeforeSpecialRowModal = () => {
  isAddRowBeforeSpecialRowModal.value = false;
};

watch(() => props.jsonData, (newValue) => {
  console.log('jsonData updated:', newValue);
  resetTotalRow();
  updateTotalTime();
  updateTotalPrice();
});

window.addEventListener('addRow', (event) => {
  addRow(event.detail);
  closeAddRowModal();
});
window.addEventListener('addRowBeforeSpecialRow', (event) => {
  addRowBeforeSpecialRow(event.detail);
  closeAddRowBeforeSpecialRowModal();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

.table-head {
  background: #e7e7e7;
  font-weight: 700;
}

table tbody tr:first-child {
  background: #e7e7e7;
  pointer-events: none;
}

table tbody tr:first-child td:first-child {
  font-weight: 700;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 16px;
  white-space: nowrap;
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
}

.add-row {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  background: none;
  border: none;
  z-index: 1;
  font-size: 22px;
  cursor: pointer;
  opacity: 0;
  margin-top: -10px;
}

.add-row:hover {
  opacity: 1;
}
</style>
