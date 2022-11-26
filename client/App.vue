<template>
  <div id="app">
    <TopBar />
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/components/common/TopBar.vue';

export default {
  name: 'App',
  components: { TopBar },
  beforeCreate() {
    // Sync stored username to current session
    fetch('/api/users/session', {
      credentials: 'same-origin' // Sends express-session credentials with request
    }).then(res => res.json()).then(res => {
      const user = res.user;
      this.$store.commit('setUsername', user ? user.username : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

:root {
  --background-color: rgb(247, 247, 247);
  --content-color: rgb(253, 253, 253);
  --accent-color: #b44b4b;
  --text-color: #455358;
  --secondary-text-color: #909697;

  --content-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  --primary-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

a {
  color: var(--accent-color);
}

h3 {
  margin: 0;
}

.info {
  color: var(--secondary-text-color);
}

* {
  box-sizing: border-box;
  overflow-wrap: break-word;
}

textarea {
  padding: 5px 5px;
  border: 1px solid var(--text-color);
  resize: none;
  font-size: 1.2em;
  font-family: inherit;
  height: 100px;
}

select {
  font-size: 1em;
}

input {
  padding: 5px 5px;
  border: 1px solid var(--text-color);
  resize: none;
}

button {
  background-color: var(--accent-color);
  border: none;
  color: var(--background-color);
  padding: 15px 25px;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  transition-duration: 0.2s;

  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: 10px;
}

button:hover {
  box-shadow: var(--primary-shadow);
}

.button-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

article,
form {
  background-color: var(--content-color);
  padding: 30px;
  position: relative;
  box-shadow: var(--content-shadow);
  margin: 20px 0 20px;
  border-radius: 8px;
}

nav {
  box-shadow: var(--primary-shadow);
  background-color: var(--accent-color);
  color: var(--background-color);
  font-size: 16px;
}

body {
  background-color: var(--background-color);
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;

  font-size: 1.2em;
  color: var(--text-color);
}

main {
  max-width: 1000px;
  padding: 0 5em 1em 5em;
  margin: 110px auto 0px auto !important;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 10px 30px 10px 30px;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(16, 134, 71);
}
</style>
