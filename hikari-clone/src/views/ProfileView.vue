<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { 
  NTabs, NTabPane, NInput, NButton, NAvatar, NTag, NIcon, 
  NSelect, NModal, NCard, NForm, NFormItem, useMessage,
  NSpin 
} from 'naive-ui'
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
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

const loading = ref(true)
const myPosts = ref([])

onMounted(() => {
  if (!userStore.userInfo) {
    router.push('/login')
  } else {
    fetchMyPosts() 
  }
})

// 控制弹窗显示
const showAvatarModal = ref(false)
const showEditModal = ref(false)

const expPercentage = computed(() => {
  if (!userStore.userInfo) return '0%'
  const current = userStore.userInfo.currentExp || userStore.userInfo.exp || 0
  const next = userStore.userInfo.nextLevelExp || 100
  const pct = (current / next) * 100
  return Math.min(pct, 100).toFixed(1) + '%'
})

// 初始化编辑表单数据
const editForm = ref({
  name: userStore.userInfo?.name || '',
  bio: userStore.userInfo?.bio || '',
  gender: userStore.userInfo?.gender || '保密', 
  avatar: userStore.userInfo?.avatar || ''      
})

const presetAvatars = [
  'https://touxiang.aihikari.xyz/%E5%A4%B4%E5%83%8F/a0.jpg',
  'https://touxiang.aihikari.xyz/%E5%A4%B4%E5%83%8F/a.jpg',
  'https://touxiang.aihikari.xyz/%E5%A4%B4%E5%83%8F/a4.jpg',
  'https://touxiang.aihikari.xyz/%E5%A4%B4%E5%83%8F/a3.jpg',
]

const genderOptions = [
  { label: '保密', value: '保密' },
  { label: '男', value: '男' },
  { label: '女', value: '女' },
  { label: '沃尔玛购物袋', value: '沃尔玛购物袋' }
]

// === 💡 核心修改区：点击头像直接发送请求并生效 ===
const selectAvatar = async (url) => {
  editForm.value.avatar = url
  showAvatarModal.value = false 
  
  try {
    // 直接向后端发起 PATCH 请求，只更新头像字段
    const res = await axios.patch(`http://127.0.0.1:8000/a/users/${userStore.userInfo.id}/`, {
      avatar: url
    })

    // 更新前端的全局用户状态，让页面立刻显示新头像
    userStore.updateProfile({ 
      ...userStore.userInfo, 
      avatar: res.data.avatar
    })

    message.success('头像更换成功！')
  } catch (error) {
    console.error('更换头像失败:', error)
    message.error('头像更换失败，请检查网络或稍后再试')
  }
}

const handleSave = async () => {
  if (!editForm.value.name.trim()) {
    message.warning('昵称不能为空')
    return
  }

  try {
    const res = await axios.patch(`http://127.0.0.1:8000/a/users/${userStore.userInfo.id}/`, {
      name: editForm.value.name,
      bio: editForm.value.bio,
      avatar: editForm.value.avatar,
      gender: editForm.value.gender 
      
    })

    userStore.updateProfile({ 
      ...userStore.userInfo, 
      name: res.data.name, 
      bio: res.data.bio,
      avatar: res.data.avatar,
      gender: res.data.gender 
    })

    message.success('保存个人资料成功！')
    showEditModal.value = false 
  } catch (error) {
    console.error('更新资料失败:', error)
    message.error('保存失败，请检查网络或稍后再试')
  }
}

const fetchMyPosts = async () => {
  if (!userStore.userInfo?.id) return
  
  loading.value = true
  try {
    const res = await axios.get(`http://127.0.0.1:8000/a/posts/?author=${userStore.userInfo.id}`)
    myPosts.value = res.data
  } catch (error) {
    console.error('获取我的文章失败:', error)
    message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

const myNews = computed(() => {
  return myPosts.value.filter(post => 
    post.category === 'gal_news' || post.category === 'novel_news'
  )
})

const myReviews = computed(() => {
  return myPosts.value.filter(post => 
    post.category === 'gal_review' || post.category === 'novel_review'
  )
})

</script>

<template>
  <div v-if="userStore.userInfo" class="min-h-screen bg-[#f4f5f7]">
    
    <div class="h-[240px] w-full bg-cover bg-center relative group" 
         style="background-image: url('https://bizhi.aihikari.xyz/a0.png');">
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
          <span class="flex items-center gap-1 cursor-pointer hover:text-hikari-blue h-[60px] transition" @click="router.push('/library')">
            <n-icon :component="HeartOutline"/> 收藏
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
                :src="userStore.userInfo.avatar" 
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
            <span class="font-bold text-gray-700">等级 Lv.{{ userStore.userInfo.level || 1 }}</span>
            <span class="text-xs text-gray-400">经验 {{ userStore.userInfo.exp || userStore.userInfo.currentExp || 0 }}/100</span>
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
             <span>UID: {{ userStore.userInfo.id }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 border-b pb-3">
             <n-icon :component="MaleFemaleOutline" /> 
             <span>性别: {{ userStore.userInfo.gender || '保密' }}</span>
          </div>
         
        </div>

      </aside>

      <main class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
          <n-tabs type="segment" animated class="p-4">
            
            <n-tab-pane name="posts" tab="我的资讯">
              <div v-if="loading" class="py-20 flex justify-center">
                <n-spin size="large" />
              </div>
              <div v-else-if="myNews.length === 0" class="py-20 text-center text-gray-400">
                暂无资讯记录
              </div>
              <div v-else class="space-y-4 mt-2">
                <PostCard v-for="post in myNews" :key="post.id" :post="post" />
              </div>
            </n-tab-pane>
            
            <n-tab-pane name="reviews" tab="我的点评">
               <div v-if="loading" class="py-20 flex justify-center">
                <n-spin size="large" />
              </div>
              <div v-else-if="myReviews.length === 0" class="py-20 text-center text-gray-400">
                暂无点评记录
              </div>
              <div v-else class="space-y-4 mt-2">
                <PostCard v-for="post in myReviews" :key="post.id" :post="post" />
              </div>
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
               <n-avatar shape="square" :size="100" :src="editForm.avatar" class="rounded-xl border-2 border-gray-100" />
               <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition flex items-center justify-center text-white">
                 <n-icon size="24" :component="CameraOutline" />
               </div>
            </div>
          </div>

          <n-form label-placement="left" label-width="80">
            <n-form-item label="昵称">
              <n-input v-model:value="editForm.name" placeholder="请输入昵称" disabled />
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