<!-- Default page that also displays goals -->

<template>
  <main class="columns">
    <section class="column time-input">
      <p>Input time here</p>
    </section>
    <section class="column goals">
      <header>
        <h2>Your Goals</h2>
        <router-link to="/my"><b-button>Manage goals</b-button></router-link>
      </header>
      <GoalListComponent :fetchGoals="fetchGoals" :allowEdit="false" />
    </section>
  </main>
</template>

<script>
import CreateGoalForm from "@/components/Goal/CreateGoalForm.vue";
import GoalListComponent from "@/components/Goal/GoalListComponent.vue";
import ManageCategoriesComponent from "../Category/ManageCategoriesComponent.vue";

export default {
  name: "HomeComponent",
  components: { ManageCategoriesComponent, CreateGoalForm, GoalListComponent },
  data() {
    return {};
  },
  mounted() {
    
  },
  methods: {
    fetchGoals() {
      return [
        { author: "elonmusk", hours: 10, category: "Twitter", progress: 3, type: "budget", visibility: "friends" },
        { author: "elonmusk", hours: 5, category: "Firing", progress: 10, type: "goal", visibility: "private" },
        { author: "elonmusk", hours: 8, category: "Tesla", progress: 7, type: "goal", visibility: "private" },
        { author: "elonmusk", hours: 8, category: "Tesla", progress: 7, type: "goal", visibility: "private" },
        { author: "elonmusk", hours: 8, category: "Tesla", progress: 7, type: "goal", visibility: "private" },
        { author: "elonmusk", hours: 5, category: "Family", progress: 4, type: "budget", visibility: "friends" },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";
main {
  margin: 0 auto;
}
.column {
  max-height: 90vh;
  overflow-y: auto;
}
.goals header {
  display: flex;
  justify-content: space-between;
}

</style>