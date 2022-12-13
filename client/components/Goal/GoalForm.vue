<template>
  <form @submit.prevent="submitCallback(type, hours, category, isFriends)">
    <section class="form-header">
      <h2>{{title}}</h2>
      <b-dropdown v-model="isFriends" aria-role="list">
        <template v-if="!isFriends" #trigger>
          <b-button
            label="Private"
            type="is-primary"
            icon-left="lock"
            icon-right="menu-down"
          />
        </template>

        <template v-else #trigger>
          <b-button
            label="Friends"
            type="is-primary"
            icon-left="account-multiple"
            icon-right="menu-down"
          />
        </template>


        <b-dropdown-item :value="true" aria-role="listitem">
          <div class="media">
            <b-icon class="media-left" icon="account-multiple"></b-icon>
            <div class="media-content">
              <h4>Friends</h4>
              <small>Friends can see</small>
            </div>
          </div>
        </b-dropdown-item>

        <b-dropdown-item :value="false" aria-role="listitem">
          <div class="media">
            <b-icon class="media-left" icon="lock"></b-icon>
            <div class="media-content">
              <h4>Private</h4>
              <small>Only you can see</small>
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
      <b-field
        ><b-numberinput
          class="hours"
          v-model="hours"
          controls-position="compact"
          controls-rounded
          :min="1"
          :max="999"
        ></b-numberinput
      ></b-field>
      <span>hours on</span>
      
      <CategoryAutocomplete 
        :value="category"
        :categories="categories"
        :loading="loading"
        @select="(c) => {category = c;}"
        @add-category="(category) => {this.categories.unshift(category);}"
      />
    </section>

    <b-button type="submit" @click="submitCallback(type, hours, category, isFriends)">{{submitButtonText}}</b-button>
  </form>
</template>

<script>
import CategoryAutocomplete from "@/components/Category/CategoryAutocomplete.vue";

export default {
  name: "CreateGoalForm",
  components: {
    CategoryAutocomplete,
  },
  props: {
    initType: {
      type: String,
      default: "goal",
    },
    initHours: {
      type: Number,
      default: 1,
    },
    initCategory: {
      type: String,
      default: null,
    },
    initIsFriends: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    submitButtonText: {
      type: String,
      required: true,
    },
    submitCallback: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      type: this.initType,
      hours: this.initHours,
      category: this.initCategory,
      isFriends: this.initIsFriends,
    };
  },
  computed: {
    categories() {
      return this.$store.state.categories || [];
    },
    loading() {
      return this.$store.state.categories === null;
    },
    filteredCategories() {
      return this.categories.filter((category) => {
        return category
          .toLowerCase()
          .includes(this.category === null ? "" : this.category.toLowerCase());
      });
    },
    isCategoryValid() {
      return (
        this.category === null ||
        !this.categories ||
        this.categories.includes(this.category)
      );
    },
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
  justify-content: space-between;
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