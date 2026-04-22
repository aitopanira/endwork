<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NBreadcrumb, NBreadcrumbItem, NTag, NDivider, NAvatar, NButton, 
  NInput, NIcon, useMessage, NSpin, NEmpty 
} from 'naive-ui'
import { 
  EyeOutline, ChatbubbleOutline, TimeOutline, HeartOutline, Heart,
  StarOutline, Star, CreateOutline
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios' 
import asukaImg from '../images/asuka.png'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const postId = route.params.id

// 状态管理
const loading = ref(true)
const error = ref(null)
const article = ref({}) 
const comments = ref([])  
const commentContent = ref('') 

const isAvatarUrl = (str) => str && (str.startsWith('http') || str.startsWith('data:'))

// === 1. 获取文章详情 ===
const fetchArticleDetail = async () => {
  try {
    loading.value = true
    const response = await axios.get(`http://127.0.0.1:8000/a/posts/${postId}/`)
    const data = response.data
    
    article.value = {
      id: data.id,
      title: data.title,
      content: data.content || '', 
      cover: data.cover,
      category: data.category,
      created_at: data.created_at,
      views: data.views,
      likes: data.likes,
      author: {
        name: data.author?.name || '未知用户',
        avatar: data.author?.avatar || '', 
        bio: data.author?.bio
      }
    }
  } catch (err) {
    console.error('获取文章失败:', err)
    error.value = '文章不存在或已被删除'
  } finally {
    loading.value = false
  }
}

// === 2. 获取评论列表 (对接后端) ===
const fetchComments = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/a/reviews/?target_type=post&target_id=${postId}`)
    comments.value = res.data.map(item => ({
      id: item.id,
      user: item.user.name,
      avatar: item.user.avatar,
      content: item.content,
      time: item.created_at.split('T')[0]
    }))
  } catch (error) { 
    console.error('获取评论失败', error) 
  }
}

// === 3. 获取当前收藏状态 ===
const currentStatus = ref('')
const fetchCurrentStatus = async () => {
  if (!userStore.userInfo) return;
  try {
    const res = await axios.get('http://127.0.0.1:8000/a/collections/status/', {
      params: {
        user_id: userStore.userInfo.id,
        target_type: 'post',
        target_id: postId
      }
    });
    currentStatus.value = res.data.status || '';
  } catch (error) {
    console.error('获取收藏状态失败', error);
  }
}

const isFavorited = computed(() => currentStatus.value === 'fav')

const handleFavorite = async () => {
  if (!userStore.userInfo) {
    message.warning('请先登录')
    router.push('/login')
    return
  }

  const isCancel = currentStatus.value === 'fav';
  const targetStatus = isCancel ? 'none' : 'fav';

  try {
    await axios.post('http://127.0.0.1:8000/a/collections/toggle/', {
      user_id: userStore.userInfo.id,
      target_type: 'post',
      target_id: postId,
      status: targetStatus
    });

    currentStatus.value = isCancel ? '' : 'fav';
    
    if (isCancel) {
       article.value.likes = Math.max(0, article.value.likes - 1)
       message.info('已取消收藏')
    } else {
       article.value.likes += 1
       message.success('收藏成功，已加入书架！')
    }
  } catch (error) {
    console.error('操作失败:', error);
    message.error('操作失败，请重试');
  }
}

// === 6. 提交评论 (对接后端) ===
const submitComment = async () => {
  if (!userStore.userInfo) {
    message.warning('请先登录后再发表评论')
    router.push('/login')
    return
  }
  if (!commentContent.value.trim()) {
    message.warning('评论内容不能为空')
    return
  }

  try {
    await axios.post('http://127.0.0.1:8000/a/reviews/', {
      user_id: userStore.userInfo.id,
      target_type: 'post',
      target_id: postId,
      content: commentContent.value,
      score: 0 // 资讯文章无需打分，默认传0
    })
    message.success('评论发表成功！')
    commentContent.value = ''
    fetchComments() // 重新拉取最新的评论列表
  } catch (e) { 
    message.error('发送失败，请重试') 
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  fetchArticleDetail()
  fetchComments()
  fetchCurrentStatus()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 animate-fade-in">
    
    <div v-if="loading" class="flex justify-center items-center h-[50vh]">
      <n-spin size="large" description="正在加载文章..." />
    </div>

    <div v-else-if="error" class="flex justify-center items-center h-[50vh]">
      <n-empty description="找不到这篇文章">
        <template #extra>
          <n-button @click="router.push('/')">返回首页</n-button>
        </template>
      </n-empty>
    </div>

    <div v-else-if="article.id" class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <main class="lg:col-span-3 bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <n-breadcrumb class="mb-6">
          <n-breadcrumb-item @click="router.push('/')">首页</n-breadcrumb-item>
          <n-breadcrumb-item>{{ article.title }}</n-breadcrumb-item>
        </n-breadcrumb>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 leading-tight break-words">
          {{ article.title }}
        </h1>
        
        <div class="flex flex-wrap items-center gap-4 sm:gap-8 text-gray-400 text-sm mb-8 pb-6 border-b border-gray-100">
          <span class="flex items-center gap-1">
             <n-icon :component="TimeOutline"/> {{ formatDate(article.created_at) }}
          </span>
        </div>

        <div v-if="article.cover" class="mb-8 rounded-lg overflow-hidden shadow-sm">
           <img :src="article.cover" class="w-full object-cover max-h-[400px]" alt="文章封面" />
        </div>

        <div class="article-content text-gray-700 leading-8 text-lg break-words" v-html="article.content"></div>

        <n-divider />
        
        <div id="comment-section" class="mt-8">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-gray-700">
                <n-icon :component="ChatbubbleOutline" class="text-blue-500" /> 评论区
            </h3>
            
            <div class="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
              <div class="flex gap-4">
                <n-avatar round :size="48" :src="userStore.userInfo ? userStore.userInfo.avatar : undefined" class="bg-gray-200">
                  {{ userStore.userInfo ? '' : '未' }}
                </n-avatar>
                <div class="flex-grow">
                  <n-input 
                    v-model:value="commentContent"
                    type="textarea" 
                    placeholder="分享你的看法..." 
                    :rows="3" 
                    class="bg-white"
                  />
                  <div class="mt-3 text-right">
                    <n-button type="primary" color="#3b82f6" @click="submitComment">
                      <template #icon><n-icon :component="CreateOutline" /></template> 发布评论
                    </n-button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="review in comments" :key="review.id" class="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <n-avatar round :src="isAvatarUrl(review.avatar) ? review.avatar : undefined" class="flex-shrink-0" :class="isAvatarUrl(review.avatar) ? '' : 'bg-blue-100 text-blue-600 font-bold'">
                  {{ isAvatarUrl(review.avatar) ? '' : review.avatar }}
                </n-avatar>
                <div class="flex-grow">
                  <div class="flex justify-between items-start mb-1">
                    <div>
                      <div class="font-bold text-gray-800 text-sm flex items-center gap-2">
                        {{ review.user }}
                      </div>
                      <div class="text-xs text-gray-400 mt-0.5">{{ review.time }}</div>
                    </div>
                  </div>
                  <p class="text-gray-600 text-sm mt-2 leading-relaxed bg-gray-50 p-3 rounded-lg">{{ review.content }}</p>
                </div>
              </div>
              
              <div v-if="comments.length === 0" class="text-center py-8">
                <n-empty description="暂无评论，快来抢沙发吧！" />
              </div>
            </div>

        </div>

      </main>

      <aside class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <div class="flex flex-col items-center text-center mb-6">
            <img :src="asukaImg" alt="看板娘" class="w-full h-auto rounded-lg mb-4 shadow-md hover:scale-105 transition-transform duration-300">
            <h3 class="font-bold text-lg text-gray-800">{{ isFavorited ? '感谢你的支持~' : '喜欢文章，点击收藏' }}</h3>
          </div>
          <div class="space-y-3">
             <n-button 
                block 
                :secondary="!isFavorited" 
                type="primary" 
                color="#fb7299"
                @click="handleFavorite"
             >
                 <template #icon><n-icon :component="isFavorited ? Heart : HeartOutline" /></template>
                 {{ isFavorited ? '已收藏' : '收藏文章' }}
             </n-button>
          </div>
        </div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.article-content) {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap; 
}

:deep(.article-content p) {
  margin-bottom: 1.5em; 
  text-align: justify;  
}

:deep(.article-content pre) {
  max-width: 100%;
  overflow-x: auto;
  white-space: pre; 
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
}

:deep(.article-content h1), 
:deep(.article-content h2), 
:deep(.article-content h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: bold;
  color: #1f2937;
}

:deep(.article-content img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>