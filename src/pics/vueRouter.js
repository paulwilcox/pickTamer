import Vue from 'vue';
import Router from 'vue-router';
import picsVue from './pics.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/pics',
      name: 'Pictures',
      component: picsVue,
      props: true
    }
  ],
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach called:', to, from);
  next();
});