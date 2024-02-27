<template>
  <div :class="{ 'modal': true, 'visible': isOpen }">
    <div class="modal-wrapper">
      <button class="modal-close" @click="closeModal">&#9587;</button>
      <div class="modal-content">
        <div v-if="modalContent.length === 0">
          No data fetched
        </div>
        <div v-else>
          <div class="modal-field"
               v-for="(item, index) in toRaw(modalContent)" :key="index">
            <div class="modal-item">{{ item?.name }}</div>
            <div class="modal-item" @click="selectValue(item?.hour)">{{ item?.hour }}</div>
            <div class="modal-item" @click="selectValue(item?.price)">{{ item?.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, toRaw, defineProps, defineEmits} from 'vue';

const {isOpen} = defineProps(['isOpen']);
const emit = defineEmits();

const modalContent = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('./dataModal.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    modalContent.value = data.values;
    // console.log(data.values)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const closeModal = () => {
  emit('closeModal');
};

const selectValue = (value) => {
  emit('selectValue', value);
  closeModal();
};

onMounted(() => {
  fetchData();
});

</script>

<style scoped>
.modal {
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

.modal-close {
  background: none;
  border: none;
  display: block;
  margin-left: auto;
  margin-bottom: 12px;
  cursor: pointer;
}

.modal-wrapper {
  background-color: #FFF;
  padding: 16px;
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
  position: absolute;
  bottom: 0;
  left: 0;
  box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
  border-radius: 0 12px 0 0;
}

.modal-field {
  display: flex;
  align-items: center;
}

.modal-field:not(:last-child) {
  margin-bottom: 12px;
}

.modal-item {
  flex: 0 0 33.3%;
  text-align: center;
}

.modal-item:first-child {
  pointer-events: none;
}

.modal-item:not(:first-child) {
  cursor: pointer;
}

</style>
