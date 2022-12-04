<template>
  <main class="columns">
    <ManageCategoriesComponent class="column manage-categories" />
    <div class="column">
      <h3>Time spent by categories</h3>
      <FrappeChart class="column" :type="'pie'" :width="500" :height="500" :data="data" :key="updateChart" />
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
      data: {
        labels: [],
        datasets: [],
      },
      updateChart: 0,
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
  },
  mounted() {
    this.fetchEntries();
  },
  methods: {
    fetchEntries() {
      const start = this.thisMonday.toISOString(), end = this.thisSunday.toISOString();
      fetch(`/api/entries?start=${start}&end=${end}`)
        .then((response) => response.json())
        .then((entries) => {
          const categories = {};
          entries.forEach((entry) => {
            // calculate time spent for the category given start and end date in hours
            const timeSpentHours = (new Date(entry.end) - new Date(entry.start)) / 1000 / 60 / 60;
            if (entry.category in categories) {
              categories[entry.category] += timeSpentHours;
            } else {
              categories[entry.category] = timeSpentHours;
            }
          });
          this.$set(this.data, "labels", Object.keys(categories));
          this.$set(this.data, "datasets", [
            {
              name: "Time Spent (hours)",
              values: Object.values(categories),
            },
          ]);
          this.updateChart++;
        });
    }
  }
};
</script>

<style scoped>
.manage-categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


</style>