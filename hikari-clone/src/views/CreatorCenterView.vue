<script setup>
import { ref, h, computed, watch, onMounted } from 'vue' 
import { useRouter } from 'vue-router'
import { 
  NMenu, NForm, NFormItem, NInput, NButton, 
  NUpload, NUploadDragger, NIcon, NText, useMessage
} from 'naive-ui'
import { 
  GameControllerOutline, BookOutline, CloudUploadOutline, 
  PaperPlaneOutline 
} from '@vicons/ionicons5'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

// === 路由拦截：未登录踢回登录页 ===
onMounted(() => {
  if (!userStore.userInfo) {
    message.warning('请先登录后再进入创作者中心')
    router.push('/login')
  }
})

// === 1. 菜单样式 (粉色主题) ===
const menuThemeOverrides = {
  itemColorActive: 'rgba(251, 114, 153, 0.1)',
  itemColorActiveHover: 'rgba(251, 114, 153, 0.15)',
  itemTextColorActive: '#fb7299',
  itemIconColorActive: '#fb7299',
  itemColorHover: 'rgba(251, 114, 153, 0.05)',
  itemTextColorHover: '#fb7299',
  itemIconColorHover: '#fb7299'
}

// === 2. 侧边栏菜单：控制大分区 ===
const activeKey = ref('gal_post') 

const menuOptions = [
  { 
    label: 'Galgame 资讯投稿', 
    key: 'gal_post', 
    icon: () => h(NIcon, null, { default: () => h(GameControllerOutline) }) 
  },
  { 
    label: '轻小说 资讯投稿', 
    key: 'novel_post', 
    icon: () => h(NIcon, null, { default: () => h(BookOutline) }) 
  }
]

// === 3. 表单数据模型 (恢复为单一的 category) ===
const formData = ref({
  title: '',
  content: '', 
  coverFile: null, 
  category: null 
})
const loading = ref(false)

// === 4. 动态计算标题 ===
const pageTitle = computed(() => {
  return activeKey.value === 'gal_post' ? '发布 Galgame 相关资讯' : '发布 轻小说 相关资讯'
})

// === 5. 动态计算下拉框选项 (根据左侧菜单自动切换) ===
const currentCategoryOptions = computed(() => {
  if (activeKey.value === 'gal_post') {
    return [
      { label: 'Galgame 资讯', value: 'gal_news' },
      { label: 'Galgame 点评', value: 'gal_review' }
    ]
  } else {
    return [
      { label: '轻小说资讯', value: 'novel_news' },
      { label: '轻小说点评', value: 'novel_review' }
    ]
  }
})

// === 6. 监听菜单切换，清空下拉框的历史选择 ===
watch(activeKey, () => {
  formData.value.category = null 
})

// === 7. 获取用户选择的文件 ===
const handleUploadChange = (options) => {
  if (options.fileList.length > 0) {
    formData.value.coverFile = options.fileList[0].file
  } else {
    formData.value.coverFile = null
  }
}

// === 8. 提交逻辑 ===
const handleSubmit = async () => {
  if (!formData.value.title) return message.warning('标题不能为空')
  if (!formData.value.category) return message.warning('请选择具体的分类')
  if (!formData.value.content) return message.warning('正文不能为空')
  
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('title', formData.value.title)
    payload.append('content', formData.value.content)
    payload.append('summary', formData.value.content.substring(0, 100))
    payload.append('category', formData.value.category) // 直接传给后端 gal_news 等格式
    payload.append('author', userStore.userInfo.id)
    
    if (formData.value.coverFile) {
      payload.append('cover_file', formData.value.coverFile)
    }

    await axios.post('http://127.0.0.1:8000/a/posts/', payload)
    
    message.success('发布成功！')
    router.push('/') 
  } catch (error) {
    console.error('发布失败:', error)
    message.error('发布失败，请检查网络或后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] flex">
    
    <div class="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
      <div class="p-6">
        <h2 class="font-bold text-xl text-gray-800 flex items-center gap-2">
          <span class="text-pink-500">✨</span> 创作者中心
        </h2>
      </div>
      
      <n-menu 
        v-model:value="activeKey" 
        :options="menuOptions" 
        :theme-overrides="menuThemeOverrides"
        class="flex-grow"
      />

      <div class="p-4 border-t border-gray-100">
        <n-button block dashed @click="router.push('/')">返回首页</n-button>
      </div>
    </div>

    <div class="flex-grow p-8">
      
      <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h2>
          <div class="flex gap-3">
            <n-button type="primary" color="#fb7299" :loading="loading" @click="handleSubmit">
              <template #icon><n-icon :component="PaperPlaneOutline" /></template>
              立即发布
            </n-button>
          </div>
        </div>

        <n-form ref="formRef" :model="formData" label-placement="top">
          
          <n-form-item label="文章标题">
            <n-input v-model:value="formData.title" placeholder="请输入标题" size="large" />
          </n-form-item>

          <n-form-item label="细分领域">
            <select 
              v-model="formData.category" 
              class="w-full h-10 px-3 border border-gray-300 rounded hover:border-[#fb7299] focus:outline-none focus:border-[#fb7299] transition-colors bg-white cursor-pointer text-gray-700"
            >
              <option :value="null" disabled hidden>请选择是资讯还是点评</option>
              <option 
                v-for="opt in currentCategoryOptions" 
                :key="opt.value" 
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </n-form-item>

          <n-form-item label="正文内容">
            <n-input
              v-model:value="formData.content"
              type="textarea"
              placeholder="在这里撰写内容..."
              :autosize="{ minRows: 12 }"
            />
          </n-form-item>

          <n-form-item label="文章封面">
            <n-upload 
              directory-dnd 
              :max="1" 
              :default-upload="false"
              @change="handleUploadChange"
            >
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3" :component="CloudUploadOutline" />
                </div>
                <n-text style="font-size: 16px">点击或拖拽图片到此处</n-text>
                <div class="text-xs text-gray-400 mt-2">建议尺寸 16:9，支持 jpg/png</div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>

        </n-form>
      </div>

    </div>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: auto;
  -moz-appearance: auto;
  appearance: auto;
}
</style>