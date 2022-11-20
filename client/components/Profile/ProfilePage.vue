<!-- Display goals on profile -->

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
        <section v-if="$store.state.goals.length">
          <GoalComponent v-for="goal in $store.state.goals" :key="goal.id" :goal="goal" />
        </section>
        <article v-else>
          <h3>No goals found.</h3>
        </article>
      </section>
    </main>
    <NotFound v-else />
</template>

<script>
import NotFound from '../../NotFound.vue';
import GoalComponent from '@/components/Goal/GoalComponent.vue';

export default {
  name: 'ProfilePage',
  components: { NotFound, GoalComponent },
  async mounted() {
    const getGoals = this.getGoals();
    const getFollower = this.getFollower();
    const getFollowing = this.getFollowing();
    await getGoals;
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
      const getGoals = this.getGoals();
      const getFollower = this.getFollower();
      const getFollowing = this.getFollowing();
      await getGoals;
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
          await this.getGoals();
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
    async getGoals() {
      const username = this.$route.params.username
      const url = `/api/goals?author=${username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.isValidUsername = true;
        this.$store.commit('updateFilter', username);
        this.$store.commit('updateGoals', res);
      } catch (e) {
        this.isValidUsername = false;
      }
    }
  }
};
</script>
