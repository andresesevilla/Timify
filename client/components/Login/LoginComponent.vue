<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>

  <main>
    <b-tabs expanded :animated="false">
      <b-tab-item label="Login" icon="login">
        <h2>Have an account?</h2>
        <LoginForm />
      </b-tab-item>
      <b-tab-item label="Register" icon="account-plus">
        <h2>New to Timify?</h2>
        <RegisterForm />
      </b-tab-item>
    </b-tabs>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style scoped>
main {
  max-width: 40em;
  margin: auto;
}
</style>