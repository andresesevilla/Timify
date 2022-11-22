<template>
  <main>
    <section>
      <header class="freet-header">
        <h2>Your Feed</h2>
        <SearchComponent />
      </header>
      <section v-if="$store.state.goals.length">
        <GoalComponent v-for="goal in $store.state.goals" :key="goal.id" :goal="goal" />
      </section>
      <article v-else>
        <h3>No goals found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import GoalComponent from '@/components/Goal/GoalComponent.vue';
import CreateGoalForm from '@/components/Goal/CreateGoalForm.vue';
import GetGoalsForm from '@/components/Goal/GetGoalsForm.vue';
import SearchComponent from '@/components/common/SearchComponent.vue';

export default {
  name: 'Feedpage',
  components: { GoalComponent, GetGoalsForm, CreateGoalForm, SearchComponent },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>