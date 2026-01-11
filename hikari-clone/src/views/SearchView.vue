<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NInput, NButton, NIcon, NSpin, NPagination
} from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'

// ⚠️ 确保图片路径正确
import asukaImg from '../images/asuka.png' 

const router = useRouter()

// === 1. 状态管理 ===
const searchQuery = ref('')
const activeTab = ref('galgame')
const loading = ref(false)
const searchResults = ref([])

// === 2. Tab 配置 ===
const tabs = [
  { key: 'galgame', label: '游戏' },
  { key: 'novel', label: '小说' },
  { key: 'news', label: '资讯' }, 
  { key: 'review', label: '点评' },
]

// === 3. 模拟数据 ===
const MOCK_DATABASE = [
  // --- 游戏 & 小说 (适合方框) ---
  { id: 201, title: '千恋＊万花', type: 'galgame', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', score: 9.8 },
  { id: 202, title: 'Summer Pockets', type: 'galgame', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', score: 9.9 },
  { id: 301, title: '关于邻家的天使大人', type: 'novel', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', score: 9.5 },
  { id: 302, title: '86 -不存在的战区-', type: 'novel', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', score: 9.7 },
  { id: 203, title: 'ATRI -My Dear Moments-', type: 'galgame', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', score: 9.0 },
  { id: 204, title: '9-nine-', type: 'galgame', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', score: 8.8 },
  
  // --- 资讯 & 点评 (适合列表) ---
  { 
    id: 101, 
    title: '【新作】Key社新作《anemoi》体验版发布，好评如潮', 
    type: 'post', 
    category: 'gal_news', 
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', 
    summary: 'Key社原本预计于今年发售的新作今日发布了体验版，讲述了风与少年的故事...',
    author: 'Admin',
    date: '2026-02-14',
    views: 3200
  },
  { 
    id: 102, 
    title: '【点评】《千恋万花》：废萌的极致，还是剧情的妥协？', 
    type: 'post', 
    category: 'gal_review', 
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', 
    summary: '通关了丛雨线和芳乃线，不得不说柚子社在人设上依然是业界顶尖...',
    author: '纯爱战神',
    date: '2026-02-10',
    likes: 128
  },
  { 
    id: 103, 
    title: '【资讯】轻小说《实教》最新卷销量霸榜', 
    type: 'post', 
    category: 'novel_news', 
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', 
    summary: '本周Oricon销量榜出炉，衣笠彰梧的《欢迎来到实力至上主义的教室》再次登顶...',
    author: 'NewsBot',
    date: '2026-02-12',
    views: 5040
  }
]

// === 4. 执行搜索 ===
const performSearch = () => {
  loading.value = true
  setTimeout(() => {
    let results = MOCK_DATABASE 

    if (activeTab.value === 'galgame') {
      results = results.filter(item => item.type === 'galgame')
      if(results.length > 0) results = [...results, ...results] 
    } 
    else if (activeTab.value === 'novel') {
      results = results.filter(item => item.type === 'novel')
       if(results.length > 0) results = [...results, ...results]
    } 
    else if (activeTab.value === 'news') {
      results = results.filter(item => item.type === 'post' && !item.category?.includes('review'))
    } 
    else if (activeTab.value === 'review') {
      results = results.filter(item => item.type === 'post' && item.category?.includes('review'))
    }

    if (searchQuery.value.trim()) {
      results = results.filter(item => item.title.includes(searchQuery.value))
    }
    
    searchResults.value = results
    loading.value = false
  }, 300)
}

watch(activeTab, performSearch)
onMounted(performSearch)

const goToDetail = (item) => {
  if (item.type === 'galgame') router.push(`/galgame/${item.id}`)
  else if (item.type === 'novel') router.push(`/novel/${item.id}`)
  else router.push(`/post/${item.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-white">
    
    <div class="container mx-auto px-4 py-8 max-w-[1200px]">
      
      <div class="flex gap-4 mb-10">
        <n-input 
          v-model:value="searchQuery" 
          size="large" 
          placeholder="搜索资源..." 
          class="flex-grow shadow-sm h-[50px] text-base rounded-md focus:border-[#fb7299]"
          @keydown.enter="performSearch"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" class="text-gray-400" />
          </template>
        </n-input>
        <n-button 
          color="#fb7299" 
          class="h-[50px] px-8 text-base font-medium rounded-md text-white shadow-sm hover:bg-[#ff8dae]"
          :bordered="false"
          @click="performSearch"
        >
          搜索
        </n-button>
      </div>

      <div class="flex w-full items-center border-b border-gray-100 pb-1 mb-8">
        <div 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 text-center cursor-pointer pb-3 px-2 text-[15px] transition-all relative"
          :class="activeTab === tab.key ? 'text-[#fb7299] font-bold' : 'text-gray-500 hover:text-gray-800'"
        >
          {{ tab.label }}
          <span 
            v-if="activeTab === tab.key" 
            class="absolute bottom-0 left-0 w-full h-[3px] bg-[#fb7299] rounded-t-full"
          ></span>
        </div>
      </div>

      <div class="min-h-[400px]">
        
        <div v-if="loading" class="flex justify-center items-center h-64">
          <n-spin size="large" stroke="#fb7299" />
        </div>

        <div v-else-if="searchResults.length === 0" class="flex flex-col items-center justify-center py-32 animate-fade-in">
          <img :src="asukaImg" alt="看板娘" class="w-24 h-24 object-cover rounded-full shadow-sm mb-6 grayscale-[20%]">
          <p class="text-gray-500 font-medium">没有找到相关内容...</p>
        </div>

        <div v-else>
          
          <div 
            v-if="activeTab === 'galgame' || activeTab === 'novel'" 
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 animate-fade-in"
          >
            <div 
              v-for="(item, index) in searchResults" 
              :key="index"
              @click="goToDetail(item)"
              class="group relative cursor-pointer flex flex-col"
            >
              <div class="bg-white p-2 rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <div class="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                  <img :src="item.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                  
                  <div class="absolute top-2 right-2 bg-[#fb7299] text-white text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <span class="transform rotate-45">🔗</span> 关联匹配
                  </div>
                  
                  <div v-if="item.score" class="absolute bottom-0 right-0 bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-tl-md">
                     {{ item.score }}
                  </div>
                </div>
              </div>

              <h3 class="mt-3 text-sm text-gray-700 font-medium truncate group-hover:text-[#fb7299] transition text-center px-1">
                {{ item.title }}
              </h3>
            </div>
          </div>

          <div 
            v-else 
            class="flex flex-col gap-4 animate-fade-in"
          >
            <div 
              v-for="(item, index) in searchResults" 
              :key="index"
              @click="goToDetail(item)"
              class="group bg-white border border-gray-100 rounded-xl p-4 flex gap-5 cursor-pointer hover:shadow-md hover:border-[#fb7299]/30 transition-all duration-300"
            >
              <div class="w-40 h-24 sm:w-56 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                <img :src="item.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute top-0 left-0 px-2 py-0.5 text-[10px] text-white font-bold rounded-br-lg shadow-sm"
                  :class="activeTab === 'review' ? 'bg-orange-400' : 'bg-[#fb7299]'"
                >
                  {{ activeTab === 'review' ? '点评' : '资讯' }}
                </div>
              </div>

              <div class="flex-grow min-w-0 flex flex-col justify-between py-1">
                <div>
                  <h3 class="font-bold text-gray-800 text-lg mb-2 truncate group-hover:text-[#fb7299] transition">
                    {{ item.title }}
                  </h3>
                  <p class="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {{ item.summary }}
                  </p>
                </div>
                
                <div class="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <span class="flex items-center gap-1">User: {{ item.author }}</span>
                  <span>Date: {{ item.date }}</span>
                  <span v-if="item.views" class="flex items-center gap-1">👁 {{ item.views }}</span>
                  <span v-if="item.likes" class="flex items-center gap-1 text-red-400">❤ {{ item.likes }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="searchResults.length > 0" class="flex justify-center mt-12 mb-12">
        <n-pagination :page-count="1" size="medium" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>