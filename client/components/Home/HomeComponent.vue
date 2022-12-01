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
      <GoalListComponent :goals="goals" />
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
    return {
      goals: [],
    };
  },
  mounted() {
    this.fetchGoals();
  },
  methods: {
    async fetchGoals() {
      this.goals = [
        { author: "elonmusk", hours: 10, category: "Twitter", progress: 10, type: "budget", visibility: "friends" },
        { author: "elonmusk", hours: 5, category: "Firing", progress: 80, type: "goal", visibility: "private" },
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