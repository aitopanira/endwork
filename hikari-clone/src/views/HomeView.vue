<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NCarousel, NAvatar, NIcon, useMessage } from 'naive-ui' 
import { EyeOutline, HeartOutline, GameControllerOutline, BookOutline } from '@vicons/ionicons5'
import { useUserStore } from '../stores/user' 
import PostCard from '../components/PostCard.vue'

const userStore = useUserStore()
const router = useRouter()
const message = useMessage() // 引入 message

// 1. 状态控制：当前激活的 Tab ('galgame' 或 'novel')
const activeReviewTab = ref('galgame')

// 通用跳转函数
const goToDetail = (id, type = 'post') => {
  if (type === 'game' || type === 'galgame') {
    router.push(`/galgame/${id}`)
  } else if (type === 'book' || type === 'novel') {
    router.push(`/novel/${id}`)
  } else {
    // 默认为文章帖子
    router.push(`/post/${id}`)
  }
}

// === 新增：处理签到 ===
const handleSignIn = () => {
  if (!userStore.userInfo) {
    router.push('/login')
    return
  }
  // 调用 store 中的签到方法
  const result = userStore.signIn()
  if (result.success) {
    message.success(result.msg)
  } else {
    message.warning(result.msg)
  }
}

// === 新增：计算经验条百分比 ===
const expPercentage = computed(() => {
  if (!userStore.userInfo) return '0%'
  const pct = (userStore.userInfo.currentExp / userStore.userInfo.nextLevelExp) * 100
  return Math.min(pct, 100).toFixed(1) + '%'
})

// 轮播图数据
const banners = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
]

// 最新资讯数据
const newsPosts = ref([
  {
    id: 1,
    title: '【Gal周报223期】MOONSTONE 宣布将制作新作，《anemoi》宣布跳票',
    summary: '本周，MOONSTONE 宣布将制作两部新作，并同步公开了两部作品的主视觉图和宣传 PV...',
    author: 'いち',
    date: '大约 22 小时前',
    views: 3200,
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
  },
  {
    id: 2,
    title: 'Key 社新作《anemoi》发布延迟通知',
    summary: '旧：2026年1月30日（周五） 新：2026年4月24日（周五） ▼anemoi 官方网站▼...',
    author: 'いち',
    date: '4 天前',
    views: 5400,
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
  },
  {
    id: 3,
    title: '【Gal周报222期】十二月新作本周发售，《缘起甜韵趣味丛生！》官中登陆 Steam',
    summary: '十二月新作已于本周发售，一共有五部作品，其中 PC 平台有四部作品...',
    author: 'いち',
    date: '8 天前',
    views: 2100,
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg'
  },
  {
    id: 4,
    title: '【Gal周报221期】《航迹云的彼方》民汉发布，《恋爱0公里》发售日期更新',
    summary: '本周，Eushully宣布将制作“战姬”系列第二部作品...',
    author: 'いち',
    date: '15 天前',
    views: 1800,
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg'
  }
])

// === 数据源 A：Galgame 评分 ===
const galgameReviews = ref([
  {
    id: 101,
    title: 'CLANNAD',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    score: '10.0',
    comment: 'Clannad是我人生中最重要的作品之一，它在一定程度上告诉我们要珍惜...',
    user: '唐胡v天体',
    time: '10天前',
    status: '已完成'
  },
  {
    id: 102,
    title: 'AMBITIOUS MISSION',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    score: '9.0',
    comment: '只玩了忍者那条线，有点想睡着，反正太色了太色了...',
    user: '蓝胖子',
    time: '21天前',
    status: '已完成'
  },
  {
    id: 103,
    title: '月影のシミュラクル',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    score: '10.0',
    comment: '流程中规中矩，喜欢恐怖悬疑解密的可以无脑玩...',
    user: 'StatTrak',
    time: '24天前',
    status: '已完成'
  },
  {
    id: 104,
    title: 'Rewrite',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    score: '9.0',
    comment: '如果说在玩完5条个人线的时候对久仰本作大名的我来说...',
    user: 'darkhope',
    time: '26天前',
    status: '已完成'
  }
])

