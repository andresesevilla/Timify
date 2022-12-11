<template>
  <main>
    <h1>Friend requests</h1>  
    <article v-if="friendRequests.length === 0">
        <h3>No friend request, come back later!</h3>
    </article>
    <ul v-else>
      <li v-for="request in friendRequests" :key="request.username">
        <span>
          <router-link :to="{ name: 'Profile', params: { username: request.username } }">
            {{ request.username }}
          </router-link>
        </span>
        <span>
          requested on {{ request.since }}
        </span>
        <span class="actions">
          <b-button @click="respondRequest(request, 'accept')">Accept</b-button>
          <b-button @click="respondRequest(request, 'reject')">Decline</b-button>
        </span>
      </li>
    </ul>

  </main>
</template>

<script>
import moment from "moment";

export default {
  name: "FriendRequestsPage",
  data() {
    return {
      friendRequests: [],
      friendRequestsLoading: true,
    };
  },
  mounted() {
    this.fetchFriendRequests();
  },
  methods: {
    fetchFriendRequests() {
      fetch("/api/friends/requests")
        .then((response) => response.json())
        .then((friendRequests) => {
          this.friendRequests = friendRequests.map(r => {
            return {
              since: moment(r.dateRequested).format("D MMM YYYY"),
              username: r.requesterUsername,
            }
          }).filter(r => r.username !== this.$store.state.username);
          this.friendRequestsLoading = false;
        });
    },
    respondRequest(request, response) {
      fetch(`/api/friends/requests/respond/${request.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({response}),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            this.$buefy.toast.open({
              message: response.error,
              type: "is-danger",
            });
            return;
          }
          this.$buefy.toast.open({
            message: response.message,
            type: "is-success",
          });
          this.fetchFriendRequests();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";

main {
  max-width: 60em;
  margin: 0 auto;
}
h1 {
  margin-bottom: 0.5em;
}
ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 1em;
  gap: 0.5em;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid $oc-gray-4;
  padding: 0.5em;
  border-radius: 0.5em;
}
.actions {
  display: flex;
  gap: 0.5em;
}
</style>