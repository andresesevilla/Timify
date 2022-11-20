<!-- Default page: login and feed -->

<template>
  <GoalsComponent v-if="$store.state.username" />
  <LoginComponent v-else />
</template>

<script>
import LoginComponent from '@/components/Login/LoginComponent.vue';
import GoalsComponent from '@/components/Goal/GoalsComponent.vue';

export default {
  name: 'HomePage',
  components: { LoginComponent, GoalsComponent },
  mounted() {
  }
};
</script>