<!-- Default page that also displays goals -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateGoalForm />
      <header>
        <h2>Your Goals</h2>
      </header>
      <GoalFeedComponent :username="$store.state.username" />
    </section>
  </main>
</template>

<script>
import GoalComponent from '@/components/Goal/GoalComponent.vue';
import CreateGoalForm from '@/components/Goal/CreateGoalForm.vue';
import GoalFeedComponent from '@/components/Goal/GoalFeedComponent.vue';

export default {
  name: 'HomeComponent',
  components: { GoalComponent, CreateGoalForm, GoalFeedComponent }
};
</script>