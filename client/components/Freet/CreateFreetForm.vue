<!-- Form for creating freets (based on BlockForm) -->

<template>
  <form @submit.prevent="submit">
    <section>
      <div>
        <textarea name="content" v-model="content" id="content" placeholder="What's happening?"
          maxlength="140"></textarea>
        <p class="info">{{ content.length }}/140 characters</p>
      </div>
      <div>
        <select name="privatecircle" v-model="privatecircle" id="privatecircle"
          v-if="$store.state.privatecircles.length">
          <option value="" selected>Post publicly</option>
          <option v-for="privatecircle in $store.state.privatecircles" :value=privatecircle.name>Post to
            {{ privatecircle.name }}</option>
        </select>
        <p v-else class="info">Want to post to a smaller audience? Create a <router-link to="privatecircles">Private
            Circle</router-link>.</p>
      </div>
    </section>
    <button type="submit">
      Post freet
    </button>
  </form>
</template>

<script>

export default {
  async mounted() {
    await this.$store.commit('refreshPrivateCircles');
  },
  data() {
    return {
      content: '',
      privatecircle: '',
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
        private_circle: this.privatecircle
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
        this.privatecircle = '';

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