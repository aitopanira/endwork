<script setup>
import { useRouter } from 'vue-router' // 1. 引入路由钩子

const router = useRouter() // 2. 获取路由实例

// 定义 Props
defineProps({
  post: {
    type: Object,
    required: true
  }
})

// 跳转函数
const goToDetail = (id) => {
  router.push(`/post/${id}`)
}
</script>

<template>
  <div 
    @click="goToDetail(post.id)"
    class="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row gap-4 cursor-pointer group border border-gray-100"
  >
    <div class="w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded bg-gray-200 relative">
      <img 
        v-if="post.cover" 
        :src="post.cover" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        alt="cover"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-400 text-xs">
        暂无封面
      </div>
    </div>

    <div class="flex flex-col justify-between flex-grow">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-white px-2 py-0.5 rounded bg-hikari-pink">
            {{ post.tag }}
          </span>
          <h3 class="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-hikari-blue transition">
            {{ post.title }}
          </h3>
        </div>
        <p class="text-gray-500 text-sm line-clamp-2 mb-2">
          {{ post.summary }}
        </p>
      </div>
      
      <div class="flex items-center justify-between text-xs text-gray-400 mt-2">
        <div class="flex items-center gap-3">
          <span>👤 {{ post.author }}</span>
          <span>📅 {{ post.date }}</span>
        </div>
        <div class="flex gap-3">
          <span>🔥 {{ post.views }}</span>
          <span>💬 {{ post.comments }}</span>
        </div>
      </div>
    </div>
  </div>
</template>