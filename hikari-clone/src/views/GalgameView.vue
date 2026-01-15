<script setup>
import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NAvatar, NIcon, NTag, NButton, useMessage } from 'naive-ui' // 引入 useMessage
import axios from 'axios'
import { 
  GameControllerOutline, 
  CalendarOutline, 
  TrophyOutline,
  ArrowForwardOutline,
  Star,
  TimeOutline
} from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage() // 注册消息提示

// 1. 顶部 Banner
const banners = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg'
]

const hotgame=ref([])
// 2. 新游速递 (Grid 数据)
const newGames = ref([])
// 3. 右侧排行榜
const rankingList = ref([])
//获取游戏数据
const fetchGames = async() => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/a/getuser/galgames/')
    console.log(res.data)
    newGames.value = res.data.sort((a, b) => b.created_at - a.created_at)
    
    // ⚠️ 修复：使用 [...res.data] 创建副本，防止 sort 影响到 newGames 的顺序
    rankingList.value = [...res.data].sort((a,b) => b.score_avg - a.score_avg).slice(0,10)
    hotgame.value = [...res.data].sort((a,b) => b.score_avg - a.score_avg).slice(0,12)
  } catch (error) {
    console.error('获取新游数据失败:', error)
    // message.error('获取新游数据失败') // 需要在 <n-message-provider> 下才能使用
  }
}

// 4. 品牌合作 (Logos)
const brands = [
  { name: 'Key', color: 'bg-blue-100 text-blue-500' },
  { name: 'ゆずソフト', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'CRYSTALiA', color: 'bg-purple-100 text-purple-500' },
  { name: '枕', color: 'bg-red-100 text-red-500' },
  { name: 'あざらし', color: 'bg-gray-800 text-white' },
  { name: 'HIKARI', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'sprite', color: 'bg-purple-100 text-purple-500' },
  { name: 'NEKO', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'MAGES', color: 'bg-pink-100 text-pink-500' },
]

// 5. 热门点评
const reviews = ref([])
const news = ref([])
const allPosts = ref([])

const fetchNewsPosts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/posts/') 
    allPosts.value = response.data.map(post => ({
      id: post.id,
      title: post.title,
      date: post.created_at,
      category: post.category,
      summary: post.summary || '暂无摘要',
      cover: post.cover || '暂无封面',
      game: '相关游戏' // 这里后端如果没返回关联游戏名，暂时写死
    }))
    // 过滤出资讯类文章
    news.value = allPosts.value.filter(p => p.category === 'gal_news' )
    reviews.value = allPosts.value.filter(p => p.category === 'gal_review')
  } catch (error) {
    console.error('获取资讯失败', error)
  }
}

// 跳转逻辑
const goToDetail = (id) => {
  router.push(`/galgame/${id}`)
}
const goToBrand = (name) => {
  router.push(`/brand/${name}`)
}

// 👇 新增：跳转到搜索页（即查看全部）
const goToSearch = () => {
  // 假设你的搜索页路由是 /search，如果是其他的请修改
  router.push('/search') 
}

onMounted(() => {
  fetchGames()
  fetchNewsPosts()
})
</script>