// === 数据源 B：轻小说评分 (新增) ===
const lightNovelReviews = ref([
  {
    id: 201,
    title: '物语系列',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    score: '10.0',
    comment: '我心目中的第一神作，西尾维新真把文字玩到了极致，物语从始至终都在讲...',
    user: 'AOTO AOZAKI',
    time: '15天前',
    status: '已读完'
  },
  {
    id: 202,
    title: '刀剑神域',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    score: '10.0',
    comment: '我最喜欢的作品，看完动画就喜欢上了然后去补了小说，小说更是精彩...',
    user: 'bobllllll',
    time: '20天前',
    status: '已读完'
  },
  {
    id: 203,
    title: '通往夏天的隧道，再见的出口',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    score: '8.0',
    comment: '“我们相吻的五秒，是外界相当于六个小时的吻。” 一篇优秀的处女作...',
    user: 'klseka',
    time: '大约2个月前',
    status: '已读完'
  },
  {
    id: 204,
    title: '在昨日的春天等待你',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    score: '10.0',
    comment: '环环相扣以及倒放一般的剧情，我如果不看这本小说，死前走马灯绝对后悔...',
    user: '空门苍',
    time: '3个月前',
    status: '已读完'
  }
])

// 计算属性：根据当前 Tab 返回对应的数据
const currentReviews = computed(() => {
  return activeReviewTab.value === 'galgame' ? galgameReviews.value : lightNovelReviews.value
})

// 热门点评数据
const popularReviews = ref([
  {
    id: 1,
    title: '愿千年之恋，有朝一日能使万花怒放。',
    source: '千恋＊万花',
    type: 'game',
    summary: '少女的恋心藏不住—— 在电车仍未开通的深山里...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    author: '儚い愛',
    views: 602,
    likes: 4,
    time: '26天前'
  },
  {
    id: 2,
    title: '在点滴的拉扯日常中，确认彼此之间的心意',
    source: '一周一次买下同班同学的那些事',
    type: 'book',
    summary: '声明：本篇文章含有一定程度的轻小说和web版剧透内容...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    author: 'klseka',
    views: 505,
    likes: 5,
    time: '大约1个月前'
  },
  {
    id: 3,
    title: '『黑百合的花语是爱，也是诅咒，所以...』',
    source: '提早绽放的黑百合',
    type: 'game',
    summary: '14小时一口气推完《绽放的黑百合》有感...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    author: 'RizuoMi',
    views: 669,
    likes: 3,
    time: '大约2个月前'
  },
  {
    id: 4,
    title: '《缘之空》: 盛夏尽头的温柔恋恋',
    source: '缘之空',
    type: 'game',
    summary: '虽说《缘之空》的大名在ACG圈子内已经如雷贯耳...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    author: 'OfficialBot',
    views: 1205,
    likes: 88,
    time: '2个月前'
  },
  {
    id: 5,
    title: '道别过去，拥抱未来',
    source: '通往夏天的隧道，再见的出口',
    type: 'book',
    summary: '作为八目迷老师的处女作我认为是相当合格的...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    author: 'BookWorm',
    views: 890,
    likes: 12,
    time: '3个月前'
  },
  {
    id: 6,
    title: 'Lovesick Puppies简评 —— 遗珠之恨',
    source: 'LOVESICK PUPPIES',
    type: 'game',
    summary: '裸推并单说十几世纪后无汉化，意思是那些伟大作品被埋没的可惜...',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    author: 'GalGamer',
    views: 450,
    likes: 9,
    time: '3个月前'
  }
])

// 侧边栏本月强推数据
const featuredGame = ref({
  id: 101,
  title: 'Sakura no Uta - 樱之诗',
  brand: '枕 (Makura)',
  date: '2015-10-24',
  score: 9.8,
  description: '春天，樱花飞舞的季节。与你相遇的奇迹，是名为“樱之诗”的旋律...',
  cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', 
  tags: ['剧情作', '神作', '哲学']
})

