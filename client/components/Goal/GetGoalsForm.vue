<!-- Form for getting goals (all, from user) -->
<template>
  <section>
    <div class="feed-control">
      <h2>
        Viewing
        <span v-if="$store.state.showAllGoals">
          global feed
        </span>
        <span v-else>
          your feed
        </span>
      </h2>
      <button @click="click">
        Switch to {{ $store.state.showAllGoals ? 'your' : 'global' }} feed <span class="material-symbols-outlined">{{
            $store.state.showAllGoals ? 'Groups' : 'Public'
        }}</span>
      </button>
    </div>
    <p class="info">Your feed has goals from users you follow. Global feed has goals from all users.</p>
  </section>
</template>


<script>

export default {
  name: 'GetGoalsForm',
  data() {
    return {
      value: this.$store.state.showAllGoals
    };
  },
  mounted() {
    this.submit();
  },
  methods: {
    async click() {
      this.value = !this.value;
      await this.submit();
    },
    async submit() {
      this.$store.commit('setShowAllGoals', this.value);
      const url = this.value ? '/api/goals' : '/api/goals?feed';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateFilter', null);
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

<style>
.feed-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -10px;
}
</style>
