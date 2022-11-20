import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    showAllFreets: false, // By default, don't show all freets (show feed instead)
    filter: null, // Username to filter shown freets by (null = show all) (overrides showAllFreets)
    freets: [], // All freets created in the app
    privatecircles: [], // All private circles of the logged in user
    shieldedTopics: [],
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setShowAllFreets(state, value) {
      /**
       * Update whether all freets are shown
       * @param value - new value to set
       */
      state.showAllFreets = value;
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to filter freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      let url = state.showAllFreets ? '/api/freets' : '/api/freets?feed';
      if (state.filter) {
        url = `/api/freets?author=${state.filter}`;
      }
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshPrivateCircles(state) {
      /**
       * Request the server for the user's Private Circles.
       */
      state.privatecircles = [];
      const url = '/api/privatecircles';
      const res = await fetch(url).then(async r => r.json());
      state.privatecircles = res.privateCircles;
    },
    async refreshShieldedTopics(state) {
      /**
       * Request the server for the user's shielded topics.
       */
       state.shieldedTopics = [];
      const url = '/api/anxietyshield';
      const res = await fetch(url).then(async r => r.json());
      state.shieldedTopics = res.anxietyShield.shieldedTopics;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
