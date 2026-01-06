<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NIcon, NTag, NImage, NImageGroup, NRate, NProgress, 
  NAvatar, NDivider, NInput, useMessage 
} from 'naive-ui'
import { 
  PlayCircleOutline, 
  CheckmarkCircleOutline, 
  TimeOutline, 
  HeartOutline, 
  ShareSocialOutline,
  ArrowBackOutline,
  Star,
  ChatbubbleOutline,
  CreateOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

// 统一 ID 类型为数字，确保与 Store 中存储的 ID 匹配
const gameId = Number(route.params.id)

// 模拟 Galgame 数据
const game = ref({
  id: gameId,
  title: '天使☆騒々 RE-BOOT!',
  originalTitle: '天使☆騒々 RE-BOOT!',
  developer: 'YUZUSOFT (柚子社)',
  date: '2023-04-28',
  price: '9,800円',
  platform: 'PC (Windows)',
  website: 'http://yuzu-soft.com/',
  tags: ['废萌', '喜剧', '恋爱', '柚子社', '纯爱'],
  description: `
    <p>“乃亚，可以拜托你去那个世界吗？”</p>
    <p>某日，主人公・<strong>谷风李空</strong>邂逅了自称天使的美少女・<strong>乃亚</strong>。</p>
    <p>乃亚因为某个意外失去了力量，请求李空协助她。而李空虽然也是个普通学生，却有着某种特殊的体质……</p>
    <p>就这样，充满骚乱与心动的同居生活开始了！</p>
  `,
  cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  gallery: [
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
  ]
})

// === 核心：从 Store 获取当前状态 ===
const currentStatus = computed(() => {
  if (!userStore.userInfo) return ''
  // 检查该游戏是否在对应的列表中
  if (userStore.galgameLibrary.wish.some(g => g.id === gameId)) return 'wish'
  if (userStore.galgameLibrary.playing.some(g => g.id === gameId)) return 'playing'
  if (userStore.galgameLibrary.played.some(g => g.id === gameId)) return 'played'
  return ''
})

// === 交互：处理状态切换 ===
const handleStatusChange = (status) => {
  if (!userStore.userInfo) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  // 如果点击的是当前已激活的状态，则表示取消
  if (currentStatus.value === status) {
    userStore.setGalgameStatus(game.value, null) // 传入 null 清除状态
    message.info('已取消标记')
  } else {
    // 否则设置为新状态
    userStore.setGalgameStatus(game.value, status)
    const msgMap = {
      wish: '已加入愿望单',
      playing: '开始记录游玩进度',
      played: '标记为已玩过'
    }
    message.success(msgMap[status])
  }
}

const handleShare = () => {
  message.success('链接已复制到剪贴板')
}

// === 1. 评论/评分数据源 ===
const reviews = ref([
  { 
    id: 1, 
    user: '纯爱战神', 
    avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg', 
    content: '柚子社依旧稳定发挥，这作的人设真的太戳我了！乃亚天下第一！', 
    score: 5, 
    time: '2小时前' 
  },
  { 
    id: 2, 
    user: 'Gal萌新', 
    avatar: 'G', 
    content: '剧情稍微有点白开水，但是画风满分。', 
    score: 4, 
    time: '1天前' 
  },
  { 
    id: 3, 
    user: 'YuzuFan', 
    avatar: 'Y', 
    content: '音乐非常好听，推荐游玩。', 
    score: 5, 
    time: '3天前' 
  }
])

// === 2. 动态计算平均分 ===
const averageScore = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, item) => sum + item.score, 0)
  return (total / reviews.value.length).toFixed(1)
})

// === 3. 动态计算评分分布 ===
const ratingDistribution = computed(() => {
  const total = reviews.value.length
  if (total === 0) return []
  
  const dist = { 5:0, 4:0, 3:0, 2:0, 1:0 }
  reviews.value.forEach(r => {
    const s = Math.round(r.score)
    if(dist[s] !== undefined) dist[s]++
  })

  return [
    { label: '5星', percent: (dist[5] / total) * 100 },
    { label: '4星', percent: (dist[4] / total) * 100 },
    { label: '3星', percent: (dist[3] / total) * 100 },
    { label: '2星', percent: (dist[2] / total) * 100 },
    { label: '1星', percent: (dist[1] / total) * 100 },
  ]
})

