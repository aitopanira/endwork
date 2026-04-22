<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NAvatar, NIcon, useMessage } from 'naive-ui' 
import { EyeOutline, HeartOutline, GameControllerOutline, BookOutline } from '@vicons/ionicons5'
import { useUserStore } from '../stores/user' 
import axios, { all } from 'axios'

const userStore = useUserStore()
const router = useRouter()
const message = useMessage()

// 1. 状态控制
const activeReviewTab = ref('galgame')
const loading = ref(false)

// 通用跳转函数
const goToDetail = (id, type = 'post') => {
  if (type === 'game' || type === 'galgame') {
    router.push(`/galgame/${id}`)
  } else if (type === 'book' || type === 'novel') {
    router.push(`/novel/${id}`)
  } else {
    // 资讯/文章跳转到这里
    router.push(`/post/${id}`)
  }
}

// 计算经验条百分比
const expPercentage = computed(() => {
  if (!userStore.userInfo) return '0%'
  const current = userStore.userInfo.currentExp || 0
  const total = userStore.userInfo.nextLevelExp || 100 
  const pct = (current / total) * 100
  return Math.min(pct, 100).toFixed(1) + '%'
})

// 处理签到
const handleSignIn = async () => {
  if (!userStore.userInfo) {
    router.push('/login')
    return
  }
  const result = await userStore.signIn()
  if (result.success) {
    message.success(result.msg)
  } else {
    message.warning(result.msg)
  }
}

// 轮播图数据
const banners = [
  
    {
    url: 'https://lunbo.aihikari.xyz/%E8%BD%AE%E6%92%AD%E5%9B%BE/a2.avif',
    title: 'anemoi アネモイ',
    desc: 'key社新作 anemoi 2026年4月26日发售'
  },
  { 
    url: 'https://lunbo.aihikari.xyz/%E8%BD%AE%E6%92%AD%E5%9B%BE/a0.avif',
    title: '【Gal周报239期】Baseson宣布制作新作，"Key Live 2026"将于香港举办',
    desc: '本周，Baseson宣布制作新作《戦国†恋姫BRAVE弐 ～戦乱の九州、島津編～》并公开了官网，与其一同公开的还有故事背景，人物介绍，店铺特典等。'
  },
  { 
    url:  'https://lunbo.aihikari.xyz/%E8%BD%AE%E6%92%AD%E5%9B%BE/a1avif.avif',
    title: '流星 世界演绎者 最新作&最终章 情报解禁',
    desc: '发售日：2026年2月27日企划开始'
  },
  
]

// === 👇 修改点：填充测试用的假数据，用于测试跳转功能 ===
const allPosts = ref([])
const allNews = ref([])
const allReviews = ref([])

//资讯和点评列表
const fetchNewsPosts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/posts/') 
    allPosts.value = response.data.map(post => ({
      id: post.id,
      title: post.title,
      date: post.created_at,
      category: post.category,
      summary: post.summary || '暂无摘要',
      cover: post.cover || '暂无封面'

    }))
    // 过滤出资讯类文章
    allNews.value = allPosts.value.filter(p => p.category === 'gal_news' || p.category === 'novel_news')
    allReviews.value = allPosts.value.filter(p => p.category === 'gal_review' || p.category === 'novel_review')
  } catch (error) {
    console.error('获取资讯失败', error)
  }
}


// === 数据源 A：Galgame 评分 (已按分数排序) ===
const galgameReviews = ref([])

const fetchGalgameReviews = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/galgames/')
    if (response.data && Array.isArray(response.data)) {
        // 先按 score_avg 降序排序，再取前 8 个
        galgameReviews.value = response.data
          .sort((a, b) => (b.score_avg || 0) - (a.score_avg || 0)) 
          .slice(0, 8) 
          .map(game => ({
            id: game.id,
            title: game.title,
            orginal_title: game.original_title,
            cover: game.cover,
            score: game.score_avg || game.score || 0.0, 
            comment: game.comment,
            user: game.user,
            time: game.time,
            status: game.status
          }))
         
    }
     
  } catch (error) {
    console.error('获取Galgame评分失败:', error)
  }
  finally {
    loading.value = false
  }
}

