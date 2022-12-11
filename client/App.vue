<template>
  <div id="app">
    <TopBar />
    <router-view />
  </div>
</template>

<script>
import '@/public/main.scss';
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

    this.$store.commit('setPlaying', null);
  }
};
</script>

<style>
 @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
  
:root {
  --background-color: rgb(247, 247, 247);
  --content-color: rgb(253, 253, 253);
  --accent-color: #b44b4b;
  --text-color: #455358;
  --secondary-text-color: #909697;

  --content-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  --primary-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}


form {
  background-color: var(--content-color);
  padding: 30px;
  position: relative;
  box-shadow: var(--content-shadow);
  margin: 20px 0 20px;
  border-radius: 8px;
}


body {
  min-height: 100vh;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
  color: var(--text-color);
}

main {
  padding: 1em;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
}
h1 {
  font-size: 2rem;
}
h2 {
  font-size: 1.5rem;
}
h3 {
  font-size: 1.3rem;
}
h4 {
  font-size: 1rem;
}
h5 {
  font-size: 0.8rem;
}
h6 {
  font-size: 0.7rem;
}
</style>
