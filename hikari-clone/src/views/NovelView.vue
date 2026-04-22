<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NAvatar, NCarousel, NCarouselItem, NSpin } from 'naive-ui'
import { 
  BookOutline, HeartOutline, Flame, TimeOutline, ChevronForward,
  ReaderOutline, ImageOutline, ShuffleOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios' 

const router = useRouter()
const userStore = useUserStore()

// === 1. 数据定义 ===
const allNovels = ref([]) 
const loading = ref(true)

const latestUpdates = ref([])
const recommendations = ref([]) 
const activeCategory = ref('校园') 
const categories = ['校园', '恋爱', '战斗', '科幻', '奇幻', '异世界', '推理', '后宫', '热血', '百合', '搞笑', '催泪', '治愈', '致郁', '日常']
const categorySectionRef = ref(null)

const featuredNovels = ref([])

// === 2. 核心：从后端获取真实数据 ===
const fetchNovels = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://127.0.0.1:8000/a/novels/')
    const bake=response.data
    allNovels.value = response.data.map(novel => ({
      id: novel.id,
      title: novel.title,
      originalTitle: novel.original_title || '暂无原名',
      author: novel.author,
      label: novel.publisher || '未知文库', 
      tags: novel.tags.map(t => t.name),    
      cover: novel.cover,
      summary: novel.description ? novel.description.substring(0, 50) + '...' : '暂无简介', 
      thumbnails: novel.volumes.map(v => v.cover)
    }))
    initPageData()
    bake.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    latestUpdates.value = bake.slice(0, 10).map(novel => ({ id: novel.id, title: novel.title }))
  } catch (error) {
    console.error('获取小说列表失败:', error)
  } finally {
    loading.value = false
  }
}

// === 3. 初始化页面逻辑 ===
const initPageData = () => {
  shuffleRecommendations()
  if (allNovels.value.length > 0) {
    featuredNovels.value = allNovels.value.slice(0, 3)
  }
}

const shuffleRecommendations = () => {
  if (allNovels.value.length === 0) return
  const shuffled = [...allNovels.value].sort(() => 0.5 - Math.random())
  recommendations.value = shuffled.slice(0, 10)
}

const categoryBooks = computed(() => {
  if (allNovels.value.length === 0) return []
  const filtered = allNovels.value.filter(book => book.tags.includes(activeCategory.value))
  return filtered.length > 0 ? filtered : allNovels.value.slice(0, 5)
})

