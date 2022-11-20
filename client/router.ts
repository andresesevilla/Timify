import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from './components/Home/HomePage.vue';
import SettingsPage from './components/Settings/SettingsPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import FollowPage from './components/Follow/FollowPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/@:username', name: 'Profile', component: ProfilePage },
  { path: '/@:username/followers', name: 'Followers', component: FollowPage },
  { path: '/@:username/following', name: 'Following', component: FollowPage },
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name !== 'Home' && !router.app.$store.state.username) {
      next({ name: 'Home' }); // Go to Home page if user navigates to any other page and are not signed in
      return;
    }
  }

  next();
});

export default router;
