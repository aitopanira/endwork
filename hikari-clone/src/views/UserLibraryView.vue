<script setup>
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NMenu, NButton, NIcon, NCard, NTabs, NTabPane, NTag, NEmpty, NAvatar, NGrid, NGi, NSpin, useMessage 
} from 'naive-ui'
import { 
  BookOutline, 
  GameControllerOutline, 
  DocumentTextOutline, 
  HeartOutline, 
  CheckmarkCircleOutline,
  ArrowForwardOutline,
  LibraryOutline 
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

// === 菜单配置 ===
const activeKey = ref('galgames')

const menuOptions = [
  { label: 'Galgame 库', key: 'galgames', icon: () => h(NIcon, null, { default: () => h(GameControllerOutline) }) },
  { label: '轻小说书架', key: 'novels', icon: () => h(NIcon, null, { default: () => h(BookOutline) }) },
  { label: '文章收藏', key: 'articles', icon: () => h(NIcon, null, { default: () => h(DocumentTextOutline) }) },
]

const menuThemeOverrides = {
  itemColorActive: 'rgba(251, 114, 153, 0.1)',
  itemColorActiveHover: 'rgba(251, 114, 153, 0.15)',
  itemTextColorActive: '#fb7299',
  itemIconColorActive: '#fb7299',
  itemColorHover: 'rgba(251, 114, 153, 0.05)',
  itemTextColorHover: '#fb7299',
  itemIconColorHover: '#fb7299'
}

const goToDetail = (path) => router.push(path)

// === 核心数据源 (从后端获取) ===
const loading = ref(true)
const libraryData = ref({
  galgames: { playing: [], wish: [], played: [] },
  novels: { fav: [], read: [] },
  articles: []
})

// === 获取收藏数据 ===
const fetchLibraryData = async () => {
  if (!userStore.userInfo || !userStore.userInfo.id) {
    message.warning('请先登录查看书架')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await axios.get(`http://127.0.0.1:8000/a/collections/?user_id=${userStore.userInfo.id}`)
    
    // 兼容 DRF 的分页结构
    const dataList = res.data.results || res.data;

    // 重置数据
    const newData = {
      galgames: { playing: [], wish: [], played: [] },
      novels: { fav: [], read: [] },
      articles: []
    }

    // 分类处理后端返回的数据
    dataList.forEach(record => {
      // 如果实体已被删除，target_data 会是 null，安全跳过
      if (!record.target_data) return 

      // 组装展示对象，把后端的详情和路由所需的 target_id 合并
      const item = { 
        id: record.target_id, 
        status: record.status,
        ...record.target_data 
      }

      if (record.target_type === 'galgame') {
        if (record.status === 'playing') newData.galgames.playing.push(item)
        if (record.status === 'wish') newData.galgames.wish.push(item)
        if (record.status === 'played') newData.galgames.played.push(item)
      } else if (record.target_type === 'novel') {
        if (record.status === 'fav') newData.novels.fav.push(item)
        if (record.status === 'read') newData.novels.read.push(item)
      } else if (record.target_type === 'post') {
        // 文章不管什么状态，统一放入文章列表
        newData.articles.push(item)
      }
    })

    libraryData.value = newData
  } catch (error) {
    console.error('获取收藏数据失败:', error)
    message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLibraryData()
})
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

    <div class="flex-grow overflow-y-auto p-8 relative">
      
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
        <n-spin size="large" stroke="#fb7299" />
      </div>

      <div v-show="activeKey === 'galgames'" class="max-w-5xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">Galgame 游戏库</h2>
          <span class="text-gray-400 text-sm">记录你的攻略历程</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="line" animated size="large" justify-content="start" class="px-6 pt-4">
            
            <n-tab-pane name="playing" :tab="`在玩 (${libraryData.galgames.playing.length})`">
              <div v-if="libraryData.galgames.playing.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in libraryData.galgames.playing" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
                      <span class="text-xs text-white font-bold tracking-widest text-shadow">PLAYING</span>
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ game.title }}</h3>
                  <p class="text-xs text-gray-400">{{ game.dev }}</p>
                </div>
              </div>
              <n-empty v-else description="暂无在玩的游戏" class="py-20" />
            </n-tab-pane>

            <n-tab-pane name="wish" :tab="`想玩 (${libraryData.galgames.wish.length})`">
              <div v-if="libraryData.galgames.wish.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in libraryData.galgames.wish" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
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
              <n-empty v-else description="暂无想玩的游戏" class="py-20" />
            </n-tab-pane>

            <n-tab-pane name="played" :tab="`玩过 (${libraryData.galgames.played.length})`">
              <div v-if="libraryData.galgames.played.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in libraryData.galgames.played" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute top-2 right-2 bg-emerald-400 text-white p-1 rounded-full shadow-sm">
                      <n-icon :component="CheckmarkCircleOutline" />
                    </div>
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ game.title }}</h3>
                  <p class="text-xs text-gray-400">{{ game.dev }}</p>
                </div>
              </div>
              <n-empty v-else description="暂无玩过的游戏" class="py-20" />
            </n-tab-pane>

          </n-tabs>
        </div>
      </div>

      <div v-show="activeKey === 'novels'" class="max-w-5xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">轻小说书架</h2>
          <span class="text-gray-400 text-sm">阅读记录</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="line" animated size="large" justify-content="start" class="px-6 pt-4">
            
            <n-tab-pane name="fav" :tab="`我的收藏 (${libraryData.novels.fav.length})`">
              <div v-if="libraryData.novels.fav.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in libraryData.novels.fav" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ book.title }}</h3>
                  <p class="text-xs text-gray-400">{{ book.author }}</p>
                </div>
              </div>
              <n-empty v-else description="暂无收藏的书籍" class="py-20" />
            </n-tab-pane>

            <n-tab-pane name="read" :tab="`已读书籍 (${libraryData.novels.read.length})`">
              <div v-if="libraryData.novels.read.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in libraryData.novels.read" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
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
              <n-empty v-else description="暂无已读书籍" class="py-20" />
            </n-tab-pane>

          </n-tabs>
        </div>
      </div>

      <div v-show="activeKey === 'articles'" class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">文章收藏夹</h2>
          <span class="text-gray-400 text-sm">共 {{ libraryData.articles.length }} 篇</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div v-if="libraryData.articles.length > 0">
            
            <div 
              v-for="post in libraryData.articles" 
              :key="post.id" 
              @click="goToDetail(`/post/${post.id}`)"
              class="p-6 border-b border-gray-50 hover:bg-pink-50/30 transition cursor-pointer flex gap-5 group items-center"
            >
              <div v-if="post.cover" class="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <img :src="post.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              </div>

              <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-lg mb-2 group-hover:text-hikari-pink transition">{{ post.title }}</h3>
                <p class="text-gray-500 text-sm line-clamp-2 mb-3">{{ post.summary }}</p>
                
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <div class="flex items-center gap-1.5">
                
                  </div>
            
                  <span>{{ post.time }}</span>
                </div>
              </div>
              
              <div class="flex items-center text-gray-300 flex-shrink-0 pl-2">
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

<style scoped>
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
}
</style>