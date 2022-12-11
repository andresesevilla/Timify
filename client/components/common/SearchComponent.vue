<template>
  <form @submit.prevent="submit">
    <b-input v-model="username" placeholder="Search for a user" />
    <b-tooltip label="Search" position="is-bottom"><a @click="submit"><b-icon icon="account-search" /></a></b-tooltip>

    <input type="submit" style="display: none" />
  </form>
</template>
  
  
<script>
export default {
  name: "SearchComponent",
  data() {
    return {
      username: "",
    };
  },
  methods: {
    submit() {
      if (!this.username) {
        return;
      }
      const url = `/api/friends/status/${this.username}`;
      const username = this.username;
      fetch(url)
        .then((response) => {
          if (response.status === 404) {
            this.$buefy.toast.open({
              message: "User not found",
              type: "is-warning",
            });
          } else {
            this.$router.push({
              name: "Profile",
              params: { username: username },
            });
          }
        });
      this.username = "";
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "@/public/variables.scss";

form {
  margin: 0;
  padding: 0;
  display: flex;
  background: none;
  
  align-items: center;
  gap: 1em;
  margin-right: 2em;
  box-shadow: none;
}

.icon {
  color: #f1f3f5;
  :hover {
    color: white;
  }
}

</style>
  