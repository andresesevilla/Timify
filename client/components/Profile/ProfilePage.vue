<!-- Display goals on profile -->

<template>
  <main v-if="isValidUsername">
    <section>
      <header>
        <h2>Profile: @{{ $route.params.username }}</h2>
      </header>
      <section class="button-row">
        <b-button @click="sendRequest"
          v-if="$route.params.username != $store.state.username && friendStatus === 'no'">Send
          Friend Request</b-button>
        <b-button @click="cancelRequest"
          v-if="$route.params.username != $store.state.username && friendStatus === 'request sent'">Cancel Friend
          Request</b-button>
        <b-button @click="acceptRequest"
          v-if="$route.params.username != $store.state.username && friendStatus === 'request received'">Accept Friend
          Request</b-button>
        <b-button @click="rejectRequest"
          v-if="$route.params.username != $store.state.username && friendStatus === 'request received'">Reject Friend
          Request</b-button>
        <b-button @click="removeFriend"
          v-if="$route.params.username != $store.state.username && friendStatus === 'friends'">Remove Friend</b-button>

        <router-link v-if="$route.params.username === $store.state.username" :to="{ name: 'Friends' }"><b-button>View
            Friends</b-button>
        </router-link>

      </section>
      <section v-if="friendStatus === 'friends'">
        <p class="info">You are friends.</p>
      </section>
      <section v-if="friendStatus === 'request sent'">
        <p class="info">You sent a friend request to @{{ $route.params.username }}, but they have not yet accepted.</p>
      </section>
      <section v-if="friendStatus === 'request received'">
        <p class="info">@{{ $route.params.username }} has sent you a friend request.</p>
      </section>
      <CreateGoalForm v-if="$route.params.username === $store.state.username" />
      <header>
        <h2>{{$route.params.username}}'s Goals</h2>
      </header>
      <GoalListComponent :allowEdit="true" :fetchOptions="{url: `/api/goals?author=${$route.params.username}`}" />
    </section>
  </main>
  <NotFound v-else />
</template>

<script>
import NotFound from '../../NotFound.vue';
import CreateGoalForm from '@/components/Goal/CreateGoalForm.vue';
import GoalListComponent from '@/components/Goal/GoalListComponent.vue';

export default {
  name: 'ProfilePage',
  components: { NotFound, CreateGoalForm, GoalListComponent },
  mounted() {
    this.getFriendStatus();
  },
  data() {
    return {
      isValidUsername: true,
      friendStatus: undefined,
    };
  },
  watch: {
    '$route'() {
      this.friendStatus = undefined;
      this.getFriendStatus();
    }
  },
  methods: {
    async sendRequest() {
      const url = `api/friends/requests/${this.$route.params.username}`;
      const options = {
        method: 'PUT',
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
          message: `Successfully sent friend request!`, status: 'success'
        });
        this.friendStatus = "request sent";
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    async cancelRequest() {
      const url = `api/friends/requests/${this.$route.params.username}`;
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
          message: `Successfully cancelled friend request!`, status: 'success'
        });
        this.friendStatus = "no";
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    async acceptRequest() {
      const url = `api/friends/requests/respond/${this.$route.params.username}`;
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      const fields = {
        response: "accept",
      }
      options.body = JSON.stringify(fields);
      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('alert', {
          message: `Successfully accepted friend request!`, status: 'success'
        });
        this.friendStatus = "friends";
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    async rejectRequest() {
      const url = `api/friends/requests/respond/${this.$route.params.username}`;
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      const fields = {
        response: "reject",
      }
      options.body = JSON.stringify(fields);
      try {
        const r = await fetch(url, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('alert', {
          message: `Successfully rejected friend request!`, status: 'success'
        });
        this.friendStatus = "no";
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    async removeFriend() {
      const url = `api/friends//list/${this.$route.params.username}`;
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
          message: `Successfully removed friend!`, status: 'success'
        });
        this.friendStatus = "no";
      } catch (e) {
        this.$store.commit('alert', {
          message: e, status: 'error'
        });
      }
    },
    async getFriendStatus() {
      const profileUsername = this.$route.params.username;
      const loggedInUsername = this.$store.state.username;
      if (profileUsername === loggedInUsername) {
        return;
      }
      const url = `api/friends/status/${profileUsername}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
        this.isValidUsername = true;
        this.friendStatus = res.status;
      } catch (e) {
        this.isValidUsername = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";
main {
  max-width: 60em;
  margin: 0 auto;
}
</style>