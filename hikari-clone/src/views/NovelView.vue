<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NAvatar, NCarousel, NCarouselItem } from 'naive-ui'
import { 
  BookOutline, 
  HeartOutline, 
  Flame, 
  TimeOutline, 
  ChevronForward,
  ReaderOutline,
  ImageOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// 1. 首屏主推书籍列表 (改为数组，用于轮播)
const featuredNovels = ref([
  {
    id: 201,
    title: '败犬女主太多了！',
    originalTitle: '負けヒロインが多すぎる！',
    author: '雨森たきび',
    label: 'ガガガ文庫',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    summary: '“哈？你在说谁是败犬？” 作为班级背景板的我——温水和彦有一天目击了人气女生・八奈见杏菜被男人甩的一幕。“明明说要娶我为妻、你不觉得他很过分吗？”',
    tags: ['校园', '恋爱', '败犬', '搞笑'],
    // 底部小轮播图素材
    thumbnails: [
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    ]
  },
  {
    id: 202,
    title: '关于我在无意间被隔壁的天使变成废柴这件事',
    originalTitle: 'お隣の天使様にいつの間にか駄目人間にされていた件',
    author: '佐伯さん',
    label: 'GA文庫',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    summary: '藤宫周所住公寓的隔壁，住着学校第一的美少女椎名真昼。两人原本并没有什么交集。直到有一天，周看到她雨中淋湿的样子，把伞借给了她。',
    tags: ['纯爱', '日常', '发糖', '神作'],
    thumbnails: [
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    ]
  },
  {
    id: 203,
    title: '义妹生活',
    originalTitle: '義妹生活',
    author: '三河ごーすと',
    label: 'MF文庫J',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    summary: '高中生浅村悠太，因为父亲再婚，和学年第一美少女绫濑沙季成为了兄妹。因为都对父母关系有心理阴影，两人约定保持适当的距离。',
    tags: ['义妹', '生活', '慢热', '真实'],
    thumbnails: [
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    ]
  }
])

// 2. 资讯列表
const newsList = [
  { id: 1, title: '《夏日重现》外传小说发售', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', date: '3天前' },
  { id: 2, title: 'SONY宣布收购KADOKAWA', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', date: '5天前' },
  { id: 3, title: '无职转生完结纪念刊', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', date: '1周前' },
  { id: 4, title: '轻小说销量排行榜发布', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', date: '1周前' },
]

// 3. 今日推荐数据
const recommendations = ref([
  { id: 201, title: '败犬女主太多了！', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
  { id: 202, title: '与原本是阴角的同班同学', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
  { id: 203, title: 'Silent Witch 沉默魔女', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
  { id: 204, title: '无职转生', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
  { id: 205, title: 'Re:从零开始的异世界生活', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
  { id: 206, title: '魔女之旅', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
])

// 4. 文库专区数据
const publisherSections = [
  { 
    name: 'MF文库J', 
    books: [
      { id: 301, title: 'Re:Zero', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
      { id: 302, title: '游戏人生', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
      { id: 303, title: '变态王子', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
      { id: 304, title: '绯弹的亚里亚', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
      { id: 305, title: '圣剑学院', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
    ]
  },
  { 
    name: 'GA文库', 
    books: [
      { id: 401, title: '天使大人', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
      { id: 402, title: '龙王的工作', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
      { id: 403, title: '哥布林杀手', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
      { id: 404, title: '地城邂逅', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
      { id: 405, title: '处刑少女', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
    ]
  }
]

// 5. 热门点评
const hotReviews = [
  { id: 1, title: '在点滴的拉扯日常中，确认彼此之间的心意', user: 'k1seka', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', views: 538 },
  { id: 2, title: '道别过去，拥抱未来', user: '牧月', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', views: 3889 },
  { id: 3, title: '『转生王女与天才千金』的合理性反转', user: 'ringyuki', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', views: 1594 },
]

// 6. 右侧列表 (最新连载)
const latestUpdates = [
  '叹息的亡灵好想隐退 ~最弱...',
  '我们就不可成为恋人吗(※...',
  'あそびのかんけい',
  '明晰梦是为思春期哦~',
  '雨森同学的深海巨苔',
  'サクチシノニエ 異端の...',
  '一周一次买下同班同学...',
  '加速世界'
]

const goToDetail = (id) => {
  router.push(`/novel/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] font-sans pb-10">
    <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <main class="lg:col-span-3 space-y-10">
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <n-carousel autoplay show-arrow draggable class="h-auto">
            
            <div v-for="book in featuredNovels" :key="book.id" class="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              <div class="w-full md:w-72 flex-shrink-0 cursor-pointer group" @click="goToDetail(book.id)">
                <div class="rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-white relative">
                  <img :src="book.cover" class="w-full h-auto object-cover group-hover:scale-105 transition duration-500">
                  <div class="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-sm">
                    本周强推
                  </div>
                </div>
              </div>
              
              <div class="flex-grow flex flex-col justify-between min-w-0">
                <div>
                  <div class="mb-4">
                    <h1 class="text-3xl font-bold text-gray-800 hover:text-hikari-blue cursor-pointer transition leading-tight mb-2" @click="goToDetail(book.id)">
                      {{ book.title }}
                    </h1>
                    <div class="flex flex-wrap items-center gap-3">
                      <span class="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{{ book.originalTitle }}</span>
                      <span class="text-sm font-bold text-blue-500 flex items-center gap-1">
                        <n-icon :component="BookOutline"/> {{ book.author }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex gap-2 mb-4">
                    <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{{ book.label }}</span>
                    <span v-for="tag in book.tags" :key="tag" class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                      #{{ tag }}
                    </span>
                  </div>
                  
                  <div class="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {{ book.summary }}
                  </div>
                  
                  <div class="flex gap-4 mb-6">
                    <n-button type="primary" color="#36ad6a" size="large" class="w-40 font-bold shadow-lg shadow-green-200">
                      <template #icon><n-icon :component="ReaderOutline" /></template>
                      立即阅读
                    </n-button>
                    <n-button secondary size="large" class="w-32">
                      <template #icon><n-icon :component="HeartOutline" /></template>
                      收藏
                    </n-button>
                  </div>
                </div>

                <div class="mt-auto pt-4 border-t border-gray-50">
                   <div class="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold">
                     <n-icon :component="ImageOutline" class="text-hikari-blue"/> 插画预览 / 相关推荐
                   </div>
                   <n-carousel :slides-per-view="4" :space-between="12" show-arrow autoplay loop class="h-24">
                      <div v-for="(img, idx) in book.thumbnails" :key="idx" class="h-full cursor-pointer group">
                        <div class="h-full rounded-md overflow-hidden border border-gray-200 relative">
                           <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                           <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                        </div>
                      </div>
                   </n-carousel>
                </div>

              </div>
            </div>
            </n-carousel>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-4 border-l-4 border-hikari-blue pl-3">
            <h2 class="text-lg font-bold text-gray-800">资讯</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="news in newsList" :key="news.id" class="group cursor-pointer">
              <div class="rounded-lg overflow-hidden mb-2 relative h-32">
                <img :src="news.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
              </div>
              <h3 class="text-sm font-bold text-gray-700 line-clamp-2 group-hover:text-hikari-blue transition h-10">{{ news.title }}</h3>
              <div class="text-xs text-gray-400 mt-1">{{ news.date }}</div>
            </div>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4 border-l-4 border-green-500 pl-3">
            <h2 class="text-lg font-bold text-gray-800">今日推荐</h2>
            <div class="flex items-center gap-1 text-xs text-green-600 cursor-pointer hover:underline">
              <n-icon :component="TimeOutline"/> 换一换
            </div>
          </div>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div v-for="book in recommendations" :key="book.id" class="group cursor-pointer" @click="goToDetail(book.id)">
              <div class="aspect-[2/3] rounded-lg overflow-hidden border border-gray-100 shadow-sm relative mb-2">
                <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              </div>
              <h3 class="text-xs font-bold text-gray-700 text-center truncate group-hover:text-hikari-blue transition px-1">
                {{ book.title }}
              </h3>
            </div>
          </div>
        </section>

        <section>
          <div class="flex items-center gap-2 mb-4 border-l-4 border-orange-500 pl-3">
            <h2 class="text-lg font-bold text-gray-800">热门点评</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="review in hotReviews" :key="review.id" 
                 class="h-40 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm">
              <img :src="review.bg" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700">
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div class="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded inline-block mb-2 font-bold shadow-sm">10.0</div>
                <h3 class="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-yellow-300 transition">{{ review.title }}</h3>
                <div class="flex justify-between items-center text-xs text-white/70">
                   <div class="flex items-center gap-1"><n-avatar round :size="16" :src="review.bg"/> {{ review.user }}</div>
                   <div class="flex items-center gap-1"><n-icon :component="Flame"/> {{ review.views }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="space-y-8">
          <section v-for="(publisher, index) in publisherSections" :key="index">
            <div class="flex items-center gap-2 mb-4 border-l-4 border-indigo-500 pl-3">
              <h2 class="text-lg font-bold text-gray-800">{{ publisher.name }}</h2>
            </div>
            <div class="grid grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="book in publisher.books" :key="book.id" class="group cursor-pointer" @click="goToDetail(book.id)">
                <div class="aspect-[2/3] rounded-lg overflow-hidden border border-gray-100 shadow-sm relative mb-2">
                  <img :src="book.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
                <h3 class="text-xs font-bold text-gray-700 text-center truncate group-hover:text-hikari-blue transition">
                  {{ book.title }}
                </h3>
              </div>
            </div>
          </section>
        </div>

      </main>

      <aside class="hidden lg:block lg:col-span-1 space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center sticky top-24">
          <div v-if="userStore.userInfo">
             <n-avatar round :size="64" :src="userStore.userInfo.avatar" class="mb-3 border border-gray-200" />
             <h3 class="font-bold text-gray-800">{{ userStore.userInfo.name }}</h3>
             <div class="mt-6 space-y-3">
               <div class="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                 <span class="text-gray-500">我的收藏</span>
                 <n-icon :component="ChevronForward" class="text-gray-300"/>
               </div>
               <div class="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                 <span class="text-gray-500">最近阅读</span>
                 <span class="text-xs text-gray-400">暂无阅读记录</span>
               </div>
             </div>
          </div>
          <div v-else class="py-4">
             <p class="text-sm text-gray-400 mb-4">登录查看收藏与历史</p>
             <n-button type="primary" size="small" @click="router.push('/login')">立即登录</n-button>
          </div>
        </div>

        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm border-b border-gray-50 pb-2">
            <n-icon :component="ReaderOutline"/> 最新连载
          </h3>
          <ul class="space-y-3">
            <li v-for="(item, i) in latestUpdates" :key="i" class="flex justify-between items-center text-xs group cursor-pointer">
              <span class="text-gray-600 truncate group-hover:text-hikari-blue transition max-w-[180px]">{{ item }}</span>
              <span class="text-gray-300 scale-90">更新</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
           <h3 class="font-bold text-gray-800 mb-4 text-sm">热门分类</h3>
           <div class="flex flex-wrap gap-2">
             <n-tag size="small" checkable>校园</n-tag>
             <n-tag size="small" checkable>恋爱</n-tag>
             <n-tag size="small" checkable>后宫</n-tag>
             <n-tag size="small" checkable>异世界</n-tag>
             <n-tag size="small" checkable>百合</n-tag>
             <n-tag size="small" checkable>搞笑</n-tag>
             <n-tag size="small" checkable>治愈</n-tag>
           </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保留功能 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>