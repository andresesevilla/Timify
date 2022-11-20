<!-- Form for creating Private Circles (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreatePrivateCircleForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/privatecircles',
      method: 'POST',
      hasBody: true,
      fields: [
        { id: 'name', label: 'Name', value: '' }
      ],
      title: 'Create a Private Circle',
      refreshPrivateCircles: true,
      callback: () => {
        this.$store.commit('alert', {
          message: 'Successfully created a Private Circle!', status: 'success'
        });
      },
      validation: (json) => {
        if (json.name.length === 0) {
          return 'Private Circle name must be at least one character long.';
        }
        if (!/^[\w\-\s]+$/.test(json.name)) {
          return 'Private Circle name must contain only letters, numbers, and spaces.';
        }
        return null;
      }
    };
  }
};
</script>