<template>
  <div class="min-h-screen bg-[#f4f5f7] pb-10 font-sans p-4">
    
    <div class="w-full h-[320px] relative group overflow-hidden">
      <n-carousel autoplay show-arrow class="h-full">
        <img v-for="url in banners" :key="url" :src="url" class="w-full h-full object-cover">
      </n-carousel>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pt-20">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-white mb-2 text-shadow">Mellow新作《True Colors》正式发售！</h1>
          <p class="text-white/80 text-sm">那个夏天，我们在海边许下的约定，如今是否还能兑现？</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <main class="lg:col-span-3 space-y-10">
        
        <section>
          <div class="flex items-center justify-between mb-4 border-l-4 border-hikari-pink pl-3">
             <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
               热门游戏
               <span class="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">New Release</span>
             </h2>
             <n-button text class="text-gray-400 hover:text-hikari-pink text-xs" @click="goToSearch">
               查看全部 <n-icon :component="ArrowForwardOutline" class="ml-1"/>
             </n-button>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div 
              v-for="game in hotgame" 
              :key="game.id" 
              @click="goToDetail(game.id)"
              class="group cursor-pointer bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div class="aspect-[3/4] rounded overflow-hidden mb-2 relative">
                <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              
              </div>
              <h3 class="font-bold text-gray-700 text-sm truncate group-hover:text-hikari-blue transition">
                {{ game.title || game.name }} 
              </h3>
            </div>
          </div>
        </section>

        <div class="h-24 rounded-lg overflow-hidden relative shadow-sm group cursor-pointer">
           <img src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg" class="w-full h-full object-cover">
           <div class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition">
             <h3 class="text-2xl font-bold text-white tracking-widest border-2 border-white px-6 py-1">广告位招租</h3>
           </div>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-4">
             <n-icon :component="CalendarOutline" class="text-hikari-blue text-xl"/>
             <h2 class="text-lg font-bold text-gray-800">本月新作</h2>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            <div 
              v-for="game in newGames.slice(0,7)" 
              :key="game.id" 
              class="flex-shrink-0 w-32 cursor-pointer group"
              @click="goToDetail(game.id)"
            >
              <div class="w-32 h-32 rounded-lg overflow-hidden mb-2 shadow-sm border border-gray-100">
                <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              </div>
              <div class="text-xs font-bold text-gray-700 text-center truncate">{{ game.title }}</div>
            </div>
          </div>
        </section>

  <section class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
     <div class="flex justify-between items-center mb-6">
       <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider">热门游戏厂商</h2>
     </div>
     
  <div class="flex flex-wrap justify-between gap-4">
  <div 
    v-for="brand in brands" 
    :key="brand.name" 
    @click="goToBrand(brand.name)"
    class="flex flex-col items-center gap-2 cursor-pointer group"
  >
    <div :class="`w-20 h-20 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition ${brand.color}`">
      {{ brand.name }}
    </div>
  </div>
</div>
  </section>
        
        <section>
          <div class="flex items-center gap-2 mb-4">
             <n-icon :component="Star" class="text-yellow-500 text-xl"/>
             <h2 class="text-lg font-bold text-gray-800">热门点评</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="review in reviews" :key="review.id" class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition">
              <div class="h-32 overflow-hidden relative">
                <img :src="review.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                   {{ review.game }}
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-800 mb-2 truncate">{{ review.title }}</h3>
                <p class="text-xs text-gray-500 line-clamp-2 mb-3">{{ review.summary }}</p>
              </div>
            </div>
          </div>
        </section>

      </main>

    <aside class="lg:col-span-1">
        
        <div class="sticky top-24 space-y-8">
          
          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <n-icon :component="TrophyOutline" class="text-yellow-500"/> 游戏评分榜
            </h3>
            <ul class="space-y-4">
              <li v-for="(item, index) in rankingList" :key="item.id" class="flex items-center justify-between group cursor-pointer" @click="goToDetail(item.id)">
                <div class="flex items-center gap-3">
                  <span :class="`font-bold w-5 text-center ${index < 3 ? 'text-hikari-pink' : 'text-gray-400'}`">
                    {{ index + 1 }}
                  </span>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-hikari-blue transition truncate max-w-[120px]">
                    {{ item.original_title || item.title }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-yellow-500">{{ item.score_avg }}</span>
                </div>
              </li>
            </ul>
         
          </div>

          <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
             <h3 class="font-bold text-gray-800 mb-4 text-sm">热门标签</h3>
             <div class="flex flex-wrap gap-2">
               <n-tag size="small" checkable>剧情作</n-tag>
               <n-tag size="small" checkable>纯爱</n-tag>
               <n-tag size="small" checkable>废萌</n-tag>
               <n-tag size="small" checkable>拔作</n-tag>
               <n-tag size="small" checkable>NTR</n-tag>
               <n-tag size="small" checkable>Key社</n-tag>
               <n-tag size="small" checkable>柚子社</n-tag>
             </div>
          </div>
          
        </div> 
    </aside>

    </div>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>