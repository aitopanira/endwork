import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
// === 新增：用户资源库数据 ===
  // 1. Galgame 状态记录
  const galgameLibrary = ref({
    wish: [],    // 想玩
    playing: [], // 在玩
    played: []   // 玩过
  })

  // 2. 轻小说记录
  const novelLibrary = ref({
    favorites: [], // 收藏
    read: []       // 已读
  })

  // 3. 文章收藏
  const articleLibrary = ref([])

  // === 动作：管理 Galgame 状态 ===
  // status: 'wish' | 'playing' | 'played'
  const setGalgameStatus = (game, status) => {
    // 先从所有列表中移除该游戏，避免重复（例如从“想玩”变成“在玩”）
    ['wish', 'playing', 'played'].forEach(key => {
      const index = galgameLibrary.value[key].findIndex(g => g.id === game.id)
      if (index !== -1) galgameLibrary.value[key].splice(index, 1)
    })

    // 如果传入了新的 status，则添加到对应列表
    if (status) {
      // 简单存储必要信息，避免存整个大对象
      galgameLibrary.value[status].unshift({
        id: game.id,
        title: game.title,
        cover: game.cover,
        dev: game.developer,
        score: game.score || 0, // 仅玩过需要
        progress: '进行中' // 仅在玩需要
      })
    }
  }

  // === 动作：收藏/取消收藏 轻小说 ===
  const toggleNovelFavorite = (novel) => {
    const index = novelLibrary.value.favorites.findIndex(n => n.id === novel.id)
    if (index !== -1) {
      novelLibrary.value.favorites.splice(index, 1) // 取消
      return false
    } else {
      novelLibrary.value.favorites.unshift({
        id: novel.id,
        title: novel.title,
        cover: novel.cover,
        author: novel.author
      })
      return true
    }
  }

  // === 动作：标记/取消标记 轻小说已读 ===
  const toggleNovelRead = (novel) => {
    const index = novelLibrary.value.read.findIndex(n => n.id === novel.id)
    if (index !== -1) {
      novelLibrary.value.read.splice(index, 1)
      return false
    } else {
      novelLibrary.value.read.unshift({
        id: novel.id,
        title: novel.title,
        cover: novel.cover,
        author: novel.author
      })
      return true
    }
  }

  // === 动作：收藏文章 ===
  const toggleArticleFavorite = (article) => {
    const index = articleLibrary.value.findIndex(a => a.id === article.id)
    if (index !== -1) {
      articleLibrary.value.splice(index, 1)
      return false
    } else {
      articleLibrary.value.unshift({
        id: article.id,
        title: article.title,
        author: article.author,
        summary: article.summary || article.content.substring(0, 50) + '...', // 简略内容
        time: article.date || '刚刚'
      })
      return true
    }
  }
  
  const login = (username) => {
    userInfo.value = {
      name: username,
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      level: 6,
      // === 改动：经验系统替代硬币 ===
      currentExp: 1240,    // 当前经验
      nextLevelExp: 2500,  // 升级所需经验
      isSignedToday: false, // 今日签到状态
      bio: '这个人很懒，什么都没有写~'
    }
  }

  const register = (nickname, email) => {
    userInfo.value = {
      name: nickname,
      email: email,
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      level: 1,
      currentExp: 0,
      nextLevelExp: 100,
      isSignedToday: false,
      bio: '萌新报到！'
    }
  }

  const updateProfile = (data) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
    }
  }

  const logout = () => {
    userInfo.value = null
  }

  // === 新增：签到函数 ===
  const signIn = () => {
    if (!userInfo.value || userInfo.value.isSignedToday) return { success: false, msg: '今日已签到' }

    // 随机经验 10-50
    const expGain = Math.floor(Math.random() * 41) + 10
    userInfo.value.currentExp += expGain
    userInfo.value.isSignedToday = true

    let msg = `签到成功！经验 +${expGain}`

    // 升级逻辑
    if (userInfo.value.currentExp >= userInfo.value.nextLevelExp) {
      userInfo.value.currentExp -= userInfo.value.nextLevelExp
      userInfo.value.level += 1
      userInfo.value.nextLevelExp = Math.floor(userInfo.value.nextLevelExp * 1.2) // 下一级难度提升
      msg += `，恭喜升级到 Lv.${userInfo.value.level}！`
    }

    return { success: true, msg }
  }

  return { userInfo, login, register, updateProfile, logout, signIn,
           galgameLibrary, setGalgameStatus,
           novelLibrary, toggleNovelFavorite, toggleNovelRead,
           articleLibrary, toggleArticleFavorite }
})