<!-- Display goals on profile -->

<template>
  <main v-if="isValidUsername">
    <section>
      <header>
        <h1>Profile: @{{ $route.params.username }}</h1>
        <span class="actions">
          <router-link
            v-if="$route.params.username === $store.state.username"
            :to="{ name: 'Friends' }"
            ><b-button>View Friends</b-button></router-link
          >
          <router-link
            v-if="$route.params.username === $store.state.username"
            :to="{ name: 'Requests' }"
            ><b-button>View Friend Requests</b-button></router-link
          >
          <b-button
            v-for="action in friendStatusToAction[friendStatus]"
            :key="action"
            @click="action[1]"
            >{{ action[0] }}</b-button
          >
        </span>
      </header>
      <CreateGoalForm
        v-if="$route.params.username === $store.state.username"
        @refreshGoals="refreshGoals ^= 1"
      />
      <header>
        <h2>{{ $route.params.username }}'s Goals</h2>
      </header>
      <GoalListComponent
        :isFeedUI="false"
        :allowEdit="$route.params.username === $store.state.username"
        :fetchOptions="{ url: `/api/goals?author=${$route.params.username}` }"
        :key="refreshGoals"
        @refreshGoals="refreshGoals ^= 1"
      />
    </section>
  </main>
  <NotFound v-else />
</template>

<script>
import NotFound from "../../NotFound.vue";
import CreateGoalForm from "@/components/Goal/CreateGoalForm.vue";
import GoalListComponent from "@/components/Goal/GoalListComponent.vue";

export default {
  name: "ProfilePage",
  components: { NotFound, CreateGoalForm, GoalListComponent },
  mounted() {
    this.getFriendStatus();
  },
  data() {
    return {
      isValidUsername: true,
      friendStatus: undefined,
      refreshGoals: 0,
      friendStatusToAction: {
        no: [["Send Friend Request", this.sendRequest]],
        "request sent": [["Withdraw Friend Request", this.cancelRequest]],
        "request received": [
          ["Accept Friend Request", this.acceptRequest],
          ["Reject Friend Request", this.rejectRequest],
        ],
        friends: [["Remove Friend", this.removeFriend]],
      },
    };
  },
  watch: {
    $route() {
      this.friendStatus = undefined;
      this.getFriendStatus();
      this.refreshGoals ^= 1;
    },
  },
  methods: {
    sendRequest() {
      const url = `/api/friends/requests/${this.$route.params.username}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      this.handleRequestForFriend(url, options, "request sent");
    },
    cancelRequest() {
      const url = `/api/friends/requests/${this.$route.params.username}`;
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      this.handleRequestForFriend(url, options, "no");
    },
    acceptRequest() {
      const url = `/api/friends/requests/respond/${this.$route.params.username}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "accept" }),
      };
      this.handleRequestForFriend(url, options, "friends");
    },
    rejectRequest() {
      const url = `/api/friends/requests/respond/${this.$route.params.username}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "reject" }),
      };
      this.handleRequestForFriend(url, options, "no");
    },
    removeFriend() {
      const url = `/api/friends/list/${this.$route.params.username}`;
      const options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      this.handleRequestForFriend(url, options, "no");
    },
    handleRequestForFriend(url, options, newFriendStatus) {
      fetch(url, options)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.$buefy.toast.open({
              message: res.error,
              type: "is-danger",
            });
            return;
          }
          this.$buefy.toast.open({
            message: res.message,
            type: "is-success",
          });
          this.friendStatus = newFriendStatus;
        });
    },
    async getFriendStatus() {
      const profileUsername = this.$route.params.username;
      const loggedInUsername = this.$store.state.username;
      if (profileUsername === loggedInUsername) {
        return;
      }
      const url = `/api/friends/status/${profileUsername}`;
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";
main {
  max-width: 60em;
  margin: 0 auto;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  .actions {
    margin-left: auto;
    display: flex;
    gap: 0.5em;
  }
}
</style>