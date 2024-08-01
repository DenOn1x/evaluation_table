<template>
  <div class="container">
    <ControlComponent
        @loadTable="loadTable"
        @saveTable="saveTable"
        @addToFavorites="addToFavorites"
        @openExportModal="openExportModal"
        @fetchAllProjects="fetchAllProjects"
    />
    <div class="grade-table">
      <SummaryTableComponent/>
      <TableComponent :jsonData="jsonData"/>
    </div>
    <ModalComponent
        :isOpen="isExportModalOpen"
        :projects="favoriteTables"
        @closeModal="closeExportModal"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import ControlComponent from './components/ControlComponent.vue';
import SummaryTableComponent from './components/SummaryTableComponent.vue';
import TableComponent from './components/TableComponent.vue';
import ModalComponent from './components/ModalComponent.vue';

const jsonData = ref(null);
const isExportModalOpen = ref(false);
const modalData = ref({projects: []});
const favoriteTables = ref([]);

const loadTable = async () => {
  try {
    const response = await fetch('http://localhost:8000/data');
    if (!response.ok) {
      throw new Error('Failed to load table data');
    }
    jsonData.value = await response.json();
    console.log('Table data loaded:', jsonData.value);
  } catch (error) {
    console.error('Error fetching table data:', error);
  }
};

const saveTable = async () => {
  if (jsonData.value) {
    try {
      console.log('Saving table data:', jsonData.value);

      const tableData = [];
      const separateWorksData = [];
      let inSeparateWorksSection = false;

      const categories = jsonData.value.header.categories.map((cat, index) => ({
        ...cat,
        index
      }));

      jsonData.value.table.forEach((row, rowIndex) => {
        console.log(`Processing row ${rowIndex}:`, row);

        if (row[0] === 'Отдельные виды работ') {
          inSeparateWorksSection = true;
        } else {
          for (let i = 1; i < row.length; i += 2) {
            const hoursCell = document.querySelector(`.table-body tr:nth-child(${rowIndex + 1}) td:nth-child(${i + 1}) input`);
            const priceCell = document.querySelector(`.table-body tr:nth-child(${rowIndex + 1}) td:nth-child(${i + 2}) input`);

            const hoursRaw = hoursCell ? hoursCell.value : row[i];
            const priceRaw = priceCell ? priceCell.value : row[i + 1];
            const hours = hoursRaw !== undefined && hoursRaw !== null && hoursRaw !== '' ? parseInt(hoursRaw, 10) : null;
            const price = priceRaw !== undefined && priceRaw !== null && priceRaw !== '' ? parseFloat(priceRaw) : null;

            console.log(`Row ${rowIndex}, Cell ${i}: hoursRaw=${hoursRaw}, hours=${hours}, priceRaw=${priceRaw}, price=${price}`);

            const rowData = {
              name: row[0] || '',
              hours,
              price,
              categoryId: Math.floor((i - 1) / 2)
            };

            console.log('Row object:', rowData);

            if (inSeparateWorksSection) {
              separateWorksData.push(rowData);
            } else {
              tableData.push(rowData);
            }
          }
        }
      });

      console.log('Final Table Data:', tableData);
      console.log('Final Separate Works Data:', separateWorksData);

      const filteredTableData = tableData.filter((row, index, self) =>
              index === self.findIndex((r) => (
                  r.name === row.name && r.categoryId === row.categoryId
              ))
      );

      const filteredSeparateWorksData = separateWorksData.filter((row, index, self) =>
              index === self.findIndex((r) => (
                  r.name === row.name && r.categoryId === row.categoryId
              ))
      );

      console.log('Filtered Table Data:', filteredTableData);
      console.log('Filtered Separate Works Data:', filteredSeparateWorksData);

      const response = await fetch('http://localhost:8000/data/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tableData: filteredTableData, separateWorksData: filteredSeparateWorksData})
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save data on the server: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Data saved successfully:', responseData);
    } catch (error) {
      console.error('Error saving table data:', error);
    }
  } else {
    console.error('No data to save');
  }
};

const addToFavorites = async () => {
  try {
    // Fetch the project name from dataResult.json
    const response = await fetch('./dataResult.json');
    if (!response.ok) {
      throw new Error('Failed to load project name');
    }
    const dataResult = await response.json();
    console.log('Data Result:', dataResult); // Debugging line
    const projectName = dataResult.summaryTable[0].projectName;
    console.log('Project Name:', projectName); // Debugging line

    if (!projectName) {
      throw new Error('Project name is not available');
    }

    if (jsonData.value) {
      // Save the favorite with the fetched project name
      const saveResponse = await fetch('http://localhost:8000/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: projectName,
          header: jsonData.value.header,
          table: jsonData.value.table
        })
      });
      console.log(jsonData.value)
      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        throw new Error(`Failed to save favorite: ${errorText}`);
      }

    } else {
      console.error('No data to add to favorites');
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

const fetchAllProjects = async () => {
  try {
    const response = await fetch('http://localhost:8000/favorites');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const projects = await response.json();
    favoriteTables.value = projects;
    openExportModal();
  } catch (error) {
    console.error('Error fetching all projects:', error);
  }
};

const openExportModal = async () => {
  isExportModalOpen.value = true;
};

const closeExportModal = () => {
  isExportModalOpen.value = false;
};
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

.grade-table {
  position: relative;
}
</style>
