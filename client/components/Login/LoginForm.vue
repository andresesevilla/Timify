<template>
  <form @submit.prevent="onSubmit">
    <b-field
      label="Username"
      :type="{'is-danger': usernameError}"
      :message="usernameError"
    >
      <b-input v-model="username" />
    </b-field>

    <b-field 
      label="Password"
      :type="{'is-danger': passwordError}"
      :message="passwordError"
    >
      <b-input
        v-model="password"
        type="password"
        password-reveal
      />
    </b-field>

    <b-button type="is-primary" @click="onSubmit">
      Login
    </b-button>

    <b-notification :active="!!error" type="is-danger" has-icon icon-size="is-medium" closable>
      {{ error }}
    </b-notification>
    <!-- line below makes it possible to submit the form on enter keypress on any input -->
    <input type="submit" style="display: none" />
  </form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: null,
      password: null,
      usernameError: null,
      passwordError: null,
      error: null
    };
  },
  mounted() {
    document.querySelector('.media').style.alignItems = 'center';
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'Username is required.';
      } else if (!/^\w+$/i.test(this.username)) {
        this.usernameError = 'Username should only have letters and numbers.';
      } else {
        this.usernameError = null;
      }
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Password is required.';
      } else {
        this.passwordError = null;
      }
    },
    onSubmit() {
      this.validateUsername();
      this.validatePassword();
      if (this.usernameError || this.passwordError) {
        return;
      }
      this.error = null;
      fetch('/api/users/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        }),
      }).then(res => res.json()).then(res => {
        if (res.error) {
          this.error = res.error;
        } else {
          this.$store.commit('setUsername', res.user.username);
          this.$router.push('/');
          this.$buefy.toast.open({
            message: `Welcome back, ${res.user.username}!`,
            type: 'is-success'
          });
        }
      });
    }
  }
};
</script>

<style scoped>
article.notification.is-danger  {
  padding: 0.8rem;
  margin: 0;
  margin-top: 1em;
}
</style>