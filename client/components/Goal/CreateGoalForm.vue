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
      <b-field :type="{'is-danger': !isCategoryValid}" :message="{'Please choose one of your categories': !isCategoryValid}" class="autocomplete-field">
        <b-autocomplete 
          v-model="category" 
          placeholder="Choose a category"
          :data="filteredCategories"
          :open-on-focus="true"
          :clearable="true"
          :loading="loading"
          required="true">
          <template #footer>
            <a><span> Add a category... </span></a>
          </template>
          <template #empty>No results {{category ? "for" : ""}} {{category}}</template>
        </b-autocomplete>
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
  computed: {
    filteredCategories() {
      return this.categories.filter((category) => {
        return category.toLowerCase().includes(this.category === null ? "" : this.category.toLowerCase());
      });
    },
    isCategoryValid() {
      return this.category === null || !this.categories || this.categories.includes(this.category);
    }
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
    submit() {
      fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: this.type,
          hours: this.hours,
          category: this.category,
          visibility: this.isFriends ? 'friends' : 'private',
        }),
      }).then(res => res.json())
        .then(res => {
          if (res.error) {
            this.$buefy.toast.open({
              message: res.error,
              type: 'is-danger',
            });
          } else {
            this.$buefy.toast.open({
              message: 'Goal created!',
              type: 'is-success',
            });
            this.$emit('refreshGoals');
          }
        })
    }
  }
};
</script>

<style lang="scss" scoped>

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
  gap: 0.5em;

  .field {
    margin: 0;
  }
}

.hours {
  width: 10em;
}
</style>