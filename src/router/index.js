import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RepoDetails from '../views/RepoView.vue';
import SearchRepo from '../views/SearchView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/search',
      name: 'serach',
      component: SearchRepo,
      props: true
    },
    {
      path: '/repo/:repoName',
      name: 'repo',
      component: RepoDetails,
      props: true
    },
  ],
})

export default router
