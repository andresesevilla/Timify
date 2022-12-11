<template>
  <div v-if="loading" class="loading">
    <b-skeleton active :animated="true" height="3em" />
    <b-skeleton active :animated="true" height="3em" />
    <b-skeleton active :animated="true" height="3em" />
  </div>
  <div v-else>
    <section v-if="goals.length">
      <header>
        <h4>weekly progress of {{thisMonday}} to {{thisSunday}} </h4>
      </header>
      <GoalComponent
        v-for="goal in goals"
        :key="goal.id"
        :goal="goal"
        :allowEdit="allowEdit"
        :isFeedUI="isFeedUI"
        @delete="handleDeleteGoal(goal)"
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
    isFeedUI: {
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
  computed: {
    thisMonday() {
      // calculate the date of the monday of this week
      let today = new Date();
      let day = today.getDay();
      let diff = today.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(today.setDate(diff)).toLocaleDateString();
    },
    thisSunday() {
      // calculate the date of the sunday of this week
      let today = new Date();
      let day = today.getDay();
      let diff = today.getDate() - day + (day == 0 ? 0 : 7); // adjust when day is sunday
      return new Date(today.setDate(diff)).toLocaleDateString();
    }
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
    handleDeleteGoal(goal) {
      this.$buefy.dialog.confirm({
        title: 'Deleting goal',
        message: 'Are you sure you want to delete this goal?',
        confirmText: 'Delete goal',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: () => this.deleteGoal(goal)
      });
    },
    deleteGoal(goal) {
      fetch(`/api/goals/${goal._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.$buefy.toast.open({
              message: res.error,
              type: "is-danger",
            });
            return;
          }
          this.goals = this.goals.filter((g) => g._id !== goal._id);
        });
    }

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