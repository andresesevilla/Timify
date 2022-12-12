<template>
  <main class="columns">
    <div class="column">
      <div style="display:flex; flexDirection: column; align-items:center; marginBottom: 24px"> 
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
        <h3>Time spent by categories</h3>
        <h4>
          from {{this.currentStart.toLocaleDateString()}} to
          {{this.currentEnd.toLocaleDateString()}}
        </h4>
        <div style="display:flex; margin-top: 1em">
          <b-datepicker
              v-model="startDateSelected"
              :locale="locale"
              placeholder="Start Date"
              icon="calendar-today"
              :icon-right="selected ? 'close-circle' : ''"
              icon-right-clickable
              @icon-right-click="clearDate"
              trap-focus
              class="date-picker"
              >
          </b-datepicker>
          <b-datepicker
                v-model="endDateSelected"
                :locale="locale"
                placeholder="End Date"
                icon="calendar-today"
                :icon-right="selected ? 'close-circle' : ''"
                icon-right-clickable
                @icon-right-click="clearDate"
                trap-focus
                class="date-picker"
                style="margin: 0" 
                >
          </b-datepicker>
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
      locale: undefined, // Browser locale
      startDateSelected: null,
      endDateSelected: null,
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
    },
    currentStart() {
      return this.startDateSelected || this.thisMonday;
    },
    currentEnd() {
      return this.endDateSelected || this.thisSunday;
    },
  },
  mounted() {
    // make this referesh when the date range changes
    this.$watch(
      () => [this.currentStart, this.currentEnd],
      () => {
        this.fetchEntries();
      },
      { deep: true }
    );
    this.fetchEntries();
  },
  methods: {
    fetchEntries() {
      const start = this.currentStart.toISOString(),
        end = this.currentEnd.toISOString();
      console.log('FETCHING ENTRIES', start, end)
      fetch(`/api/entries?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((entries) => {
          console.log('ENTRIES', entries)
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
  margin-right: 1em;
}
</style>