<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NAvatar, NIcon, NTag } from 'naive-ui'
import { 
  ArrowBack,
  PersonAddOutline,
  DocumentTextOutline,
  PeopleOutline,
  ChatbubbleOutline,
  HeartOutline,
  EyeOutline,
  Flame,
  HomeOutline,
  FolderOpenOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user' // 假设你有这个store

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 获取路由参数中的 ID
const sectionId = route.params.id

// 1. 模拟版块详情数据 (根据 ID 获取)
// 这里为了演示，写死了一个对应截图的数据
const sectionInfo = ref({
  id: sectionId,
  title: '答疑解惑&站内求助',
  cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', // 假设的封面图
  description: '游戏下载中或游玩中遇到的问题可以到这里寻求帮助。站内游戏板块有遇到问题的（角色，介绍，文件不对应，标注有问题。页面设置报错。）也可以在这里提出（管理员会解决的，对吧...？）。遇到的问题尽量提供相应游戏链接名称和错误信息以及复现步骤以便管理员解决。',
  followers: 35,
  posts: 1,
  isFollowing: false
})

// 2. 模拟帖子列表数据
const postList = ref([
  {
    id: 101,
    author: 'durt',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    time: '大约 5 小时前',
    title: '同班的偶像同学攻略',
    summary: '这个gal白毛线是怎么进的？我其他角色都通了就这个白毛不管怎么选都死活进不去个人线。。。',
    image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    tagName: '求助',
    tagColor: '#e6f7ff', // 浅蓝背景
    tagTextColor: '#1890ff', // 蓝色文字
    views: 1569,
    comments: 1,
    likes: 10
  },
  {
    id: 102,
    author: '星涟',
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
    time: '2 天前',
    title: '更快的下载！',
    summary: '话说，Hikarinagi在把下载服务从onedrive移到b2+cf后，下载体验就很感人。但是，众所周知，cf下载慢...',
    image: null, // 没有图片的帖子
    tagName: '建议',
    tagColor: '#f6ffed',
    tagTextColor: '#52c41a',
    views: 892,
    comments: 5,
    likes: 24
  }
])

// 3. 右侧热门话题 (复用之前的)
const trendingTopics = [
  { id: 1, name: '求助', count: '167讨论 · 74844浏览' },
  { id: 2, name: '闲聊', count: '95讨论 · 33322浏览' },
  { id: 3, name: '游戏吐槽', count: '56讨论 · 30647浏览' },
  { id: 4, name: '新作情报', count: '43讨论 · 44239浏览' },
  { id: 5, name: '长评', count: '34讨论 · 26450浏览' },
]

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转帖子详情
const goToPost = (id) => {
  router.push(`/post/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] pb-10 font-sans">
    
    <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <aside class="hidden lg:block lg:col-span-1 space-y-4">
        <div class="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
          <div v-if="userStore.userInfo">
             <n-avatar round :size="80" :src="userStore.userInfo.avatar" class="mb-4 border-2 border-white shadow-md" />
             <h3 class="font-bold text-gray-800 text-lg mb-4">{{ userStore.userInfo.name }}</h3>
             <div class="flex justify-center gap-6 text-sm text-gray-500 mb-6">
               <div class="flex flex-col"><span class="font-bold text-gray-800">0</span> 关注</div>
               <div class="flex flex-col"><span class="font-bold text-gray-800">0</span> 粉丝</div>
               <div class="flex flex-col"><span class="font-bold text-gray-800">0</span> 发布</div>
             </div>
             <div class="space-y-3">
               <n-button type="primary" color="#fb7299" block round class="shadow-sm font-bold">
                 + 发布内容
               </n-button>
               <n-button secondary color="#fb7299" block round class="font-bold">
                 内容管理
               </n-button>
             </div>
          </div>
          <div v-else>
             <n-button type="primary" color="#fb7299" block round @click="router.push('/login')">立即登录</n-button>
          </div>
        </div>

        <n-button 
        type="primary"
          color="#fb7299" 
          block 
          class="shadow-sm rounded-xl py-6 font-bold text-base" 
          @click="goBack"
        >
          <template #icon>
            <n-icon><ArrowBack /></n-icon>
          </template>
          返回上一页
        </n-button>
      </aside>

      <main class="lg:col-span-2 space-y-4">
        
        <div class="relative rounded-xl overflow-hidden shadow-sm h-64">
           <div 
             class="absolute inset-0 bg-cover bg-center blur-xl scale-110 brightness-50"
             :style="{ backgroundImage: `url(${sectionInfo.cover})` }"
           ></div>
           
           <div class="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              <div class="flex items-start gap-5">
                 <div class="w-24 h-24 rounded-lg bg-white p-1 shadow-lg flex-shrink-0">
                    <img :src="sectionInfo.cover" class="w-full h-full object-cover rounded-md">
                 </div>
                 
                 <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-start">
                       <h1 class="text-2xl font-bold mb-2 text-white shadow-black drop-shadow-md">{{ sectionInfo.title }}</h1>
                       <n-button size="small" ghost color="#fff" class="font-bold">
                          <template #icon><n-icon><PersonAddOutline /></n-icon></template>
                          关注
                       </n-button>
                    </div>
                    
                    <p class="text-gray-200 text-xs leading-relaxed line-clamp-3 mb-3 text-shadow">
                       {{ sectionInfo.description }}
                    </p>
                    
                    <div class="flex items-center gap-4 text-xs font-medium text-gray-100">
                       <span class="flex items-center gap-1"><n-icon><DocumentTextOutline/></n-icon> {{ sectionInfo.posts }} 帖子</span>
                       <span class="flex items-center gap-1"><n-icon><PeopleOutline/></n-icon> {{ sectionInfo.followers }} 关注</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div class="bg-transparent px-2 py-1 text-xs text-gray-500 flex items-center gap-2">
           <n-icon><HomeOutline /></n-icon>
           <span>当前位置</span>
           <span class="text-gray-300">/</span>
           <span>社区首页</span>
           <span class="text-gray-300">/</span>
           <span class="flex items-center gap-1"><n-icon><FolderOpenOutline /></n-icon> 版块</span>
           <span class="text-gray-300">/</span>
           <span class="text-gray-800 font-bold">{{ sectionInfo.title }}</span>
        </div>

        <div class="space-y-4">
           <div 
             v-for="post in postList" 
             :key="post.id"
             @click="goToPost(post.id)"
             class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
           >
              <div class="flex items-center gap-3 mb-3">
                 <n-avatar round :size="32" :src="post.avatar" />
                 <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-700 leading-none">{{ post.author }}</span>
                    <span class="text-xs text-gray-400 scale-90 origin-left mt-1">{{ post.time }}</span>
                 </div>
              </div>

              <h2 class="text-lg font-bold text-gray-800 mb-2 hover:text-blue-500 transition">{{ post.title }}</h2>
              
              <p class="text-sm text-gray-600 mb-3 leading-relaxed">{{ post.summary }}</p>
              
              <div v-if="post.image" class="mb-4 rounded-lg overflow-hidden max-w-md">
                 <img :src="post.image" class="w-full h-auto object-cover max-h-64">
              </div>

              <div class="flex items-center gap-3 pt-2">
                 <div 
                   class="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                   :style="{ backgroundColor: post.tagColor, color: post.tagTextColor }"
                 >
                    <n-icon v-if="post.tagName === '求助'"><ChatbubbleOutline/></n-icon>
                    # {{ post.tagName }}
                 </div>

                 <div class="flex-grow"></div>
                 
                 <div class="flex items-center gap-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1 hover:text-blue-500"><n-icon><ChatbubbleOutline/></n-icon> {{ post.comments }}</span>
                    <span class="flex items-center gap-1 hover:text-pink-500"><n-icon><HeartOutline/></n-icon> {{ post.likes }}</span>
                    <span class="flex items-center gap-1"><n-icon><EyeOutline/></n-icon> {{ post.views }}</span>
                 </div>
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
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
/* 增加一些额外的文字阴影，保证在模糊背景上的可读性 */
.text-shadow {
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
</style>