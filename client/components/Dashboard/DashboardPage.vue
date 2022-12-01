<template>
    <main>
      <header>
        <h1>{{selectedView!="Select View" ? `My Time ${selectedView}` : 'My Time'}}</h1>

        <b-dropdown aria-role="list"
        v-model="selectedView"
        >
          <template #trigger="{ active }">
              <b-button
                  :label="selectedView"
                  type="is-primary"
                  :icon-right="active ? 'menu-up' : 'menu-down'" />
          </template>


          <b-dropdown-item aria-role="listitem" value="by Category">By Category</b-dropdown-item>
          <b-dropdown-item aria-role="listitem" value="by Goal">By Goal</b-dropdown-item>
          <b-dropdown-item aria-role="listitem" value="by Week">By Week</b-dropdown-item>
          <b-dropdown-item aria-role="listitem" value="versus Friends">Versus Friends</b-dropdown-item>
        </b-dropdown>
      </header>
      
      <DoughnutChart 
      title="My Progress by Category"
      style="padding-left: 64px; padding-right: 64px; padding-top: 32px; padding-bottom: 32px;"
      v-if="selectedView=='by Category'" />

    </main>
  </template>
  
  <script>
  import ManageCategoriesComponent from "../Category/ManageCategoriesComponent";
  // import BarChart from "../Dashboard/BarChart";
  import DoughnutChart from "../Dashboard/DoughnutChart";
  

  export default {
    name: "DashboardPage",
    components: { DoughnutChart },
    data() {
      return {
        filterName: "by Category",
        selectedView: "Select View",
      };
    }
  };
  </script>

  <style scoped>
    h1 {
      color: #2c3e50;
    }
    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-left: 64px;
      padding-right: 64px;
    }
  </style>