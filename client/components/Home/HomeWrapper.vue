<!-- Default page: login and feed -->

<template>
  <HomeComponent v-if="$store.state.username" />
  <LoginComponent v-else />
</template>

<script>
import LoginComponent from '@/components/Login/LoginComponent.vue';
import HomeComponent from '@/components/Home/HomeComponent.vue';

export default {
  name: 'HomeWrapper',
  components: { LoginComponent, HomeComponent },
  mounted() {
  }
};
</script>