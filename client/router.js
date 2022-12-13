import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeWrapper from './components/Home/HomeWrapper.vue';
import FeedPage from './components/Feed/FeedPage.vue';
import SettingsPage from './components/Settings/SettingsPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import FriendPage from './components/Friend/FriendPage.vue';
import FriendRequestsPage from './components/Friend/FriendRequestsPage.vue';
import CategoriesPage from './components/Category/CategoriesPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomeWrapper },
  { path: '/feed', name: 'Feed', component: FeedPage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/user/:username', name: 'Profile', component: ProfilePage },
  { path: '/friends', name: 'Friends', component: FriendPage },
  { path: '/requests', name: 'Requests', component: FriendRequestsPage },
  { path: '/categories', name: 'Categories', component: CategoriesPage },
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
    if (to.path === '/my' && router.app.$store.state.username) {
      next({ name: 'Profile', params: { username: router.app.$store.state.username } });
      return;
    }
  }

  next();
});

export default router;
