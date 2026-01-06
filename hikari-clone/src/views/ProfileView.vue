<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { NTabs, NTabPane, NInput, NButton, NAvatar, NTag, NIcon, NSelect, NModal, NCard, NForm, NFormItem } from 'naive-ui'
import { 
  CreateOutline, 
  HeartOutline, 
  SettingsOutline, 
  CalendarOutline, 
  IdCardOutline,
  MaleFemaleOutline,
  CameraOutline
} from '@vicons/ionicons5'
import PostCard from '../components/PostCard.vue'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (!userStore.userInfo) {
    router.push('/login')
  }
})

// 控制弹窗显示
const showAvatarModal = ref(false)
const showEditModal = ref(false)

const expPercentage = computed(() => {
  if (!userStore.userInfo) return '0%'
  const pct = (userStore.userInfo.currentExp / userStore.userInfo.nextLevelExp) * 100
  return Math.min(pct, 100).toFixed(1) + '%'
})

const editForm = ref({
  name: userStore.userInfo?.name || '',
  bio: userStore.userInfo?.bio || '',
  gender: userStore.userInfo?.gender || '保密', 
  avatar: userStore.userInfo?.avatar || ''      
})

const presetAvatars = [
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg',
  'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
]

const genderOptions = [
  { label: '保密', value: '保密' },
  { label: '男', value: '男' },
  { label: '女', value: '女' },
  { label: '沃尔玛购物袋', value: '沃尔玛购物袋' }
]

const selectAvatar = (url) => {
  editForm.value.avatar = url
  showAvatarModal.value = false 
}

const handleSave = () => {
  userStore.updateProfile({ 
    name: editForm.value.name, 
    bio: editForm.value.bio,
    gender: editForm.value.gender,
    avatar: editForm.value.avatar
  })
  window.$message?.success('保存个人资料成功！')
  showEditModal.value = false 
}

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
       
          <n-button size="small" color="#fb7299" secondary round @click="showEditModal = true">
            编辑资料
          </n-button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-30">
      
      <aside class="lg:col-span-1 space-y-4">

        <div class="-mt-[70px] mb-2 relative z-40 inline-block group cursor-pointer" @click="showAvatarModal = true">
            <div class="border-4 border-white rounded-xl overflow-hidden shadow-lg bg-white relative">
              <n-avatar 
                shape="square" 
                :size="140" 
                :src="editForm.avatar || userStore.userInfo.avatar" 
                class="block transition-transform group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                <n-icon size="30" :component="CameraOutline" />
                <span class="text-xs mt-1 font-bold">更换头像</span>
              </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-gray-700">等级 Lv.{{ userStore.userInfo.level }}</span>
            <span class="text-xs text-gray-400">经验 {{ userStore.userInfo.currentExp }}/{{ userStore.userInfo.nextLevelExp }}</span>
          </div>
          <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-yellow-400 rounded-full transition-all duration-500" :style="{ width: expPercentage }"></div>
          </div>
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
             <span>性别: {{ userStore.userInfo.gender || '保密' }}</span>
          </div>
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
            
            <n-tab-pane name="articles" tab="发布文章">
              <div class="space-y-4 mt-2">
                <PostCard v-for="post in myPosts" :key="post.id" :post="post" />
              </div>
            </n-tab-pane>
            
            <n-tab-pane name="galgames" tab="发布Galgame">
               <div class="py-10 text-center text-gray-400">暂无 Galgame 投稿</div>
            </n-tab-pane>
            
            <n-tab-pane name="novels" tab="发布轻小说">
               <div class="py-10 text-center text-gray-400">暂无轻小说投稿</div>
            </n-tab-pane>

          </n-tabs>
        </div>
      </main>

    </div>

    <n-modal v-model:show="showEditModal">
      <n-card
        style="width: 500px"
        title="编辑个人资料"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="space-y-6">
          <div class="flex justify-center mb-4">
            <div class="relative group cursor-pointer" @click="showAvatarModal = true">
               <n-avatar shape="square" :size="100" :src="editForm.avatar || userStore.userInfo.avatar" class="rounded-xl border-2 border-gray-100" />
               <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center text-white">
                 <n-icon size="24" :component="CameraOutline" />
               </div>
            </div>
          </div>

          <n-form label-placement="left" label-width="80">
            <n-form-item label="昵称">
              <n-input v-model:value="editForm.name" placeholder="请输入昵称" />
            </n-form-item>
            <n-form-item label="性别">
              <n-select v-model:value="editForm.gender" :options="genderOptions" placeholder="请选择性别" />
            </n-form-item>
            <n-form-item label="个性签名">
              <n-input type="textarea" v-model:value="editForm.bio" placeholder="介绍一下自己" :rows="3" />
            </n-form-item>
          </n-form>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <n-button @click="showEditModal = false">取消</n-button>
            <n-button color="#fb7299" @click="handleSave">保存修改</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showAvatarModal">
      <n-card
        style="width: 400px"
        title="选择你喜欢的头像"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="grid grid-cols-2 gap-4 justify-items-center">
          <div 
            v-for="(url, index) in presetAvatars" 
            :key="index"
            @click="selectAvatar(url)"
            class="cursor-pointer rounded-xl p-1 border-4 transition hover:scale-105 shadow-sm"
            :class="editForm.avatar === url ? 'border-hikari-pink' : 'border-transparent hover:border-gray-200'"
          >
            <n-avatar shape="square" :size="90" :src="url" class="rounded-lg" />
          </div>
        </div>
        <div class="mt-6 text-center text-gray-400 text-xs">
          点击头像即可选中
        </div>
      </n-card>
    </n-modal>

  </div>
</template>

<style scoped>
.n-avatar {
  background-color: #fff;
}
</style>