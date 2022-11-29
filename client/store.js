import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export function getDefaultState() {
  return {
    showAllGoals: false, // By default, don't show all goals (show feed instead)
    filter: null, // Username to filter shown goals by (null = show all) (overrides showAllGoals)
    goals: [], // All goals created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    categories: []
  };
}

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: getDefaultState(),
  actions: {
    fetchCategories: async function({ commit }) {
      return fetch('/api/categories')
        .then(response => response.json())
        .then(categories => commit('setCategories', categories));
    },
    updateCategories: async function({ commit }, categories) {
      return fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categories)
      });
        // .then(response => response.json())
        // .then(categories => commit('setCategories', categories));
    }
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
    setShowAllGoals(state, value) {
      /**
       * Update whether all goals are shown
       * @param value - new value to set
       */
      state.showAllGoals = value;
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
       * Update the stored goals filter to the specified one.
       * @param filter - Username of the user to filter goals by
       */
      state.filter = filter;
    },
    updateGoals(state, goals) {
      /**
       * Update the stored goals to the provided goals.
       * @param goals - Goals to store
       */
      state.goals = goals;
    },
    async refreshGoals(state) {
      /**
       * Request the server for the currently available goals.
       */
      let url = state.showAllGoals ? '/api/goals' : '/api/goals?feed';
      if (state.filter) {
        url = `/api/goals?author=${state.filter}`;
      }
      const res = await fetch(url).then(async r => r.json());
      state.goals = res;
    },
    setCategories(state, categories) {
      state.categories = categories;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
