<template>
  <div :class="{ 'modal-add-row': true, 'visible': isOpen }">
    <div class="modal-wrapper">
      <div class="modal-header">
        <button class="modal-close" @click="closeModal">&#9587;</button>
      </div>
      <div class="modal-content">
        <div class="modal-item-text">{{ modalHeaderText }}</div>
        <input v-model="newRowName"/>
        <button @click="handleAddRow">{{ buttonText }}</button>
      </div>
    </div>
  </div>


</template>

<script setup>
import {ref, defineProps} from 'vue';

const {isOpen, buttonText, specialRow} = defineProps(['isOpen', 'buttonText', 'modalHeaderText', 'specialRow']);
const newRowName = ref('');


const handleAddRow = () => {
  if (newRowName.value.trim() !== '') {
    if (specialRow) {
      window.dispatchEvent(new CustomEvent('addRowBeforeSpecialRow', {detail: newRowName.value}));
    } else {
      window.dispatchEvent(new CustomEvent('addRow', {detail: newRowName.value}));
    }
    newRowName.value = '';
  }
};


</script>

<style scoped>

.modal-add-row {
  display: none;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
}

.visible {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  background-color: #FFF;
  padding: 16px;
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
  box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
  border-radius: 0 12px 0 0;
}

.modal-close {
  background: none;
  border: none;
  display: block;
  margin-left: auto;
  margin-bottom: 12px;
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.modal-item-text {
  font-size: 18px;
  color: #000;
  margin-bottom: 24px;
}

.modal-content input {
  padding: 6px 12px;
  border-radius: 6px;
  outline: none;
  width: 100%;
  font-size: 18px;
  color: #000;
  margin-bottom: 12px;
}

.modal-content button {
  background: #e7e7e7;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  border: none;
  cursor: pointer;
}

</style>