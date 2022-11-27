import Buefy from 'buefy';
import 'buefy/dist/buefy.css'; // this line coming before import App one is important (css rules)

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');