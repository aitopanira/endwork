<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTabs, NTabPane, NInput, NButton, NCheckbox, NIcon, useMessage } from 'naive-ui'
import { PersonOutline, LockClosedOutline, MailOutline } from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios' // 真实对接后端时请取消注释

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()

const activeTab = ref('login')
const isLoading = ref(false) // 控制登录按钮的加载状态

// === 1. 登录表单数据 ===
const loginForm = ref({ username: '', password: '' })

// === 2. 注册表单数据 ===
const registerForm = ref({ nickname: '', email: '', password: '' })

// 处理登录
const handleLogin = async () => {
  // 1. 基础非空校验
  if (!loginForm.value.username || !loginForm.value.password) {
    message.warning('请输入账号和密码')
    return
  }

  isLoading.value = true // 开始加载（按钮转圈）

  try {
    // ==========================================================
    //  TODO: 这里对接你的真实后端
    // ==========================================================
      const res = await axios.post('http://127.0.0.1:8000/a/getuser/users/', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    // 假设后端返回 code 200 表示成功
    if (res.data.code == 200) 
    {
      // 把后端返回的用户信息传进去（假设数据在 res.data.data 里）
      // 如果你的后端返回结构不一样，请根据 console.log 的结果调整这里
      userStore.login(res.data.data) 
      
      message.success(`欢迎回来，${res.data.data.name || loginForm.value.username}`)

      // 5. 跳转回之前的页面
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    }
    else {
      // 如果 code 不是 200，说明账号密码错误
      throw new Error(res.data.msg || '登录失败')
    }
    

   
   
   
    // // // --- 👇【当前模拟逻辑：仅供测试】👇 ---
    // await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟 0.8秒
    
    // // // 硬编码验证：只有账号 admin 且密码 123456 能过
    // if (loginForm.value.username !== 'admin' || loginForm.value.password !== '123456') {
    //    throw new Error('账号或密码错误 (测试号: admin, 密码: 123456)')
    // }
    // // --- 👆【模拟结束】👆 ---

    // 2. 验证通过：更新状态
    // userStore.login(userStore.login(res.data.data))
    // message.success(`欢迎回来，${loginForm.value.username}`)
    
    // 3. 跳转逻辑：优先跳回原来的页面，否则跳去首页
    // const redirectPath = route.query.redirect || '/'
    // router.push(redirectPath)

  } catch (error) {
    // 4. 失败处理
    console.error(error)
    message.error(error.message || '登录失败，请稍后重试')
  } finally {
    isLoading.value = false // 结束加载
  }
}

// 处理注册
const handleRegister = () => {
  if (!registerForm.value.nickname || !registerForm.value.email || !registerForm.value.password) {
    message.warning('请填写完整的注册信息')
    return
  }

  // 这里建议同样加上 loading 和后端请求逻辑
  userStore.register(registerForm.value.nickname, registerForm.value.email)
  message.success(`注册成功！欢迎你，${registerForm.value.nickname}`)

  const redirectPath = route.query.redirect || '/'
  router.push(redirectPath)
}
</script>

<template>
  <div 
    class="fixed inset-0 flex items-center justify-center bg-cover bg-center"
    style="background-image: url('https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg');"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

    <div class="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl mx-4 animate-fade-in">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-hikari-pink tracking-widest drop-shadow-sm cursor-pointer" @click="router.push('/')">
          Hikarinagi
        </h1>
        <p class="text-xs text-gray-500 mt-2 tracking-wide uppercase">ACGN 爱好者社区</p>
      </div>

      <n-tabs v-model:value="activeTab" size="large" justify-content="space-evenly" animated type="segment">
        
        <n-tab-pane name="login" tab="登 录">
          <form class="mt-6 space-y-6" @submit.prevent="handleLogin">
            <n-input v-model:value="loginForm.username" placeholder="账号 / 邮箱 (admin)" size="large" round>
              <template #prefix><n-icon :component="PersonOutline" class="text-gray-500" /></template>
            </n-input>
            <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="密码 (123456)" size="large" round>
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
            
            <n-input v-model:value="registerForm.email" placeholder="邮箱" size="large" round>
              <template #prefix><n-icon :component="MailOutline" /></template>
            </n-input>
            
            <n-input v-model:value="registerForm.password" type="password" placeholder="设置密码" size="large" round>
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