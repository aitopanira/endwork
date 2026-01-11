import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user' // 引入 Store
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GalgameDetailView from '@/views/GalgameDetailView.vue'
import NovelDetailView from '@/views/NovelDetailView.vue'
import GalgameView from '@/views/GalgameView.vue'
import NovelView from '@/views/NovelView.vue'
import BrandDetailView from '@/views/BrandDetailView.vue'

import ReaderView from '@/views/ReaderView.vue'
import CreatorCenterView from '@/views/CreatorCenterView.vue'
import UserLibraryView from '@/views/UserLibraryView.vue'
import SearchView from '@/views/SearchView.vue'

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
      component: LoginView,
      meta: { requiresAuth: false } // 明确标记登录页不需要验证
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetailView
    },
    { 
      path: '/profile', 
      name: 'profile', 
      component: ProfileView,
      meta: { requiresAuth: true } // 🔒 保护：个人资料需要登录
    },
    { 
      path: '/galgame', 
      name: 'galgame', 
      component: GalgameView
    },
    { 
      path: '/galgame/:id', 
      name: 'galgame-detail', 
      component: GalgameDetailView
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
      path: '/brand/:name', 
      name: 'brand-detail', 
      component: BrandDetailView
    },
    {
      path: '/read/:id',
      name: 'reader',
      component: ReaderView,
      meta: { requiresAuth: true }
    },
    {
      path: '/creator',
      name: 'creator',
      component: CreatorCenterView,
      meta: { requiresAuth: true } // 🔒 保护：创作中心需要登录
    },
    {
      path: '/library',
      name: 'library',
      component: UserLibraryView,
      meta: { requiresAuth: true } // 🔒 保护：资源库需要登录
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    }
  ],
})

// === 路由守卫核心逻辑 ===
router.beforeEach((to, from, next) => {
  // 必须在 guard 内部获取 store
  const userStore = useUserStore()

  // 1. 检查目标路由是否需要认证
  if (to.meta.requiresAuth) {
    // 2. 检查是否已登录 (是否有 token)
    if (userStore.isLoggedIn()) {
      next() // 已登录，放行
    } else {
      // 3. 未登录，跳转到登录页，并带上 redirect 参数
      next({ 
        path: '/login', 
        query: { redirect: to.fullPath } 
      })
    }
  } else {
    // 不需要认证的页面直接放行
    next()
  }
})

export default router