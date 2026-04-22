import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  
  // === 1. 初始化逻辑 ===
  const loadUserFromStorage = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'))
      if (!stored) return null

      if (stored.level === undefined) stored.level = 1
      if (!stored.nextLevelExp) {
        stored.nextLevelExp = Math.floor(100 * Math.pow(1.2, stored.level - 1))
      }
      if (stored.currentExp === undefined) {
        stored.currentExp = stored.exp || 0
      }
      if (stored.isSignedToday === undefined) {
        stored.isSignedToday = stored.is_signed_today || false
      }

      // 每次刷新页面时，检查是不是新的一天
      checkAndResetDailyStatus(stored)

      return stored
    } catch (e) {
      localStorage.removeItem('user')
      return null
    }
  }

  // === 💡 核心升级：基于“用户专属签到日期”的重置逻辑 ===
  const checkAndResetDailyStatus = async (userObj) => {
    if (!userObj || !userObj.id) return
    
    const today = new Date().toLocaleDateString()
    // 获取该用户最后一次【真实点击签到】的日期
    const lastSignDate = localStorage.getItem(`lastSignDate_${userObj.id}`)

    // 只要本地记录的最后签到日期不是今天（或者根本没签过到）
    if (lastSignDate !== today) {
      // 1. 强制无视后端的旧数据，今天就是没签到！
      userObj.isSignedToday = false
      localStorage.setItem('user', JSON.stringify(userObj))
      
      if (userInfo.value) {
        userInfo.value.isSignedToday = false
      }

      // 2. 顺手发个请求，把数据库里昨天的 1 擦掉，改成 0
      try {
        await axios.patch(`http://127.0.0.1:8000/a/users/${userObj.id}/`, {
          is_signed_today: false
        })
      } catch (error) {
        // 静默失败，不影响前端展示
      }
    }
  }

  // === 2. 核心状态 ===
  const userInfo = ref(loadUserFromStorage())
  const token = ref(localStorage.getItem('token') || '')

  // === 3. 用户资源库数据 ===
  const galgameLibrary = ref({ wish: [], playing: [], played: [] })
  const novelLibrary = ref({ favorites: [], read: [] })
  const articleLibrary = ref([])

  // === 4. 动作：登录 ===
  const login = (data) => {
    const rawUser = data.user || data
    
    const mappedUser = {
      ...rawUser,
      currentExp: rawUser.exp !== undefined ? rawUser.exp : (rawUser.currentExp || 0),
      isSignedToday: rawUser.is_signed_today !== undefined ? rawUser.is_signed_today : false,
      nextLevelExp: rawUser.nextLevelExp || Math.floor(100 * Math.pow(1.2, (rawUser.level || 1) - 1))
    }

    userInfo.value = mappedUser
    token.value = data.token || 'mock-token-xyz'

    localStorage.setItem('user', JSON.stringify(userInfo.value))
    localStorage.setItem('token', token.value)

    // 每次登录时，检查是不是新的一天
    checkAndResetDailyStatus(userInfo.value)
  }

  // === 5. 动作：退出登录 ===
  const logout = () => {
    userInfo.value = null
    token.value = ''
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const isLoggedIn = () => {
    return !!token.value
  }

  // === 7. 动作：签到 ===
  const signIn = async () => {
    if (!userInfo.value) return { success: false, msg: '请先登录' }
    
    if (userInfo.value.isSignedToday) {
      return { success: false, msg: '今天已经签到过了哦~' }
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/a/users/sign_in/', {
        user_id: userInfo.value.id
      })

      const data = res.data
      
      if (data.status === 'success') {
        const rawUser = data.user
        
        userInfo.value = {
            ...rawUser,
            currentExp: rawUser.exp !== undefined ? rawUser.exp : (rawUser.currentExp || 0),
            isSignedToday: true, 
            level: rawUser.level || 1,
            nextLevelExp: Math.floor(100 * Math.pow(1.2, ((rawUser.level || 1) - 1)))
        }
        
        localStorage.setItem('user', JSON.stringify(userInfo.value))
        
        // 💡 核心升级：签到成功后，给这个用户盖上“今天已签到”的时间戳印章！
        const today = new Date().toLocaleDateString()
        localStorage.setItem(`lastSignDate_${userInfo.value.id}`, today)
        
        return { success: true, msg: data.msg }
      } else {
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

  // === 9. 资源库管理逻辑 ===
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
    signIn,
    galgameLibrary, 
    setGalgameStatus,
    novelLibrary, 
    toggleNovelFavorite, 
    toggleNovelRead,
    articleLibrary, 
    toggleArticleFavorite 
  }
})