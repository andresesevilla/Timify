<template>
  <section v-if="goals.length">
    <GoalComponent v-for="goal in goals" :key="goal.id" :goal="goal" @delete="deleteGoal(goal)" />
  </section>
  <article v-else>
    <h3>No goals found.</h3>
  </article>
</template>

<script>
import GoalComponent from '@/components/Goal/GoalComponent.vue';

export default {
  name: 'GoalListComponent',
  components: { GoalComponent },
  props: {
    fetchGoals: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      goals: [],
    };
  },
  async mounted() {
    this.goals = await this.fetchGoals();
  },
  methods: {
    deleteGoal(goal) {
      this.goals = this.goals.filter((g) => g !== goal);
    },
  }
};
</script>