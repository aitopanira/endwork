<script setup>
import { useRouter } from 'vue-router'
import { NButton, NIcon, NInput } from 'naive-ui'
import { ArrowBackOutline, SearchOutline } from '@vicons/ionicons5'
import { ref, computed } from 'vue'

const router = useRouter()
const searchText = ref('')

// 模拟的大型厂商数据库
const allBrands = [
  { name: 'Key', color: 'bg-blue-100 text-blue-500' },
  { name: 'Yuzu', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Saga', color: 'bg-purple-100 text-purple-500' },
  { name: 'Purple', color: 'bg-pink-100 text-pink-500' },
  { name: 'Alice', color: 'bg-red-100 text-red-500' },
  { name: 'Nitro+', color: 'bg-gray-800 text-white' },
  { name: 'Frontwing', color: 'bg-teal-100 text-teal-600' },
  { name: 'Navel', color: 'bg-orange-100 text-orange-500' },
  { name: 'August', color: 'bg-indigo-100 text-indigo-500' },
  { name: 'Lose', color: 'bg-gray-200 text-gray-700' },
  { name: 'Pulltop', color: 'bg-green-100 text-green-600' },
  { name: 'Sprite', color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Aquaplus', color: 'bg-blue-50 text-blue-800' },
  { name: 'Circus', color: 'bg-yellow-50 text-yellow-800' },
  { name: 'Leaf', color: 'bg-green-50 text-green-800' },
  { name: 'Type-Moon', color: 'bg-blue-900 text-white' },
]

// 简单的搜索过滤
const filteredBrands = computed(() => {
  if (!searchText.value) return allBrands
  return allBrands.filter(b => b.name.toLowerCase().includes(searchText.value.toLowerCase()))
})

// 跳转到该品牌的详情页
const goToBrand = (name) => {
  router.push(`/brand/${name}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f5f7] font-sans pb-10">
    
    <div class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
      <div class="container mx-auto px-4 py-4 flex items-center gap-4">
        <n-button circle secondary @click="router.back()">
          <template #icon><n-icon :component="ArrowBackOutline" /></template>
        </n-button>
        <h1 class="text-xl font-bold text-gray-800">全部厂商</h1>
        <div class="flex-grow"></div>
        <div class="w-48 sm:w-64">
           <n-input v-model:value="searchText" placeholder="搜索厂商..." round size="small">
             <template #prefix><n-icon :component="SearchOutline" /></template>
           </n-input>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        <div 
          v-for="brand in filteredBrands" 
          :key="brand.name" 
          @click="goToBrand(brand.name)"
          class="flex flex-col items-center gap-3 group cursor-pointer bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition"
        >
          <div :class="`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition duration-300 ${brand.color}`">
            {{ brand.name }}
          </div>
          <span class="text-sm font-bold text-gray-600 group-hover:text-hikari-blue">{{ brand.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>