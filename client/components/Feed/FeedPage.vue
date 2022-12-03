<template>
  <main>
    <section>
      <header class="freet-header">
        <h2>Friends' goals</h2>
      </header>
      <GoalListComponent :fetchOptions="{url: '/api/goals?feed=true'}" :allowEdit="false" />
    </section>
  </main>
</template>

<script>
import GoalListComponent from '@/components/Goal/GoalListComponent.vue';

export default {
  name: 'Feedpage',
  components: { GoalListComponent },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
main {
  max-width: 60em;
  margin: 0 auto;
}
</style>