const handleSidebarTagClick = (tag) => {
  activeCategory.value = tag
  if (categorySectionRef.value) {
    categorySectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}


const newsList = [
  { id: 1, title: '《夏日重现》外传小说发售', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', date: '3天前' },
  { id: 2, title: 'SONY宣布收购KADOKAWA', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', date: '5天前' },
  { id: 3, title: '无职转生完结纪念刊', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', date: '1周前' },
  { id: 4, title: '轻小说销量排行榜发布', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', date: '1周前' },
]

const publisherSections = computed(() => {
    return [
        { name: '热门文库', books: allNovels.value.slice(0, 5) },
        { name: '新刊速递', books: allNovels.value.slice(5, 10) }
    ]
})

// === 🌟 修改点 1：将写死的点评改为响应式变量，并增加获取后端的函数 ===
const hotReviews = ref([])

const fetchReviews = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/posts/')
    // 过滤出轻小说点评 (novel_review)
    const novelReviews = response.data.filter(p => p.category === 'novel_review')
    
    // 映射到前端需要的格式，取前3条展示
    hotReviews.value = novelReviews.map(post => ({
      id: post.id,
      title: post.title,
      user: '热心书友', // 如果后端有 author.name 可以换成对应的字段
      bg: post.cover || 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', // 如果没有封面给个默认图
      views: Math.floor(Math.random() * 500) + 100 // 模拟热度，如果后端有真实浏览量可以替换
    })).slice(0, 3)
  } catch (error) {
    console.error('获取热门点评失败:', error)
  }
}

// === 🌟 修改点 2：在 onMounted 中调用获取点评数据 ===
onMounted(() => {
  fetchNovels()
  fetchReviews() 
})

// === 🌟 修改点 3：增加跳转到文章详情的逻辑 ===
const goToPost = (id) => {
  router.push(`/post/${id}`)
}

const goToDetail = (id) => {
  router.push(`/novel/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] font-sans pb-10 text-gray-800">
    
    <div v-if="loading" class="flex h-screen items-center justify-center">
        <n-spin size="large" stroke="#36ad6a" description="正在从书架取书..." />
    </div>

    <div v-else class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <main class="lg:col-span-3 space-y-12">
        
        <div class="bg-white rounded-xl shadow-sm border-dashed border-gray-300 overflow-hidden" v-if="featuredNovels.length > 0">
          <n-carousel autoplay show-arrow draggable class="h-auto">
            <div v-for="book in featuredNovels" :key="book.id" class="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div class="w-full md:w-[260px] flex-shrink-0 cursor-pointer group" @click="goToDetail(book.id)">
                <div class="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white relative aspect-[2/3]">
                  <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                  <div class="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 shadow-sm">本周强推</div>
                </div>
              </div>
              <div class="flex-grow flex flex-col justify-between min-w-0 pt-2">
                <div>
                  <h1 class="text-3xl font-bold hover:text-hikari-blue cursor-pointer transition leading-tight mb-2" @click="goToDetail(book.id)">{{ book.title }}</h1>
                  <div class="flex flex-wrap items-center gap-3 mb-4"><span class="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{{ book.originalTitle }}</span></div>
                  <div class="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">{{ book.summary }}</div>
                  <div class="flex gap-4">
                    <n-button type="primary" color="#36ad6a" class="w-32 shadow-lg shadow-green-200" @click="goToDetail(book.id)">立即阅读</n-button>
                  </div>
                </div>
                <div class="mt-auto pt-4 border-t border-dashed border-gray-200 ">
                    <div class="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold"><n-icon :component="ImageOutline" class="text-hikari-blue"/> 插画预览 / 相关推荐</div>
                    <n-carousel :slides-per-view="3" :space-between="12" show-arrow autoplay loop class="h-48">
                      <div v-for="(img, idx) in book.thumbnails" :key="idx" class="h-full cursor-pointer group ">
                        <div class="h-full rounded-md overflow-hidden border border-dashed border-gray-200 relative">
                           <img :src="img" class="w-full h-full object-top  object-cover group-hover:scale-110 transition duration-500">
                        </div>
                      </div>
                    </n-carousel>
                </div>
              </div>
            </div>
          </n-carousel>
        </div>


        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2 border-l-4 border-green-500 pl-3">
              今日推荐 
              <span @click="shuffleRecommendations" class="text-xs font-normal text-white bg-green-500 px-1.5 rounded flex items-center gap-1 cursor-pointer hover:bg-green-600 transition select-none active:scale-95">
                <n-icon :component="ShuffleOutline"/> 随机推荐
              </span>
            </h2>
          </div>
          
          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div v-for="book in recommendations" :key="book.id" class="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 hover:shadow-md transition cursor-pointer group flex flex-col overflow-hidden pb-2" @click="goToDetail(book.id)">
              <div class="p-3 pb-0">
                <div class="rounded overflow-hidden shadow-inner relative aspect-[2/3]">
                  <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
              </div>
              <div class="px-3 pt-3 flex flex-col flex-grow text-center">
                <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.title }}</h3>
                <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.originalTitle }}</p>
                <div class="mt-auto border-t border-dashed border-gray-300 pt-2 w-full">
                  <span class="text-[10px] text-gray-500">{{ book.author }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </section>

        <section ref="categorySectionRef">
          <div class="flex items-center gap-2 mb-4 border-l-4 border-hikari-blue pl-3">
            <h2 class="text-xl font-bold">热门分类</h2>
          </div>
          <div class="flex flex-wrap gap-x-6 gap-y-2 mb-6 border-b border-dashed border-gray-300 pb-1">
            <span 
              v-for="cat in categories" 
              :key="cat" 
              @click="handleSidebarTagClick(cat)"
              class="cursor-pointer text-sm pb-2 transition relative"
              :class="activeCategory === cat ? 'font-bold text-hikari-blue' : 'text-gray-500 hover:text-gray-700'"
            >
              {{ cat }}
              <span v-if="activeCategory === cat" class="absolute bottom-0 left-0 right-0 h-0.5 bg-hikari-blue rounded-full"></span>
            </span>
          </div>
          
          <TransitionGroup name="list" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div v-for="book in categoryBooks" :key="book.id" class="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 hover:shadow-md transition cursor-pointer group flex flex-col overflow-hidden pb-2" @click="goToDetail(book.id)">
              <div class="p-3 pb-0">
                <div class="rounded overflow-hidden shadow-inner relative aspect-[2/3]">
                  <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
              </div>
              <div class="px-3 pt-3 flex flex-col flex-grow text-center">
                <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.title }}</h3>
                <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.originalTitle }}</p>
                <div class="mt-auto border-t border-dashed border-gray-300 pt-2 w-full">
                  <span class="text-[10px] text-gray-500">{{ book.author }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </section>
        
        <section>
          <div class="flex items-center gap-2 mb-4 border-l-4 border-orange-500 pl-3">
            <h2 class="text-lg font-bold text-gray-800">热门点评</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div 
              v-for="review in hotReviews" 
              :key="review.id" 
              @click="goToPost(review.id)" 
              class="h-40 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm"
            >
              <img :src="review.bg" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div class="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded inline-block mb-2 font-bold shadow-sm">点评</div>
                <h3 class="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-yellow-300 transition">{{ review.title }}</h3>
                <div class="flex justify-between items-center text-xs text-white/70">
            
             
                </div>
              </div>
            </div>
            
          </div>
        </section>

        <div class="space-y-10">
          <section v-for="(publisher, index) in publisherSections" :key="index">
            <div class="flex items-center gap-2 mb-4 border-l-4 border-indigo-500 pl-3">
              <h2 class="text-lg font-bold">{{ publisher.name }}</h2>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div v-for="book in publisher.books" :key="book.id" class="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 hover:shadow-md transition cursor-pointer group flex flex-col overflow-hidden pb-2" @click="goToDetail(book.id)">
                <div class="p-3 pb-0">
                  <div class="rounded overflow-hidden shadow-inner relative aspect-[2/3]">
                    <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                  </div>
                </div>
                <div class="px-3 pt-3 flex flex-col flex-grow text-center">
                  <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.title }}</h3>
                  <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.originalTitle }}</p>
                  <div class="mt-auto border-t border-dashed border-gray-300 pt-2 w-full">
                    <span class="text-[10px] text-gray-500">{{ book.author }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>

      <aside class="hidden lg:block lg:col-span-1 space-y-6">
        <div class="sticky top-24 space-y-8">
          <div class="bg-white rounded-xl p-6 shadow-sm border border-dashed border-gray-300 text-center">
            <div v-if="userStore.userInfo">
               <n-avatar round :size="64" :src="userStore.userInfo.avatar" class="mb-3 border border-gray-200" />
               <h3 class="font-bold text-gray-800">{{ userStore.userInfo.name }}</h3>
               <div class="mt-6 space-y-3">
                 <div class="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition" @click="router.push('/library')">
                   <span class="text-gray-500" >我的收藏</span><n-icon :component="ChevronForward" class="text-gray-300"/>
                 </div>
               </div>
            </div>
            <div v-else class="py-4">
               <p class="text-sm text-gray-400 mb-4">登录查看收藏与历史</p>
               <n-button type="primary" size="small" @click="router.push('/login')">立即登录</n-button>
            </div>
          </div>
          <div class="bg-white rounded-xl p-5 shadow-sm border border-dashed border-gray-300">
            <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm border-b border-dashed border-gray-200 pb-2">
              <n-icon :component="ReaderOutline"/> 最新连载
            </h3>
            <ul class="space-y-3">
              <li v-for="item in latestUpdates" :key="item.id" class="flex justify-between items-center text-xs group cursor-pointer" @click="goToDetail(item.id)">
                <span class="text-gray-600 truncate group-hover:text-hikari-blue transition max-w-[180px]">{{ item.title }}</span>
                <span class="text-gray-300 scale-90">更新</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-white rounded-xl p-5 shadow-sm border border-dashed border-gray-300">
             <h3 class="font-bold text-gray-800 mb-4 text-sm">热门分类</h3>
             <div class="flex flex-wrap gap-2">
               <n-tag 
                 v-for="cat in categories.slice(0, 10)" 
                 :key="cat" 
                 size="small" 
                 checkable 
                 :checked="activeCategory === cat"
                 @click="handleSidebarTagClick(cat)"
                 class="cursor-pointer hover:border-hikari-blue transition"
               >
                 {{ cat }}
               </n-tag>
             </div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* 列表动画样式 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>