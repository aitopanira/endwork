<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTabs, NTabPane, NInput, NButton, NCheckbox, NIcon, useMessage } from 'naive-ui'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5' // 去掉了 MailOutline
import { useUserStore } from '../stores/user'
import axios from 'axios'
import loginBg from '@/images/login-background.png'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()

const activeTab = ref('login')
const isLoading = ref(false)

// === 1. 登录表单数据 ===
const loginForm = ref({ username: '', password: '' })

// === 2. 注册表单数据 (修改：去掉了 email，加了 confirmPassword) ===
const registerForm = ref({ 
  nickname: '', 
  password: '', 
  confirmPassword: '' // 新增：确认密码
})

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    message.warning('请输入账号和密码')
    return
  }

  isLoading.value = true 

  try {
    const res = await axios.post('http://127.0.0.1:8000/a/users/login/', {
      username: loginForm.value.username,
      // password: loginForm.value.password 
    })

    if (res.data.status === 'success') {
      userStore.login(res.data.user)
      message.success(`欢迎回来，${res.data.user.name || loginForm.value.username}`)
      
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } else {
      throw new Error('登录状态异常')
    }

  } catch (error) {
    console.error(error)
    const errorMsg = error.response?.data?.detail || error.message || '登录失败'
    message.error(errorMsg)
  } finally {
    isLoading.value = false 
  }
}

// 处理注册
const handleRegister = async () => {
  // 1. 基础非空校验 (修改：检查 confirmPassword)
  if (!registerForm.value.nickname || !registerForm.value.password || !registerForm.value.confirmPassword) {
    message.warning('请填写完整的注册信息')
    return
  }
console
  // 2. 新增：密码一致性校验
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.error('两次输入的密码不一致，请检查')
    return
  }
  isLoading.value = true
  try {
    // 3. 发送注册请求 (去掉了 email)
    const res = await axios.post('http://127.0.0.1:8000/a/users/register/', {
      nickname: registerForm.value.nickname,
      password: registerForm.value.password
      // email: ... 后端还没存，这里就不发了
    })

    console.log('注册返回:', res.data)

    if (res.data.status === 'success') {
      message.success('注册成功！请登录')
      
      // 自动切回登录 Tab，并填好账号
      activeTab.value = 'login'
      loginForm.value.username = registerForm.value.nickname
      loginForm.value.password = '' 
      
      // 清空注册表单
      registerForm.value = { nickname: '', password: '', confirmPassword: '' }
      
    } else {
      throw new Error(res.data.msg || '注册失败')
    }

  } catch (error) {
    console.error(error)
    const errorMsg = error.response?.data?.msg || error.message || '注册请求失败'
    message.error(errorMsg)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
 <div 
  class="fixed inset-0 flex items-center justify-center bg-cover bg-center"
  :style="{ backgroundImage: `url(${loginBg})` }"
>
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

    <div class="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl mx-4 animate-fade-in">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-hikari-pink tracking-widest drop-shadow-sm cursor-pointer" @click="router.push('/')">
          AiHikari
        </h1>
        <p class="text-xs text-gray-500 mt-2 tracking-wide uppercase">ACGN 爱好者社区</p>
      </div>

      <n-tabs v-model:value="activeTab" size="large" justify-content="space-evenly" animated type="segment">
        
        <n-tab-pane name="login" tab="登 录">
          <form class="mt-6 space-y-6" @submit.prevent="handleLogin">
            <n-input v-model:value="loginForm.username" placeholder="账号 / 昵称" size="large" round>
              <template #prefix><n-icon :component="PersonOutline" class="text-gray-500" /></template>
            </n-input>
            <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="密码" size="large" round>
              <template #prefix><n-icon :component="LockClosedOutline" class="text-gray-500" /></template>
            </n-input>

            <div class="flex justify-between items-center text-sm px-1">
              <n-checkbox>自动登录</n-checkbox>
              <a href="#" class="text-gray-500 hover:text-hikari-pink transition">忘记密码?</a>
            </div>

            <n-button 
              attr-type="submit" 
              type="primary" 
              block 
              round 
              size="large" 
              color="#fb7299" 
              class="shadow-lg"
              :loading="isLoading"
              :disabled="isLoading"
            >
              <span class="font-bold tracking-widest">
                {{ isLoading ? '登录中...' : '进入社区' }}
              </span>
            </n-button>
          </form>
        </n-tab-pane>

        <n-tab-pane name="register" tab="注 册">
          <form class="mt-6 space-y-4" @submit.prevent="handleRegister">
            <n-input v-model:value="registerForm.nickname" placeholder="昵称" size="large" round>
              <template #prefix><n-icon :component="PersonOutline" /></template>
            </n-input>
            
            <n-input v-model:value="registerForm.password" type="password" show-password-on="click" placeholder="设置密码" size="large" round>
              <template #prefix><n-icon :component="LockClosedOutline" /></template>
            </n-input>
            
            <n-input 
              v-model:value="registerForm.confirmPassword" 
              type="password" 
              show-password-on="click" 
              placeholder="确认密码" 
              size="large" 
              round
              :status="registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? 'error' : undefined"
            >
              <template #prefix><n-icon :component="LockClosedOutline" /></template>
            </n-input>
            
            <n-button attr-type="submit" type="info" block round dashed size="large" class="mt-4">
              立即注册
            </n-button>
          </form>
        </n-tab-pane>

      </n-tabs>

      <div class="mt-8">
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink-0 mx-4 text-gray-500 text-xs">社交账号登录</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center gap-6 mt-2 text-sm text-gray-500 font-medium">
           <span class="cursor-pointer hover:text-green-600 hover:scale-105 transition">微信</span>
           <span class="cursor-pointer hover:text-blue-600 hover:scale-105 transition">QQ</span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
:deep(.n-tabs-rail) {
  background-color: rgba(243, 244, 246, 0.7); 
}
</style>