<!-- Default page that also displays goals -->

<template>
  <main class="columns">
    <section class="column time-input">
      <DailyCalendar @refreshGoals="refreshGoals ^= 1" />
    </section>
    <section class="column goals">
      <header>
        <span><h2>Your Goals</h2></span>
        <router-link to="/my"><b-button>Manage goals</b-button></router-link>
      </header>
      <GoalListComponent :allowEdit="false" :isFeedUI="false" :motivatingMessage="'Create some goals and start keeping track of your progress!'" :key="refreshGoals" />
    </section>
  </main>
</template>

<script>
import DailyCalendar from '@/components/Calendar/DailyCalendar.vue';
import CreateGoalForm from "@/components/Goal/CreateGoalForm.vue";
import GoalListComponent from "@/components/Goal/GoalListComponent.vue";
import ManageCategoriesComponent from "../Category/ManageCategoriesComponent.vue";

export default {
  name: "HomeComponent",
  components: { DailyCalendar, ManageCategoriesComponent, CreateGoalForm, GoalListComponent },
  data() {
    return {
      refreshGoals: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";
main {
  margin: 0 auto;
}
.column {
  // set so that there's no vertical scroll
  height: calc(100vh - 3.5em - 2em); // nav = 3.5em, padding = 2em
  overflow-y: auto;
}
.goals header {
  display: flex;
  justify-content: space-between;

  span {
    display: flex;
    gap: 1em;
    align-items: center;
  }
}

</style>