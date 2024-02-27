<template>
  <div class="control-buttons">
    <div class="control-buttons__table">
      <button class="btn save-btn" @click="saveTable">Сохранить таблицу</button>
      <button class="btn load-btn" @click="loadTable">Загрузить таблицу</button>
    </div>
    <button class="btn pdf-btn" @click="generatePDF">Сгенерировать PDF</button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const jsonData = ref(null);

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8080/data');
    if (!response.ok) {
      throw new Error('Failed to fetch data from server');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const saveDataToServer = async (tableData) => {
  try {
    console.log('Data to be sent to server:', tableData);
    const response = await fetch('http://localhost:8080/data/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({table: tableData})
    });

    if (!response.ok) {
      throw new Error('Failed to save data on the server');
    }

    const responseData = await response.json();
    console.log('Data saved successfully:', responseData);
  } catch (error) {
    console.error('Error while sending data to server:', error.message);
  }
};

onMounted(async () => {
  jsonData.value = await fetchData();
});

const saveTable = async () => {
  if (jsonData.value) {
    await saveDataToServer(jsonData.value);
  } else {
    console.error('No data to save');
  }
};

const loadTable = () => {
};

const generatePDF = () => {
  const element = document.querySelector('.grade-table');

  html2canvas(element, {scale: 5}).then((canvas) => {
    const imgData = canvas.toDataURL('image/JPEG');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save('grade-table.pdf');
  });
};
</script>

<style scoped>
.control-buttons {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 24px 0;
}

.control-buttons__table {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.btn {
  width: 280px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2px 0;
}
</style>
