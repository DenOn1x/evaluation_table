<template>
  <div>
    <SummaryTableComponent/>
    <TableComponent/>
  </div>
</template>

<script setup>
import SummaryTableComponent from './components/SummaryTableComponent.vue';
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
</style>
