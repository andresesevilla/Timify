<!-- Display freets on profile -->

<template>
    <main v-if="isValidUsername">
      <section>
        <header>
          <h2>Profile: @{{ $route.params.username }}</h2>
        </header>
        <section class="button-row">
          <button @click="submit" v-if="$route.params.username != $store.state.username">{{following ? 'Unfollow' : 'Follow'}}</button>
          <router-link :to="{ name: 'Following', params: { username: $route.params.username } }"><button>View Following</button>
          </router-link>
          <router-link :to="{ name: 'Followers', params: { username: $route.params.username } }"><button>View Followers</button>
          </router-link>
        </section>
        <section v-if="follower && following">
          <p class="info">You follow each other.</p>
        </section>
        <section v-if="follower && !following">
          <p class="info">@{{ $route.params.username }} follows you, but you do not follow them back.</p>
        </section>
        <section v-if="!follower && following">
          <p class="info">You are following @{{ $route.params.username }}, but they do not follow you back.</p>
        </section>
        <section v-if="$store.state.freets.length">
          <FreetComponent v-for="freet in $store.state.freets" :key="freet.id" :freet="freet" />
        </section>
        <article v-else>
          <h3>No freets found.</h3>
        </article>
      </section>
    </main>
    <NotFound v-else />
</template>

<script>
import NotFound from '../../NotFound.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: { NotFound, FreetComponent },
  async mounted() {
    const getFreets = this.getFreets();
    const getFollower = this.getFollower();
    const getFollowing = this.getFollowing();
    await getFreets;
    await getFollower;
    await getFollowing;
  },
  data() {
    return {
      isValidUsername: true,
      follower: false,
      following: false
    };
  },
  watch: {
    async '$route'() {
      this.follower = false;
      this.following = false;
      const getFreets = this.getFreets();
      const getFollower = this.getFollower();
      const getFollowing = this.getFollowing();
      await getFreets;
      await getFollower;
      await getFollowing;
    }
  },
  methods: {
    async submit() {
      if (!this.following) {
        const url = 'api/follows'
        const fields = { username: this.$route.params.username }
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        options.body = JSON.stringify(fields);

        try {
          const r = await fetch(url, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('alert', {
            message: `Successfully followed user!`, status: 'success'
          });
          this.following = true;
        } catch (e) {
          this.$store.commit('alert', {
            message: e, status: 'error'
          });
        }


      } else {
        const url = `api/follows/${this.$route.params.username}`
        const fields = { username: this.$route.params.username }
        const options = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin' // Sends express-session credentials with request
        };

        try {
          const r = await fetch(url, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }
          this.$store.commit('alert', {
            message: `Successfully unfollowed user!`, status: 'success'
          });
          this.following = false;
          await this.getFreets();
        } catch (e) {
          this.$store.commit('alert', {
            message: e, status: 'error'
          });
        }
      }
    },
    async getFollowing() {
      const profileUsername = this.$route.params.username;
      const loggedInUsername = this.$store.state.username;
      if (profileUsername === loggedInUsername) {
        return;
      }
      const url = `/api/follows?followerUsername=${loggedInUsername}&followeeUsername=${profileUsername}`;
      const r = await fetch(url);
      if (r.status !== 204) {
        this.following = true;
      }
    },
    async getFollower() {
      const profileUsername = this.$route.params.username;
      const loggedInUsername = this.$store.state.username;
      if (profileUsername === loggedInUsername) {
        return;
      }
      const url = `/api/follows?followerUsername=${profileUsername}&followeeUsername=${loggedInUsername}`;
      const r = await fetch(url);
      if (r.status !== 204) {
        this.follower = true;
      }
    },
    async getFreets() {
      const username = this.$route.params.username
      const url = `/api/freets?author=${username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.isValidUsername = true;
        this.$store.commit('updateFilter', username);
        this.$store.commit('updateFreets', res);
      } catch (e) {
        this.isValidUsername = false;
      }
    }
  }
};
</script>
