<template>
  <main v-if="isValidUsername">
    <section>
      <header>
        <h2>
          My friends
        </h2>
      </header>
      <article v-if="friends.length === 0">
        <h3>No friends found. Explore and work through your goals together!</h3>
      </article>
      <ul v-else>
        <li v-for="friend in friends" :key="friend.username">
          <span>
            <router-link :to="{ name: 'Profile', params: { username: friend.username } }">
              {{ friend.username }}
            </router-link>
          </span>
          <span>
            since {{ friend.since }}
          </span>
          <span>
            <b-button @click="unfriend(friend)">Unfriend</b-button>
          </span>
        </li>
      </ul>
    </section>
  </main>
  <NotFound v-else />
</template>

<script>
import NotFound from "../../NotFound.vue";
import moment from "moment";

export default {
  name: "FriendPage",
  components: { NotFound },
  data() {
    return {
      isValidUsername: true,
      friends: [],
    };
  },
  watch: {
    async $route() {
      await this.getFriends();
    },
  },
  async mounted() {
    await this.getFriends();
  },
  methods: {
    async getFriends() {
      fetch(`/api/friends/list`)
        .then((response) => response.json())
        .then((friends) => {
          this.friends = friends.map(friend => {
            return {
              username: friend.friendship.filter(friend => friend !== this.$store.state.username)[0],
              since: moment(friend.dateFriends).format("D MMM YYYY")
            }
          });
        });
    },
    async unfriend(friend) {
      fetch(`/api/friends/list/${friend.username}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((res) => {
          this.friends = this.friends.filter((f) => f !== friend);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";

main {
  max-width: 40em;
  margin: 0 auto;
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
</style>