<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NAvatar, NIcon, NTag } from 'naive-ui'
// 引入所需的图标
import { 
  CreateOutline, 
  SettingsOutline, 
  ChatbubbleOutline, 
  HeartOutline, 
  EyeOutline,
  MegaphoneOutline,
  Flame,
  PersonOutline,
  GameControllerOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import { useCommunityStore } from '../stores/community'

const router = useRouter()
// 如果没有这些 store，可以注释掉这两行，或者换成你自己的逻辑
const userStore = useUserStore()
const communityStore = useCommunityStore()

// 1. 热门版块数据：已修改为纯色背景风格 (hexColor)
const hotSections = [
  { 
    id: 1, 
    title: '闲聊灌水', 
    count: '78图文', 
    posts: '31文章', 
    hexColor: '#66b1ff', // 蓝色
    icon: ChatbubbleOutline 
  },
  { 
    id: 2, 
    title: 'Galgame周报', 
    count: '3图文', 
    posts: '32文章', 
    hexColor: '#ff9f43', // 橙色
    icon: MegaphoneOutline 
  },
  { 
    id: 3, 
    title: '答疑解惑', 
    count: '37图文', 
    posts: '7文章', 
    hexColor: '#4cd137', // 绿色
    icon: CreateOutline 
  },
  { 
    id: 4, 
    title: '新人报道区', 
    count: '31图文', 
    posts: '5文章', 
    hexColor: '#ff6b6b', // 粉红
    icon: PersonOutline 
  },
]

// 2. 帖子列表数据
const feedPosts = [
  {
    id: 1,
    author: 'devv',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    time: '大约 6 小时前',
    title: '今年我不会再玩galgame了！这是我今年最后一天碰gal！',
    summary: '经典段子放送 提前庆祝各位元旦快乐...',
    image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    tag: '闲聊',
    views: 24,
    comments: 0,
    likes: 0
  },
  {
    id: 2,
    author: 'いち',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    time: '1 天前',
    title: '【Gal周报223期】MOONSTONE 宣布制作新作，《anemoi》宣布跳票',
    summary: '本周，MOONSTONE 宣布将制作两部新作《ストレイ・シープと死者の声 Vol.1》和《ストレイ・シープと死者の声 Vol.2》...',
    image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    tag: '资讯',
    views: 247,
    comments: 4,
    likes: 3
  }
]

// 3. 右侧热门话题数据
const trendingTopics = [
  { id: 1, name: '求助', count: '165讨论 · 7154浏览' },
  { id: 2, name: '闲聊', count: '94讨论 · 31223浏览' },
  { id: 3, name: '游戏吐槽', count: '56讨论 · 29373浏览' },
  { id: 4, name: '新作情报', count: '42讨论 · 43034浏览' },
  { id: 5, name: '长评', count: '34讨论 · 25871浏览' },
  { id: 6, name: '炭边情报', count: '32讨论 · 38772浏览' },
  { id: 7, name: '每周Galgame新闻速递', count: '32讨论 · 38351浏览' },
]

// 路由跳转方法
const goToDetail = (id) => {
  router.push(`/post/${id}`)
}

const goToSection = (id) => {
  router.push(`/community/section/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] relative overflow-hidden font-sans pb-10">
    
    <div class="absolute top-20 left-10 text-red-200 text-4xl opacity-50 select-none animate-pulse">🏮</div>
    <div class="absolute top-40 right-20 text-pink-200 text-2xl opacity-60 select-none">🌸</div>
    <div class="absolute bottom-1/3 left-1/4 text-red-100 text-3xl opacity-40 select-none">🏮</div>

    <div class="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
      
      <aside class="hidden lg:block lg:col-span-1 space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100 sticky top-24">
          <div v-if="userStore.userInfo">
            <n-avatar round :size="80" :src="userStore.userInfo.avatar" class="mb-4 border-2 border-white shadow-md" />
            <h3 class="font-bold text-gray-800 text-lg mb-1">{{ userStore.userInfo.name }}</h3>
            
            <div class="flex justify-center gap-4 text-sm text-gray-500 mb-6">
              <div class="flex flex-col"><span class="font-bold text-gray-800">0</span> 收藏</div>  
              <div class="flex flex-col"><span class="font-bold text-gray-800">0</span> 发布</div>
            </div>
                    
            <div class="space-y-3">
            <n-button type="primary" color="#fb7299" block round class="shadow-sm font-bold" @click="router.push('/creator')">
              <template #icon><n-icon :component="CreateOutline" /></template>
              发布内容
            </n-button>
            
            <n-button secondary color="#fb7299" block round class="font-bold">
              <template #icon><n-icon :component="SettingsOutline" /></template>
              内容管理
            </n-button>
          </div>
          </div>
          
          <div v-else class="py-8">
             <p class="text-gray-400 mb-4">登录后参与讨论</p>
             <n-button type="primary" color="#fb7299" block round @click="router.push('/login')">立即登录</n-button>
          </div>
        </div>
      </aside>

      <main class="lg:col-span-2 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="sec in hotSections" 
            :key="sec.id" 
            @click="goToSection(sec.id)"
            class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm mr-4 shrink-0"
              :style="{ backgroundColor: sec.hexColor }"
            >
               <n-icon size="24" :component="sec.icon" />
            </div>
            <div class="flex flex-col">
              <div class="font-bold text-gray-800 text-base mb-0.5">{{ sec.title }}</div>
              <div class="text-xs text-gray-400">{{ sec.count }} · {{ sec.posts }}</div>
            </div>
          </div>
        </div>

        <div class="bg-teal-50 text-teal-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-teal-100 shadow-sm">
          <n-icon :component="MegaphoneOutline" />
          <span class="font-bold">[公告]</span>
          <span class="truncate">关于 Hikarinagi 将于 2025 年 11 月 4 日起正式关闭 Galgame 游戏本体下载功能的通知</span>
        </div>

        <div class="space-y-4">
          <div v-for="post in feedPosts" :key="post.id" 
               @click="goToDetail(post.id)"
               class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
            
            <div class="flex items-center gap-2 mb-3">
              <n-avatar round :size="24" :src="post.avatar" />
              <span class="text-sm font-bold text-gray-700">{{ post.author }}</span>
              <span class="text-xs text-gray-400">{{ post.time }}</span>
            </div>

            <h3 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-hikari-blue transition">{{ post.title }}</h3>
            <p class="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">{{ post.summary }}</p>

            <div v-if="post.image" class="w-32 h-32 rounded-lg overflow-hidden mb-3 bg-gray-100 border border-gray-100">
               <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-3">
               <span class="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium"># {{ post.tag }}</span>
               <div class="flex-grow"></div>
               <span class="flex items-center gap-1 hover:text-blue-500 transition"><n-icon :component="ChatbubbleOutline"/> {{ post.comments }}</span>
               <span class="flex items-center gap-1 hover:text-pink-500 transition"><n-icon :component="HeartOutline"/> {{ post.likes }}</span>
               <span class="flex items-center gap-1"><n-icon :component="EyeOutline"/> {{ post.views }}</span>
            </div>
          </div>
        </div>

      </main>

      <aside class="hidden lg:block lg:col-span-1 space-y-6">
        
        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">
            <span class="text-red-500"><n-icon :component="Flame" /></span> 热门话题
          </h3>
          <ul class="space-y-4">
            <li 
              v-for="(topic, index) in trendingTopics" 
              :key="topic.id" 
              @click="router.push(`/community/topic/${topic.id}`)"
              class="flex items-start gap-3 cursor-pointer group"
                >
               <span :class="`font-bold w-5 text-center flex-shrink-0 bg-gray-100 rounded text-xs py-0.5 ${index < 3 ? 'text-orange-500 bg-orange-50' : 'text-gray-400'}`">
                 {{ index + 1 }}
               </span>
               <div class="min-w-0">
                 <div class="text-sm text-gray-700 font-medium group-hover:text-hikari-blue transition truncate">{{ topic.name }}</div>
                 <div class="text-xs text-gray-400 scale-90 origin-left truncate">{{ topic.count }}</div>
               </div>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
           <h3 class="font-bold text-gray-800 mb-4 text-sm">社区统计</h3>
           <div class="grid grid-cols-2 gap-3 text-center">
             <div class="bg-teal-50 rounded-lg py-3">
               <div class="text-teal-600 font-bold text-lg">34.2K</div>
               <div class="text-xs text-teal-500/70">社区成员</div>
             </div>
             <div class="bg-blue-50 rounded-lg py-3">
               <div class="text-blue-600 font-bold text-lg">192</div>
               <div class="text-xs text-blue-500/70">周文总数</div>
             </div>
             <div class="bg-green-50 rounded-lg py-3">
               <div class="text-green-600 font-bold text-lg">113</div>
               <div class="text-xs text-green-500/70">今日在线</div>
             </div>
             <div class="bg-purple-50 rounded-lg py-3">
               <div class="text-purple-600 font-bold text-lg">1.8K</div>
               <div class="text-xs text-purple-500/70">总帖子</div>
             </div>
           </div>
        </div>

      </aside>

    </div>
  </div>
</template>