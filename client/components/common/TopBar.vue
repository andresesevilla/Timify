<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="@/public/logo-accent.svg" />
        <h2>Timify</h2>
      </b-navbar-item>
    </template>

    <template #start>
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button tag="router-link" to="/">
            <b-icon icon="home" size="is-small" />
            Home
          </b-button>
        </div>
      </b-navbar-item>
    </template>

    <template #end v-if="$store.state.username">
      <b-navbar-item tag="div">
        <div class="buttons">
          <b-button tag="router-link" to="/feed" class="button is-primary">
            <b-icon icon="view-list" size="is-small" />
            Feed
          </b-button>
          <b-button tag="router-link" :to="{ name: 'Profile', params: {username: $store.state.username} }" class="button is-primary">
            <b-icon icon="account" size="is-small" />
            Profile
          </b-button>
          <b-button @click="logout" class="button is-light">
            <b-icon icon="logout" size="is-small" />
            Logout
          </b-button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { getDefaultState } from "@/store";

export default {
  name: "TopBar",
  methods: {
    logout() {
      fetch('/api/users/session', {
        method: 'DELETE',
      }).then(() => {
        this.$store.replaceState(getDefaultState());
        this.$router.push('/');
        this.$buefy.toast.open({
          message: 'You have been logged out.',
          type: 'is-info',
        });
      });
    },
  },
};
</script>

<style scoped>
nav {
  background-color: #78C3FB;
}
h2 {
  margin-left: 10px;
  font-size: 1.5rem;
  font-weight: 300;
}

img {
  height: 2.5rem;
}
.icon {
  margin-right: 0 !important;
}
</style>