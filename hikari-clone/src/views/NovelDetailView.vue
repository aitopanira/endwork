<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NImage, NRate, NAvatar, NDivider, NTabs, NTabPane } from 'naive-ui'
import { 
  BookOutline, 
  HeartOutline, 
  ArrowBackOutline, 
  ShareSocialOutline, 
  EyeOutline,
  PersonOutline,
  CreateOutline,
  ChatbubbleOutline,
  ListOutline
} from '@vicons/ionicons5'
import { useResourceStore } from '../stores/resources'

const route = useRoute()
const router = useRouter()
const resourceStore = useResourceStore()

const novel = ref(null)

onMounted(() => {
  const found = resourceStore.getNovelById(route.params.id)
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

// 跳转到阅读页
const handleStartReading = () => {
  router.push({
    name: 'reader', // 确保你的 router 中定义了 name: 'reader'
    params: { id: novel.value.id },
    query: { title: novel.value.title }
  })
}

// 跳转到特定卷
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
             <span v-for="tag in novel.tags" :key="tag" class="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded hover:bg-white/30 cursor-pointer transition">
               {{ tag }}
             </span>
          </div>

          <div class="flex gap-4 pt-4">
            <n-button type="primary" color="#f87171" size="large" class="w-32 shadow-lg font-bold">
               <template #icon><n-icon :component="HeartOutline" /></template>
               收藏
            </n-button>
            <n-button color="#26a69a" size="large" class="w-32 shadow-lg font-bold">
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

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
           <h3 class="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
             <n-icon :component="ChatbubbleOutline" class="text-green-500"/> 评论
           </h3>
           <div class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
             暂无评论，快来抢沙发吧~
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