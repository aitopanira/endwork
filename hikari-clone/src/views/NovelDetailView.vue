<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NTag, NImage, NRate, NAvatar, NDivider, NTabs, NTabPane, NCard } from 'naive-ui'
import { 
  BookOutline, 
  HeartOutline, 
  ArrowBackOutline, 
  ShareSocialOutline, 
  EyeOutline,
  PersonOutline,
  CreateOutline
} from '@vicons/ionicons5'
import { useResourceStore } from '../stores/resources'

const route = useRoute()
const router = useRouter()
const resourceStore = useResourceStore()

const novel = ref(null)

onMounted(() => {
  // 从 Store 获取数据
  const found = resourceStore.getNovelById(route.params.id)
  if (found) {
    // 补充一些 demo 数据以还原布局（实际开发中这些应在数据库里）
    novel.value = {
      ...found,
      readCount: 3605, // 阅读量
      status: '连载中', // 状态
      contributor: 'ringyuki', // 贡献者
      // 模拟卷列表 (发行列表)
      volumes: [
        { id: 1, title: '第一卷', cover: found.cover },
        { id: 2, title: '第二卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
        { id: 3, title: '第三卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
        { id: 4, title: '第四卷', cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
      ],
      // 模拟角色列表
      characters: [
        { name: '温水和彦', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
        { name: '八奈见杏菜', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
        { name: '烧盐柠檬', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
        { name: '小鞠知花', role: '主角', avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
      ]
    }
  }
})
</script>

<template>
  <div v-if="novel" class="min-h-screen bg-[#f4f5f7] pb-10 font-sans">
    
    <div class="relative h-[320px] overflow-hidden group">
      <div class="absolute inset-0 bg-gray-900">
        <img :src="novel.cover" class="w-full h-full object-cover opacity-40 blur-xl scale-110">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#f4f5f7] via-transparent to-black/30"></div>
      
      <div class="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-20">
        <n-button text class="text-white/90 hover:text-white" @click="router.back()">
          <template #icon><n-icon :component="ArrowBackOutline" /></template>
          返回列表
        </n-button>
        <div class="flex gap-3">
          <n-button circle color="rgba(255,255,255,0.2)" class="text-white border-none backdrop-blur-sm">
             <template #icon><n-icon :component="ShareSocialOutline" /></template>
          </n-button>
        </div>
      </div>

      <div class="absolute bottom-4 left-0 right-0 container mx-auto px-4 z-20 flex flex-col md:flex-row items-end gap-6 translate-y-12">
        <div class="w-40 md:w-52 flex-shrink-0 rounded-lg shadow-2xl overflow-hidden border-4 border-white bg-white relative z-30">
          <n-image :src="novel.cover" class="w-full h-auto object-cover block" />
        </div>

        <div class="flex-grow pb-14 text-white md:pl-2">
          <div class="flex items-center gap-3 mb-2">
             <span class="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">{{ novel.status }}</span>
             <span class="flex items-center gap-1 text-xs opacity-80 bg-black/20 px-2 py-0.5 rounded backdrop-blur-md">
               <n-icon :component="EyeOutline" /> {{ novel.readCount }} 次阅读
             </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-2 shadow-sm">{{ novel.title }}</h1>
          <h2 class="text-lg opacity-80 mb-4 font-medium">{{ novel.originalTitle }}</h2>
          
          <div class="flex flex-wrap gap-2">
             <n-tag v-for="tag in novel.tags" :key="tag" round size="small" class="bg-white/20 text-white border-none hover:bg-white/30 cursor-pointer backdrop-blur-md">
               # {{ tag }}
             </n-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <aside class="lg:col-span-3 space-y-6">
        
        <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center space-y-3">
          <n-button type="primary" color="#fb7299" block round size="large" class="shadow-lg shadow-pink-200">
             <template #icon><n-icon :component="BookOutline" /></template>
             开始阅读
          </n-button>
          <div class="grid grid-cols-2 gap-3">
            <n-button ghost block round>
               <template #icon><n-icon :component="HeartOutline" /></template>
               收藏
            </n-button>
            <n-button ghost block round>
               <template #icon><n-icon :component="CreateOutline" /></template>
               评价
            </n-button>
          </div>
          <div class="text-xs text-gray-400 mt-2 flex justify-center items-center gap-1">
             <n-icon :component="PersonOutline"/> 贡献者: <span class="text-blue-500 cursor-pointer">{{ novel.contributor }}</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2 border-l-4 border-hikari-pink pl-3">
            书籍信息
          </h3>
          <ul class="space-y-4 text-sm text-gray-600">
            <li class="flex justify-between border-b border-gray-50 pb-2">
               <span class="text-gray-400">作者</span> 
               <span class="font-medium text-blue-500 cursor-pointer hover:underline">{{ novel.author }}</span>
            </li>
            <li class="flex justify-between border-b border-gray-50 pb-2">
               <span class="text-gray-400">插画</span> 
               <span class="font-medium text-blue-500 cursor-pointer hover:underline">{{ novel.illustrator }}</span>
            </li>
            <li class="flex justify-between border-b border-gray-50 pb-2">
               <span class="text-gray-400">出版社</span> 
               <span class="font-medium text-gray-800">{{ novel.publisher }}</span>
            </li>
            <li class="flex justify-between border-b border-gray-50 pb-2">
               <span class="text-gray-400">文库</span> 
               <span class="font-medium text-gray-800">{{ novel.publisher }}</span> </li>
            <li class="flex justify-between items-center pt-2">
               <span class="text-gray-400">评分</span> 
               <n-rate readonly :default-value="novel.score / 2" size="small" allow-half />
               <span class="text-hikari-pink font-bold">{{ novel.score }}</span>
            </li>
          </ul>
        </div>
      </aside>

      <main class="lg:col-span-9 space-y-8">
        
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <n-icon size="120" :component="BookOutline" />
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-4">剧情简介</h3>
          <div class="text-gray-600 leading-8 text-justify whitespace-pre-line" v-html="novel.description"></div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-800 border-l-4 border-blue-400 pl-3">发行列表</h3>
            <n-tabs type="segment" size="small" class="w-48">
              <n-tab-pane name="main" tab="正篇" />
              <n-tab-pane name="side" tab="番外" />
            </n-tabs>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div v-for="vol in novel.volumes" :key="vol.id" class="group cursor-pointer">
              <div class="aspect-[2/3] rounded-lg overflow-hidden border border-gray-100 shadow-sm relative mb-2">
                <img :src="vol.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                   <n-button v-if="false" size="small" round type="primary">阅读</n-button>
                </div>
              </div>
              <h4 class="text-sm font-bold text-gray-700 text-center truncate group-hover:text-hikari-blue transition">{{ vol.title }}</h4>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-bold text-gray-800 mb-6 border-l-4 border-green-400 pl-3">出场角色</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="char in novel.characters" :key="char.name" class="flex items-center gap-3 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition">
              <n-avatar round :src="char.avatar" size="large" class="border border-gray-200" />
              <div>
                <div class="font-bold text-gray-700 text-sm">{{ char.name }}</div>
                <div class="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1">{{ char.role }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
           <h3 class="text-lg font-bold text-gray-800 mb-6">评论</h3>
           <div class="text-center py-10 text-gray-400 bg-gray-50 rounded-lg">
             暂无评论，快来抢沙发吧~
           </div>
        </div>

      </main>
    </div>

  </div>
</template>

<style scoped>
/* 隐藏滚动条但保留功能 */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>