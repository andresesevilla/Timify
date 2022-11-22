<template>
  <main>
    <section>
      <header class="freet-header">
        <h2>Your Feed</h2>
        <SearchComponent />
      </header>
      <GoalFeedComponent/>
    </section>
  </main>
</template>

<script>
import GoalComponent from '@/components/Goal/GoalComponent.vue';
import GoalFeedComponent from '@/components/Goal/GoalFeedComponent.vue';
import SearchComponent from '@/components/common/SearchComponent.vue';

export default {
  name: 'Feedpage',
  components: { GoalComponent, SearchComponent, GoalFeedComponent },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>