<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePasswordForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        { id: 'password', label: 'Password', value: '' }
      ],
      title: 'Change password',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Successfully changed password!', status: 'success'
        });
      },
      validation: (json) => {
        if (!/^\S+$/.test(json.password)) {
          return 'Password must be a nonempty string with no spaces.'
        }
        return null;
      }
    };
  }
};
</script>
