<template>
  <div v-if="jsonData">
    <table class="table-body">
      <HeaderComponent :jsonData="jsonData"/>
      <tbody>
      <tr v-for="(row, rowIndex) in jsonData?.table" :key="rowIndex" :class="{ 'total-row': isTotalRow(rowIndex) }">
        <template v-if="row[0] !== 'Отдельные виды работ'">
          <td>{{ row[0] }}</td>
          <td v-for="(cell, cellIndex) in row.slice(1)" :key="cellIndex"
              :class="{ 'price': isTotalRow(rowIndex) && (cellIndex % 2 !== 0), 'time': isTotalRow(rowIndex) && (cellIndex % 2 === 0) }">
            <input
                type="text"
                :value="isTotalRow(rowIndex) ? getColumnSumInTotalRow(cellIndex + 1) : cell"
                @input="updateCellValue(rowIndex, cellIndex + 1, $event)"
                @click="openModal(cell, rowIndex, cellIndex + 1)"
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
    <ModalComponent
        :modalContent="modalContent"
        :isOpen="isModalOpen"
        @closeModal="closeModal"
        @selectValue="handleValueSelection"/>
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
    <p>Loading...</p>
  </div>
</template>


<script setup>
import HeaderComponent from './HeaderComponent';
import ModalComponent from "./ModalComponent";
import ModalAddRowComponent from './ModalAddRowComponent';


import {ref, onMounted, watch, computed} from 'vue';
import {useStore} from 'vuex';


const jsonData = ref(null);
const isModalOpen = ref(false);
const modalContent = ref([]);
const selectedCellIndexes = ref([]);
const isAddRowModalOpen = ref(false);
const isAddRowBeforeSpecialRowModal = ref(false);
const store = useStore();


onMounted(() => {
  fetchData();

  window.addEventListener('addRow', (event) => {
    addRow(event.detail);
    closeAddRowModal();
  });
  window.addEventListener('addRowBeforeSpecialRow', (event) => {
    addRowBeforeSpecialRow(event.detail);
    closeAddRowBeforeSpecialRowModal();
  });

});

const fetchData = () => {
  fetch('http://localhost:8000/data')
      .then((response) => response.json())
      .then((data) => {
        jsonData.value = data;
        console.log(jsonData.value)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
};

const openModal = (rowData, rowIndex, cellIndex) => {
  selectedCellIndexes.value = [rowIndex, cellIndex];
  isModalOpen.value = true;
  modalContent.value = [rowData];
};


const closeModal = () => {
  isModalOpen.value = false;
  modalContent.value = [];
};


const openAddRowModal = () => {
  isAddRowModalOpen.value = true;
};

const closeAddRowModal = () => {
  isAddRowModalOpen.value = false;
};


const addRow = (newRowName) => {
  if (jsonData.value && jsonData.value.table) {
    const newRow = [newRowName, ...Array(jsonData.value.table[0].length - 1).fill('')];
    jsonData.value.table.push(newRow);
  }
};


const addRowBeforeSpecialRow = (newRowName) => {
  if (jsonData.value && jsonData.value.table) {
    const specialRowIndex = jsonData.value.table.findIndex(row => row[0] === 'Отдельные виды работ');
    if (specialRowIndex !== -1) {
      const newRow = [newRowName, ...Array(jsonData.value.table[0].length - 1).fill('')];
      jsonData.value.table.splice(specialRowIndex, 0, newRow);
    }
  }
};

const openAddRowBeforeSpecialRowModal = () => {
  isAddRowBeforeSpecialRowModal.value = true;
};

const closeAddRowBeforeSpecialRowModal = () => {
  isAddRowBeforeSpecialRowModal.value = false;
};

const updateCellValue = (rowIndex, cellIndex, event) => {
  if (jsonData.value && jsonData.value.table) {
    const row = jsonData.value.table[rowIndex];
    if (row) {
      const columnIndex = cellIndex;
      if (columnIndex >= 0 && columnIndex < row.length) {
        const updatedRow = [...row];
        updatedRow[columnIndex] = event.target.value;
        jsonData.value.table[rowIndex] = updatedRow;

        updateTotalTime()
        updateTotalPrice();

      } else {
        console.error('Invalid cellIndex or columnIndex is not within bounds:', cellIndex, columnIndex, row);
      }
    } else {
      console.error('Invalid row is not properly defined:', row);
    }
  } else {
    console.error('jsonData.table or row is not properly defined.');
  }
};

const handleValueSelection = (value) => {
  if (jsonData.value && selectedCellIndexes.value.length === 2) {
    const [rowIndex, cellIndex] = selectedCellIndexes.value;
    if (
        jsonData.value.table &&
        jsonData.value.table[rowIndex] &&
        jsonData.value.table[rowIndex][cellIndex] !== undefined
    ) {
      jsonData.value.table[rowIndex][cellIndex] = value;

      updateTotalTime()
      updateTotalPrice();

    } else {
      console.error('Invalid indices or jsonData.table is not properly defined.');
    }
  } else {
    console.error('Invalid selectedCellIndexes value:', selectedCellIndexes.value);
  }
};

const isTotalRow = (rowIndex) => {
  return jsonData.value?.table[rowIndex]?.[0] === 'Итого';
};

const getColumnSumInTotalRow = (columnIndex) => {
  if (jsonData.value && jsonData.value.table) {
    return jsonData.value.table.reduce((sum, row) => sum + parseFloat(row[columnIndex] || 0), 0);
  }
  return 0;
};

const updateTotalTime = () => {
  let sum = 0;
  if (jsonData.value && jsonData.value.table) {
    jsonData.value.table.forEach(row => {
      row.forEach((cell, index) => {
        if (index % 2 !== 0 && !isNaN(parseFloat(cell))) {
          // console.log(cell, cell.value)
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
