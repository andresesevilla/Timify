<template>
  <article v-if="isFeedUI">
    <header>
      <h3>
        <router-link :to="{ name: 'Profile', params: { username: goal.author } }">
          {{ goal.author }}
        </router-link>
      </h3>
      <span class="visibility"> <b-icon :icon="goal.visibility === 'friends' ? 'account-multiple' : 'lock'" /> {{ goal.visibility }} </span>
      <span class="goal-sentence"> Spend {{ goal.type === 'goal' ? 'at least' : 'at most'}} {{ goal.hours }} hours on {{ goal.category }} </span>
      <span class="goal-actions" v-if="allowEdit">
          <b-tooltip label="Edit"><a @click="startEdit"><b-icon icon="pencil" /></a></b-tooltip>
          <b-tooltip label="Delete"><a @click="deleteCategory"><b-icon icon="delete" /></a></b-tooltip>
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
  <article v-else>
    <header style="justify-content:space-between">
      <h3 style="color: #087f5b; fontWeight: 900">{{goal.category}}</h3>
      <span class="goal-sentence"> {{ goal.type === 'goal' ? '>' : '<'}} {{ goal.hours }} hours </span>
      <span class="goal-actions" v-if="allowEdit">
        <b-tooltip label="Edit"><a @click="startEdit"><b-icon icon="pencil" /></a></b-tooltip>
        <b-tooltip label="Delete"><a @click="deleteCategory"><b-icon icon="delete" /></a></b-tooltip>
      </span>
    </header>
    <p>{{ infoMessage }}</p>
    <section>
      <b-progress :value="progress" size="is-large" format="percent" :type="goal.type === 'goal' ? 'is-success' : 'is-info'" show-value>
        {{progress}}% {{progressMessage}}
      </b-progress>
    </section>
  </article>
</template>

<script>
export default {
  name: 'GoalComponent',
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
      editing: null,
      draft: {},
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
          return "Be careful with your limit!";
        }
        if (this.progress >= 50) {
          return "Less than half of your limit left!";
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
      let message = `You have spent ${Math.round(this.goal.progress * 100) / 100} hours on ${this.goal.category} so far. `;
      if (this.goal.type === 'goal') {
        if (this.goal.progress >= this.goal.hours) {
          message += `You have reached your goal!`;
        } else {
          message += `Only ${this.goal.hours - this.goal.progress} hours left to reach your goal!`;
        }
      } else {
        if (this.goal.progress >= this.goal.hours) {
          message += `You have reached your limit! Try to spend less time on this.`;
        } else {
          message += `Just ${this.goal.hours - this.goal.progress} hours this week left to reach your limit, use it wisely!`;
        }
      }
      return message;
    }
  },
  methods: {
    startEdit() {
      this.$buefy.toast.open({
        message: 'Editing is not yet implemented, delete and create a new goal instead. lol.',
        type: 'is-warning',
        duration: 3000,
      });
    },
    deleteCategory() {
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
}


</style>