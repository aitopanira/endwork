import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { LogIn } from '@vicons/ionicons5'
import LoginView from '@/views/LoginView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GalgameDetailView from '@/views/GalgameDetailView.vue'
import NovelDetailView from '@/views/NovelDetailView.vue'
import CommunityView from '@/views/CommunityView.vue'  
import GalgameView from '@/views/GalgameView.vue'
import NovelView from '@/views/NovelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
  {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetailView
    },
    { 
      path: '/profile', 
      name: 'profile', 
      component: ProfileView
    },
    { 
      path: '/galgame', 
      name: 'galgame', 
      component: GalgameView
    },
      { 
      path: '/galgame/:id', 
      name: 'galgame-detail', 
      component: GalgameView
    },
    { 
      path: '/novel', 
      name: 'novel', 
      component: NovelView
    },
    { 
      path: '/novel/:id', 
      name: 'novel-detail', 
      component: NovelDetailView
    },
    { 
      path: '/community', 
      name: 'community', 
      component: CommunityView
    },
  ],
})

export default router