// 社区动态数据
const posts = ref([
  {
    id: 10,
    title: '【Gal周报222期】十二月新作本周发售，《缘起甜韵》登陆Steam',
    summary: '十二月新作已于本周发售，一共有五部作品，快来看看有没有你喜欢的吧...',
    author: '官方bot',
    date: '18小时前',
    views: 2390,
    comments: 22,
    tag: '资讯',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
  },
  {
    id: 11,
    title: '关于Hikarinagi下载服务变更的说明',
    summary: '话说，Hikarinagi在把下载服务从onedrive移到b2+cf后，下载体验就很感人...',
    author: '星涟',
    date: '1天前',
    views: 4012,
    comments: 8,
    tag: '公告',
    cover: null 
  },
  {
    id: 12,
    title: 'Key社新作《anemoi》2026年1月30日发售预定',
    summary: 'Key社终于公布了新作的详细情报，这次的剧本由...',
    author: '搬运工',
    date: '2天前',
    views: 885,
    comments: 45,
    tag: '新闻',
    cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    
    <div class="lg:col-span-3 space-y-10">
      
      <n-carousel autoplay show-arrow class="rounded-lg shadow-sm overflow-hidden h-48 sm:h-80">
        <img v-for="url in banners" :key="url" :src="url" class="w-full h-full object-cover">
      </n-carousel>

      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-700 flex items-center gap-2">
            <span class="text-hikari-blue text-2xl">❖</span> 最新评分
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="game in currentReviews" 
            :key="game.id" 
            @click="goToDetail(game.id,activeReviewTab === 'galgame' ? 'game' : 'book')"
            class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex gap-3 group cursor-pointer animate-fade-in"
          >
            <div class="w-20 h-28 flex-shrink-0 relative overflow-hidden rounded-md bg-gray-100">
              <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            </div>
            <div class="flex-grow min-w-0 flex flex-col justify-between">
              <div class="flex justify-between items-start gap-2">
                <h3 class="font-bold text-gray-800 text-sm truncate w-full group-hover:text-hikari-blue transition">
                  {{ game.title }}
                </h3>
                <span class="bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 shadow-sm">
                  {{ game.score }}
                </span>
              </div>
              <p class="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed h-8">
                {{ game.comment }}
              </p>
              <div class="flex justify-between items-center text-[10px] text-gray-400 mt-2 border-t border-gray-50 pt-2">
                <div class="flex items-center gap-1.5">
                  <div class="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                    <img :src="game.cover" class="w-full h-full object-cover opacity-60"> 
                  </div>
                  <span class="hover:text-gray-600">{{ game.user }}</span>
                </div>
                <div class="text-right flex flex-col items-end leading-none gap-0.5">
                  <span class="text-green-500 bg-green-50 px-1 rounded transform scale-90 origin-right">{{ game.status }}</span>
                  <span class="transform scale-90 origin-right">{{ game.time }}</span>
                </div>
              </div>
            </div>
          </div>
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
            v-for="item in newsPosts" 
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
                <n-avatar round :size="16" :src="item.cover" />
                <span class="text-gray-500">{{ item.author }}</span>
                <span>{{ item.date }}</span>
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
            v-for="item in popularReviews" 
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
                   <span class="truncate">{{ item.source }}</span>
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
                <div class="flex items-center gap-1.5">
                   <n-avatar round :size="16" :src="item.cover" class="opacity-80"/>
                   <span class="hover:text-gray-600 truncate max-w-[60px]">{{ item.author }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="flex items-center gap-0.5"><n-icon :component="EyeOutline"/> {{ item.views }}</span>
                  <span class="flex items-center gap-0.5 hover:text-red-400 transition"><n-icon :component="HeartOutline"/> {{ item.likes }}</span>
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-4 mb-4 border-b pb-2">
          <h2 class="text-xl font-bold text-gray-700 border-l-4 border-hikari-pink pl-3">
            社区动态
          </h2>
        </div>
        <div class="space-y-4">
          <PostCard v-for="item in posts" :key="item.id" :post="item" />
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
          <div class="cursor-pointer hover:bg-gray-50 rounded py-1 transition">
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
          </div>
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

      <div @click="goToDetail(featuredGame.id, 'game')" class="bg-white rounded-lg shadow-sm overflow-hidden group border border-gray-100 cursor-pointer">
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
            <span class="text-[10px] text-gray-400">EGS</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
             <h4 class="text-white font-bold text-lg shadow-sm truncate w-full">{{ featuredGame.title }}</h4>
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
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
               <span v-for="tag in featuredGame.tags" :key="tag" class="text-[10px] border border-gray-200 px-1 rounded text-gray-400">
                 {{ tag }}
               </span>
            </div>
            <button class="bg-hikari-pink text-white text-xs px-3 py-1.5 rounded-full hover:bg-pink-600 transition shadow-sm shadow-pink-200">
              查看详情
            </button>
          </div>
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