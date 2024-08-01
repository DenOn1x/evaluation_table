<template>
  <div class="control-buttons">
    <div class="control-buttons__table">
      <button class="btn load-btn" @click="emitLoadTable">Загрузить таблицу</button>
      <button class="btn save-btn" @click="emitSaveTable">Сохранить таблицу</button>
      <button class="btn favorite-btn" @click="emitAddToFavorites">Добавить в избранное</button>
      <button class="btn export-btn" @click="emitFetchAllProjects">Все проекты</button>
    </div>
    <div class="control-buttons__table">
      <button class="btn pdf-btn" @click="generatePDF">Сгенерировать PDF</button>
      <button class="btn excel-btn" @click="exportToExcel">Экспорт в Excel</button>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, nextTick} from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const emit = defineEmits(['saveTable', 'loadTable', 'openExportModal', 'fetchAllProjects', 'addToFavorites']);

const emitSaveTable = () => {
  emit('saveTable');
};

const emitLoadTable = () => {
  emit('loadTable');
};

const generatePDF = () => {
  const element = document.querySelector('.grade-table');
  if (element) {
    html2canvas(element, {scale: 5}).then((canvas) => {
      const imgData = canvas.toDataURL('image/JPEG');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.save('grade-table.pdf');
    });
  } else {
    console.error('Table element not found for PDF generation.');
  }
};

const exportToExcel = async () => {
  await nextTick();
  const table = document.querySelector('.table-body');
  if (table) {
    const headers = Array.from(table.querySelectorAll('thead tr')).map(row =>
        Array.from(row.querySelectorAll('th')).map(th => th.innerText)
    ).flat();

    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
        Array.from(row.querySelectorAll('td')).map(td => {
          const input = td.querySelector('input');
          return input ? input.value : td.innerText;
        })
    );

    const data = [headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table-data.xlsx');
  } else {
    console.error('Table element not found for Excel export.');
  }
};

const emitFetchAllProjects = () => {
  emit('fetchAllProjects');
};

const emitAddToFavorites = () => {
  emit('addToFavorites');
};

</script>

<style scoped>
.control-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  margin: 24px 0;
}

.control-buttons__table {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.btn {
  width: 100%;
  max-width: 280px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2px 0;
}
</style>
