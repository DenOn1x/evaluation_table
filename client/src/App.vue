<template>
  <div class="container">
    <ControlComponent/>
    <div class="grade-table">
      <SummaryTableComponent/>
      <TableComponent/>
    </div>
  </div>
</template>

<script setup>
import SummaryTableComponent from './components/SummaryTableComponent.vue';
import ControlComponent from './components/ControlComponent.vue';
import TableComponent from './components/TableComponent.vue';

</script>

<style>
*,
*::before,
*::after,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1440px;
  margin: auto;
  padding: 0 15px;
}
</style>
