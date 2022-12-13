<template>
  <article v-if="isFeedUI">
    <header>
      <h3>
        <router-link :to="{ name: 'Profile', params: { username: goal.author } }">
          {{ goal.author }}
        </router-link>
      </h3>
      <span class="goal-sentence"> Spend {{ goal.type === 'goal' ? 'at least' : 'at most'}} {{ goal.hours }} hours on <span class="category-name">{{ goal.category }}</span> </span>
      <span class="goal-actions" v-if="allowEdit">
          <b-tooltip label="Edit"><a @click="startEdit"><b-icon icon="pencil" /></a></b-tooltip>
          <b-tooltip label="Delete"><a @click="deleteGoal"><b-icon icon="delete" /></a></b-tooltip>
        </span>
    </header>
    <p>{{ infoMessage }}</p>
    <section>
      <b-progress :value="progress" size="is-large" format="percent" :type="goal.type === 'goal' ? 'is-success' : 'is-info'" show-value>
        {{progress}}% {{progressMessage}}
      </b-progress>
    </section>
  </article>
  
  <!-- For Home page UI -->
  <article v-else-if="editing === false">
    <header>
      <h3 class="category-name">{{goal.category}}</h3>
      <b-tooltip class="visibility" :label="goal.visibility === 'friends' ? 'friends can see' : 'private'"> <b-icon :icon="goal.visibility === 'friends' ? 'account-multiple' : 'lock'" /> </b-tooltip>
      <span class="goal-sentence"> spend {{ goal.type === 'goal' ? 'at least' : 'at most'}} {{ goal.hours }} hours </span>
      <span class="goal-actions" v-if="allowEdit">
        <b-tooltip label="Edit"><a @click="startEdit"><b-icon icon="pencil" /></a></b-tooltip>
        <b-tooltip label="Delete"><a @click="deleteGoal"><b-icon icon="delete" /></a></b-tooltip>
      </span>
    </header>
    <p>{{ infoMessage }}</p>
    <section>
      <b-progress :value="progress" size="is-large" format="percent" :type="goal.type === 'goal' ? 'is-success' : 'is-info'" show-value>
        {{progress}}% {{progressMessage}}
      </b-progress>
    </section>
  </article>
  <GoalForm 
    v-else
    :title="'Edit goal'"
    :submitButtonText="'Save'"
    :submitCallback="submitEdit"
    :initType="goal.type"
    :initHours="goal.hours"
    :initIsFriends="goal.visibility === 'friends'"
    :initCategory="goal.category"
  />
</template>

<script>
import GoalForm from "@/components/Goal/GoalForm.vue";

export default {
  name: 'GoalComponent',
  components: {GoalForm},
  props: {
    // Data from the stored goal
    goal: {
      type: Object,
      required: true
    },
    allowEdit: {
      type: Boolean,
      default: true
    },
    isFeedUI: {
      type: Boolean,
      default: true,      
    }
  },
  data() {
    return {
      editing: false,
    };
  },
  computed: {
    // The goal's progress as a percentage
    progress() {
      return Math.round(this.goal.progress / this.goal.hours * 100);
    },
    progressMessage() {
      if (this.goal.type === 'goal') {
        if (this.progress >= 100) {
          return "Amazing!";
        }
        if (this.progress >= 85) {
          return "So close!";
        }
        if (this.progress >= 50) {
          return "More than halfway there!";
        }
        if (this.progress >= 25) {
          return "Keep it up!";
        }
        if (this.progress >= 0) {
          return "You can do it!";
        }
      } else {
        if (this.progress >= 100) {
          return "Limit reached!";
        }
        if (this.progress >= 85) {
          return "Be careful with the limit!";
        }
        if (this.progress >= 50) {
          return "Less than half of the limit left!";
        }
        if (this.progress >= 25) {
          return "You're doing great!";
        }
        if (this.progress >= 0) {
          return "Good luck!";
        }
      }
    },
    infoMessage() {
      let message = `Spent ${this.twoDigitRound(this.goal.progress)} hours on ${this.goal.category} so far. `;
      if (this.goal.type === 'goal') {
        if (this.goal.progress >= this.goal.hours) {
          message += `Goal reached!`;
        } else {
          message += `Only ${this.twoDigitRound(this.goal.hours - this.goal.progress)} hours left to reach the goal!`;
        }
      } else {
        if (this.goal.progress >= this.goal.hours) {
          message += `Reached the limit! Need to spend less time on this.`;
        } else {
          message += `Just ${this.twoDigitRound(this.goal.hours - this.goal.progress)} hours this week left to reach the limit, use it wisely!`;
        }
      }
      return message;
    }
  },
  methods: {
    twoDigitRound(x) {
      return Math.round(x * 100) / 100;
    },
    startEdit() {
      this.editing = true;
    },
    submitEdit(type, hours, category, isFriends) {
      fetch(`/api/goals/${this.goal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type, hours, category,
          private: !isFriends
        })
      }).then(res => res.json()).then(res => {
        if (res.error) {
          this.$buefy.toast.open({
            message: res.error,
            type: "is-danger"
          });
          return;
        }
        this.$buefy.toast.open({
          message: res.message,
          type: "is-success"
        });
        this.$emit("refreshGoals");
        this.editing = false;
      });
    },
    deleteGoal() {
      this.$emit("delete");
    },
  }
};
</script>

<style lang="scss" scoped>
@import '@/public/variables.scss';

article {
  background-color: $oc-gray-1;
  border: 2px solid $oc-gray-4;
  border-radius: 0.5em;
  margin: 1em 0;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

header {
  display: flex;
  align-items: center;
  gap: 2em;

  .visibility {
    display: flex;
    align-items: center;
    gap: 0.3em;
  }
  .goal-sentence {
    font-size: 1.2em;
  }

  .goal-actions {
    margin-left: auto;
    display: flex;
    gap: 1em;
  }

  .category-name {
    color: #087f5b;
    font-weight: bold;
  }
}


</style>