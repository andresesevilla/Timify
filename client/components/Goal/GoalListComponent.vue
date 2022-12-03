<template>
  <div v-if="loading" class="loading">
    <b-skeleton active :animated="true" height="3em" />
    <b-skeleton active :animated="true" height="3em" />
    <b-skeleton active :animated="true" height="3em" />
  </div>
  <div v-else>
    <section v-if="goals.length">
      <GoalComponent
        v-for="goal in goals"
        :key="goal.id"
        :goal="goal"
        :allowEdit="allowEdit"
        @delete="deleteGoal(goal)"
      />
    </section>
    <article v-else>
      <h3>No goals found. {{ this.motivatingMessage }} </h3>
    </article>
  </div>
</template>

<script>
import GoalComponent from "@/components/Goal/GoalComponent.vue";

export default {
  name: "GoalListComponent",
  components: { GoalComponent },
  props: {
    allowEdit: {
      type: Boolean,
      default: true,
    },
    fetchOptions: {
      type: Object,
      default: () => {
        return { url: "/api/goals" };
      },
    },
    motivatingMessage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      goals: [],
      loading: true,
    };
  },
  mounted() {
    fetch(this.fetchOptions.url, {
      method: this.fetchOptions.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.loading = false;
        if (res.error) {
          this.$buefy.toast.open({
            message: res.error,
            type: "is-danger",
          });
          return;
        }
        this.goals = res.map((goal) => {
          return {
            ...goal,
            visibility: goal.private ? "private" : "friends",
          };
        });
      });
  },
  methods: {
    deleteGoal(goal) {
      this.goals = this.goals.filter((g) => g !== goal);
    },
  },
};
</script>

<style scoped>
article {
  margin-top: 1em;
}
.loading {
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>