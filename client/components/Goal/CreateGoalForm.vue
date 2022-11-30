<!-- Form for creating goals (based on BlockForm) -->

<template>
  <form @submit.prevent="submit">
    <section class="form-header">
      <h2>Create a new goal</h2>
      <b-dropdown v-model="isFriends" aria-role="list">
          <template v-if="!isFriends" #trigger>
              <b-button
                  label="Private"
                  type="is-primary"
                  icon-left="lock"
                  icon-right="menu-down" />
          </template>

          <template v-else #trigger>
              <b-button
                  label="Friends"
                  type="is-primary"
                  icon-left="account-multiple"
                  icon-right="menu-down" />
          </template>


          <b-dropdown-item :value="false" aria-role="listitem">
              <div class="media">
                  <b-icon class="media-left" icon="lock"></b-icon>
                  <div class="media-content">
                      <h4>Private</h4>
                      <small>Only you can see</small>
                  </div>
              </div>
          </b-dropdown-item>

          <b-dropdown-item :value="true" aria-role="listitem">
              <div class="media">
                  <b-icon class="media-left" icon="account-multiple"></b-icon>
                  <div class="media-content">
                      <h4>Friends</h4>
                      <small>Friends can see</small>
                  </div>
              </div>
          </b-dropdown-item>
      </b-dropdown>
    </section>

    <section class="goal-sentence">
      <span>Spend</span>
      <b-select v-model="type" rounded>
        <option value="goal">at least</option>
        <option value="budget">at most</option>
      </b-select>
      <b-field><b-numberinput class="hours" v-model="hours" controls-position="compact" controls-rounded :min="1" :max="999"></b-numberinput></b-field>
      <span>hours on</span>
      <b-field>
      <b-autocomplete 
        v-model="category" 
        placeholder="Choose a category"
        :data="categories"
        :open-on-focus="true"
        :clearable="true"
        :loading="loading"
        required="true"
      />
      </b-field>
    </section>

    <b-button type="submit">Create goal</b-button>
  </form>
</template>

<script>

export default {
  data() {
    return {
      type: 'goal',
      hours: 1,
      category: null,
      categories: [],
      isFriends: false,
      loading: true
    };
  },
  mounted() {
    this.loading = true;
    fetch('/api/categories')
      .then(response => response.json())
      .then(categories => {
        this.categories = categories.map(category => category.name);
        this.loading = false;
      });
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
  gap: 1em;
}

form h2 {
  margin: 0;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1em;
}

.goal-sentence {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5em;
}
.hours {
  width: 10em;
}
</style>