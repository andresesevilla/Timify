<template>
  <article>
    <header>
      <h3>
        <router-link :to="{ name: 'Profile', params: { username: goal.author } }">
          {{ goal.author }}
        </router-link>
      </h3>
      <span class="visibility"> <b-icon :icon="goal.visibility === 'friends' ? 'account-multiple' : 'lock'" /> {{ goal.visibility }} </span>
      <span> Spend {{ goal.type === 'goal' ? 'at least' : 'at most'}} {{ goal.hours }} hours on {{ goal.category }} </span>
    </header>
    <section>
      <b-progress :value="goal.progress" size="is-large" format="percent" type="is-success" show-value />
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
    }
  },
  methods: {
  
  }
};
</script>

<style lang="scss" scoped>
@import '@/public/variables.scss';

article {
  background-color: $oc-gray-4;
  border-radius: 0.5em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
  margin: 1em 0;
  padding: 1em;
}

header {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  gap: 2em;
  margin-bottom: 1em;

  .visibility {
    display: flex;
    align-items: center;
    gap: 0.3em;
  }
}


</style>