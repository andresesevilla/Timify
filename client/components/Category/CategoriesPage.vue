<template>
  <main class="columns">
    <div class="column">
      <div style="display:flex; flexDirection: column; align-items:center; marginBottom: 1.5em"> 
        <h3>Manage Categories</h3>
        <h4>Edit a category name, or delete it and remove all related logs.</h4>
      </div>
      <ManageCategoriesComponent
      class="column manage-categories"
      @update-categories="fetchEntries"
      />
    </div>
    <div class="column">
      <div style="display:flex; flexDirection: column; align-items:center"> 
        <h3>Time spent by categories in hours</h3>


        <div class="date-picker-container">
          <span>Choose dates:</span>
          <b-datepicker
            placeholder="Click to select..."
            v-model="dates"
            range />

        </div>
        
      </div>
      <h3 class="chart-empty" v-if="this.categories.length === 0">No time entries in this range.</h3>
      <FrappeChart
        class="column"
        :type="'pie'"
        :width="500"
        :height="500"
        ref="chart"
      />
    </div>
  </main>
</template>

<script>
import ManageCategoriesComponent from "./ManageCategoriesComponent";
import FrappeChart from "@/components/Visualization/FrappeChart.vue";

export default {
  name: "CategoriesPage",
  components: { ManageCategoriesComponent, FrappeChart },
  data() {
    return {
      updateChart: 0,
      categories: [],
      showWeekNumber: false,
      startDateSelected: null,
      endDateSelected: null,
      selected: null,
      dates: []
    };
  },
  computed: {
    thisMonday() {
      // get monday of current week
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(today.setDate(diff));
    },
    thisSunday() {
      // get sunday of current week
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day == 0 ? 0 : 7);
      return new Date(today.setDate(diff));
    }
  },
  mounted() {
    this.dates = [this.thisMonday, this.thisSunday];
    this.fetchEntries();
  },
  methods: {
    fetchEntries() {
      const start = this.dates[0].toISOString(),
        end = this.dates[1].toISOString();
      fetch(`/api/entries?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((entries) => {
          const categories = {};
          entries.forEach((entry) => {
            // calculate time spent for the category given start and end date in hours
            const timeSpentHours =
              (new Date(entry.end) - new Date(entry.start)) / 1000 / 60 / 60;
            if (entry.category in categories) {
              categories[entry.category] += timeSpentHours;
            } else {
              categories[entry.category] = timeSpentHours;
            }
          });
          this.categories = Object.keys(categories);
          this.$refs.chart.update({
            labels: Object.keys(categories),
            datasets: [
              {
                name: "Time spent by categories",
                values: Object.values(categories),
              },
            ],
          });
        });
    },
    clearDate () {
      this.selected = null
    },
  },
  watch: {
    dates() {
      this.fetchEntries();
    }
  },
};
</script>

<style scoped>
.manage-categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.chart-empty {
  display: flex;
  justify-content: center;
  margin-top: 1em;
}

.date-picker {
  width: 200px;
}

.date-picker-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  margin: 1em 0;
}
</style>