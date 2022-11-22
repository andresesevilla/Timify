<template>
  <main v-if="isValidUsername">
    <section>
      <header>
        <h2>
          Friends:&nbsp;
          <router-link :to="{ name: 'Profile', params: { username: $route.params.username } }">
            @{{ $route.params.username }}
          </router-link>
        </h2>
        <p class="info">@{{ $route.params.username }} is friends with the following users.</p>
      </header>
      <article v-if="friends.length === 0">
        <h3>No friends found.</h3>
      </article>
      <article v-else="friends.length" v-for="friend in friends">
        <router-link :to="{ name: 'Profile', params: { username: friend } }"> @{{ friend }}
        </router-link>
      </article>
    </section>
  </main>
  <NotFound v-else />
</template>

<script>
import NotFound from '../../NotFound.vue';

export default {
  name: 'FriendPage',
  components: { NotFound },
  async mounted() {
    await this.getFriends();
  },
  data() {
    return {
      isValidUsername: true,
      friends: []
    };
  },
  watch: {
    async '$route'() {
      await this.getFriends();
    }
  },
  methods: {
    async getFriends() {
      const username = this.$route.params.username;
      const url = `/api/friends/list/${username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.isValidUsername = true;
        this.friends = res.map((value) => { return value.friendship[0] !== username ? value.friendship[0] : value.friendship[1] })
      } catch (e) {
        this.isValidUsername = false;
      }
    }
  }
};
</script>