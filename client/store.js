import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export function getDefaultState() {
  return {
    username: null, // Username of the logged in user
    playing: {},
    categories: null,
    events: []
  };
}

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: getDefaultState(),
  actions: {
    fetchCategories({commit}) {
      commit("setCategories", null);
      return fetch("/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        commit("setCategories", categories.map(c => c.name));
      });
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setPlaying(state, playingEvent) {
      state.playing = playingEvent;
    },
    setEvents(state, events) {
      state.events = events;
    },
    setCategories(state, categories) {
      state.categories = categories;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
