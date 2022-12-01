<template>
  <section v-if="goals.length">
    <GoalComponent v-for="goal in goals" :key="goal.id" :goal="goal" />
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
    goals: {
      type: Array,
      required: true
    }
  },
  mounted() {
    console.log("HI", this.goals);
  }
};
</script>