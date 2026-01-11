<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NBreadcrumb, NBreadcrumbItem, NTag, NDivider, NAvatar, NButton, 
  NInput, NIcon, useMessage, NSpin, NEmpty 
} from 'naive-ui'
import { 
  EyeOutline, ChatbubbleOutline, TimeOutline, HeartOutline, 
  StarOutline, Star 
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios' 
import { marked } from 'marked' // 确保安装了: npm install marked
import asukaImg from '../images/asuka.png'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const postId = route.params.id

// 状态管理
const loading = ref(true)
const error = ref(null)
const article = ref({}) // 初始化为空对象
const comments = ref([])  
const commentContent = ref('') 

// === 1. 获取文章详情 ===
const fetchArticleDetail = async () => {
  try {
    loading.value = true
    
    // 真实接口请求
    const response = await axios.get(`http://127.0.0.1:8000/a/getuser/posts/${postId}/`)
    console.log('后端返回数据:', response.data) // 调试用
    
    const data = response.data
    
    // 核心步骤：将包含 \r\n 的纯文本转换为 HTML
    // marked 会把 \r\n\r\n 转换成 <p>...</p>，把 \n 转换成 <br>
    const parsedHtml = marked.parse(data.content || '')

    // 数据映射 (Mapping)
    article.value = {
      id: data.id,
      title: data.title,
      content: parsedHtml, // 使用解析后的 HTML
      cover: data.cover,
      category: data.category,
      created_at: data.created_at,
      views: data.views,
      likes: data.likes,
      // 注意：后端 author 是一个对象 {id, name, avatar...}
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
// === 2. 获取评论列表 (测试模式：写死数据) ===
const fetchComments = async () => {
  try {
    // 👇 使用写死的评论数据
    comments.value = [
      {
        id: 1,
        user: { name: '热心网友A', avatar: null },
        content: '前排围观，这个页面做的不错！',
        created_at: '2026-01-09 12:30'
      },
      {
        id: 2,
        user: { name: '催更狂魔', avatar: null },
        content: 'GKD GKD，生产队的驴都不敢这么歇。',
        created_at: '2026-01-09 13:00'
      }
    ]
  } catch (err) {
    console.error('获取评论失败', err)
  }
}
// === 3. 判断是否已收藏 ===
const isFavorited = computed(() => {
  if (!userStore.userInfo || !article.value) return false
  return false 
})
// === 4. 交互：收藏/取消收藏 ===
const handleFavorite = async () => {
  if (!userStore.userInfo) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  message.success('收藏功能前端测试中...')

}
// === 5. 提交评论 ===

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

  // 模拟前端添加一条评论
  comments.value.unshift({
    id: Date.now(),
    user: { name: userStore.userInfo.name, avatar: userStore.userInfo.avatar },
    content: commentContent.value,
    created_at: '刚刚'
  })
  commentContent.value = ''
  message.success('评论发表成功 (测试)')
}


// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  fetchArticleDetail()
  fetchComments()
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
      
      <main class="lg:col-span-3 bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-100">
        
        <n-breadcrumb class="mb-6">
          <n-breadcrumb-item @click="router.push('/')">首页</n-breadcrumb-item>
          <n-breadcrumb-item>{{ article.title }}</n-breadcrumb-item>
        </n-breadcrumb>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 leading-tight">
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

        <div class="article-content text-gray-700 leading-8 text-lg" v-html="article.content"></div>

        <n-divider />
        <div class="mt-8">
            <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-gray-700">
                <n-icon :component="ChatbubbleOutline" /> 评论区
            </h3>
            <n-empty description="评论功能开发中..." />
        </div>

      </main>

      <aside class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <div class="flex flex-col items-center text-center mb-6">
            <img :src="asukaImg" alt="看板娘" class="w-full h-auto rounded-lg mb-4 shadow-md hover:scale-105 transition-transform duration-300">
            <h3 class="font-bold text-lg text-gray-800">喜欢文章，点击收藏</h3>
          </div>
          <div class="space-y-3">
             <n-button block secondary type="primary" color="#fb7299">
                 <template #icon><n-icon :component="HeartOutline" /></template>
                 收藏文章 ({{ article.likes }})
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
/* === 正文样式优化 === */
/* 处理段落间距：marked 会生成 <p> 标签 */
:deep(.article-content p) {
  margin-bottom: 1.5em; /* 段落之间空一行 */
  text-align: justify;  /* 两端对齐 */
  /* ⚠️ 关键：如果 marked 解析没生效，这行 CSS 会强制处理 \n 换行符 */
  white-space: pre-wrap; 
}
/* 处理标题 */
:deep(.article-content h1), 
:deep(.article-content h2), 
:deep(.article-content h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: bold;
  color: #1f2937;
}

/* 图片自适应 */
:deep(.article-content img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1em 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>