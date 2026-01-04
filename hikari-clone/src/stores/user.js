import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)

  const login = (username) => {
    userInfo.value = {
      name: username,
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
      level: 6,
      coin: 233,
      bio: '这个人很懒，什么都没有写~' // 新增：个性签名
    }
  }

  const register = (nickname, email) => {
    userInfo.value = {
      name: nickname,
      email: email,
      avatar: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
      level: 1,
      coin: 0,
      bio: '萌新报到！'
    }
  }

  // === 新增：更新个人资料 ===
  const updateProfile = (data) => {
    if (userInfo.value) {
      // 合并旧数据和新数据
      userInfo.value = { ...userInfo.value, ...data }
    }
  }

  const logout = () => {
    userInfo.value = null
  }

  return { userInfo, login, register, updateProfile, logout }
})