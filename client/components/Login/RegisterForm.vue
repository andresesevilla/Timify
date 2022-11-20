<!-- Form for registering an account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'RegisterForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'POST',
      hasBody: true,
      setUsername: true,
      fields: [
        { id: 'username', label: 'Username', value: '' },
        { id: 'password', label: 'Password', value: '' }
      ],
      title: 'Create account',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Successfully created an account!', status: 'success'
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
