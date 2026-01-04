<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { NTabs, NTabPane, NInput, NButton, NAvatar, NTag, NIcon, NCard, NDivider, NProgress } from 'naive-ui'
import { 
  CreateOutline, 
  HeartOutline, 
  SettingsOutline, 
  LocationOutline, 
  CalendarOutline, 
  IdCardOutline,
  MaleFemaleOutline
} from '@vicons/ionicons5'
import PostCard from '../components/PostCard.vue'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (!userStore.userInfo) {
    router.push('/login')
  }
})

const editForm = ref({
  name: userStore.userInfo?.name || '',
  bio: userStore.userInfo?.bio || ''
})

const handleSave = () => {
  userStore.updateProfile({ name: editForm.value.name, bio: editForm.value.bio })
  window.$message?.success('保存个人资料成功！')
}

// 模拟动态数据
const myPosts = [
  {
    id: 1,
    title: '【新人报道】刚才注册了账号，请多关照！',
    summary: '这是我在Hikarinagi发的第一条动态...',
    author: userStore.userInfo?.name || '我',
    date: '刚刚',
    views: 1,
    comments: 0,
    tag: '日常',
    cover: null
  }
]
</script>

<template>
  <div v-if="userStore.userInfo" class="min-h-screen bg-[#f4f5f7]">
    
    <div class="h-[240px] w-full bg-cover bg-center relative group" 
         style="background-image: url('https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg');">
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      <div class="absolute bottom-4 left-8 text-white z-10 hidden md:block">
        <h1 class="text-2xl font-bold shadow-sm tracking-wide">{{ userStore.userInfo.name }}</h1>
        <p class="text-sm opacity-90 mt-1 shadow-sm">{{ userStore.userInfo.bio || '这个人很懒，什么都没有写~' }}</p>
      </div>
    </div>

    <div class="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
      <div class="container mx-auto px-4 relative h-[60px] flex items-center justify-between">
        
        <div class="flex gap-8 text-gray-600 font-medium">
          <span class="flex items-center gap-1 cursor-pointer text-hikari-pink border-b-2 border-hikari-pink h-[60px]">
            <n-icon :component="CreateOutline"/> 主页
          </span>
          <span class="flex items-center gap-1 cursor-pointer hover:text-hikari-blue h-[60px] transition">
            <n-icon :component="HeartOutline"/> 收藏
          </span>
          <span class="flex items-center gap-1 cursor-pointer hover:text-hikari-blue h-[60px] transition">
            <n-icon :component="SettingsOutline"/> 设置
          </span>
        </div>

        <div class="flex gap-6 text-center text-sm items-center">
          <div>
            <div class="font-bold text-gray-800">12</div>
            <div class="text-gray-400 text-xs">关注</div>
          </div>
          <div>
            <div class="font-bold text-gray-800">0</div>
            <div class="text-gray-400 text-xs">粉丝</div>
          </div>
          <n-button size="small" type="primary" secondary round>
            编辑资料
          </n-button>
        </div>

      </div>
    </div>

    <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-30">
      
      <aside class="lg:col-span-1 space-y-4">

        <div class="-mt-[70px] mb-2 relative z-40 inline-block">
           <div class="border-4 border-white rounded-xl overflow-hidden shadow-lg bg-white">
             <n-avatar 
               shape="square" 
               :size="140" 
               :src="userStore.userInfo.avatar" 
               class="block"
             />
           </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-gray-700">等级 Lv.{{ userStore.userInfo.level }}</span>
            <span class="text-xs text-gray-400">经验 233/500</span>
          </div>
          <n-progress type="line" :percentage="46" color="#fb7299" :height="6" :show-indicator="false" />
          
          <div class="mt-4 flex flex-wrap gap-2">
            <n-tag size="small" type="warning" round>高级会员</n-tag>
            <n-tag size="small" type="info" round>Galgame 鉴赏家</n-tag>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-sm space-y-3">
          <div class="flex items-center gap-2 text-gray-600 border-b pb-3">
             <n-icon :component="IdCardOutline" /> 
             <span>UID: 33764</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 border-b pb-3">
             <n-icon :component="MaleFemaleOutline" /> 
             <span>性别: 保密</span>
          </div>
          <!-- <div class="flex items-center gap-2 text-gray-600 border-b pb-3">
             <n-icon :component="LocationOutline" /> 
             <span>IP属地: 未知</span>
          </div> -->
          <div class="flex items-center gap-2 text-gray-600">
             <n-icon :component="CalendarOutline" /> 
             <span>注册时间: 2025-10-11</span>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-700 mb-3 text-sm">佩戴勋章</h3>
          <div class="grid grid-cols-4 gap-2">
            <img src="https://via.placeholder.com/40/ffd700/ffffff?text=Lv1" class="rounded hover:scale-110 transition cursor-pointer" title="萌新上路">
            <img src="https://via.placeholder.com/40/c0c0c0/ffffff?text=Sign" class="rounded hover:scale-110 transition cursor-pointer" title="签到达人">
          </div>
        </div>

      </aside>

      <main class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="segment" animated class="p-4">
            <n-tab-pane name="dynamic" tab="我的动态">
              <div class="space-y-4 mt-2">
                <PostCard v-for="post in myPosts" :key="post.id" :post="post" />
              </div>
            </n-tab-pane>
            
            <n-tab-pane name="article" tab="投稿文章">
               <div class="py-10 text-center text-gray-400">暂无投稿</div>
            </n-tab-pane>
            
            <n-tab-pane name="reply" tab="我的回复">
               <div class="py-10 text-center text-gray-400">暂无回复</div>
            </n-tab-pane>

             <n-tab-pane name="setting" tab="编辑资料">
               <div class="max-w-lg p-4">
                 <div class="mb-4">
                   <label class="block text-gray-700 mb-1">昵称</label>
                   <n-input v-model:value="editForm.name" placeholder="请输入昵称" />
                 </div>
                 <div class="mb-4">
                   <label class="block text-gray-700 mb-1">个性签名</label>
                   <n-input type="textarea" v-model:value="editForm.bio" placeholder="介绍一下自己" />
                 </div>
                 <n-button type="primary" @click="handleSave">保存修改</n-button>
               </div>
             </n-tab-pane>
          </n-tabs>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
.n-avatar {
  background-color: #fff;
}
</style>