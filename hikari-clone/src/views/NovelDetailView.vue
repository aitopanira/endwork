<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NIcon, NTag, NRate, NAvatar, NDivider, NInput, useMessage, NProgress 
} from 'naive-ui'
import { 
  BookOutline, 
  HeartOutline, 
  Heart, 
  ArrowBackOutline, 
  ShareSocialOutline, 
  EyeOutline,
  PersonOutline,
  CreateOutline,
  ChatbubbleOutline,
  ListOutline,
  Star,
  DownloadOutline,
  CheckmarkCircleOutline, 
  CheckmarkCircle 
} from '@vicons/ionicons5'
import { useResourceStore } from '../stores/resources'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const resourceStore = useResourceStore()
const userStore = useUserStore()

const novel = ref(null)
const commentInputRef = ref(null)

// === 核心：从 Store 获取状态 ===
const isFavorited = computed(() => {
  if (!novel.value || !userStore.userInfo) return false
  return userStore.novelLibrary.favorites.some(n => n.id === novel.value.id)
})

const isRead = computed(() => {
  if (!novel.value || !userStore.userInfo) return false
  return userStore.novelLibrary.read.some(n => n.id === novel.value.id)
})

// === 交互：处理状态切换 ===
const handleFavorite = () => {
  if (!userStore.userInfo) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  
  const isAdded = userStore.toggleNovelFavorite(novel.value)
  if (isAdded) {
    message.success('收藏成功！已加入书架')
  } else {
    message.info('已取消收藏')
  }
}

const handleMarkAsRead = () => {
  if (!userStore.userInfo) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  const isAdded = userStore.toggleNovelRead(novel.value)
  if (isAdded) {
    message.success('标记为已看过')
  } else {
    message.info('取消看过状态')
  }
}

// === 1. 评论与评分数据 ===
const reviews = ref([
  { 
    id: 1, 
    user: '败犬女主爱好者', 
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', 
    content: '八奈见杏菜真的太可爱了！老八党头顶青天！', 
    score: 5, 
    time: '2小时前' 
  },
  { 
    id: 2, 
    user: '轻小说中毒', 
    avatar: '轻', 
    content: '雨森焚火老师的文笔很细腻，这一卷的感情描写更进一步了。', 
    score: 4.5, 
    time: '1天前' 
  },
  { 
    id: 3, 
    user: '路人B', 
    avatar: 'B', 
    content: '什么时候出下一卷啊，急急急。', 
    score: 4, 
    time: '3天前' 
  }
])

const averageScore = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, item) => sum + item.score, 0)
  return (total / reviews.value.length).toFixed(1)
})

// === 2. 发表评论逻辑 ===
const commentContent = ref('')
const userRating = ref(0)

const isAvatarUrl = (str) => {
  return str && (str.startsWith('http') || str.startsWith('blob:') || str.startsWith('data:image'))
}

const submitReview = () => {
  if (!userStore.userInfo) {
    message.warning('请登录后再进行评价')
    router.push('/login')
    return
  }
  if (userRating.value === 0) {
    message.warning('请点击星星进行打分')
    return
  }
  if (!commentContent.value.trim()) {
    message.warning('评价内容不能为空')
    return
  }

  const userAvatar = userStore.userInfo.avatar || userStore.userInfo.name.charAt(0).toUpperCase()
  const newReview = {
    id: Date.now(),
    user: userStore.userInfo.name,
    avatar: userAvatar,
    content: commentContent.value,
    score: userRating.value,
    time: '刚刚'
  }

  reviews.value.unshift(newReview)
  commentContent.value = ''
  userRating.value = 0
  message.success('评价发表成功！')
}

// === 3. 锚点跳转逻辑 ===
const scrollToComments = () => {
  const commentSection = document.getElementById('comment-section')
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth' })
    nextTick(() => {
      if(commentInputRef.value) commentInputRef.value.focus()
    })
  }
}

