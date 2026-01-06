import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)

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

  return { userInfo, login, register, updateProfile, logout, signIn }
})