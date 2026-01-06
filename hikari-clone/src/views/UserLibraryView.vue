<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NMenu, NButton, NIcon, NCard, NTabs, NTabPane, NTag, NEmpty, NAvatar, NGrid, NGi 
} from 'naive-ui'
import { 
  BookOutline, 
  GameControllerOutline, 
  DocumentTextOutline, 
  HeartOutline, 
  TimeOutline, 
  CheckmarkCircleOutline,
  ArrowForwardOutline,
  LibraryOutline // 新增图书馆图标
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// === 菜单配置 ===
const activeKey = ref('galgames') // 默认显示 Galgame

const menuOptions = [
  { 
    label: 'Galgame 库', 
    key: 'galgames', 
    icon: () => h(NIcon, null, { default: () => h(GameControllerOutline) }) 
  },
  { 
    label: '轻小说书架', 
    key: 'novels', 
    icon: () => h(NIcon, null, { default: () => h(BookOutline) }) 
  },
  { 
    label: '文章收藏', 
    key: 'articles', 
    icon: () => h(NIcon, null, { default: () => h(DocumentTextOutline) }) 
  },
]

// 粉色主题覆盖 (与创作者中心保持一致)
const menuThemeOverrides = {
  itemColorActive: 'rgba(251, 114, 153, 0.1)',
  itemColorActiveHover: 'rgba(251, 114, 153, 0.15)',
  itemTextColorActive: '#fb7299',
  itemIconColorActive: '#fb7299',
  itemColorHover: 'rgba(251, 114, 153, 0.05)',
  itemTextColorHover: '#fb7299',
  itemIconColorHover: '#fb7299'
}

// === 模拟数据 ===

// Galgame 数据
const galgameData = {
  wish: [
    { id: 101, title: '樱之诗', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', dev: '枕' },
    { id: 102, title: '夏日口袋', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', dev: 'Key' }
  ],
  playing: [
    { id: 103, title: '天使☆骚骚 RE-BOOT!', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', dev: 'YUZUSOFT', progress: '共通线' }
  ],
  played: [
    { id: 104, title: '千恋＊万花', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', dev: 'YUZUSOFT', score: 9.5 }
  ]
}

// 轻小说数据
const novelData = {
  favorites: [
    { id: 201, title: '败犬女主太多了！', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', author: '雨森焚火' },
    { id: 202, title: '也就是弹幕游戏', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', author: '镰池和马' }
  ],
  read: [
    { id: 203, title: '刀剑神域', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', author: '川原砾' }
  ]
}

// 文章收藏数据
const favArticles = ref([
  { 
    id: 1, 
    title: '【Gal周报】十二月新作本周发售，《缘起甜韵》登陆Steam', 
    author: '官方Bot', 
    avatar: '官',
    summary: '十二月新作已于本周发售，一共有五部作品，其中PC平台有四部作品...',
    time: '2025-12-24'
  },
  { 
    id: 2, 
    title: '关于“剧情作”与“废萌作”的深度解析', 
    author: '老二次元', 
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    summary: '最近看到很多人争论剧情和画风哪个重要，其实我觉得...',
    time: '2025-12-20'
  }
])

const goToDetail = (path) => router.push(path)
</script>

<template>
  <div class="h-[calc(100vh-64px)] bg-[#f9fafb] flex">
    
    <div class="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
      <div class="p-6">
        <h2 class="font-bold text-xl text-gray-800 flex items-center gap-2">
          <span class="text-pink-500 bg-pink-50 p-1.5 rounded-lg"><n-icon :component="LibraryOutline"/></span> 
          我的书架
        </h2>
      </div>
      
      <n-menu 
        v-model:value="activeKey" 
        :options="menuOptions" 
        :theme-overrides="menuThemeOverrides"
        class="flex-grow"
      />
      
      <div class="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
        Hikari Library v1.0
      </div>
    </div>

    <div class="flex-grow overflow-y-auto p-8">
      
      <div v-if="activeKey === 'galgames'" class="max-w-5xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">Galgame 游戏库</h2>
          <span class="text-gray-400 text-sm">记录你的攻略历程</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="line" animated size="large" justify-content="start" class="px-6 pt-4">
            
            <n-tab-pane name="playing" tab="在玩 (1)">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in galgameData.playing" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center">
                      <span class="text-xs text-white font-bold">{{ game.progress }}</span>
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ game.title }}</h3>
                  <p class="text-xs text-gray-400">{{ game.dev }}</p>
                </div>
              </div>
            </n-tab-pane>

            <n-tab-pane name="wish" tab="想玩 (2)">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in galgameData.wish" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm">
                      <n-icon :component="HeartOutline" />
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ game.title }}</h3>
                  <p class="text-xs text-gray-400">{{ game.dev }}</p>
                </div>
              </div>
            </n-tab-pane>

            <n-tab-pane name="played" tab="玩过 (1)">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in galgameData.played" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {{ game.score }}
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ game.title }}</h3>
                  <p class="text-xs text-gray-400">{{ game.dev }}</p>
                </div>
              </div>
            </n-tab-pane>

          </n-tabs>
        </div>
      </div>

      <div v-if="activeKey === 'novels'" class="max-w-5xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">轻小说书架</h2>
          <span class="text-gray-400 text-sm">阅读记录</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="line" animated size="large" justify-content="start" class="px-6 pt-4">
            
            <n-tab-pane name="fav" tab="我的收藏">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in novelData.favorites" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ book.title }}</h3>
                  <p class="text-xs text-gray-400">{{ book.author }}</p>
                </div>
              </div>
            </n-tab-pane>

            <n-tab-pane name="read" tab="已读书籍">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in novelData.read" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100 grayscale group-hover:grayscale-0 transition duration-500">
                    <img :src="book.cover" class="w-full h-full object-cover">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition">
                      <n-icon size="40" color="white" :component="CheckmarkCircleOutline" />
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ book.title }}</h3>
                  <p class="text-xs text-gray-400">{{ book.author }}</p>
                </div>
              </div>
            </n-tab-pane>

          </n-tabs>
        </div>
      </div>

      <div v-if="activeKey === 'articles'" class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">文章收藏夹</h2>
          <span class="text-gray-400 text-sm">共 {{ favArticles.length }} 篇</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div v-if="favArticles.length > 0">
            <div 
              v-for="post in favArticles" 
              :key="post.id" 
              @click="goToDetail(`/post/${post.id}`)"
              class="p-6 border-b border-gray-50 hover:bg-pink-50/30 transition cursor-pointer flex gap-4 group"
            >
              <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-lg mb-2 group-hover:text-hikari-pink transition">{{ post.title }}</h3>
                <p class="text-gray-500 text-sm line-clamp-2 mb-3">{{ post.summary }}</p>
                
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <div class="flex items-center gap-1.5">
                    <n-avatar round :size="16" :src="post.avatar.startsWith('http') ? post.avatar : undefined" class="bg-gray-200">
                      {{ post.avatar.startsWith('http') ? '' : post.avatar }}
                    </n-avatar>
                    <span>{{ post.author }}</span>
                  </div>
                  <span>·</span>
                  <span>{{ post.time }}</span>
                </div>
              </div>
              
              <div class="flex items-center text-gray-300">
                <n-icon size="20" :component="ArrowForwardOutline" class="group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
          <n-empty v-else description="暂无收藏的文章" class="py-20" />
        </div>
      </div>

    </div>
  </div>
</template>