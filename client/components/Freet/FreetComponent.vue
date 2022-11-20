<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    v-if="!reporting && (!$store.state.shieldedTopics.some((e) => { return freet.topics.includes(e) }) || viewAnyway)">
    <header>
      <h3>
        <router-link :to="{ name: 'Profile', params: { username: freet.author } }">
          @{{ freet.author }}
        </router-link>
      </h3>
      <div class="info">
        {{ freet.dateCreated }}
      </div>
    </header>
    <p class="content">
      {{ freet.content }}
    </p>

    <p v-if="freet.restrictAccess" class="info">
      <router-link :to="{ name: 'PrivateCircles' }" class="no-style">Private Circle</router-link>: {{
          freet.restrictAccess
      }}
    </p>
    <div class="button-row">
      <button @click="deleteFreet" v-if="$store.state.username === freet.author">
        <span class="material-symbols-outlined">Delete</span> Delete
      </button>
      <button @click="startReport">
        <span class="material-symbols-outlined">Security</span> Report Anxiety
      </button>
    </div>
  </article>
  <article v-else-if="!reporting">
    <h3>
      <router-link :to="{ name: 'Settings' }">
        Anxiety Shield
      </router-link>
    </h3>
    <p class="content">This freet by <router-link :to="{ name: 'Profile', params: { username: freet.author } }">
        @{{ freet.author }}</router-link> may contain the following
      topic(s):
    </p>
    <ul>
      <li v-for="topic in freet.topics" v-if="$store.state.shieldedTopics.includes(topic)">
        {{ topic }}
      </li>
    </ul>
    <button @click="() => { viewAnyway = true }"><span class="material-symbols-outlined">Visibility</span>View</button>
  </article>
  <article v-else>
    <h3>
      Anxiety Shield
    </h3>
    <p class="info">Help users avoid anxiety inducing content by reporting it to Anxiety Shield.</p>
    <form @submit.prevent="submit" v-on:change="reportToAnxietyShield">
      <label for="topic">What anxiety inducing topic does this freet contain?</label>
      <select name="topic" id="topic" v-model="reportedTopic">
        <option>Death</option>
        <option>Suicide</option>
        <option>Serious Injury or Disease</option>
        <option>Addiction</option>
        <option>Sexual Violence</option>
        <option>Financial Issues</option>
        <option>Other Anxiety</option>
      </select>
    </form>
    <button @click="() => { reporting = false }"><span class="material-symbols-outlined">Cancel</span>Cancel</button>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewAnyway: false,
      reporting: false,
      reportedTopic: '',
    };
  },
  watch: {
    freet() {
      this.viewAnyway = false;
    }
  },
  methods: {
    startReport() {
      this.reporting = true;
    },
    async reportToAnxietyShield() {
      const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
      };
      const fields = {
        topic: this.reportedTopic,
      }
      options.body = JSON.stringify(fields);
      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.reportedTopic = '';
        this.$store.commit('alert', {
          message: 'Successfully reported freet to Anxiety Shield!', status: 'success'
        });
        this.reporting = false;
      } catch (e) {
        this.reportedTopic = '';
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');

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