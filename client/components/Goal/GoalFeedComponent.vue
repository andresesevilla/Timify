<template>
  <section v-if="$store.state.goals.length">
    <GoalComponent v-for="goal in $store.state.goals" :key="goal.id" :goal="goal" />
  </section>
  <article v-else>
    <h3>No goals found.</h3>
  </article>
</template>

<script>
import GoalComponent from '@/components/Goal/GoalComponent.vue';
import CreateGoalForm from '@/components/Goal/CreateGoalForm.vue';

export default {
  name: 'GoalFeedComponent',
  components: { GoalComponent, CreateGoalForm },
  async mounted() {
    await this.getGoals();
  },
  props: {
    // If not supplied, assume this is the social feed
    username: String
  },
  methods: {
    async getGoals() {
      const username = this.$store.state.username
      let url = '/api/goals?feed';
      if (this.username !== undefined) {
        url = `/api/goals?author=${this.username}`;
      }
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateFilter', username);
        this.$store.commit('updateGoals', res);
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    }
  }
};
</script>