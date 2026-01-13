<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NIcon, NTag, NImage, NImageGroup, NRate, NProgress, 
  NAvatar, NDivider, NInput, useMessage, NSpin,
  NTabs, NTabPane 
} from 'naive-ui'
import { 
  PlayCircleOutline, CheckmarkCircleOutline, TimeOutline, HeartOutline, 
  ShareSocialOutline, ArrowBackOutline, ChatbubbleOutline, CreateOutline,
  ImagesOutline, BookOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const gameId = Number(route.params.id)
const game = ref(null)
const loading = ref(true)

// === 1. 获取游戏详情 (包含角色数据) ===
const fetchGalgameData = async () => {
  try {
    loading.value = true
    const response = await axios.get(`http://127.0.0.1:8000/a/galgames/${gameId}/`)
    const data = response.data
    
    game.value = {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title,
      developer: data.developer,
      date: data.release_date,
      price: data.price || '暂未公布',
      platform: 'PC',
      website: '#',
      tags: data.tags.map(tag => tag.name),
      description: data.description,
      cover: data.cover,
      gallery: data.cgs.map(cg => cg.image_url),
      // 映射后端返回的角色数据
      characters: data.characters ? data.characters.map(c => ({
        id: c.id,
        name: c.name,
        cv: c.cv,
        desc: c.description,
        avatar: c.avatar
      })) : []
    }
  } catch (error) {
    console.error('获取 Galgame 数据失败:', error)
    message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// === 2. 获取评论 ===
const reviews = ref([])
const fetchReviews = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/a/reviews/?target_type=galgame&target_id=${gameId}`)
    reviews.value = res.data.map(item => ({
      id: item.id,
      user: item.user.name,
      avatar: item.user.avatar,
      content: item.content,
      score: item.score,
      time: item.created_at.split('T')[0]
    }))
  } catch (error) { console.error(error) }
}

onMounted(() => {
  fetchGalgameData()
  fetchReviews()
})

// === 状态与交互逻辑 ===
const currentStatus = computed(() => {
  if (!userStore.userInfo || !game.value) return ''
  if (userStore.galgameLibrary.wish.some(g => g.id === gameId)) return 'wish'
  if (userStore.galgameLibrary.playing.some(g => g.id === gameId)) return 'playing'
  if (userStore.galgameLibrary.played.some(g => g.id === gameId)) return 'played'
  return ''
})

const averageScore = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, item) => sum + item.score, 0)
  return (total / reviews.value.length).toFixed(1)
})

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

const commentContent = ref('')
const userRating = ref(0)
const isAvatarUrl = (str) => str && (str.startsWith('http') || str.startsWith('data:'))

const submitReview = async () => {
  if (!userStore.userInfo) { message.warning('请登录'); router.push('/login'); return }
  if (userRating.value === 0 || !commentContent.value.trim()) { message.warning('请评分并填写内容'); return }
  
  try {
    await axios.post('http://127.0.0.1:8000/a/reviews/', {
      user_id: userStore.userInfo.id,
      target_type: 'galgame',
      target_id: gameId,
      content: commentContent.value,
      score: userRating.value
    })
    message.success('发布成功')
    commentContent.value = ''
    userRating.value = 0
    fetchReviews()
  } catch (e) { message.error('发送失败') }
}

const handleStatusChange = (status) => {
  if (!userStore.userInfo) { message.warning('请登录'); router.push('/login'); return }
  if (!game.value) return 
  if (currentStatus.value === status) {
    userStore.setGalgameStatus(game.value, null)
    message.info('已取消标记')
  } else {
    userStore.setGalgameStatus(game.value, status)
    const msgMap = { wish: '已加入愿望单', playing: '开始记录游玩进度', played: '标记为已玩过' }
    message.success(msgMap[status])
  }
}
const handleShare = () => message.success('链接已复制到剪贴板')
</script>
<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden font-sans">
    
    <div v-if="loading" class="flex h-screen items-center justify-center">
      <n-spin size="large" stroke="#fb7299">
         <template #description>少女祈祷中...</template>
      </n-spin>
    </div>

    <div v-else-if="game">
        <div class="fixed inset-0 z-0">
          <img :src="game.cover" class="w-full h-full object-cover blur-3xl opacity-80 scale-110">
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
              <h1 class="text-4xl font-bold mb-2 text-shadow">{{ game.originalTitle }}</h1>
              <h2 class="text-lg text-white/60 mb-6 font-medium">{{ game.title }}</h2>
              
              <div class="flex flex-wrap gap-4 mb-8">
                <n-button @click="handleStatusChange('wish')" :type="currentStatus === 'wish' ? 'error' : 'default'" :secondary="currentStatus !== 'wish'" :color="currentStatus === 'wish' ? undefined : '#f87171'" size="large" class="w-32 font-bold shadow-lg">
                  <template #icon><n-icon :component="HeartOutline" /></template> {{ currentStatus === 'wish' ? '已标记' : '想玩' }}
                </n-button>
                <n-button @click="handleStatusChange('playing')" :type="currentStatus === 'playing' ? 'info' : 'default'" :secondary="currentStatus !== 'playing'" :color="currentStatus === 'playing' ? undefined : '#60a5fa'" size="large" class="w-32 font-bold shadow-lg">
                  <template #icon><n-icon :component="PlayCircleOutline" /></template> {{ currentStatus === 'playing' ? '在玩中' : '在玩' }}
                </n-button>
                <n-button @click="handleStatusChange('played')" :type="currentStatus === 'played' ? 'primary' : 'default'" :secondary="currentStatus !== 'played'" :color="currentStatus === 'played' ? '#34d399' : '#34d399'" size="large" class="w-32 font-bold shadow-lg">
                  <template #icon><n-icon :component="CheckmarkCircleOutline" /></template> {{ currentStatus === 'played' ? '已玩过' : '玩过' }}
                </n-button>
                <n-button @click="handleShare" secondary circle class="text-white bg-white/10 hover:bg-white/20 border-none"><template #icon><n-icon :component="ShareSocialOutline" /></template></n-button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <aside class="space-y-8 animate-slide-up" style="animation-delay: 0.1s;">
              <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 class="font-bold text-lg mb-4 border-l-4 border-hikari-pink pl-3">作品信息</h3>
                <ul class="space-y-3 text-sm text-gray-300">
                  <li class="flex justify-between"><span class="text-gray-500">开发商</span> <span class="text-white font-medium hover:text-hikari-pink cursor-pointer">{{ game.developer }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-500">发售日</span> <span>{{ game.date }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-500">平台</span> <span>{{ game.platform }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-500">官网</span> <a :href="game.website" target="_blank" class="text-blue-400 hover:underline">点击访问</a></li>
                </ul>
                <n-divider class="bg-white/20" />
                <div class="flex flex-wrap gap-2">
                  <n-tag v-for="tag in game.tags" :key="tag" round size="small" class="bg-white/10 text-white border-transparent hover:bg-hikari-pink transition cursor-pointer"># {{ tag }}</n-tag>
                </div>
              </div>

              <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
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
                    <n-progress type="line" :percentage="item.percent" color="#fbbf24" rail-color="rgba(255,255,255,0.1)" :height="6" :show-indicator="false" />
                  </div>
                </div>
              </div>
            </aside>

            <main class="lg:col-span-2 animate-slide-up" style="animation-delay: 0.2s;">
              
              <n-tabs type="segment" animated class="custom-tabs mb-10">
                
                <n-tab-pane name="intro" tab="游戏介绍">
                    <div class="space-y-8">
                        <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                              <n-icon :component="ImagesOutline" class="text-hikari-blue"/> CG 预览
                            </h3>
                            <n-image-group>
                              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <n-image v-for="(img, index) in game.gallery" :key="index" :src="img" class="rounded-lg overflow-hidden cursor-zoom-in hover:brightness-110 transition border border-white/10 w-full h-32 object-cover" object-fit="cover" />
                              </div>
                            </n-image-group>
                        </div>

                        <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                                <n-icon :component="BookOutline" class="text-hikari-blue"/> 故事简介
                            </h3>
                            <div class="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap" v-html="game.description"></div>
                        </div>
                    </div>
                </n-tab-pane>
<n-tab-pane name="chars" tab="出场角色">
                    <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10 min-h-[400px]">
                        <div v-if="game.characters.length === 0" class="text-center text-gray-500 py-10">
                            暂无角色信息
                        </div>
                        <div v-else class="grid grid-cols-1 gap-6">
                            
                            <div v-for="char in game.characters" :key="char.id" class="flex gap-6 bg-black/60 p-4 rounded-xl border border-white/10 hover:bg-black/80 transition">
                                
                                <div class="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white relative">
                                    <img 
                                      :src="char.avatar" 
                                      class="w-full h-full object-cover object-top block"
                                      alt="角色立绘"
                                    />
                                </div>
                                
                                <div class="flex-grow pt-1">
                                    <h3 class="text-2xl font-black mb-2 flex items-center gap-3 text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.9);">
                                        {{ char.name }}
                                        <span v-if="char.cv" class="text-xs font-bold text-white/90 bg-gray-700 px-2 py-0.5 rounded shadow-sm">
                                            CV: {{ char.cv }}
                                        </span>
                                    </h3>
                                    
                                    <n-divider class="my-3 bg-white/20" />
                                    
                                    <p class="text-gray-200 text-sm leading-7 whitespace-pre-wrap font-medium" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                                      {{ char.desc }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </n-tab-pane>
              </n-tabs>

              <div class="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
                    <n-icon :component="ChatbubbleOutline" /> 玩家评价
                  </h3>

                  <div class="bg-white/5 p-5 rounded-xl mb-8 border border-white/10">
                      <div class="flex gap-4">
                        <n-avatar round :size="48" :src="userStore.userInfo ? userStore.userInfo.avatar : undefined" class="bg-gray-700">{{ userStore.userInfo ? '' : '未' }}</n-avatar>
                        <div class="flex-grow">
                          <div class="flex items-center gap-3 mb-3">
                            <span class="text-sm text-gray-400 font-bold">点击打分:</span>
                            <n-rate v-model:value="userRating" allow-half />
                          </div>
                          <n-input v-model:value="commentContent" type="textarea" placeholder="玩过之后感觉如何？分享你的评价吧..." :rows="3" class="bg-black/20 text-white border border-white/10 rounded-lg placeholder-gray-500" />
                          <div class="mt-3 text-right">
                            <n-button type="primary" color="#fb7299" @click="submitReview"><template #icon><n-icon :component="CreateOutline" /></template>{{ userStore.userInfo ? '发布评价' : '登录后评价' }}</n-button>
                          </div>
                        </div>
                      </div>
                  </div>

                  <div class="space-y-6">
                      <div v-for="review in reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                          <n-avatar round :src="isAvatarUrl(review.avatar) ? review.avatar : undefined" class="flex-shrink-0" :class="isAvatarUrl(review.avatar) ? '' : 'bg-hikari-blue text-white font-bold'">{{ isAvatarUrl(review.avatar) ? '' : review.avatar }}</n-avatar>
                          <div class="flex-grow">
                              <div class="flex items-center justify-between mb-1">
                                  <div class="flex items-center gap-2">
                                  <span class="font-bold text-sm text-white">{{ review.user }}</span>
                                  <n-rate readonly :default-value="review.score" size="small" class="scale-75 origin-left" />
                                  </div>
                                  <span class="text-xs text-gray-500">{{ review.time }}</span>
                              </div>
                              <p class="text-sm text-gray-300 leading-relaxed">{{ review.content }}</p>
                          </div>
                      </div>
                  </div>
              </div>

            </main>
          </div>
        </div>
    </div>
    
    <div v-else class="flex h-screen items-center justify-center text-gray-500">
        未找到该游戏数据
    </div>
  </div>
</template>

<style scoped>
/* Added stronger text shadow for character names */
.text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.9); }

.animate-fade-in { animation: fadeIn 0.8s ease-out; }
.animate-slide-up { animation: slideUp 0.8s ease-out backwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Naive UI Tabs Style Adaptation */
:deep(.n-tabs .n-tabs-rail) {
    background-color: rgba(0, 0, 0, 0.6);
}
:deep(.n-tabs .n-tabs-tab) {
    color: #bbb;
}
:deep(.n-tabs .n-tabs-tab--active) {
    color: #fb7299 !important; /* Selected text turns pink */
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.1);
}
:deep(.n-input) { background-color: rgba(0, 0, 0, 0.2) !important; }
:deep(.n-input__textarea-el) { color: #eee !important; }
</style>