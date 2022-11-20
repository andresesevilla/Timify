<!-- Private Circle main page (create, view, edit) -->

<template>
  <main>
    <h2>Private Circles</h2>
    <p class="info">Allow you to post freets viewable only by followers in the Private Circle. Deleting a Private Circle will delete all freets posted to that Private Circle.</p>
    <CreatePrivateCircleForm />
    <section v-if="$store.state.privatecircles.length">
      <PrivateCircleComponent v-for="privatecircle in $store.state.privatecircles" :key="privatecircle.id" :privatecircle="privatecircle" :followers="followers" />
    </section>
    <section v-else>
      <h3>No Private Circles found.</h3>
    </section>
  </main>

</template>

<script>
import CreatePrivateCircleForm from '@/components/PrivateCircle/CreatePrivateCircleForm.vue';
import PrivateCircleComponent from '@/components/PrivateCircle/PrivateCircleComponent.vue';

export default {
  name: 'PrivateCirclePage',
  components: { CreatePrivateCircleForm, PrivateCircleComponent },
  async mounted() {
    const followPromise =  this.getFollowers();
    const privateCirclePromise = this.$store.commit('refreshPrivateCircles');
    await followPromise;
    await privateCirclePromise;
  },
  data() {
    return {
      username: '',
      followers: []
    };
  },
  methods: {
    async getFollowers() {
      const username = this.$store.state.username;
      const query = 'followee';
      const desired = 'follower';
      const url = `/api/follows?${query}Username=${username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.isValidUsername = true;
        this.followers = res.map((value) => { return value[desired] });
      } catch (e) {
        this.isValidUsername = false;
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
  }
};
</script>