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
      <GoalFeedComponent :username="$store.state.username" />
    </section>
  </main>
</template>

<script>
import CreateGoalForm from '@/components/Goal/CreateGoalForm.vue';
import GoalFeedComponent from '@/components/Goal/GoalFeedComponent.vue';
import ManageCategoriesComponent from '../Category/ManageCategoriesComponent.vue';

export default {
  name: 'HomeComponent',
  components: { ManageCategoriesComponent, CreateGoalForm, GoalFeedComponent }
};
</script>

<style lang="scss" scoped>
@import '@/public/variables.scss';
main {
  max-width: 60em;
  margin: 0 auto;
}
</style>