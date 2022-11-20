<!-- Form for signing in (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'LoginForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users/session',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
        {id: 'password', label: 'Password', value: ''}
      ],
      title: 'Sign in',
      callback: () => {
        this.$store.commit('alert', {
          message: 'You are now signed in!', status: 'success'
        });
      },
      validation: (json) => {
        if (!/^\S+$/.test(json.password)) {
          return 'Password must be a nonempty string with no spaces.'
        }
        if (!/^\w+$/i.test(json.username)) {
          return 'Username must be a nonempty alphanumeric string.'
        }
        return null;
      }
    };
  }
};
</script>
