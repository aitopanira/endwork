<script setup>
import { ref, h } from 'vue' 
import { useRouter } from 'vue-router'
import { 
  NLayout, NLayoutSider, NMenu, NForm, NFormItem, NInput, NSelect, NButton, 
  NUpload, NUploadDragger, NIcon, NText, NP, useMessage, NCard, NStatistic, NGrid, NGi
} from 'naive-ui'
import { 
  HomeOutline, CreateOutline, GameControllerOutline, BookOutline, 
  CloudUploadOutline, SaveOutline, PaperPlaneOutline 
} from '@vicons/ionicons5'
import { useCommunityStore } from '../stores/community'
import { useResourceStore } from '../stores/resources'
import { useUserStore } from '../stores/user'

const router = useRouter()
const message = useMessage()
const communityStore = useCommunityStore()
const resourceStore = useResourceStore()
const userStore = useUserStore()

// === 1. 新增：菜单颜色主题覆盖 (粉色系) ===
const menuThemeOverrides = {
  itemColorActive: 'rgba(251, 114, 153, 0.1)',      // 选中项背景：淡粉色
  itemColorActiveHover: 'rgba(251, 114, 153, 0.15)', // 选中悬停：稍深的淡粉色
  itemTextColorActive: '#fb7299',                    // 选中文字颜色：粉色
  itemIconColorActive: '#fb7299',                    // 选中图标颜色：粉色
  itemColorHover: 'rgba(251, 114, 153, 0.05)',       // 未选中悬停背景：极淡粉色
  itemTextColorHover: '#fb7299',                     // 未选中悬停文字：粉色
  itemIconColorHover: '#fb7299'                      // 未选中悬停图标：粉色
}

// === 侧边栏导航 ===
const activeKey = ref('dashboard')
const menuOptions = [
  { label: '创作仪表盘', key: 'dashboard', icon: () => h(NIcon, null, { default: () => h(HomeOutline) }) },
  { label: '发布帖子 (社区)', key: 'post', icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) },
  { label: '投稿 Galgame', key: 'galgame', icon: () => h(NIcon, null, { default: () => h(GameControllerOutline) }) },
  { label: '投稿 轻小说', key: 'novel', icon: () => h(NIcon, null, { default: () => h(BookOutline) }) },
]

// === 表单数据 ===
const formData = ref({
  title: '',
  content: '', 
  tag: null,
  cover: null,
  developer: '', 
  author: '',    
  originalTitle: '',
  date: null
})

// === 提交逻辑 ===
const handleSubmit = () => {
  if (!formData.value.title) return message.warning('标题不能为空')

  // 1. 社区帖子投稿
  if (activeKey.value === 'post') {
    communityStore.addPost({
      title: formData.value.title,
      summary: formData.value.content,
      author: userStore.userInfo?.name || '匿名用户',
      avatar: userStore.userInfo?.avatar || '',
      tag: formData.value.tag || '日常',
      image: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' 
    })
    message.success('帖子发布成功！')
    router.push('/community')
  } 
  // 2. Galgame 投稿
  else if (activeKey.value === 'galgame') {
    resourceStore.addGalgame({
      title: formData.value.title,
      originalTitle: formData.value.originalTitle,
      developer: formData.value.developer,
      description: `<p>${formData.value.content}</p>`,
      tags: [formData.value.tag || '新作'],
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg'
    })
    message.success('Galgame 词条提交成功！')
    router.push('/galgame')
  }
  // 3. 轻小说 投稿
  else if (activeKey.value === 'novel') {
    resourceStore.addNovel({
      title: formData.value.title,
      author: formData.value.author,
      description: `<p>${formData.value.content}</p>`,
      tags: [formData.value.tag || '轻小说'],
      cover: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg'
    })
    message.success('轻小说 词条提交成功！')
    router.push('/novel')
  }
}
</script>

<template>
  <div class="h-[calc(100vh-64px)] bg-[#f9fafb] flex">
    
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

    <div class="flex-grow overflow-y-auto p-8">
      
      <div v-if="activeKey === 'dashboard'" class="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来，{{ userStore.userInfo?.name || '旅行者' }}</h1>
          <p class="text-gray-500">今天想分享些什么有趣的内容呢？</p>
        </div>

        <n-grid x-gap="12" :cols="3">
          <n-gi>
            <n-card>
              <n-statistic label="我的帖子" value="12" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card>
              <n-statistic label="获得的赞" value="1,204" />
            </n-card>
          </n-gi>
          <n-gi>
            <n-card>
              <n-statistic label="创作等级" value="Lv.3" />
            </n-card>
          </n-gi>
        </n-grid>

        <n-card title="创作草稿箱" size="small">
          <div class="py-8 text-center text-gray-400">暂无草稿</div>
        </n-card>
      </div>

      <div v-else class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        <div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 class="text-xl font-bold text-gray-800">
            {{ activeKey === 'post' ? '发布新帖子' : activeKey === 'galgame' ? '提交 Galgame 词条' : '提交轻小说词条' }}
          </h2>
          <div class="flex gap-3">
            <n-button secondary color="#fb7299">
              <template #icon><n-icon :component="SaveOutline" /></template>
              存草稿
            </n-button>
            <n-button type="primary" color="#fb7299" @click="handleSubmit">
              <template #icon><n-icon :component="PaperPlaneOutline" /></template>
              立即发布
            </n-button>
          </div>
        </div>

        <n-form ref="formRef" :model="formData" label-placement="top">
          
          <n-form-item label="标题 / 名称">
            <n-input v-model:value="formData.title" placeholder="请输入标题" size="large" />
          </n-form-item>

          <div v-if="activeKey !== 'post'" class="grid grid-cols-2 gap-4">
            <n-form-item label="原名 (Original Title)">
              <n-input v-model:value="formData.originalTitle" placeholder="日语原名" />
            </n-form-item>
            
            <n-form-item :label="activeKey === 'galgame' ? '开发商 (Developer)' : '作者 (Author)'">
              
              <n-input 
                v-if="activeKey === 'galgame'" 
                v-model:value="formData.developer" 
                placeholder="请输入开发商"
              />
              
              <n-input 
                v-else 
                v-model:value="formData.author" 
                placeholder="请输入作者"
              />
            </n-form-item>
          </div>

          <n-form-item :label="activeKey === 'post' ? '正文内容' : '剧情简介'">
            <n-input
              v-model:value="formData.content"
              type="textarea"
              placeholder="支持 Markdown 语法..."
              :autosize="{ minRows: 8 }"
            />
          </n-form-item>

          <n-form-item label="选择标签">
            <n-select 
              v-model:value="formData.tag" 
              :options="[
                { label: '闲聊', value: '闲聊' }, 
                { label: '评测', value: '评测' },
                { label: '资讯', value: '资讯' },
                { label: '攻略', value: '攻略' },
                { label: '新作', value: '新作' }
              ]" 
            />
          </n-form-item>

          <n-form-item label="上传封面/配图">
            <n-upload directory-dnd :max="1">
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3" :component="CloudUploadOutline" />
                </div>
                <n-text style="font-size: 16px">点击或拖拽图片到此处</n-text>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>

        </n-form>
      </div>

    </div>
  </div>
</template>