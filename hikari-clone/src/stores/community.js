// src/stores/community.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommunityStore = defineStore('community', () => {
  // 初始帖子数据 (从你原来的 CommunityView 搬过来的)
  const posts = ref([
    {
      id: 1,
      author: 'devv',
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      time: '大约 6 小时前',
      title: '今年我不会再玩galgame了！这是我今年最后一天碰gal！',
      summary: '经典段子放送 提前庆祝各位元旦快乐...',
      image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      tag: '闲聊',
      views: 24,
      comments: 0,
      likes: 0
    },
    {
      id: 2,
      author: 'いち',
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
      time: '1 天前',
      title: '【Gal周报223期】MOONSTONE 宣布制作新作，《anemoi》宣布跳票',
      summary: '本周，MOONSTONE 宣布将制作两部新作...',
      image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg',
      tag: '资讯',
      views: 247,
      comments: 4,
      likes: 3
    }
  ])

  // 发布新帖子 Action
  const addPost = (newPost) => {
    // 模拟生成 ID 和时间
    const post = {
      id: Date.now(),
      time: '刚刚',
      views: 0,
      comments: 0,
      likes: 0,
      ...newPost
    }
    posts.value.unshift(post) // 加到最前面
  }

  return { posts, addPost }
})