<!-- Form for getting freets (all, from user) -->
<template>
  <section>
    <div class="feed-control">
      <h2>
        Viewing
        <span v-if="$store.state.showAllFreets">
          global feed
        </span>
        <span v-else>
          your feed
        </span>
      </h2>
      <button @click="click">
        Switch to {{ $store.state.showAllFreets ? 'your' : 'global' }} feed <span class="material-symbols-outlined">{{
            $store.state.showAllFreets ? 'Groups' : 'Public'
        }}</span>
      </button>
    </div>
    <p class="info">Your feed has freets from users you follow. Global feed has freets from all users.</p>
  </section>
</template>


<script>

export default {
  name: 'GetFreetsForm',
  data() {
    return {
      value: this.$store.state.showAllFreets
    };
  },
  mounted() {
    this.submit();
    this.$store.commit('refreshShieldedTopics');
  },
  methods: {
    async click() {
      this.value = !this.value;
      await this.submit();
    },
    async submit() {
      this.$store.commit('setShowAllFreets', this.value);
      const url = this.value ? '/api/freets' : '/api/freets?feed';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.$store.commit('updateFilter', null);
        this.$store.commit('updateFreets', res);
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
