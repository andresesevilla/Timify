<template>
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
    <h3>No goals found. Create some and track your progress!</h3>
  </article>
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
  },
  data() {
    return {
      goals: [],
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
      .then((goals) => {
        this.goals = goals.map((goal) => {
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
</style>