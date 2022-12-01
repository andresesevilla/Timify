<!-- Default page that also displays goals -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome {{ $store.state.username }}</h2>
      </header>
      <CreateGoalForm />
      <header>
        <h2>Your Goals</h2>
      </header>
      <GoalListComponent :fetchGoals="fetchGoals" />
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
        { author: "elonmusk", hours: 5, category: "Family", progress: 4, type: "budget", visibility: "friends" },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";
main {
  max-width: 60em;
  margin: 0 auto;
}
</style>