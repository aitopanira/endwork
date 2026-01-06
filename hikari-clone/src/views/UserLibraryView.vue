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
  CheckmarkCircleOutline,
  ArrowForwardOutline,
  LibraryOutline 
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
            
            <n-tab-pane name="playing" :tab="`在玩 (${userStore.galgameLibrary.playing.length})`">
              <div v-if="userStore.galgameLibrary.playing.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in userStore.galgameLibrary.playing" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
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
              <n-empty v-else description="暂无在玩的游戏" class="py-20" />
            </n-tab-pane>

            <n-tab-pane name="wish" :tab="`想玩 (${userStore.galgameLibrary.wish.length})`">
              <div v-if="userStore.galgameLibrary.wish.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in userStore.galgameLibrary.wish" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
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

            <n-tab-pane name="played" :tab="`玩过 (${userStore.galgameLibrary.played.length})`">
              <div v-if="userStore.galgameLibrary.played.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="game in userStore.galgameLibrary.played" :key="game.id" class="group cursor-pointer" @click="goToDetail(`/galgame/${game.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                      {{ game.score || '-' }}
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

      <div v-if="activeKey === 'novels'" class="max-w-5xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">轻小说书架</h2>
          <span class="text-gray-400 text-sm">阅读记录</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="line" animated size="large" justify-content="start" class="px-6 pt-4">
            
            <n-tab-pane name="fav" :tab="`我的收藏 (${userStore.novelLibrary.favorites.length})`">
              <div v-if="userStore.novelLibrary.favorites.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in userStore.novelLibrary.favorites" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
                  <div class="relative rounded-lg overflow-hidden aspect-[2/3] mb-3 shadow-md border border-gray-100">
                    <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                  </div>
                  <h3 class="font-bold text-gray-800 text-sm truncate group-hover:text-hikari-pink transition">{{ book.title }}</h3>
                  <p class="text-xs text-gray-400">{{ book.author }}</p>
                </div>
              </div>
              <n-empty v-else description="暂无收藏的书籍" class="py-20" />
            </n-tab-pane>

            <n-tab-pane name="read" :tab="`已读书籍 (${userStore.novelLibrary.read.length})`">
              <div v-if="userStore.novelLibrary.read.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6">
                <div v-for="book in userStore.novelLibrary.read" :key="book.id" class="group cursor-pointer" @click="goToDetail(`/novel/${book.id}`)">
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

      <div v-if="activeKey === 'articles'" class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-end mb-2">
          <h2 class="text-2xl font-bold text-gray-800">文章收藏夹</h2>
          <span class="text-gray-400 text-sm">共 {{ userStore.articleLibrary.length }} 篇</span>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
          <div v-if="userStore.articleLibrary.length > 0">
            <div 
              v-for="post in userStore.articleLibrary" 
              :key="post.id" 
              @click="goToDetail(`/post/${post.id}`)"
              class="p-6 border-b border-gray-50 hover:bg-pink-50/30 transition cursor-pointer flex gap-4 group"
            >
              <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-lg mb-2 group-hover:text-hikari-pink transition">{{ post.title }}</h3>
                <p class="text-gray-500 text-sm line-clamp-2 mb-3">{{ post.summary }}</p>
                
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <div class="flex items-center gap-1.5">
                    <n-avatar round :size="16" :src="post.avatar && post.avatar.startsWith('http') ? post.avatar : undefined" class="bg-gray-200">
                      {{ post.avatar && post.avatar.startsWith('http') ? '' : (post.avatar || '文') }}
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