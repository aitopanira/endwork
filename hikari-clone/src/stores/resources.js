// src/stores/resources.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useResourceStore = defineStore('resource', () => {
  
  // === Galgame 数据库 ===
  const galgames = ref([
    {
      id: 101,
      title: 'Sakura no Uta - 樱之诗',
      originalTitle: 'サクラノ詩 -樱の森の上を舞う-',
      developer: '枕 (Makura)',
      date: '2015-10-24',
      price: '9,800円',
      platform: 'PC',
      website: '#',
      score: 9.8,
      tags: ['剧情作', '神作', '哲学'],
      description: '<p>春天，樱花飞舞的季节。与你相遇的奇迹，是名为“樱之诗”的旋律...</p>',
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg', 
      gallery: [
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg'
      ]
    },
    {
      id: 102,
      title: 'AMBITIOUS MISSION',
      originalTitle: 'アンビシャスミッション',
      developer: 'SAGA PLANETS',
      date: '2022-05-27',
      price: '9,800円',
      platform: 'PC',
      website: '#',
      score: 9.0,
      tags: ['废萌', '怪盗', '恋爱'],
      description: '<p>只玩了忍者那条线，有点想睡着，反正太色了...</p>',
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      gallery: [
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
      ]
    }
  ])

  // === 轻小说 数据库 ===
  const novels = ref([
    {
      id: 201,
      title: '物语系列',
      originalTitle: '物語シリーズ',
      author: '西尾维新',
      illustrator: 'VOFAN',
      publisher: '讲谈社',
      date: '2006-11-01',
      status: '连载中',
      score: 10.0,
      tags: ['怪异', '话痨', '神作'],
      description: '<p>我心目中的第一神作，西尾维新真把文字玩到了极致...</p>',
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
      illustrations: [
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg'
      ]
    },
    {
      id: 202,
      title: '刀剑神域',
      originalTitle: 'ソードアート・オンライン',
      author: '川原砾',
      illustrator: 'abec',
      publisher: '电击文库',
      date: '2009-04-10',
      status: '连载中',
      score: 10.0,
      tags: ['冒险', 'VRMMO', '神作'],
      description: '<p>我最喜欢的作品，看完动画就喜欢上了然后去补了小说...</p>',
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      illustrations: [
        'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg'
      ]
    }
  ])


  const addGalgame = (data) => {
    galgames.value.unshift({
      id: Date.now(), // 模拟ID
      score: 0, // 初始评分
      ...data
    })
  }

  const addNovel = (data) => {
    novels.value.unshift({
      id: Date.now(),
      score: 0,
      status: '连载中',
      ...data
    })
  }
  // === 核心功能：根据 ID 查找数据 ===
  const getGalgameById = (id) => {
    return galgames.value.find(g => g.id == id)
  }

  const getNovelById = (id) => {
    return novels.value.find(n => n.id == id)
  }

  return { galgames, novels, getGalgameById, getNovelById, addGalgame, addNovel }
})