<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NIcon, NEmpty } from 'naive-ui'
import { ArrowBackOutline, GameControllerOutline } from '@vicons/ionicons5'
import axios from 'axios'
const route = useRoute()
const router = useRouter()

// 获取路由参数里的品牌名 (例如 "Key", "Yuzu")
const brandName = route.params.name

console.log('当前品牌名称:', brandName)
// 模拟的大型数据库 (实际项目中这些应该在 store/resources.js 里)
const allGames = ref([])

// 根据 URL 传进来的品牌名进行筛选
const fetchGames = async() => {
  try{
    const response = await axios.get('http://127.0.0.1:8000/a/getuser/galgames/')
    allGames.value = response.data
  }catch (error) {
    console.error('获取新游数据失败:', error)
  }
}
const filteredGames = computed(() => {
  if (!brandName) return []
  return allGames.value.filter(game =>{
  const dev = game.developer ? game.developer : ''
  const target = brandName ? brandName : '' 
  return dev.includes(target)
})
})

const goToDetail = (id) => {
  router.push(`/galgame/${id}`)
}
onMounted(() => {
  fetchGames()
})
</script>

<template>
  <div class="min-h-screen bg-[#f4f5f7] font-sans pb-10">
    
    <div class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <n-button circle secondary @click="router.back()">
            <template #icon><n-icon :component="ArrowBackOutline" /></template>
          </n-button>
          <div>
            <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              {{ brandName }} 
              <span class="text-sm font-normal text-gray-400">旗下作品</span>
            </h1>
          </div>
        </div>
        <div class="text-sm text-gray-500">
          共收录 <span class="font-bold text-hikari-blue">{{ filteredGames.length }}</span> 部
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      
      <div v-if="filteredGames.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div 
          v-for="game in filteredGames" 
          :key="game.id" 
          @click="goToDetail(game.id)"
          class="group cursor-pointer bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300"
        >
          <div class="aspect-[3/4] rounded-lg overflow-hidden mb-3 relative">
            <img :src="game.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
              {{ game.developer }}
            </div>
          </div>
          <h3 class="font-bold text-gray-700 text-sm truncate group-hover:text-hikari-blue transition mb-1">{{ game.title }}</h3>
          <div class="text-xs text-gray-400 flex items-center gap-1">
             <n-icon :component="GameControllerOutline" /> {{ game.date }}
          </div>
        </div>
      </div>

      <div v-else class="py-20 flex justify-center">
        <n-empty description="该品牌下暂无收录游戏" size="large" />
      </div>

    </div>
  </div>
</template>