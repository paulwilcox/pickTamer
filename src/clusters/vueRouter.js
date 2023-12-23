import Vue from 'vue';
import Router from 'vue-router';
import clustersVue from './clusters.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/clusters',
      name: 'Clusters',
      component: clustersVue
    },
  ],
});