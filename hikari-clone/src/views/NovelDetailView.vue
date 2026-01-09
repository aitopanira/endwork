<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NIcon, NTag, NRate, NAvatar, NDivider, NInput, useMessage, NSpin,
  NTabs, NTabPane 
} from 'naive-ui'
import { 
  BookOutline, HeartOutline, Heart, ArrowBackOutline, ShareSocialOutline, 
  EyeOutline, PersonOutline, CreateOutline, ChatbubbleOutline, Star,
  CheckmarkCircleOutline, CheckmarkCircle, ListOutline // 引入列表图标
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const novelId = Number(route.params.id)
const novel = ref(null)
const loading = ref(true)
const commentInputRef = ref(null)

// === 1. API: 获取小说详情 ===
const fetchNovelData = async () => {
  try {
    loading.value = true
    const response = await axios.get(`http://127.0.0.1:8000/a/novels/${novelId}/`)
    const data = response.data
    const novelVolumes = [{}]
    // 模拟卷数据 (因为后端暂时没有 Volume 表)
    

    novel.value = {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title || '暂无原名',
      cover: data.cover,
      description: data.description,
      author: data.author,
      illustrator: data.illustrator || '暂无',
      publisher: data.publisher || '未知文库',
      status: data.status,
      tags: data.tags.map(tag => tag.name),
      characters: data.characters ? data.characters.map(c => ({
        id: c.id,
        name: c.name,
        role: c.role || '主要角色', 
        avatar: c.avatar
        
      })) : [],
      // 注入模拟的卷信息
      volumes: data.volumes.map(v => ({
        id: v.id,
        title: v.title,
        cover: v.cover  // 暂时都用小说封面
      }))
    }
      console.log(novel.value.characters)
  } catch (error) {
    console.error('获取小说失败:', error)
    message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}


// === 2. API: 获取评论 ===
const reviews = ref([])
const fetchReviews = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/a/reviews/?target_type=novel&target_id=${novelId}`)
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
  fetchNovelData()
  fetchReviews()
})

// === 状态逻辑 ===
const isFavorited = computed(() => {
  if (!novel.value || !userStore.userInfo) return false
  return userStore.novelLibrary?.favorites?.some(n => n.id === novelId) ?? false
})

const isRead = computed(() => {
  if (!novel.value || !userStore.userInfo) return false
  return userStore.novelLibrary?.read?.some(n => n.id === novelId) ?? false
})

const averageScore = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, item) => sum + item.score, 0)
  return (total / reviews.value.length).toFixed(1)
})

// === 交互逻辑 ===
const handleFavorite = () => {
  if (!userStore.userInfo) { message.warning('请先登录'); router.push('/login'); return }
  const success = userStore.toggleNovelFavorite(novel.value)
  message.success(success ? '已加入书架' : '已取消收藏')
}

const handleMarkAsRead = () => {
  if (!userStore.userInfo) { message.warning('请先登录'); router.push('/login'); return }
  const success = userStore.toggleNovelRead(novel.value)
  message.success(success ? '标记为已读' : '取消已读状态')
}

const scrollToComments = () => {
  const commentSection = document.getElementById('comment-section')
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth' })
    nextTick(() => { if(commentInputRef.value) commentInputRef.value.focus() })
  }
}

const handleShare = () => message.success('链接已复制')

// === 阅读卷 ===
const handleReadVolume = (volId) => {
  message.info(`准备开始阅读第 ${volId} 卷`)
  // router.push(...) 
}

// === 评论提交 ===
const commentContent = ref('')
const userRating = ref(0)
const isAvatarUrl = (str) => str && (str.startsWith('http') || str.startsWith('data:'))

const submitReview = async () => {
  if (!userStore.userInfo) { message.warning('请登录'); router.push('/login'); return }
  if (userRating.value === 0 || !commentContent.value.trim()) { message.warning('请评分并填写内容'); return }
  
  try {
    await axios.post('http://127.0.0.1:8000/a/reviews/', {
      user_id: userStore.userInfo.id,
      target_type: 'novel',
      target_id: novelId,
      content: commentContent.value,
      score: userRating.value
    })
    message.success('评价发表成功！')
    commentContent.value = ''
    userRating.value = 0
    fetchReviews()
  } catch (e) { message.error('发送失败') }
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] font-sans pb-20">
    
    <div v-if="loading" class="flex h-screen items-center justify-center">
      <n-spin size="large" stroke="#2080f0" description="加载中..." />
    </div>

    <div v-else-if="novel">
      <div class="relative h-[500px] w-full overflow-hidden">
        <img :src="novel.cover" class="w-full h-full object-cover blur-2xl opacity-90 scale-110">
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
        
        <div class="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center">
          <n-button text class="text-white/90 hover:text-white font-bold" @click="router.back()">
            <template #icon><n-icon :component="ArrowBackOutline" /></template> 返回
          </n-button>
          <div class="flex gap-4">
             <n-button circle class="bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-sm" @click="handleShare">
               <template #icon><n-icon :component="ShareSocialOutline" /></template>
             </n-button>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 container mx-auto px-4 z-20 pb-16 flex flex-col md:flex-row items-end gap-10">
          <div class="w-52 md:w-60 flex-shrink-0 relative group">
             <div class="rounded-lg overflow-hidden shadow-2xl border-4 border-white transition transform group-hover:-translate-y-2 duration-500">
               <img :src="novel.cover" class="w-full h-auto object-cover">
             </div>
          </div>

          <div class="flex-grow text-white pb-2 space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">{{ novel.title }}</h1>
            <h2 class="text-xl opacity-90 font-medium">{{ novel.originalTitle }}</h2>
            
            <div class="flex flex-wrap gap-2 pt-2">
               <span class="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">{{ novel.status }}</span>
               <span class="bg-yellow-500/90 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                 <n-icon :component="Star"/> {{ averageScore }}
               </span>
               <span v-for="tag in novel.tags" :key="tag" class="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded hover:bg-white/30 cursor-pointer transition">
                 {{ tag }}
               </span>
            </div>

            <div class="flex flex-wrap gap-4 pt-4">
              <n-button type="primary" :color="isFavorited ? '#ef4444' : '#f87171'" size="large" class="w-32 shadow-lg font-bold" @click="handleFavorite">
                 <template #icon><n-icon :component="isFavorited ? Heart : HeartOutline" /></template>
                 {{ isFavorited ? '已收藏' : '收藏' }}
              </n-button>

              <n-button type="primary" :color="isRead ? '#059669' : '#34d399'" size="large" class="w-32 shadow-lg font-bold" @click="handleMarkAsRead">
                 <template #icon><n-icon :component="isRead ? CheckmarkCircle : CheckmarkCircleOutline" /></template>
                 {{ isRead ? '已看过' : '看过' }}
              </n-button>

              <n-button color="#26a69a" size="large" class="w-32 shadow-lg font-bold" @click="scrollToComments">
                 <template #icon><n-icon :component="CreateOutline" /></template> 写评价
              </n-button>

              <n-button type="primary" color="#3b82f6" size="large" class="w-40 shadow-lg font-bold ml-auto md:ml-0">
                 <template #icon><n-icon :component="BookOutline" /></template> 开始阅读
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-12 space-y-8">
          
          <div class="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative">
            <h3 class="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">书籍信息</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm text-gray-600 mb-4">
               <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">作者</span> <span class="font-bold text-blue-500 cursor-pointer hover:underline">{{ novel.author }}</span></div>
               <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">插画</span> <span class="font-bold text-blue-500 cursor-pointer hover:underline">{{ novel.illustrator }}</span></div>
               <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">出版社</span> <span class="font-bold text-gray-800">{{ novel.publisher }}</span></div>
               <div class="flex flex-col"><span class="text-gray-400 text-xs mb-1">连载状态</span> <span class="font-bold text-green-600">{{ novel.status }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <n-tabs type="line" animated class="light-theme-tabs">
                
                <n-tab-pane name="intro" tab="内容简介">
                   <div class="p-4">
                      <div class="leading-loose text-gray-700 space-y-4 text-justify whitespace-pre-wrap font-medium" v-html="novel.description"></div>
                   </div>
                </n-tab-pane>

                <n-tab-pane name="volumes" tab="发行列表">
                   <div class="p-4 min-h-[200px]">
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <div 
                           v-for="vol in novel.volumes" 
                           :key="vol.id" 
                           @click="handleReadVolume(vol.id)"
                           class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group transition border border-transparent hover:border-gray-100"
                         >
                           <div class="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                             <img :src="vol.cover" class="w-full h-full object-cover">
                           </div>
                           <div>
                             <h4 class="font-bold text-sm text-gray-700 group-hover:text-blue-500 transition mb-1">{{ vol.title }}</h4>
                             <span class="text-xs text-gray-400 flex items-center gap-1">
                               <n-icon :component="BookOutline" /> {{ vol.date }}
                             </span>
                           </div>
                         </div>
                      </div>
                   </div>
                </n-tab-pane>

                <n-tab-pane name="chars" tab="登场人物">
                   <div class="p-4 min-h-[200px]">
                      <div v-if="novel.characters.length === 0" class="text-center text-gray-400 py-10">暂无角色信息</div>
                      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                         <div v-for="char in novel.characters" :key="char.id" class="flex flex-col items-center group cursor-pointer">
                            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition duration-300 relative bg-gray-100">
                               <img :src="char.avatar" class="w-full h-full object-cover object-top" alt="头像">
                            </div>
                            <div class="text-center mt-3">
                               <h4 class="font-bold text-gray-700 text-sm group-hover:text-blue-500 transition">{{ char.name }}</h4>
                               <span v-if="char.role" class="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{{ char.role }}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </n-tab-pane>

             </n-tabs>
          </div>

          <div id="comment-section" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
             <h3 class="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
               <n-icon :component="ChatbubbleOutline" class="text-green-500"/> 评论区
             </h3>
             
             <div class="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
               <div class="flex gap-4">
                 <n-avatar round :size="48" :src="userStore.userInfo ? userStore.userInfo.avatar : undefined" class="bg-gray-200">{{ userStore.userInfo ? '' : '未' }}</n-avatar>
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
                     <n-button type="primary" color="#26a69a" @click="submitReview">
                       <template #icon><n-icon :component="CreateOutline" /></template> 发布评价
                     </n-button>
                   </div>
                 </div>
               </div>
             </div>

             <div class="space-y-6">
               <div v-for="review in reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                 <n-avatar round :src="isAvatarUrl(review.avatar) ? review.avatar : undefined" class="flex-shrink-0" :class="isAvatarUrl(review.avatar) ? '' : 'bg-green-100 text-green-600 font-bold'">
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
                     <div class="text-yellow-500 font-bold text-lg leading-none">{{ review.score }}</div>
                   </div>
                   <p class="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg">{{ review.content }}</p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blur-2xl { filter: blur(24px); }

/* Tabs 亮色主题微调 */
:deep(.n-tabs.light-theme-tabs .n-tabs-tab__label) {
  font-size: 16px;
  font-weight: bold;
}
:deep(.n-tabs.light-theme-tabs .n-tabs-tab--active) {
  color: #3b82f6 !important;
}
:deep(.n-tabs.light-theme-tabs .n-tabs-bar) {
  background-color: #3b82f6 !important;
}
</style>