import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export function getDefaultState() {
  return {
    username: null, // Username of the logged in user
    playing: {},
    events: []
  };
}

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: getDefaultState(),
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setPlaying(state, playingEvent) {
      state.playing = playingEvent;
    },
    setEvents(state, events) {
      state.events = events;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
