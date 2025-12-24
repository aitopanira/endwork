<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NBreadcrumb, NBreadcrumbItem, NTag, NDivider, NAvatar, NButton, NInput, NIcon } from 'naive-ui'
import { EyeOutline, ChatbubbleOutline, TimeOutline, PersonOutline, HeartOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const postId = route.params.id // 获取 URL 里的文章 ID (例如 1, 2, 3)

// 模拟文章数据 (实际开发中这里应该用 axios 请求后端 API)
const article = ref({
  id: postId,
  title: '【Gal周报】十二月新作本周发售，《缘起甜韵》登陆Steam',
  author: '官方Bot',
  date: '2025-12-24',
  views: 2390,
  likes: 128,
  // 模拟一段 HTML 正文内容
  content: `
    <p class="mb-4">十二月新作已于本周发售，一共有五部作品，其中PC平台有四部作品。这也是本年度最后的一波发售热潮，各位玩家准备好了吗？</p>
    
    <h3 class="text-xl font-bold my-4 border-l-4 border-pink-400 pl-3">本周重点推荐</h3>
    
    <p class="mb-4"><strong>《HaremKingdom》</strong>：SMEE社的经典后宫作，这次的高清重制版诚意满满。画风依旧是那种废萌里带着一点点实用的感觉，早濑老师的原画依然稳定发挥。</p>
    
    <div class="my-6 rounded-lg overflow-hidden shadow-md">
      <img src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg" alt="游戏截图" class="w-full" />
      <p class="text-center text-gray-400 text-xs mt-1">游戏实际运行画面</p>
    </div>

    <h3 class="text-xl font-bold my-4 border-l-4 border-pink-400 pl-3">玩家评价</h3>
    <p class="mb-4">目前Steam好评率98%，大部分玩家表示“SMEE，我的超人”。不过也有人吐槽剧情稍微有点白开水，适合想要放松大脑的时候游玩。</p>
    
    <blockquote class="bg-gray-50 border-l-4 border-gray-300 p-4 italic my-4 text-gray-600">
      “只要有早濑画的妹子，我就无脑买爆！” —— 某资深玩家
    </blockquote>
    
    <p>总之，如果你喜欢轻松愉快的恋爱喜剧，这作绝对不容错过！</p>
  `,
  tags: ['Galgame', '资讯', 'SMEE', 'Steam']
})

// 模拟评论数据
const comments = ref([
  { id: 1, user: '路人A', content: 'SMEE！我的超人！钱包已经准备好了。', time: '2小时前', avatar: '路' },
  { id: 2, user: '纯爱战神', content: '这画风真的很顶，希望汉化质量能在线。', time: '5小时前', avatar: '纯' },
  { id: 3, user: 'HikariAdmin', content: '感谢搬运，已加入愿望单。', time: '1天前', avatar: 'H' }
])
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 animate-fade-in">
    <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <main class="lg:col-span-3 bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-100">
        
        <n-breadcrumb class="mb-6">
          <n-breadcrumb-item @click="router.push('/')">首页</n-breadcrumb-item>
          <n-breadcrumb-item>文章详情</n-breadcrumb-item>
          <n-breadcrumb-item>{{ article.title }}</n-breadcrumb-item>
        </n-breadcrumb>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 leading-tight">
          {{ article.title }}
        </h1>
        
        <div class="flex flex-wrap items-center gap-4 sm:gap-8 text-gray-400 text-sm mb-8 pb-6 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <n-avatar round size="small" class="bg-hikari-pink text-white">官</n-avatar>
            <span class="text-gray-600 font-medium cursor-pointer hover:text-hikari-pink">{{ article.author }}</span>
          </div>
          <span class="flex items-center gap-1"><n-icon :component="TimeOutline"/> {{ article.date }}</span>
          <span class="flex items-center gap-1"><n-icon :component="EyeOutline"/> {{ article.views }} 阅读</span>
          <span class="flex items-center gap-1 cursor-pointer hover:text-red-500 transition"><n-icon :component="HeartOutline"/> {{ article.likes }} 点赞</span>
        </div>

        <div class="article-content text-gray-700 leading-8 text-lg" v-html="article.content"></div>

        <div class="mt-10 flex flex-wrap gap-2">
          <n-tag v-for="tag in article.tags" :key="tag" round :bordered="false" type="info" size="small" class="cursor-pointer hover:opacity-80">
            # {{ tag }}
          </n-tag>
        </div>

        <n-divider />

        <div class="mt-8">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-gray-700">
            <n-icon :component="ChatbubbleOutline" /> 评论 ({{ comments.length }})
          </h3>
          
          <div class="flex gap-4 mb-8">
            <n-avatar round size="medium" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg" />
            <div class="flex-grow">
              <n-input type="textarea" placeholder="发一条友善的评论吧..." :rows="3" class="bg-gray-50" />
              <div class="mt-3 text-right">
                <n-button type="primary" color="#fb7299" class="px-6 shadow-md hover:shadow-lg">
                  发表评论
                </n-button>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-4 group">
              <n-avatar round size="small" class="bg-gray-200 text-gray-500 font-bold flex-shrink-0">
                {{ comment.avatar }}
              </n-avatar>
              <div class="flex-grow border-b border-gray-50 pb-4 group-last:border-none">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-gray-700 text-sm">{{ comment.user }}</span>
                  <span class="text-xs text-gray-400">{{ comment.time }}</span>
                </div>
                <p class="text-gray-600 text-sm">{{ comment.content }}</p>
                <div class="mt-2 text-xs text-gray-400 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span class="hover:text-hikari-pink">回复</span>
                  <span class="hover:text-hikari-pink">点赞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <aside class="lg:col-span-1 space-y-6">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <div class="flex flex-col items-center text-center mb-6">
            <n-avatar round :size="80" class="mb-4 bg-hikari-pink text-white text-2xl shadow-md border-4 border-pink-50">
              官
            </n-avatar>
            <h3 class="font-bold text-lg text-gray-800">{{ article.author }}</h3>
            <p class="text-gray-500 text-xs mt-1">资深 Galgame 鉴赏家，专注搬运最新资讯。</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="text-center bg-gray-50 py-2 rounded">
              <span class="block font-bold text-gray-700">128</span>
              <span class="text-xs text-gray-400">文章</span>
            </div>
            <div class="text-center bg-gray-50 py-2 rounded">
              <span class="block font-bold text-gray-700">2.3k</span>
              <span class="text-xs text-gray-400">粉丝</span>
            </div>
          </div>

          <div class="space-y-3">
            <n-button block type="primary" color="#fb7299" secondary>
              <template #icon><n-icon :component="PersonOutline" /></template>
              关注作者
            </n-button>
            <n-button block dashed>
              私信
            </n-button>
          </div>
        </div>

      </aside>

    </div>
  </div>
</template>

<style scoped>
/* 简单的进场动画 */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 简单的文章样式微调 */
:deep(.article-content p) {
  margin-bottom: 1.2em;
}
</style>