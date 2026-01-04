<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NImage, NImageGroup, NRate, NProgress, NAvatar, NDivider } from 'naive-ui'
import { 
  PlayCircleOutline, 
  CheckmarkCircleOutline, 
  TimeOutline, 
  HeartOutline, 
  ShareSocialOutline,
  ArrowBackOutline,
  Star
} from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()

// 模拟 Galgame 数据 (实际应根据 route.params.id 从 API 获取)
const game = ref({
  id: route.params.id,
  title: '天使☆騒々 RE-BOOT!',
  originalTitle: '天使☆騒々 RE-BOOT!',
  developer: 'YUZUSOFT (柚子社)',
  date: '2023-04-28',
  price: '9,800円',
  platform: 'PC (Windows)',
  website: 'http://yuzu-soft.com/',
  score: 9.8,
  tags: ['废萌', '喜剧', '恋爱', '柚子社', '纯爱'],
  description: `
    <p>“乃亚，可以拜托你去那个世界吗？”</p>
    <p>某日，主人公・<strong>谷风李空</strong>邂逅了自称天使的美少女・<strong>乃亚</strong>。</p>
    <p>乃亚因为某个意外失去了力量，请求李空协助她。而李空虽然也是个普通学生，却有着某种特殊的体质……</p>
    <p>就这样，充满骚乱与心动的同居生活开始了！</p>
  `,
  // 背景图/封面
  cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  // CG 画廊
  gallery: [
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
    'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
  ]
})

// 评分分布数据
const ratingDistribution = [
  { label: '10', percent: 60 },
  { label: '9', percent: 25 },
  { label: '8', percent: 10 },
  { label: '7', percent: 3 },
  { label: '6', percent: 2 },
]
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white relative overflow-hidden font-sans">
    
    <div class="fixed inset-0 z-0">
      <img :src="game.cover" class="w-full h-full object-cover blur-3xl opacity-60 scale-110">
      <div class="absolute inset-0 bg-black/40"></div> </div>

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
            <n-button color="#f87171" size="large" class="w-32 font-bold shadow-lg shadow-red-500/30">
              <template #icon><n-icon :component="HeartOutline" /></template>
              想玩
            </n-button>
            <n-button color="#60a5fa" size="large" class="w-32 font-bold shadow-lg shadow-blue-500/30">
              <template #icon><n-icon :component="PlayCircleOutline" /></template>
              在玩
            </n-button>
            <n-button color="#34d399" size="large" class="w-32 font-bold shadow-lg shadow-green-500/30">
              <template #icon><n-icon :component="CheckmarkCircleOutline" /></template>
              玩过
            </n-button>
            <n-button secondary circle class="text-white bg-white/10 hover:bg-white/20 border-none">
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
            <h3 class="font-bold text-lg mb-4 border-l-4 border-yellow-400 pl-3">班固米评分</h3>
            <div class="flex items-end gap-2 mb-4">
              <span class="text-5xl font-bold text-yellow-400">{{ game.score }}</span>
              <div class="pb-2">
                <n-rate readonly :default-value="5" size="small" />
                <p class="text-xs text-gray-400">2390 人评分</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div v-for="item in ratingDistribution" :key="item.label" class="flex items-center gap-3 text-xs">
                <span class="w-4 text-right text-gray-400">{{ item.label }}</span>
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
            <h3 class="font-bold text-lg mb-4">最新评论</h3>
            <div class="flex gap-4">
              <n-avatar round src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg" />
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-sm">纯爱战神</span>
                  <n-rate readonly :default-value="5" size="small" />
                  <span class="text-xs text-gray-500">2小时前</span>
                </div>
                <p class="text-sm text-gray-300">柚子社依旧稳定发挥，这作的人设真的太戳我了！乃亚天下第一！</p>
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
</style>