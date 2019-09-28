import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Flows from './views/Flows';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/flows/:id?',
      name: 'flows',
      component: Flows,
    },
  ],
});
