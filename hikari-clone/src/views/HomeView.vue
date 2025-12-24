<script setup>
import { ref } from 'vue'
import PostCard from '../components/PostCard.vue'
import { NCarousel } from 'naive-ui'

// 1. 模拟轮播图数据
const banners = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
]

// 2. 模拟帖子数据 (假装是从后台获取的)
const posts = ref([
  {
    id: 1,
    title: '【Gal周报222期】十二月新作本周发售，《缘起甜韵》登陆Steam',
    summary: '十二月新作已于本周发售，一共有五部作品，其中PC平台有四部作品，快来看看有没有你喜欢的吧...',
    author: '官方bot',
    date: '18小时前',
    views: 2390,
    comments: 22,
    tag: '资讯',
    cover: 'https://via.placeholder.com/300x200/fb7299/ffffff?text=Galgame+News'
  },
  {
    id: 2,
    title: '关于Hikarinagi下载服务变更的说明',
    summary: '话说，Hikarinagi在把下载服务从onedrive移到b2+cf后，下载体验就很感人。虽说代理能解决这个问题...',
    author: '星涟',
    date: '1天前',
    views: 4012,
    comments: 8,
    tag: '公告',
    cover: null // 测试没有封面的情况
  },
  {
    id: 3,
    title: 'Key社新作《anemoi》2026年1月30日发售预定',
    summary: 'Key社终于公布了新作的详细情报，这次的剧本由...',
    author: '搬运工',
    date: '2天前',
    views: 885,
    comments: 45,
    tag: '新闻',
    cover: 'https://via.placeholder.com/300x200/00aeec/ffffff?text=Key+Project'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    
    <div class="lg:col-span-3 space-y-6">
      
      <n-carousel autoplay show-arrow class="rounded-lg shadow-sm overflow-hidden h-48 sm:h-80">
        <img v-for="url in banners" :key="url" :src="url" class="w-full h-full object-cover">
      </n-carousel>

      <section>
        <div class="flex items-center gap-4 mb-4 border-b pb-2">
          <h2 class="text-xl font-bold text-gray-700 border-l-4 border-hikari-pink pl-3">
            社区动态
          </h2>
        </div>
        
        <div class="space-y-4">
          <PostCard v-for="item in posts" :key="item.id" :post="item" />
        </div>
      </section>
    </div>

    <aside class="lg:col-span-1 space-y-6">
      
      <div class="bg-white p-5 rounded-lg shadow-sm text-center">
        <h3 class="font-bold text-gray-800 mb-2">欢迎加入社区</h3>
        <p class="text-xs text-gray-500 mb-4">登录后参与讨论，分享你的资源。</p>
       <button @click="$router.push('/login')" class="w-full bg-hikari-blue text-white py-2 rounded hover:bg-blue-500 transition font-medium">
        立即登录
      </button>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="font-bold text-gray-700 text-sm mb-3">热门标签</h3>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-pink-50 text-pink-500 text-xs rounded cursor-pointer">#Galgame</span>
          <span class="px-2 py-1 bg-blue-50 text-blue-500 text-xs rounded cursor-pointer">#轻小说</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded cursor-pointer">#求助</span>
        </div>
      </div>

    </aside>

  </div>
</template>