<!-- Form for creating goals (based on BlockForm) -->

<template>
  <form @submit.prevent="submit">
    <section>
      <textarea name="content" v-model="content" id="content" placeholder="What's your goal?"
        maxlength="70"></textarea>
      <p class="info">{{ content.length }}/70 characters</p>

      <label for="hours">Hours:</label>
      <input type='number' name="hours" min="1" v-model="hours">

      <label for="type">Type:</label>
      <select name="type" v-model="type" id="type">
        <option value="goal">Goal</option>
        <option value="budget">Budget</option>
      </select>
    </section>
    <button type="submit">
      Post goal
    </button>
  </form>
</template>

<script>

export default {
  data() {
    return {
      content: '',
      hours: 1,
      type: 'goal'
    };
  },
  methods: {
    async submit() {
      if (!this.content.trim()) {
        this.$store.commit('alert', {
          message: 'Goal content must be at least one character long.', status: 'error'
        });
        return;
      }

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      };
      const fields = {
        name: this.content,
        hours: this.hours,
        type: this.type
      }
      options.body = JSON.stringify(fields);

      try {
        const r = await fetch('/api/goals', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshGoals');

        this.content = '';
        this.hours = 1;

        this.$store.commit('alert', {
          message: 'Successfully created a goal!', status: 'success'
        });

      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

section {
  display: flex;
  flex-direction: column;
}

form>section p {
  margin: 0;
}

form h3,
form>* {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}
</style>