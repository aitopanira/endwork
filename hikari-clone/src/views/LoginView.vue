<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NTabs, NTabPane, NInput, NButton, NCheckbox, NIcon } from 'naive-ui'
// 引入图标：这次只用了 Person (人), Lock (锁), Mail (信封)
import { PersonOutline, LockClosedOutline, MailOutline } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const activeTab = ref('login')

const loginForm = ref({ username: '', password: '' })

const handleLogin = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    window.$message?.warning('请输入账号和密码') // 如果没配 MessageProvider，这行可能不弹窗，但不影响运行
    return
  }
  
  // 模拟登录成功，跳转
  const jumpUrl = route.query.jumpTo || '/'
  router.push(jumpUrl)
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
          <div class="mt-6 space-y-6">
            <n-input v-model:value="loginForm.username" placeholder="账号 / 邮箱" size="large" round>
              <template #prefix>
                <n-icon :component="PersonOutline" class="text-gray-500" />
              </template>
            </n-input>
            
            <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="密码" size="large" round>
              <template #prefix>
                <n-icon :component="LockClosedOutline" class="text-gray-500" />
              </template>
            </n-input>

            <div class="flex justify-between items-center text-sm px-1">
              <n-checkbox>自动登录</n-checkbox>
              <a href="#" class="text-gray-500 hover:text-hikari-pink transition">忘记密码?</a>
            </div>

            <n-button type="primary" block round size="large" color="#fb7299" @click="handleLogin" class="shadow-lg">
              <span class="font-bold tracking-widest">进入社区</span>
            </n-button>
          </div>
        </n-tab-pane>

        <n-tab-pane name="register" tab="注 册">
          <div class="mt-6 space-y-4">
            <n-input placeholder="昵称" size="large" round>
              <template #prefix><n-icon :component="PersonOutline" /></template>
            </n-input>
            <n-input placeholder="邮箱" size="large" round>
              <template #prefix><n-icon :component="MailOutline" /></template>
            </n-input>
            <n-input type="password" placeholder="设置密码" size="large" round>
              <template #prefix><n-icon :component="LockClosedOutline" /></template>
            </n-input>
            
            <n-button type="info" block round dashed size="large" class="mt-4">
              立即注册
            </n-button>
          </div>
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
/* 修改 Tab 轨道颜色 */
:deep(.n-tabs-rail) {
  background-color: rgba(243, 244, 246, 0.7); 
}
</style>