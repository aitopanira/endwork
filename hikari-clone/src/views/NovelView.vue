<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NAvatar, NCarousel, NCarouselItem } from 'naive-ui'
import { 
  BookOutline, 
  HeartOutline, 
  Flame, 
  TimeOutline, 
  ChevronForward,
  ReaderOutline,
  ImageOutline,
  ShuffleOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// === 1. 核心数据源：模拟一个较大的书籍库 ===
// 只有数据够多，随机推荐才有意义
const allNovels = [
  { id: 201, title: '败犬女主太多了！', originalTitle: '負けヒロインが多すぎる！', author: '雨森たきび', label: 'ガガガ文庫', tags: ['校园', '恋爱', '败犬', '搞笑'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', summary: '“哈？你在说谁是败犬？”' },
  { id: 202, title: '一周一次买下同班同学的那些事', originalTitle: '週に一度クラスメイトを買う話', author: '羽田宇佐', label: '富士見ファンタジア文庫', tags: ['校园', '百合', '恋爱'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', summary: '两个人的关系，从一周5000日元开始。' },
  { id: 203, title: 'Silent Witch 沉默魔女的秘密', originalTitle: 'サイレント・ウィッチ', author: '依空まつり', label: 'カドカワBOOKS', tags: ['奇幻', '魔法', '校园'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', summary: '虽然是天才魔女，但其实超怕生！' },
  { id: 204, title: '无职转生 ～到了异世界就拿出真本事～', originalTitle: '無職転生', author: '理不尽な孫の手', label: 'MFブックス', tags: ['异世界', '转生', '后宫', '热血'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', summary: '34岁无职处男尼特族在异世界开启新人生。' },
  { id: 205, title: 'Re: 从零开始的异世界生活', originalTitle: 'Re:ゼロから始める異世界生活', author: '長月達平', label: 'MF文庫J', tags: ['异世界', '战斗', '循环', '致郁'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', summary: '为了守护重要的人，少年不断对抗绝望的命运。' },
  { id: 206, title: '魔女之旅', originalTitle: '魔女の旅々', author: '白石定規', label: 'GAノベル', tags: ['奇幻', '旅行', '百合', '治愈'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', summary: '某个地方有一位旅人，她的名字是伊蕾娜。' },
  { id: 207, title: 'No Game No Life 游戏人生', originalTitle: 'ノーゲーム・ノーライフ', author: '榎宮祐', label: 'MF文庫J', tags: ['异世界', '智斗', '游戏', '后宫'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', summary: '空白兄妹在异世界通过游戏征服一切。' },
  { id: 208, title: '我们不可能成为恋人！绝对不行！', originalTitle: 'わたしが恋人になれるわけないじゃん、ムリムリ!', author: 'みかみてれん', label: 'ダッシュエックス文庫', tags: ['百合', '校园', '搞笑'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', summary: '虽然嘴上说不行，但身体却很诚实？' },
  { id: 209, title: '关于邻家的天使大人不知不觉把... ', originalTitle: 'お隣の天使様にいつの間にか駄目人間にされていた件', author: '佐伯さん', label: 'GA文庫', tags: ['恋爱', '校园', '纯爱', '日常'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', summary: '此乃名为焦急的双向暗恋，最棒的纯爱物语。' },
  { id: 210, title: '青春猪头少年系列', originalTitle: '青春ブタ野郎シリーズ', author: '鴨志田一', label: '電撃文庫', tags: ['校园', '恋爱', '科幻', '催泪'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', summary: '思春期症候群——那是流传在网络上的都市传说。' },
  { id: 211, title: '欢迎来到实力至上主义的教室', originalTitle: 'ようこそ実力至上主義の教室へ', author: '衣笠彰梧', label: 'MF文庫J', tags: ['校园', '智斗', '推理'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', summary: '真正的实力，究竟是什么？' },
  { id: 212, title: '86 -不存在的战区-', originalTitle: '86-エイティシックス-', author: '安里アサト', label: '電撃文庫', tags: ['科幻', '战斗', '致郁', '战争'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', summary: '在那片战场上，没有死者——这是官方的谎言。' },
  { id: 213, title: '千岁同学在波子汽水瓶内', originalTitle: '千歳くんはラムネ瓶のなか', author: '裕夢', label: 'ガガガ文庫', tags: ['校园', '现充', '青春'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', summary: '他是福井县首屈一指的现充，千岁朔。' },
  { id: 214, title: '刀剑神域', originalTitle: 'ソードアート・オンライン', author: '川原礫', label: '電撃文庫', tags: ['战斗', '科幻', '游戏', '热血'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', summary: '这虽然是游戏，但可不是闹着玩的。' },
  { id: 215, title: '继母的拖油瓶是我的前女友', originalTitle: '継母の連れ子が元カノだった', author: '紙城境介', label: '角川スニーカー文庫', tags: ['恋爱', '校园', '日常'], cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', summary: '由于父母再婚，分手的恋人变成了义理兄妹。' },
]

// 2. 状态定义
const recommendations = ref([]) // 今日推荐（随机变化）
const activeCategory = ref('校园') // 当前选中的分类
const categories = ['校园', '恋爱', '战斗', '科幻', '奇幻', '异世界', '推理', '后宫', '热血', '百合', '搞笑', '催泪', '治愈', '致郁', '日常']
const categorySectionRef = ref(null) // 用于滚动定位

// 3. ✨ 核心功能：真·随机推荐
const shuffleRecommendations = () => {
  // 从大库 allNovels 中随机打乱并取前 10 本
  const shuffled = [...allNovels].sort(() => 0.5 - Math.random())
  recommendations.value = shuffled.slice(0, 10)
}

// 4. ✨ 核心功能：分类筛选 (根据 activeCategory 动态计算)
const categoryBooks = computed(() => {
  const filtered = allNovels.filter(book => book.tags.includes(activeCategory.value))
  // 如果该分类下没有书，为了不留白，显示前5本（或者显示空状态）
  return filtered.length > 0 ? filtered : allNovels.slice(0, 5)
})

// 5. ✨ 核心功能：侧边栏标签点击联动
const handleSidebarTagClick = (tag) => {
  activeCategory.value = tag
  // 滚动到分类区域
  if (categorySectionRef.value) {
    categorySectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 初始化时随机一次
onMounted(() => {
  shuffleRecommendations()
})

// === 其他静态数据 (保持原样) ===
// 轮播图数据 (取大库里的前几本并补充缩略图)
const featuredNovels = ref([allNovels[0], allNovels[8], allNovels[2]]) 
featuredNovels.value.forEach(novel => {
  novel.thumbnails = [
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
  ]
})

const newsList = [
  { id: 1, title: '《夏日重现》外传小说发售', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', date: '3天前' },
  { id: 2, title: 'SONY宣布收购KADOKAWA', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', date: '5天前' },
  { id: 3, title: '无职转生完结纪念刊', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', date: '1周前' },
  { id: 4, title: '轻小说销量排行榜发布', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', date: '1周前' },
]

const publisherSections = [
  { name: 'MF文库J', books: allNovels.filter(b => b.label === 'MF文庫J') },
  { name: 'GA文库', books: allNovels.filter(b => b.label === 'GA文庫' || b.label === 'GAノベル') }
]

const hotReviews = [
  { id: 1, title: '在点滴的拉扯日常中，确认彼此之间的心意', user: 'k1seka', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', views: 538 },
  { id: 2, title: '道别过去，拥抱未来', user: '牧月', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg', views: 3889 },
  { id: 3, title: '『转生王女与天才千金』的合理性反转', user: 'ringyuki', bg: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg', views: 1594 },
]

const latestUpdates = ['叹息的亡灵好想隐退 ~最弱...', '我们就不可成为恋人吗(※...', 'あそびのかんけい', '明晰梦是为思春期哦~', '雨森同学的深海巨苔', 'サクチシノニエ 異端の...', '一周一次买下同班同学...', '加速世界']

const goToDetail = (id) => {
  router.push(`/novel/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] font-sans pb-10 text-gray-800">
    <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <main class="lg:col-span-3 space-y-12">
        
        <div class="bg-white rounded-xl shadow-sm border-dashed border-gray-300 overflow-hidden">
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
                    <n-button type="primary" color="#36ad6a" class="w-32 shadow-lg shadow-green-200">立即阅读</n-button>
                  </div>
                </div>
                <div class="mt-auto pt-4 border-t border-dashed border-gray-200">
                   <div class="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold"><n-icon :component="ImageOutline" class="text-hikari-blue"/> 插画预览 / 相关推荐</div>
                   <n-carousel :slides-per-view="4" :space-between="12" show-arrow autoplay loop class="h-24">
                      <div v-for="(img, idx) in book.thumbnails" :key="idx" class="h-full cursor-pointer group">
                        <div class="h-full rounded-md overflow-hidden border border-dashed border-gray-200 relative">
                           <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                        </div>
                      </div>
                   </n-carousel>
                </div>
              </div>
            </div>
          </n-carousel>
        </div>

        <section>
          <div class="flex items-center gap-2 mb-4 border-l-4 border-hikari-blue pl-3"><h2 class="text-lg font-bold">资讯</h2></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="news in newsList" :key="news.id" class="group cursor-pointer">
              <div class="rounded-lg overflow-hidden mb-2 relative h-32"><img :src="news.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"></div>
              <h3 class="text-xs font-bold text-gray-700 line-clamp-2 group-hover:text-hikari-blue transition h-10">{{ news.title }}</h3>
            </div>
          </div>
        </section>

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
                <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.originalTitle }}</h3>
                <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.title }}</p>
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
              @click="activeCategory = cat"
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
                <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.originalTitle }}</h3>
                <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.title }}</p>
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
            <div v-for="review in hotReviews" :key="review.id" class="h-40 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm">
              <img :src="review.bg" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700">
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
                  <h3 class="font-bold text-gray-800 text-xs leading-tight mb-1 line-clamp-2 h-8 group-hover:text-hikari-blue transition">{{ book.originalTitle }}</h3>
                  <p class="text-[10px] text-gray-400 truncate mb-2">{{ book.title }}</p>
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
                 <div class="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                   <span class="text-gray-500">我的收藏</span><n-icon :component="ChevronForward" class="text-gray-300"/>
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
              <li v-for="(item, i) in latestUpdates" :key="i" class="flex justify-between items-center text-xs group cursor-pointer">
                <span class="text-gray-600 truncate group-hover:text-hikari-blue transition max-w-[180px]">{{ item }}</span>
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