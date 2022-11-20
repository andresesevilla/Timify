<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <section v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}:</label>
        <textarea v-if="field.id === 'content'" :name="field.id" :value="field.value"
          @input="field.value = $event.target.value" />
        <input v-else :type="field.id === 'password' ? 'password' : 'text'" :name="field.id" :value="field.value"
          @input="field.value = $event.target.value">
      </div>
    </section>
    <section v-else>
      <p>{{ content }}</p>
    </section>
    <button type="submit">
      {{ title }}
    </button>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      callback: null, // Function to run after successful form submission
      validation: null, // Function to run to validate form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      let json = null;
      if (this.hasBody) {
        json = Object.fromEntries(
          this.fields.map(field => {
            const { id, value } = field;
            return [id, value];
          })
        )
        options.body = JSON.stringify(json);
      }

      if (this.validation) {
        const error = this.validation(json);
        if (error) {
          this.$store.commit('alert', {
            message: error, status: 'error'
          });
          return;
        }
      }

      this.fields.map(field => {
        field.value = '';
      })

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.refreshPrivateCircles) {
          this.$store.commit('refreshPrivateCircles');
        }

        if (this.callback) {
          this.callback();
        }
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
