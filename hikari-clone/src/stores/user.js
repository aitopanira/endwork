import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', () => {
  // === 1. 核心状态 (新增了 token 和 localStorage 读取逻辑) ===
  // 优先从本地存储读取，如果没有才是 null
  
  const userInfo = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || '')

  // === 2. 用户资源库数据 (保持你原来的代码不变) ===
  // 注意：如果想让这些数据也“刷新不丢失”，建议也存 localStorage 或等后端有了对应接口后从后端获取
  const galgameLibrary = ref({
    wish: [],    
    playing: [], 
    played: []   
  })

  const novelLibrary = ref({
    favorites: [],
    read: []      
  })

  const articleLibrary = ref([])

  // === 3. 动作：登录 (核心修改) ===
  // data: 后端返回的完整数据对象
  const login = (data) => {
    // 假设后端返回的数据结构包含 user 信息和 token
    // 例如： { user: { id: 1, name: '...' }, token: 'xyz...' }
    // 如果后端直接返回用户信息且 Token 在 header 里，这里需要根据实际情况调整
    
    // 1. 设置状态
    userInfo.value = data.user || data // 兼容一下，看后端是包裹在 user 里还是直接返回
    token.value = data.token || 'mock-token' // 如果后端暂时没发 token，先给个假的防止报错

    // 2. 持久化存储 (关键！刷新不丢失)
    localStorage.setItem('user', JSON.stringify(userInfo.value))
    localStorage.setItem('token', token.value)
  }

  // === 4. 动作：退出登录 (核心修改) ===
  const logout = () => {
    userInfo.value = null
    token.value = ''
    
    // 清除本地存储
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    // 可选：退出时是否要清空资源库？看你需求
    // galgameLibrary.value = { wish: [], playing: [], played: [] }
  }

  // === 5. 辅助函数：判断是否登录 ===
  const isLoggedIn = () => {
    return !!token.value // 有 token 就算登录
  }

  // === 下面是你原来的业务逻辑 (完美保留) ===

  // === 动作：管理 Galgame 状态 ===
  const setGalgameStatus = (game, status) => {
    ['wish', 'playing', 'played'].forEach(key => {
      const index = galgameLibrary.value[key].findIndex(g => g.id === game.id)
      if (index !== -1) galgameLibrary.value[key].splice(index, 1)
    })

    if (status) {
      galgameLibrary.value[status].unshift({
        id: game.id,
        title: game.title,
        cover: game.cover,
        dev: game.developer,
        score: game.score || 0,
        progress: '进行中'
      })
    }
  }

  // === 动作：收藏/取消收藏 轻小说 ===
  const toggleNovelFavorite = (novel) => {
    const index = novelLibrary.value.favorites.findIndex(n => n.id === novel.id)
    if (index !== -1) {
      novelLibrary.value.favorites.splice(index, 1)
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
        summary: article.summary || article.content.substring(0, 50) + '...',
        time: article.date || '刚刚'
      })
      return true
    }
  }

  // === 动作：注册 (配合后端逻辑简单修改) ===
  const register = (nickname, email) => {
     // 注册其实通常不需要在 store 里操作 state，
     // 而是注册成功后自动调用 login，或者跳回登录页。
     // 这里保留你的逻辑，但建议注册成功后直接走 login 流程。
    console.log('注册信息已提交', nickname, email)
  }

  // === 动作：更新个人资料 ===
  const updateProfile = (data) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
      // 更新了资料也要同步到 localStorage
      localStorage.setItem('user', JSON.stringify(userInfo.value))
    }
  }

  // === 动作：签到 (保留你的逻辑，记得同步 storage) ===
  const signIn = () => {
    if (!userInfo.value || userInfo.value.isSignedToday) return { success: false, msg: '今日已签到' }

    const expGain = Math.floor(Math.random() * 41) + 10
    userInfo.value.currentExp += expGain
    userInfo.value.isSignedToday = true

    let msg = `签到成功！经验 +${expGain}`

    if (userInfo.value.currentExp >= userInfo.value.nextLevelExp) {
      userInfo.value.currentExp -= userInfo.value.nextLevelExp
      userInfo.value.level += 1
      userInfo.value.nextLevelExp = Math.floor(userInfo.value.nextLevelExp * 1.2)
      msg += `，恭喜升级到 Lv.${userInfo.value.level}！`
    }
    
    // 状态变了，同步保存到本地
    localStorage.setItem('user', JSON.stringify(userInfo.value))

    return { success: true, msg }
  }

  return { 
    userInfo, token, isLoggedIn, // 导出新加的状态和方法
    login, logout, register, updateProfile, signIn,
    galgameLibrary, setGalgameStatus,
    novelLibrary, toggleNovelFavorite, toggleNovelRead,
    articleLibrary, toggleArticleFavorite 
  }
})