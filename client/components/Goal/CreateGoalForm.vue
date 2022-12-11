<template>
  <GoalForm 
    :title="'Create a new weekly goal'"
    :submitButtonText="'Create goal'"
    :submitCallback="submit"
    @refreshGoals="$emit('refreshGoals')"
  />
</template>

<script>
import GoalForm from "@/components/Goal/GoalForm.vue";

export default {
  name: "CreateGoalForm",
  components: {
    GoalForm,
  },
  methods: {
    submit(type, hours, category, isFriends) {
      fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          hours: hours,
          category: category,
          private: !isFriends,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.$buefy.toast.open({
              message: res.error,
              type: "is-danger",
            });
          } else {
            this.$buefy.toast.open({
              message: "Goal created!",
              type: "is-success",
            });
            this.$emit("refreshGoals");
          }
        });
    },
  },
};
</script>