onMounted(() => {
  // 转换 ID 为数字，确保匹配正确
  const novelId = Number(route.params.id)
  const found = resourceStore.getNovelById(novelId)
  
  if (found) {
    novel.value = {
      ...found,
      readCount: 3651,
      status: '连载中',
      contributor: 'zizaizile',
      volumes: [
        { id: 1, title: '第一卷', cover: found.cover },
        { id: 2, title: '第二卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
        { id: 3, title: '第三卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
        { id: 4, title: '第四卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
      ],
      characters: [
        { name: '温水和彦', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
        { name: '八奈见杏菜', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
        { name: '烧盐柠檬', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
      ]
    }
  }
})

const handleStartReading = () => {
  router.push({
    name: 'reader', 
    params: { id: novel.value.id },
    query: { title: novel.value.title }
  })
}

const handleReadVolume = (volumeId) => {
  router.push({
    name: 'reader',
    params: { id: novel.value.id },
    query: { title: novel.value.title, volume: volumeId }
  })
}
</script>

<template>
  <div v-if="novel" class="min-h-screen bg-[#f9fafb] font-sans pb-20">
    
    <div class="relative h-[500px] w-full overflow-hidden">
      <img :src="novel.cover" class="w-full h-full object-cover blur-2xl opacity-90 scale-110">
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
      
      <div class="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center">
        <n-button text class="text-white/90 hover:text-white font-bold" @click="router.back()">
          <template #icon><n-icon :component="ArrowBackOutline" /></template>
          返回
        </n-button>
        <div class="flex gap-4">
           <n-button circle class="bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-sm">
             <template #icon><n-icon :component="ShareSocialOutline" /></template>
           </n-button>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 container mx-auto px-4 z-20 pb-16 flex flex-col md:flex-row items-end gap-10">
        
        <div class="w-56 flex-shrink-0 relative group">
           <div class="rounded-lg overflow-hidden shadow-2xl border-4 border-white transition transform group-hover:-translate-y-2 duration-500">
             <img :src="novel.cover" class="w-full h-auto object-cover">
           </div>
        </div>

        <div class="flex-grow text-white pb-2 space-y-4">
          <h1 class="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">{{ novel.title }}</h1>
          <h2 class="text-xl opacity-90 font-medium">{{ novel.originalTitle }}</h2>
          
          <div class="flex flex-wrap gap-2 pt-2">
             <span class="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">连载中</span>
             <span class="bg-blue-500/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
               <n-icon :component="EyeOutline"/> {{ novel.readCount }}
             </span>
             <span class="bg-yellow-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
               <n-icon :component="Star"/> {{ averageScore }}
             </span>
             <span v-for="tag in novel.tags" :key="tag" class="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded hover:bg-white/30 cursor-pointer transition">
               {{ tag }}
             </span>
          </div>

          <div class="flex flex-wrap gap-4 pt-4">
            
            <n-button 
              type="primary" 
              :color="isFavorited ? '#ef4444' : '#f87171'" 
              size="large" 
              class="w-32 shadow-lg font-bold"
              @click="handleFavorite"
            >
               <template #icon>
                 <n-icon :component="isFavorited ? Heart : HeartOutline" />
               </template>
               {{ isFavorited ? '已收藏' : '收藏' }}
            </n-button>

            <n-button 
              type="primary"
              :color="isRead ? '#059669' : '#34d399'"
              size="large" 
              class="w-32 shadow-lg font-bold"
              @click="handleMarkAsRead"
            >
               <template #icon>
                 <n-icon :component="isRead ? CheckmarkCircle : CheckmarkCircleOutline" />
               </template>
               {{ isRead ? '已看过' : '看过' }}
            </n-button>

            <n-button color="#26a69a" size="large" class="w-32 shadow-lg font-bold" @click="scrollToComments">
               <template #icon><n-icon :component="CreateOutline" /></template>
               写评价
            </n-button>

            <n-button 
              @click="handleStartReading"
              type="primary" 
              color="#3b82f6" 
              size="large" 
              class="w-40 shadow-lg font-bold ml-auto md:ml-0"
            >
               <template #icon><n-icon :component="BookOutline" /></template>
               开始阅读
            </n-button>
          </div>
        </div>

      </div>
    </div>

    <div class="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-12 space-y-8">
        
        <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative">
          
          <div class="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-500">
             <span>贡献者:</span>
             <n-avatar round :size="20" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg" />
             <span class="font-bold text-gray-700">{{ novel.contributor }}</span>
             <n-button size="tiny" type="primary" color="#14b8a6" class="ml-2 rounded text-xs px-2">编辑此条目</n-button>
          </div>

          <h3 class="text-xl font-bold text-hikari-blue mb-6 mt-8 border-l-4 border-hikari-blue pl-3">书籍信息</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm text-gray-600 mb-8">
             <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">作者</span> <span class="font-bold text-blue-500 cursor-pointer hover:underline">{{ novel.author }}</span></div>
             <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">插画</span> <span class="font-bold text-blue-500 cursor-pointer hover:underline">いみぎむる</span></div>
             <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">出版社</span> <span class="font-bold text-gray-800">小学馆</span></div>
             <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">文库</span> <span class="font-bold text-green-600">GAGAGA文库</span></div>
          </div>

          <n-divider class="bg-gray-100" />

          <div class="mt-6">
             <div class="leading-loose text-gray-600 space-y-4 text-justify" v-html="novel.description"></div>
          </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <div class="flex justify-between items-center mb-4">
               <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
                 <n-icon :component="ListOutline" class="text-blue-500"/> 发行列表
               </h3>
               <span class="text-xs text-gray-400 cursor-pointer hover:text-blue-500">全部 ></span>
             </div>
             <div class="space-y-3">
               <div 
                 v-for="vol in novel.volumes" 
                 :key="vol.id" 
                 @click="handleReadVolume(vol.id)"
                 class="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group transition"
               >
                 <div class="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                   <img :src="vol.cover" class="w-full h-full object-cover">
                 </div>
                 <div>
                   <h4 class="font-bold text-sm text-gray-700 group-hover:text-blue-500 transition">{{ vol.title }}</h4>
                   <span class="text-xs text-gray-400">2024-05-20</span>
                 </div>
               </div>
             </div>
           </div>

           <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <div class="flex justify-between items-center mb-4">
               <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
                 <n-icon :component="PersonOutline" class="text-pink-500"/> 出场角色
               </h3>
             </div>
             <div class="grid grid-cols-2 gap-3">
               <div v-for="char in novel.characters" :key="char.name" class="flex items-center gap-3 p-2 border border-gray-100 rounded-lg hover:shadow-sm transition bg-gray-50/50">
                 <n-avatar round :src="char.avatar" />
                 <div>
                   <div class="font-bold text-xs text-gray-700">{{ char.name }}</div>
                   <div class="text-[10px] text-gray-400">{{ char.role }}</div>
                 </div>
               </div>
             </div>
           </div>

        </div>

        <div id="comment-section" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
           <h3 class="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
             <n-icon :component="ChatbubbleOutline" class="text-green-500"/> 评论区
           </h3>
           
           <div class="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
             <div class="flex gap-4">
               <n-avatar round :size="48" :src="userStore.userInfo ? userStore.userInfo.avatar : 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg'" />
               <div class="flex-grow">
                 <div class="mb-3 flex items-center gap-3">
                   <span class="text-sm text-gray-500 font-bold">打分:</span>
                   <n-rate v-model:value="userRating" allow-half />
                   <span v-if="userRating > 0" class="text-yellow-500 font-bold ml-2">{{ userRating }} 分</span>
                 </div>
                 
                 <n-input 
                   ref="commentInputRef"
                   v-model:value="commentContent"
                   type="textarea" 
                   placeholder="读完这本书感觉如何？快来写下你的评价吧..." 
                   :rows="3" 
                   class="bg-white"
                 />
                 
                 <div class="mt-3 text-right">
                   <n-button type="primary" color="#26a69a" @click="submitReview" :disabled="!userStore.userInfo">
                     <template #icon><n-icon :component="CreateOutline" /></template>
                     {{ userStore.userInfo ? '发布评价' : '登录后评价' }}
                   </n-button>
                 </div>
               </div>
             </div>
           </div>

           <div class="space-y-6">
             <div v-for="review in reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
               <n-avatar 
                 round 
                 :src="isAvatarUrl(review.avatar) ? review.avatar : undefined"
                 class="flex-shrink-0"
                 :class="isAvatarUrl(review.avatar) ? '' : 'bg-green-100 text-green-600 font-bold'"
               >
                 {{ isAvatarUrl(review.avatar) ? '' : review.avatar }}
               </n-avatar>

               <div class="flex-grow">
                 <div class="flex justify-between items-start mb-1">
                   <div>
                     <div class="font-bold text-gray-800 text-sm flex items-center gap-2">
                       {{ review.user }}
                       <n-rate readonly :default-value="review.score" size="small" class="scale-75 origin-left" />
                     </div>
                     <div class="text-xs text-gray-400 mt-0.5">{{ review.time }}</div>
                   </div>
                   <div class="text-yellow-500 font-bold text-lg leading-none">
                     {{ review.score }}
                   </div>
                 </div>
                 
                 <p class="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg">
                   {{ review.content }}
                 </p>
               </div>
             </div>
           </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* 让背景图的模糊不溢出容器 */
.blur-2xl {
  filter: blur(24px);
}
</style>