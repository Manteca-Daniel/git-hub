import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RepoDetails from '../views/RepoView.vue';
import SearchRepo from '../views/SearchView.vue';
import Token from '../views/TokenView.vue';
import Tickets from '../views/TicketsView.vue';
import CallbackView from '../views/CallbackView.vue';
import NotFound from '../components/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: true
    },
    {
      path: '/token',
      name: 'token',
      component: Token,
      props: true
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackView,
      props: true
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      props: true
    }, 
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      props: true
    },
    {
      path: '/search',
      name: 'serach',
      component: SearchRepo,
      props: true
    },
    {
      path: '/repo/:owner/:repoName',
      name: 'repo',
      component: RepoDetails,
      props: true
    },   
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    } 
  ],
})

export default router
