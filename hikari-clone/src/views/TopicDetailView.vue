<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NAvatar, NIcon, NTag, NBreadcrumb, NBreadcrumbItem 
} from 'naive-ui'
import { 
  ChatbubbleOutline, 
  HeartOutline, 
  EyeOutline,
  Flame,
  PersonOutline,
  CreateOutline,
  SettingsOutline,
  ArrowBack 
} from '@vicons/ionicons5'
import { useCommunityStore } from '../stores/community'
import { useUserStore } from '../stores/user' 

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()
const userStore = useUserStore() 

// 模拟话题详情数据
const topicInfo = ref({
  id: 1,
  name: '闲聊',
  description: '茶余饭后，在此畅所欲言。分享你的生活点滴。',
  icon: '💬',
  stats: {
    posts: 1204,
    views: '3.4m',
    followers: 892
  }
})

// 右侧热门话题数据
const trendingTopics = [
  { id: 1, name: '闲聊', count: '165讨论 · 7154浏览' }, 
  { id: 2, name: '求助', count: '94讨论 · 31223浏览' },
  { id: 3, name: 'Galgame', count: '56讨论 · 29373浏览' },
  { id: 4, name: '新作情报', count: '42讨论 · 43034浏览' },
  { id: 5, name: '长评', count: '34讨论 · 25871浏览' },
  { id: 6, name: '炭边情报', count: '32讨论 · 38772浏览' },
  { id: 7, name: '每周Galgame新闻速递', count: '32讨论 · 38351浏览' },
]

// 筛选帖子逻辑
const topicPosts = computed(() => {
  const posts = communityStore.posts.filter(p => p.tag === topicInfo.value.name || p.tag === '日常')
  if (posts.length === 0) {
    return [
      {
        id: 101,
        author: 'UserA',
        avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
        time: '2小时前',
        title: '关于这个话题的一些看法...',
        summary: '正如标题所说，我觉得这个话题非常有意思...',
        tag: '闲聊',
        comments: 12,
        likes: 5,
        views: 100,
        image: null
      },
      {
        id: 102,
        author: 'UserB',
        avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
        time: '5小时前',
        title: '新人报道，请多关照',
        summary: '刚刚入坑，希望能和大家好好相处！',
        tag: '闲聊',
        comments: 2,
        likes: 1,
        views: 45,
        image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
      }
    ]
  }
  return posts
})

// 获取数据函数
const fetchTopicData = (id) => {
  topicInfo.value.icon = '💬' 
  topicInfo.value.name = '话题 ' + id 

  if (id === '1') {
    topicInfo.value.name = '闲聊'
    topicInfo.value.icon = '💬'
  }
  if (id === '2') {
    topicInfo.value.name = '求助'
    topicInfo.value.icon = '🆘'
  }
  if (id === '3') {
    topicInfo.value.name = 'Galgame'
    topicInfo.value.icon = '🎮'
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchTopicData(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchTopicData(newId)
    }
  }
)

const goToPost = (id) => router.push(`/post/${id}`)

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] font-sans py-8">
    <div class="container mx-auto px-4">
      
      <n-breadcrumb class="mb-6">
        <n-breadcrumb-item @click="router.push('/')" class="cursor-pointer">首页</n-breadcrumb-item>
        <n-breadcrumb-item @click="router.push('/community')" class="cursor-pointer">社区</n-breadcrumb-item>
        <n-breadcrumb-item>话题: #{{ topicInfo.name }}</n-breadcrumb-item>
      </n-breadcrumb>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
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

          <n-button 
            type="primary"
            color="#fb7299" 
            block 
            class="shadow-sm rounded-xl py-6 font-bold text-base" 
            @click="goBack"
          >
            <template #icon>
              <n-icon color="#ffffff"><ArrowBack /></n-icon>
            </template>
            <span style="color: #ffffff">返回上一页</span>
          </n-button>
        </aside>

        <main class="lg:col-span-2 space-y-6">
          
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-3xl flex-shrink-0">
                {{ topicInfo.icon }}
              </div>
              <div class="flex-grow">
                <h1 class="text-xl font-bold text-gray-800 mb-1">#{{ topicInfo.name }}</h1>
                <p class="text-gray-500 text-sm leading-relaxed mb-3">{{ topicInfo.description }}</p>
                <div class="flex gap-4 text-xs text-gray-400">
                  <span><strong>{{ topicInfo.stats.posts }}</strong> 帖子</span>
                  <span><strong>{{ topicInfo.stats.followers }}</strong> 关注</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm min-h-[500px] border border-gray-100 p-4 space-y-4">
            
            <div v-for="post in topicPosts" :key="post.id" 
                 class="group cursor-pointer border-b border-gray-50 last:border-0 pb-4 last:pb-0 hover:bg-gray-50/50 transition -mx-2 px-2 rounded-lg"
                 @click="goToPost(post.id)">
              
              <div class="flex items-start gap-3">
                <n-avatar round :src="post.avatar" :size="36" class="flex-shrink-0 border border-gray-100 mt-1" />
                <div class="flex-grow min-w-0">
                  <div class="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <span class="font-medium text-gray-700">{{ post.author }}</span>
                      <span>·</span>
                      <span>{{ post.time }}</span>
                  </div>

                  <div class="flex justify-between items-start mb-1">
                    <h3 class="font-bold text-gray-800 text-base group-hover:text-blue-600 transition truncate pr-4">
                      {{ post.title }}
                    </h3>
                  </div>
                  
                  <p class="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                    {{ post.summary }}
                  </p>

                  <div v-if="post.image" class="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-100">
                    <img :src="post.image" class="w-full h-full object-cover">
                  </div>

                  <div class="flex gap-6 text-xs text-gray-400">
                    <span class="flex items-center gap-1 hover:text-blue-500"><n-icon :component="ChatbubbleOutline"/> {{ post.comments }}</span>
                    <span class="flex items-center gap-1 hover:text-pink-500"><n-icon :component="HeartOutline"/> {{ post.likes }}</span>
                    <span class="flex items-center gap-1"><n-icon :component="EyeOutline"/> {{ post.views }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="topicPosts.length === 0" class="text-center py-20 text-gray-400">
              <n-icon size="48" :component="ChatbubbleOutline" class="mb-2 opacity-50" />
              <p>暂无内容</p>
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
                  <div class="text-sm text-gray-700 font-medium group-hover:text-pink-500 transition truncate">{{ topic.name }}</div>
                  <div class="text-xs text-gray-400 scale-90 origin-left truncate">{{ topic.count }}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-80">
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
  </div>
</template>