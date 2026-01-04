<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NAvatar, NIcon, NTag, NButton } from 'naive-ui'
import { 
  GameControllerOutline, 
  CalendarOutline, 
  TrophyOutline,
  ArrowForwardOutline,
  Star,
  TimeOutline
} from '@vicons/ionicons5'

const router = useRouter()

// 1. 顶部 Banner
const banners = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg'
]

// 2. 新游速递 (Grid 数据)
const newGames = ref([
  { id: 101, title: '天使☆騒々 RE-BOOT!', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', date: '2023-04-28' },
  { id: 102, title: 'AMBITIOUS MISSION', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', date: '2022-05-27' },
  { id: 103, title: 'Sakura no Uta', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', date: '2015-10-24' },
  { id: 104, title: '月影のシミュラクル', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', date: '2013-07-26' },
  { id: 105, title: 'Rewrite', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', date: '2011-06-24' },
  { id: 106, title: 'CLANNAD', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', date: '2004-04-28' },
  { id: 107, title: '千恋＊万花', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', date: '2016-07-29' },
  { id: 108, title: 'Summer Pockets', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', date: '2018-06-29' },
])

// 3. 右侧排行榜
const rankingList = ref([
  { id: 1, title: 'CLANNAD', score: 10.0, trend: 'up' },
  { id: 2, title: '命运石之门', score: 9.9, trend: 'same' },
  { id: 3, title: 'White Album 2', score: 9.8, trend: 'up' },
  { id: 4, title: '樱之诗', score: 9.8, trend: 'down' },
  { id: 5, title: '美好的每一天', score: 9.7, trend: 'same' },
  { id: 6, title: 'Ever17', score: 9.6, trend: 'up' },
])

// 4. 品牌合作 (Logos)
const brands = [
  { name: 'Key', color: 'bg-blue-100 text-blue-500' },
  { name: 'Yuzu', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Saga', color: 'bg-purple-100 text-purple-500' },
  { name: 'Purple', color: 'bg-pink-100 text-pink-500' },
  { name: 'Alice', color: 'bg-red-100 text-red-500' },
  { name: 'Nitro+', color: 'bg-gray-800 text-white' },
]

// 5. 热门点评
const reviews = ref([
  {
    id: 1,
    game: '千恋＊万花',
    title: '愿千年之恋，有朝一日能使万花怒放',
    user: '儚い愛',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    summary: '少女的恋心藏不住—— 在电车仍未开通的深山里、坐落着名为穗织的小镇...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
  },
  {
    id: 2,
    game: '缘之空',
    title: '《缘之空》: 盛夏尽头的温柔恋恋',
    user: 'OfficialBot',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    summary: '虽说《缘之空》的大名在ACG圈子内已经如雷贯耳，但是真正推过原作的人似乎并没有多少...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg'
  }
])

const goToDetail = (id) => {
  router.push(`/galgame/${id}`)
}
const goToBrand = (name) => {
  router.push(`/brand/${name}`)
}
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
               新游速递
               <span class="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">New Release</span>
             </h2>
             <n-button text class="text-gray-400 hover:text-hikari-pink text-xs">
               查看全部 <n-icon :component="ArrowForwardOutline" class="ml-1"/>
             </n-button>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div 
              v-for="game in newGames" 
              :key="game.id" 
              @click="goToDetail(game.id)"
              class="group cursor-pointer bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div class="aspect-[3/4] rounded overflow-hidden mb-2 relative">
                <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {{ game.date }}
                </div>
              </div>
              <h3 class="font-bold text-gray-700 text-sm truncate group-hover:text-hikari-blue transition">{{ game.title }}</h3>
            </div>
          </div>
        </section>

        <div class="h-24 rounded-lg overflow-hidden relative shadow-sm group cursor-pointer">
           <img src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg" class="w-full h-full object-cover">
           <div class="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition">
             <h3 class="text-2xl font-bold text-white tracking-widest border-2 border-white px-6 py-1">AI 伴侣 · 心动测试</h3>
           </div>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-4">
             <n-icon :component="CalendarOutline" class="text-hikari-blue text-xl"/>
             <h2 class="text-lg font-bold text-gray-800">本月新作</h2>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            <div 
              v-for="game in newGames.slice(0, 5)" 
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
       <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Brand Partners</h2>
       <n-button text size="tiny" class="text-gray-400 hover:text-hikari-blue" @click="router.push('/brands')">
         更多厂商 >
       </n-button>
     </div>
     
     <div class="flex flex-wrap justify-between gap-4">
       <div 
         v-for="brand in brands" 
         :key="brand.name" 
         @click="goToBrand(brand.name)"
         class="flex flex-col items-center gap-2 cursor-pointer group"
       >
         <div :class="`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-110 transition ${brand.color}`">
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
                <div class="flex items-center gap-2 text-xs text-gray-400">
                   <n-avatar round :size="20" :src="review.avatar" />
                   <span>{{ review.user }}</span>
                </div>
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
              <li v-for="(item, index) in rankingList" :key="item.id" class="flex items-center justify-between group cursor-pointer">
                <div class="flex items-center gap-3">
                  <span :class="`font-bold w-5 text-center ${index < 3 ? 'text-hikari-pink' : 'text-gray-400'}`">
                    {{ index + 1 }}
                  </span>
                  <span class="text-sm font-medium text-gray-700 group-hover:text-hikari-blue transition truncate max-w-[120px]">
                    {{ item.title }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-yellow-500">{{ item.score }}</span>
                </div>
              </li>
            </ul>
            <div class="mt-4 pt-4 border-t border-gray-50 text-center">
              <n-button text size="tiny" class="text-gray-400 hover:text-hikari-blue">查看完整榜单</n-button>
            </div>
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
          
        </div> </aside>

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