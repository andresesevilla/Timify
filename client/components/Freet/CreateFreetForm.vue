<!-- Form for creating freets (based on BlockForm) -->

<template>
  <form @submit.prevent="submit">
    <section>
      <div>
        <textarea name="content" v-model="content" id="content" placeholder="What's happening?"
          maxlength="140"></textarea>
        <p class="info">{{ content.length }}/140 characters</p>
      </div>
    </section>
    <button type="submit">
      Post freet
    </button>
  </form>
</template>

<script>

export default {
  data() {
    return {
      content: '',
    };
  },
  methods: {
    async submit() {
      if (!this.content.trim()) {
        this.$store.commit('alert', {
          message: 'Freet content must be at least one character long.', status: 'error'
        });
        return;
      }

      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      };
      const fields = {
        content: this.content,
      }
      options.body = JSON.stringify(fields);

      try {
        const r = await fetch('/api/freets', options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');

        this.content = '';

        this.$store.commit('alert', {
          message: 'Successfully created a freet!', status: 'success'
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

section>div {
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