// === 数据源 B：轻小说评分 (已按分数排序) ===
const lightNovelReviews = ref([])

const fetchLightNovelReviews = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/novels/')
    if (response.data && Array.isArray(response.data)) {
      lightNovelReviews.value = response.data
        .sort((a, b) => (b.score_avg || 0) - (a.score_avg || 0)) 
        .slice(0, 8) 
        .map(novel => ({
          id: novel.id,
          title: novel.title,
          cover: novel.cover,
          score: novel.score_avg || novel.score || 0.0, 
          user: novel.author || '未知作者', 
          status: novel.publisher || '连载中',
          time: novel.release_date || '近期'
        }))
    }
  } catch (error) {
    console.error('获取小说列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算属性：根据 Tab 切换
const currentReviews = computed(() => {
  return activeReviewTab.value === 'galgame' ? galgameReviews.value : lightNovelReviews.value
})

// === 侧边栏：本月强推 ===
const featuredGame = ref(null)

const fetchFeaturedGame = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/galgames/')
    if (response.data && response.data.length > 0) {
      // 找出评分最高的那个
      const bestGame = response.data.reduce((prev, current) => {
        const prevScore = prev.score_avg || 0
        const currScore = current.score_avg || 0
        return (prevScore > currScore) ? prev : current
      })

      featuredGame.value = {
        id: bestGame.id,
        title: bestGame.title,
        orginal_title: bestGame.original_title,
        brand: bestGame.developer || '未知厂商',
        date: bestGame.release_date || '未知日期',
        score: bestGame.score_avg || 0.0,
        description: bestGame.description || '暂无简介，点击查看详情...', 
        cover: bestGame.cover,
        tags: bestGame.tags ? bestGame.tags.map(t => t.name || t) : ['强推', '高分']
      }
    }
  } catch (error) {
    console.error('获取本月强推失败:', error)
  }
}
//格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
// === 生命周期 ===
onMounted(() => {
  fetchGalgameReviews()
  fetchLightNovelReviews()
  fetchFeaturedGame()
  // fetchArticle
  fetchNewsPosts() // 未来启用
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    
    <div class="lg:col-span-3 space-y-10">
      
  <n-carousel interval="2000" autoplay show-arrow class="rounded-lg shadow-sm overflow-hidden h-48 sm:h-80">
  
  <div v-for="(lunbo, index) in banners" :key="index" class="w-full h-full relative group cursor-pointer">
    
    <img :src="lunbo.url" class="w-full h-full object-cover">
    
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white flex flex-col justify-end">
      <h1 class="font-bold text-lg sm:text-2xl text-shadow mb-1">{{ lunbo.title }}</h1>
      <p class="text-xs sm:text-sm text-gray-200 line-clamp-1">{{ lunbo.desc }}</p>
    </div>
    
  </div>
  
</n-carousel>
      

      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-700 flex items-center gap-2">
            <span class="text-hikari-blue text-2xl">❖</span> 
            {{ activeReviewTab === 'galgame' ? '高分 Galgame' : '高分轻小说' }}
          </h2>
          
          <div class="flex gap-2">
             <div 
               @click="activeReviewTab = 'galgame'"
               class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition shadow-sm"
               :class="activeReviewTab === 'galgame' ? 'bg-hikari-blue text-white shadow-blue-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
             >
               <n-icon :component="GameControllerOutline" />
             </div>

             <div 
               @click="activeReviewTab = 'novel'"
               class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition shadow-sm"
               :class="activeReviewTab === 'novel' ? 'bg-hikari-blue text-white shadow-blue-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'"
             >
               <n-icon :component="BookOutline" />
             </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div 
            v-for="item in currentReviews" 
            :key="item.id" 
            @click="goToDetail(item.id, activeReviewTab === 'galgame' ? 'game' : 'book')"
            class="group cursor-pointer flex flex-col gap-2 animate-fade-in"
          >
            <div class="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-100">
              <img :src="item.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              
              <div v-if="item.score > 0" class="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md backdrop-blur-sm bg-opacity-95">
                {{ item.score }}
              </div>

              <div v-if="item.status" class="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm truncate max-w-[80%]">
                 {{ item.status }}
              </div>
            </div>

            <div>
               <h3 class="font-bold text-gray-800 text-sm truncate w-full group-hover:text-hikari-blue transition">
                 {{ item.orginal_title||item.title }}
               </h3>
               
               <div class="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                 <div class="flex items-center gap-1 overflow-hidden">
                    <n-icon :component="activeReviewTab === 'galgame' ? GameControllerOutline : BookOutline" class="flex-shrink-0" />
                    <span class="truncate">{{ item.user }}</span>
                 </div>
                 <span class="flex-shrink-0">{{ item.time }}</span>
               </div>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-10 text-gray-400">
           正在获取数据...
        </div>
        <div v-else-if="currentReviews.length === 0" class="text-center py-10 text-gray-400">
           暂无数据
        </div>

      </section>

      <section>
        <div class="flex items-center gap-4 mb-6 border-b border-gray-100 pb-2">
          <h2 class="text-xl font-bold text-gray-800 border-l-[5px] border-hikari-blue pl-3 flex items-center gap-2">
            最新资讯
            <span class="text-hikari-blue/30 text-lg animate-pulse">❄</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div 
            v-for="item in allNews" 
            :key="item.id" 
            @click="goToDetail(item.id, 'post')"
            class="flex gap-4 group cursor-pointer"
          >
            <div class="w-32 h-[85px] flex-shrink-0 overflow-hidden rounded-md relative shadow-sm">
              <img :src="item.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="flex-grow min-w-0 flex flex-col">
              <h3 class="font-bold text-gray-800 text-[15px] leading-tight mb-1.5 group-hover:text-hikari-blue transition line-clamp-2">
                {{ item.title }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
               
                <span>{{ formatDate(item.date) }}</span>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {{ item.summary }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-6 border-b border-gray-100 pb-2">
          <h2 class="text-xl font-bold text-gray-800 border-l-[5px] border-hikari-blue pl-3 flex items-center gap-2">
            热门点评
            <span class="text-hikari-blue/30 text-lg animate-pulse">❄</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            v-for="item in allReviews" 
            :key="item.id" 
            @click="goToDetail(item.id, item.type)"
            class="group cursor-pointer flex flex-col h-full"
          >
            <div class="relative w-full h-36 rounded-lg overflow-hidden mb-3">
              <img :src="item.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
              <div class="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent flex items-center px-2">
                 <div class="text-white text-[10px] flex items-center gap-1">
                   <n-icon v-if="item.type === 'game'" :component="GameControllerOutline" />
                   <n-icon v-else :component="BookOutline" />
                   
                 </div>
              </div>
            </div>

            <div class="flex-grow flex flex-col">
              <h3 class="font-bold text-gray-800 text-sm mb-2 group-hover:text-hikari-blue transition line-clamp-2 leading-snug">
                {{ item.title }}
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3 flex-grow">
                {{ item.summary }}
              </p>
              
              <div class="flex items-center justify-between text-[10px] text-gray-400 mt-auto pt-2 border-t border-gray-50">
                <div class="flex items-center gap-2">

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>

    <aside class="lg:col-span-1 space-y-6">
        <div class="sticky top-24 space-y-8">
      
      <div v-if="userStore.userInfo" class="bg-white p-5 rounded-lg shadow-sm animate-fade-in relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-hikari-pink to-hikari-blue"></div>

        <div class="flex items-center gap-4 mb-4">
          <n-avatar round :size="50" :src="userStore.userInfo.avatar" class="border-2 border-white shadow-sm" />
          <div class="flex-grow">
            <h3 class="font-bold text-gray-800 text-base">{{ userStore.userInfo.name }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-white bg-yellow-400 px-2 py-0.5 rounded shadow-sm">
                Lv.{{ userStore.userInfo.level }}
              </span>
              <div class="h-2 flex-grow bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-yellow-400 rounded-full transition-all duration-500" 
                  :style="{ width: expPercentage }"
                ></div>
              </div>
            </div>
            <div class="text-[10px] text-gray-400 text-right mt-0.5">
              {{ userStore.userInfo.currentExp }} / {{ userStore.userInfo.nextLevelExp }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center mb-5 border-t border-gray-50 pt-4">
          <!-- <div class="cursor-pointer hover:bg-gray-50 rounded py-1 transition">
            <span class="block font-bold text-gray-700 text-sm">0</span>
            <span class="text-xs text-gray-400">动态</span>
          </div>
          <div class="cursor-pointer hover:bg-gray-50 rounded py-1 transition">
            <span class="block font-bold text-gray-700 text-sm">12</span>
            <span class="text-xs text-gray-400">收藏</span>
          </div>
          <div class="cursor-pointer hover:bg-gray-50 rounded py-1 transition">
            <span class="block font-bold text-gray-700 text-sm">{{ userStore.userInfo.currentExp }}</span>
            <span class="text-xs text-gray-400">经验</span>
          </div> -->
        </div>

        <button 
          @click="handleSignIn"
          :disabled="userStore.userInfo.isSignedToday"
          class="w-full py-2 rounded-full transition text-sm shadow-md font-bold flex items-center justify-center gap-2"
          :class="userStore.userInfo.isSignedToday 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-hikari-pink to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5 transform'"
        >
          <span>{{ userStore.userInfo.isSignedToday ? '✨ 今日已签到' : '📅 签到领经验' }}</span>
        </button>
      </div>

      <div v-else class="bg-white p-5 rounded-lg shadow-sm text-center">
        <h3 class="font-bold text-gray-800 mb-2">欢迎加入社区</h3>
        <p class="text-xs text-gray-500 mb-4">登录后参与讨论，分享你的资源。</p>
        <button @click="router.push('/login')" class="w-full bg-hikari-blue text-white py-2 rounded hover:bg-blue-500 transition font-medium">
          立即登录
        </button>
      </div>

      <div v-if="featuredGame" @click="goToDetail(featuredGame.id, 'game')" class="bg-white rounded-lg shadow-sm overflow-hidden group border border-gray-100 cursor-pointer animate-fade-in">
        <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-700 text-sm flex items-center gap-2">
            <span class="w-1 h-4 bg-hikari-pink rounded-full"></span>
            本月强推
          </h3>
          <span class="text-xs text-gray-400 cursor-pointer hover:text-hikari-blue">更多 &gt;</span>
        </div>
        <div class="relative h-40 overflow-hidden cursor-pointer">
          <img :src="featuredGame.cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute top-2 right-2 bg-white/90 backdrop-blur text-hikari-pink font-extrabold px-2 py-1 rounded shadow-sm flex flex-col items-center leading-none">
            <span class="text-xl">{{ featuredGame.score }}</span>
            <span class="text-[10px] text-gray-400">评分</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
             <h4 class="text-white font-bold text-lg shadow-sm truncate w-full">{{ featuredGame.orginal_title }}</h4>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center text-xs text-gray-500 mb-3">
            <span class="bg-blue-50 text-blue-500 px-2 py-0.5 rounded">
              {{ featuredGame.brand }}
            </span>
            <span>📅 {{ featuredGame.date }}</span>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {{ featuredGame.description }}
          </p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="font-bold text-gray-700 text-sm mb-3">热门标签</h3>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-pink-50 text-pink-500 text-xs rounded cursor-pointer hover:bg-pink-100">#Galgame</span>
          <span class="px-2 py-1 bg-blue-50 text-blue-500 text-xs rounded cursor-pointer hover:bg-blue-100">#轻小说</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded cursor-pointer hover:bg-gray-200">#求助</span>
        </div>
      </div>
</div>
    </aside>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>