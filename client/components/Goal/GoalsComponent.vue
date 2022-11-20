<!-- Default page that also displays goals -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateGoalForm />
      <header>
        <GetGoalsForm />
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

export default {
  name: 'GoalPage',
  components: { GoalComponent, GetGoalsForm, CreateGoalForm },
};
</script>