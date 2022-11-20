<!-- Reusable component representing a single goal and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <header>
      <h3>
        <router-link :to="{ name: 'Profile', params: { username: goal.author } }">
          @{{ goal.author }}
        </router-link>
      </h3>
      <div class="info">
        {{ goal.dateCreated }}
      </div>
    </header>
    <p class="content">
      {{ goal.content }}
    </p>

    <div class="button-row">
      <button @click="deleteGoal" v-if="$store.state.username === goal.author">
        <span class="material-symbols-outlined">Delete</span> Delete
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'GoalComponent',
  props: {
    // Data from the stored goal
    goal: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteGoal() {
      /**
       * Deletes this goal.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted goal!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the goal's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/goals/${this.goal._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshGoals');

        params.callback();
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
.no-style {
  text-decoration: none;
  color: inherit;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ul {
  margin-top: -10px;
}

.content {
  margin: 20px 0 20px 0;
}

form {
  background-color: inherit;
  position: inherit;
  box-shadow: inherit;
  margin: 0 0 20px 0;
  border-radius: inherit;
  padding: 0;

  display: grid;
  grid-auto-flow: column;
  align-items: center;
  box-shadow: none;
}
</style>