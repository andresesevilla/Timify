<!-- Component for displaying user's Anxiety Shield -->

<template>
  <article class="anxietyshield">
    <section>
      <h3>Your Anxiety Inducing Topics</h3>
      <p v-if=" $store.state.shieldedTopics.length === 0">No topics found.</p>
      <ul>
        <li v-for="topic in $store.state.shieldedTopics">{{ topic }}</li>
      </ul>
    </section>
    <form @submit.prevent="submit" v-on:change="editAnxietyShield">
      <label for="topic">Toggle shielding of a topic:</label>
      <select name="topic" id="topic" v-model="toggledTopic">
        <option>Death</option>
        <option>Suicide</option>
        <option>Serious Injury or Disease</option>
        <option>Addiction</option>
        <option>Sexual Violence</option>
        <option>Financial Issues</option>
        <option>Other Anxiety</option>
      </select>
    </form>
  </article>
</template>

<script>
export default {
  name: 'AnxietyShieldComponent',
  async mounted() {
    this.$store.commit('refreshShieldedTopics');
  },
  data() {
    return {
      toggledTopic: ''
    };
  },
  methods: {
    async editAnxietyShield() {
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      };
      const fields = {
        topic: this.toggledTopic,
      }
      options.body = JSON.stringify(fields);
      try {
        const r = await fetch(`/api/anxietyshield`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.toggledTopic = '';
        this.$store.commit('refreshShieldedTopics');
        this.$store.commit('alert', {
          message: 'Successfully toggled topic!', status: 'success'
        });

      } catch (e) {
        this.toggledTopic = '';
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
select {
  margin-left: 10px;
}
form {
  background-color: inherit;
  position: inherit;
  box-shadow: inherit;
  padding: 0;
  align-items: center;
  box-shadow: none;
}
</style>