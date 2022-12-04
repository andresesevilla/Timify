<template>
  <section>
    <div v-if="!playing" class="play-button-container">
      <span>Start working on:</span>
      <div>
        <CategoryAutocomplete
          :categories="categories"
          :loading="categoriesLoading"
          @select="(c) => (category = c)"
          @add-category="(category) => {this.categories.push(category);}"
          class="autocomplete"
        />
      </div>
    </div>
    <div v-else>Working on {{ category }} for {{ timeSpentReadable }}.</div>
    <b-tooltip :label="playing ? 'Stop' : 'Start'" position="is-bottom">
    <a @click="togglePlaying()"
      ><b-icon
        :icon="playing ? 'stop-circle' : 'play-circle'"
        class="play-icon"
        size="is-medium"
    /></a>
    </b-tooltip>
  </section>
</template>

<script>
import CategoryAutocomplete from "@/components/Category/CategoryAutocomplete.vue";

export default {
  name: "PlayButton",
  components: { CategoryAutocomplete },
  data() {
    return {
      playing: false,
      category: null,
      timeSpentSeconds: 0,
      interval: null,
      categories: [],
      categoriesLoading: true,

      startDate: null,
      endDate: null,
    };
  },
  computed: {
    timeSpentReadable() {
      if (this.timeSpentSeconds < 60) {
        return `${this.timeSpentSeconds} seconds`;
      } else if (this.timeSpentSeconds < 3600) {
        return `${Math.floor(this.timeSpentSeconds / 60)} minutes, ${
          this.timeSpentSeconds % 60
        } seconds`;
      } else {
        return `${Math.floor(this.timeSpentSeconds / 3600)} hours, ${Math.floor(
          (this.timeSpentSeconds % 3600) / 60
        )} minutes`;
      }
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      fetch("/api/categories")
        .then((response) => response.json())
        .then((categories) => {
          this.categories = categories.map((category) => category.name);
          this.categoriesLoading = false;
        });
    },
    togglePlaying() {
      if (!this.playing) {
        if (!this.category) {
          this.$buefy.toast.open({
            message: "Please select a category first.",
            type: "is-danger",
          });
          return;
        }
        if (!this.categories.includes(this.category)) {
          this.$buefy.toast.open({
            message: "Please select a valid category.",
            type: "is-danger",
          });
          return;
        }

        this.timeSpentSeconds = 0;
        this.startDate = new Date();
        this.interval = setInterval(this.incrementTime, 1000);
        this.$store.commit("setPlaying", {title: this.category, start: this.startDate});
      } else {
        this.endDate = new Date();
        clearInterval(this.interval);
        this.interval = null;
        if (this.timeSpentSeconds < 5 * 60) {
          this.$buefy.toast.open({
            message: "You need to work for at least 5 minutes to log time, so this won't be logged.",
            type: "is-warning",
          });
          this.playing = false;
          this.$store.commit("setPlaying", null);
          return;
        }
        const categoryBeforeNull = this.category;
        fetch("/api/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: this.category,
            start: this.startDate,
            end: this.endDate,
          }),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.error) {
              this.$buefy.toast.open({
                message: res.error,
                type: "is-danger",
              });
              this.$store.commit("setPlaying", null);
              return;
            }
            this.$buefy.toast.open({
              message: `Logged ${this.timeSpentReadable} to ${categoryBeforeNull}.`,
              type: "is-success",
            });
            this.$store.commit("setPlaying", {title: categoryBeforeNull, start: this.startDate, end: this.endDate, id: res._id});
          });
        
        this.category = null;
      }
      this.playing = !this.playing;
    },
    incrementTime() {
      this.timeSpentSeconds += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";

.autocomplete {
  margin-bottom: 0;
}
section {
  display: flex;
  align-items: center;
  gap: 1em;
  color: $oc-gray-1;
  width: 100%;
}
.play-button-container {
  display: flex;
  gap: 1em;
  align-items: center;
}
.play-icon {
  padding: 1em;
  color: $oc-gray-1;
  :hover {
    color: $oc-gray-5;
  }
}
</style>