// === 4. 发表评价逻辑 ===
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
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden font-sans">
    
    <div class="fixed inset-0 z-0">
      <img :src="game.cover" class="w-full h-full object-cover blur-3xl opacity-60 scale-110">
      <div class="absolute inset-0 bg-black/40"></div> 
    </div>

    <div class="relative z-10 container mx-auto px-4 py-10 max-w-6xl">
      
      <div class="mb-6">
        <n-button text class="text-white/80 hover:text-white" @click="router.back()">
          <template #icon><n-icon :component="ArrowBackOutline" /></template>
          返回列表
        </n-button>
      </div>

      <div class="flex flex-col md:flex-row gap-8 mb-10 items-start animate-fade-in">
        <div class="w-48 md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
          <img :src="game.cover" class="w-full h-full object-cover hover:scale-105 transition duration-500">
        </div>

        <div class="flex-grow pt-2">
          <h1 class="text-4xl font-bold mb-2 text-shadow">{{ game.title }}</h1>
          <h2 class="text-lg text-white/60 mb-6 font-medium">{{ game.originalTitle }}</h2>
          
          <div class="flex flex-wrap gap-4 mb-8">
            
            <n-button 
              @click="handleStatusChange('wish')"
              :type="currentStatus === 'wish' ? 'error' : 'default'"
              :secondary="currentStatus !== 'wish'"
              :color="currentStatus === 'wish' ? undefined : '#f87171'" 
              size="large" 
              class="w-32 font-bold shadow-lg shadow-red-500/30"
            >
              <template #icon><n-icon :component="HeartOutline" /></template>
              {{ currentStatus === 'wish' ? '已标记' : '想玩' }}
            </n-button>

            <n-button 
              @click="handleStatusChange('playing')"
              :type="currentStatus === 'playing' ? 'info' : 'default'"
              :secondary="currentStatus !== 'playing'"
              :color="currentStatus === 'playing' ? undefined : '#60a5fa'" 
              size="large" 
              class="w-32 font-bold shadow-lg shadow-blue-500/30"
            >
              <template #icon><n-icon :component="PlayCircleOutline" /></template>
              {{ currentStatus === 'playing' ? '在玩中' : '在玩' }}
            </n-button>

            <n-button 
              @click="handleStatusChange('played')"
              :type="currentStatus === 'played' ? 'primary' : 'default'"
              :secondary="currentStatus !== 'played'"
              :color="currentStatus === 'played' ? '#34d399' : '#34d399'" 
              size="large" 
              class="w-32 font-bold shadow-lg shadow-green-500/30"
            >
              <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
              {{ currentStatus === 'played' ? '已玩过' : '玩过' }}
            </n-button>

            <n-button @click="handleShare" secondary circle class="text-white bg-white/10 hover:bg-white/20 border-none">
              <template #icon><n-icon :component="ShareSocialOutline" /></template>
            </n-button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <aside class="space-y-8 animate-slide-up" style="animation-delay: 0.1s;">
          
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 class="font-bold text-lg mb-4 border-l-4 border-hikari-pink pl-3">作品信息</h3>
            <ul class="space-y-3 text-sm text-gray-300">
              <li class="flex justify-between"><span class="text-gray-500">开发商</span> <span class="text-white font-medium hover:text-hikari-pink cursor-pointer">{{ game.developer }}</span></li>
              <li class="flex justify-between"><span class="text-gray-500">发售日</span> <span>{{ game.date }}</span></li>
              <li class="flex justify-between"><span class="text-gray-500">平台</span> <span>{{ game.platform }}</span></li>
              <li class="flex justify-between"><span class="text-gray-500">官网</span> <a :href="game.website" target="_blank" class="text-blue-400 hover:underline">点击访问</a></li>
            </ul>
            
            <n-divider class="bg-white/20" />
            
            <div class="flex flex-wrap gap-2">
              <n-tag v-for="tag in game.tags" :key="tag" round size="small" class="bg-white/10 text-white border-transparent hover:bg-hikari-pink transition cursor-pointer">
                # {{ tag }}
              </n-tag>
            </div>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 class="font-bold text-lg mb-4 border-l-4 border-yellow-400 pl-3">用户评分</h3>
            <div class="flex items-end gap-2 mb-4">
              <span class="text-5xl font-bold text-yellow-400">{{ averageScore }}</span>
              <div class="pb-2">
                <n-rate readonly :default-value="Number(averageScore)" allow-half size="small" />
                <p class="text-xs text-gray-400">{{ reviews.length }} 人评价</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div v-for="item in ratingDistribution" :key="item.label" class="flex items-center gap-3 text-xs">
                <span class="w-8 text-right text-gray-400">{{ item.label }}</span>
                <n-progress 
                  type="line" 
                  :percentage="item.percent" 
                  color="#fbbf24" 
                  rail-color="rgba(255,255,255,0.1)"
                  :height="6" 
                  :show-indicator="false" 
                />
              </div>
            </div>
          </div>

        </aside>

        <main class="lg:col-span-2 space-y-8 animate-slide-up" style="animation-delay: 0.2s;">
          
          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
              <n-icon :component="TimeOutline" class="text-hikari-blue"/> 
              CG 预览
            </h3>
            <n-image-group>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <n-image 
                  v-for="(img, index) in game.gallery" 
                  :key="index"
                  :src="img"
                  class="rounded-lg overflow-hidden cursor-zoom-in hover:brightness-110 transition border border-white/10 w-full h-32 object-cover"
                  object-fit="cover"
                />
              </div>
            </n-image-group>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 class="font-bold text-lg mb-4">故事简介</h3>
            <div class="text-gray-300 leading-relaxed space-y-4" v-html="game.description"></div>
          </div>

          <div class="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <n-icon :component="ChatbubbleOutline" /> 玩家评价
            </h3>

            <div class="bg-white/5 p-5 rounded-xl mb-8 border border-white/10">
               <div class="flex gap-4">
                 <n-avatar round :size="48" :src="userStore.userInfo ? userStore.userInfo.avatar : 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg'" class="bg-gray-700"/>
                 <div class="flex-grow">
                   <div class="flex items-center gap-3 mb-3">
                     <span class="text-sm text-gray-400 font-bold">点击打分:</span>
                     <n-rate v-model:value="userRating" allow-half />
                     <span v-if="userRating > 0" class="text-yellow-400 font-bold text-sm ml-1">{{ userRating }} 分</span>
                   </div>
                   
                   <n-input 
                     v-model:value="commentContent"
                     type="textarea" 
                     placeholder="玩过之后感觉如何？分享你的评价吧..." 
                     :rows="3" 
                     class="bg-black/20 text-white border border-white/10 rounded-lg placeholder-gray-500"
                   />
                   
                   <div class="mt-3 text-right">
                     <n-button type="primary" color="#fb7299" @click="submitReview">
                       <template #icon><n-icon :component="CreateOutline" /></template>
                       {{ userStore.userInfo ? '发布评价' : '登录后评价' }}
                     </n-button>
                   </div>
                 </div>
               </div>
            </div>

            <div class="space-y-6">
              <div v-for="review in reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                
                <n-avatar 
                  round 
                  :src="isAvatarUrl(review.avatar) ? review.avatar : undefined"
                  class="flex-shrink-0"
                  :class="isAvatarUrl(review.avatar) ? '' : 'bg-hikari-blue text-white font-bold'"
                >
                  {{ isAvatarUrl(review.avatar) ? '' : review.avatar }}
                </n-avatar>

                <div class="flex-grow">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm text-white">{{ review.user }}</span>
                      <n-rate readonly :default-value="review.score" size="small" class="scale-75 origin-left" />
                    </div>
                    <span class="text-xs text-gray-500">{{ review.time }}</span>
                  </div>
                  <p class="text-sm text-gray-300 leading-relaxed">
                    {{ review.content }}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </main>

      </div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.8s ease-out backwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 强制修改 Naive UI Input 在暗色下的样式 */
:deep(.n-input) {
  background-color: rgba(0, 0, 0, 0.2) !important;
}
:deep(.n-input__textarea-el) {
  color: #eee !important;
}
</style>