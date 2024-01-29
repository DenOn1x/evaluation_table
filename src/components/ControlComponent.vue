<template>
  <div class="control-buttons">
    <div class="control-buttons__table">
      <button
          class="btn save-btn"
          @click="saveTable">Сохранить таблицу
      </button>
      <button
          class="btn load-btn"
          @click="loadTable">Загрузить таблицу
      </button>
    </div>
    <button
        class="btn pdf-btn"
        @click="generatePDF">Сгенерировать PDF
    </button>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const saveTable = () => {

};

const loadTable = () => {

};


const generatePDF = () => {
  const element = document.querySelector('.grade-table');

  html2canvas(element, {
    scale: 5
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/JPEG');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save('grade-table.pdf');
  });

}
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
