import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios' // 1. 引入 axios

export const useUserStore = defineStore('user', () => {
  
  // === 1. 初始化逻辑 (新增：防呆处理) ===
  // 专门处理“刷新页面”时的数据读取，防止旧数据缺少字段导致报错
  const loadUserFromStorage = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'))
      if (!stored) return null

      // 补全可能缺失的字段 (兼容旧数据)
      // 1. 补全等级
      if (stored.level === undefined) stored.level = 1
      
      // 2. 补全下一级经验 (如果缺失，按公式反推)
      if (!stored.nextLevelExp) {
        stored.nextLevelExp = Math.floor(100 * Math.pow(1.2, stored.level - 1))
      }
      
      // 3. 兼容 exp 和 currentExp
      if (stored.currentExp === undefined) {
        stored.currentExp = stored.exp || 0
      }

      // 4. 兼容下划线写法
      if (stored.isSignedToday === undefined) {
        stored.isSignedToday = stored.is_signed_today || false
      }

      return stored
    } catch (e) {
      localStorage.removeItem('user')
      return null
    }
  }

  // === 2. 核心状态 ===
  const userInfo = ref(loadUserFromStorage()) // 使用增强版的读取函数
  const token = ref(localStorage.getItem('token') || '')

  // === 3. 用户资源库数据 ===
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

  // === 4. 动作：登录 ===
  const login = (data) => {
    // 兼容逻辑：后端可能返回 { status: 'success', user: {...}, token: '...' }
    // 也可能直接返回 user 对象
    const rawUser = data.user || data
    
    // ⚠️ 关键修正：后端字段 -> 前端字段映射
    const mappedUser = {
      ...rawUser,
      // 如果后端有 exp 字段，映射为 currentExp；否则默认为 0
      currentExp: rawUser.exp !== undefined ? rawUser.exp : (rawUser.currentExp || 0),
      // 如果后端有 is_signed_today，映射为 isSignedToday
      isSignedToday: rawUser.is_signed_today !== undefined ? rawUser.is_signed_today : false,
      // 初始化下一级所需经验 (如果没存过，默认 100，按 1.2 倍递增)
      nextLevelExp: rawUser.nextLevelExp || Math.floor(100 * Math.pow(1.2, (rawUser.level || 1) - 1))
    }

    userInfo.value = mappedUser
    token.value = data.token || 'mock-token-xyz' // 防止后端没发 token 导致报错

    // 持久化存储
    localStorage.setItem('user', JSON.stringify(userInfo.value))
    localStorage.setItem('token', token.value)
  }

  // === 5. 动作：退出登录 ===
  const logout = () => {
    userInfo.value = null
    token.value = ''
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('lastSignDate')
  }

  // === 6. 辅助函数 ===
  const isLoggedIn = () => {
    return !!token.value
  }

  // === 7. 动作：签到 (核心修改：连接后端) ===
  const signIn = async () => {
    // 1. 检查是否登录
    if (!userInfo.value) return { success: false, msg: '请先登录' }
    
    // 前端先做个简单判断，避免重复请求（后端也会再校验一次）
    if (userInfo.value.isSignedToday) {
      return { success: false, msg: '今天已经签到过了哦~' }
    }

    try {
      // 2. 发送请求给后端 (请确保端口号正确)
      const res = await axios.post('http://127.0.0.1:8000/a/users/sign_in/', {
        user_id: userInfo.value.id
      })

      const data = res.data
      
      if (data.status === 'success') {
        // 3. 后端处理成功，直接用后端返回的最新 user 数据覆盖前端的
        const rawUser = data.user
        
        // 重新做一次字段映射 (保持和 login 里一样的逻辑)
        // 这样前端显示的等级、经验就自动同步了
        userInfo.value = {
            ...rawUser,
            currentExp: rawUser.exp, // 后端通常返回 exp
            isSignedToday: true,     // 既然成功了，那就是签了
            level: rawUser.level,
            // 算出下一级经验用于显示进度条
            nextLevelExp: Math.floor(100 * Math.pow(1.2, (rawUser.level - 1)))
        }
        
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify(userInfo.value))
        
        return { success: true, msg: data.msg }
      } else {
        // 后端返回 warning (比如“已签到”)
        return { success: false, msg: data.msg }
      }

    } catch (error) {
      console.error('签到请求失败:', error)
      return { success: false, msg: '签到失败，网络连接错误' }
    }
  }

  // === 8. 动作：更新个人资料 ===
  const updateProfile = (data) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
      localStorage.setItem('user', JSON.stringify(userInfo.value))
    }
  }

  // === 9. 资源库管理逻辑 (保持原样) ===
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
        summary: article.summary || (article.content ? article.content.substring(0, 50) + '...' : ''),
        time: article.date || '刚刚'
      })
      return true
    }
  }

  const register = (nickname, email) => {
    console.log('注册信息 (前端仅记录):', nickname, email)
  }

  return { 
    userInfo, 
    token, 
    isLoggedIn, 
    login, 
    logout, 
    register, 
    updateProfile, 
    signIn, // 导出新的 signIn
    galgameLibrary, 
    setGalgameStatus,
    novelLibrary, 
    toggleNovelFavorite, 
    toggleNovelRead,
    articleLibrary, 
    toggleArticleFavorite 
  }
})