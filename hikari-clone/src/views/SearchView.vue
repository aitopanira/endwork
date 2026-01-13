<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NInput, NButton, NIcon, NSpin, NPagination, useMessage
} from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import asukaImg from '../images/asuka.png' // ⚠️ 请确保这个路径下的图片存在，否则会报错
import axios from 'axios'

const router = useRouter()
// const message = useMessage() 

// 👇 你的 Cloudflare R2 公开域名
const R2_DOMAIN = 'https://pub-31746bf4167d45c09c44a61e59e55416.r2.dev' 

// === 1. 状态管理 ===
const searchQuery = ref('')
const activeTab = ref('galgame')
const loading = ref(false)
const searchResults = ref([])
// 存储所有从后端获取的原始数据
const allDataPool = ref([]) 

// === 2. Tab 配置 ===
const tabs = [
  { key: 'galgame', label: '游戏' },
  { key: 'novel', label: '小说' },
  { key: 'news', label: '资讯' }, 
  { key: 'review', label: '点评' },
]

// === 3. 核心：模糊搜索逻辑 ===
const performSearch = async () => {
  loading.value = true
  
  // 模拟一点延迟让 UI 交互更自然 (可选)
  // await new Promise(resolve => setTimeout(resolve, 300))

  let results = allDataPool.value

  // --- 第一步：按 Tab 类型过滤 ---
  if (activeTab.value === 'galgame') {
    results = results.filter(item => item.type === 'galgame')
  } else if (activeTab.value === 'novel') {
    results = results.filter(item => item.type === 'novel')
  } else if (activeTab.value === 'news') {
    // 资讯：是 post 且分类不是 review
    results = results.filter(item => item.type === 'post' && !item.category?.includes('review'))
  } else if (activeTab.value === 'review') {
    // 点评：是 post 且分类包含 review
    results = results.filter(item => item.type === 'post' && item.category?.includes('review'))
  }

  // --- 第二步：多字段模糊搜索 ---
  const query = searchQuery.value.trim().toLowerCase()
  
  if (query) {
    // 支持空格分词 (例如搜: "Key 纯爱") -> 必须同时包含这两个词
    const keywords = query.split(/\s+/).filter(k => k)

    results = results.filter(item => {
      // 构造搜索范围：把标题、原名、开发商、简介等拼成一个大字符串
      const searchScope = [
        item.title,                  // 标题
        item.original_title,         // 原名 (Galgame/Novel)
        item.developer,              // 开发商 (Galgame)
        item.author,                 // 作者 (Novel/Post)
        item.description,            // 简介 (Galgame/Novel)
        item.summary,                // 摘要 (Post)
        // item.tags?.join(' ')      // 如果你有标签数组，也可以加上
      ].filter(Boolean).join(' ').toLowerCase() // filter(Boolean) 去掉 undefined/null

      // 检查是否所有关键词都在这个范围内
      return keywords.every(k => searchScope.includes(k))
    })
  }
  
  searchResults.value = results
  loading.value = false
}

// === 4. 数据获取 ===
const fetchAllData = async () => {
  loading.value = true
  try {
    // 并发请求三个接口
    const [galRes, novelRes, postRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/a/getuser/galgames/'),
      axios.get('http://127.0.0.1:8000/a/getuser/novels/'),
      axios.get('http://127.0.0.1:8000/a/getuser/posts/')
    ])

    // 图片链接处理 Helper
    const processCover = (coverPath) => {
      if (!coverPath) return null
      // 如果已经是完整链接(如原有的外部图床)，直接返回
      if (coverPath.startsWith('http')) return coverPath
      // 否则拼接 Cloudflare 域名 (处理 / 开头的情况)
      const cleanPath = coverPath.startsWith('/') ? coverPath.slice(1) : coverPath
      return `${R2_DOMAIN}/${cleanPath}`
    }

    // 处理 Galgame 数据
    const galgames = (galRes.data || []).map(item => ({
      ...item,
      type: 'galgame',
      cover: processCover(item.cover),
      score: item.score_avg || item.score || 0,
      date: item.release_date
    }))

    // 处理 Novel 数据
    const novels = (novelRes.data || []).map(item => ({
      ...item,
      type: 'novel',
      cover: processCover(item.cover),
      score: item.score_avg || item.score || 0,
      date: item.release_date
    }))

    // 处理 Post 数据
    const posts = (postRes.data || []).map(item => ({
      ...item,
      type: 'post',
      cover: processCover(item.cover),
      author: item.author_name || item.author?.name || 'User',
      date: item.created_at?.split('T')[0]
    }))

    // 合并入池
    allDataPool.value = [...galgames, ...novels, ...posts]
    
    // 数据加载完后，立即执行一次搜索(显示默认列表)
    performSearch()

  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听 Tab 切换
watch(activeTab, performSearch)

// 初始化
onMounted(() => {
  fetchAllData()
})

// 跳转详情页
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
          placeholder="搜索资源 (支持 标题 / 开发商 / 原名 / 简介...)" 
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