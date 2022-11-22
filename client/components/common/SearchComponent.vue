<!-- Search bar -->

<template>
    <form @submit.prevent="search" v-if="$store.state.username">
        <input type="text" placeholder="Search for a user..." v-model="usernameToSearch">
        <button type="submit"><span class="material-symbols-outlined">search</span></button>
    </form>
</template>
  
  
<script>
export default {
    data() {
        return {
            usernameToSearch: ''
        }
    },
    methods: {
        search() {
            let username = this.usernameToSearch;
            if (username.length > 0) {
                if (username.startsWith('@')) {
                    username = username.slice(1);
                }
                this.$router.push({ name: 'Profile', params: { username: username } });
                this.usernameToSearch = '';
            }
        }
    }
};
</script>
  
<style scoped>
button {
    padding: 5px 25px;
    height: 100%;
}

form {
    background-color: inherit;
    position: inherit;
    box-shadow: inherit;
    margin: 0;
    border-radius: inherit;
    padding: 0;

    display: grid;
    grid-auto-flow: column;
    align-items: center;

    box-shadow: var(--content-shadow);
    margin-left: 20px;
}

input {
    padding: 15px;
    height: 45px;
    width: 250px;
}
</style>
  