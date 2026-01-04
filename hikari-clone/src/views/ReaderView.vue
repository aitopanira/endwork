<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NButton, NSpin, NResult, NUpload, NUploadDragger, 
  NIcon, NText, NP, useMessage, NDrawer, NDrawerContent, 
  NList, NListItem, NThing, NEllipsis
} from 'naive-ui'
import { 
  ArrowBackOutline, 
  SaveOutline, 
  BookOutline,
  CloudUploadOutline,
  ArchiveOutline,
  ListOutline, // 新增：目录图标
  CloseOutline 
} from '@vicons/ionicons5'
import ePub from 'epubjs'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 状态管理
const isBookLoaded = ref(false)
const isLoading = ref(false)
const bookTitle = ref('')
const toc = ref([]) // 存放目录数据
const showToc = ref(false) // 控制目录侧边栏显示
const currentChapterName = ref('') // 当前章节名（可选，用于高亮）

// Epub 实例
let book = null
let rendition = null

// 1. 处理文件上传
const handleUpload = ({ file }) => {
  const fileObj = file.file
  if (!fileObj) return
  
  isLoading.value = true
  initBook(fileObj)
}

// 2. 初始化书籍
const initBook = (fileData) => {
  book = ePub(fileData)
  
  book.ready.then(() => {
    isBookLoaded.value = true
    isLoading.value = false
    
    // 获取元数据
    book.package.metadata.title && (bookTitle.value = book.package.metadata.title)
    
    // --- 核心改动：获取目录 ---
    // book.navigation.toc 是一个数组，包含 { label, href, id }
    toc.value = book.navigation.toc
    console.log('目录加载成功:', toc.value)

    // 渲染
    renderBook()
  }).catch(err => {
    console.error(err)
    message.error('书籍解析失败，请检查文件格式')
    isLoading.value = false
  })
}

// 3. 渲染与进度恢复
const renderBook = () => {
  const storageKey = `read_progress_${route.params.id || bookTitle.value}`

  rendition = book.renderTo('epub-viewer', {
    width: '100%',
    height: '100%',
    flow: 'paginated', 
    manager: 'default'
  })

  const savedCfi = localStorage.getItem(storageKey)
  
  if (savedCfi) {
    rendition.display(savedCfi)
    message.success('已自动跳转到上次阅读位置 🔖')
  } else {
    rendition.display()
  }

  // 监听键盘
  document.addEventListener('keyup', handleKeyUp)

  // 监听章节变化（可选：用于更新当前章节名）
  rendition.on('relocated', (location) => {
    // 尝试匹配当前章节
    const chapter = toc.value.find(item => item.href.includes(location.start.href))
    if (chapter) currentChapterName.value = chapter.label
  })
}

// 4. 翻页逻辑
const prevPage = () => rendition && rendition.prev()
const nextPage = () => rendition && rendition.next()

const handleKeyUp = (e) => {
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'ArrowRight') nextPage()
}

// 5. 保存进度
const saveProgress = () => {
  if (!rendition) return
  const currentCfi = rendition.currentLocation().start.cfi
  const storageKey = `read_progress_${route.params.id || bookTitle.value}`
  
  localStorage.setItem(storageKey, currentCfi)
  message.success('进度已保存 💾')
}

// --- 新增：跳转到指定章节 ---
const jumpToChapter = (href) => {
  if (rendition) {
    rendition.display(href)
    showToc.value = false // 关闭侧边栏
  }
}

// 销毁
onBeforeUnmount(() => {
  if (book) book.destroy()
  document.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="h-screen w-full bg-[#fcfcfc] flex flex-col overflow-hidden relative font-sans">
    
    <div v-if="!isBookLoaded" class="flex-1 flex justify-center items-center bg-gray-50">
      <div class="w-full max-w-md p-6">
         <n-result status="info" title="准备阅读" description="请手动上传 EPUB 文件以开始">
          <template #icon><n-icon size="80" color="#3b82f6" :component="BookOutline" /></template>
          <template #footer>
            <n-upload directory-dnd :show-file-list="false" accept=".epub" @change="handleUpload">
              <n-upload-dragger>
                <div style="margin-bottom: 12px"><n-icon size="48" :depth="3" :component="ArchiveOutline" /></div>
                <n-text style="font-size: 16px">点击或拖拽 EPUB 文件到此处</n-text>
              </n-upload-dragger>
            </n-upload>
          </template>
        </n-result>
      </div>
    </div>

    <div v-else class="flex-1 relative flex flex-col">
      
      <div class="h-14 bg-white/95 backdrop-blur border-b border-gray-100 flex justify-between items-center px-4 z-20 shadow-sm">
        <div class="flex items-center gap-3">
          <n-button text @click="router.back()">
            <template #icon><n-icon :component="ArrowBackOutline" /></template>
          </n-button>
          
          <n-button secondary size="small" @click="showToc = true">
            <template #icon><n-icon :component="ListOutline" /></template>
            目录
          </n-button>

          <span class="font-bold text-gray-700 truncate max-w-[150px] md:max-w-[300px] text-sm md:text-base">
            {{ bookTitle }}
          </span>
        </div>
        
        <div class="flex gap-2">
          <n-button size="small" secondary type="primary" @click="saveProgress">
            <template #icon><n-icon :component="SaveOutline" /></template>
            保存
          </n-button>
        </div>
      </div>

      <div id="epub-viewer" class="flex-1 bg-white"></div>

      <div class="absolute top-14 bottom-0 left-0 w-[20%] z-10 cursor-pointer" @click="prevPage" title="上一页"></div>
      <div class="absolute top-14 bottom-0 right-0 w-[20%] z-10 cursor-pointer" @click="nextPage" title="下一页"></div>

      <n-drawer v-model:show="showToc" :width="320" placement="left">
        <n-drawer-content title="目录" closable>
          <template #header-extra>
             <n-text depth="3" class="text-xs">共 {{ toc.length }} 章</n-text>
          </template>
          
          <div v-if="toc.length === 0" class="py-10 text-center text-gray-400">
            暂无目录信息
          </div>

          <n-list hoverable clickable v-else>
            <n-list-item v-for="(item, index) in toc" :key="index" @click="jumpToChapter(item.href)">
              <div class="flex items-center gap-2 py-1">
                <span class="text-gray-300 text-xs w-6">{{ index + 1 }}</span>
                <n-ellipsis style="max-width: 220px">
                  {{ item.label.trim() }}
                </n-ellipsis>
              </div>
            </n-list-item>
          </n-list>
        </n-drawer-content>
      </n-drawer>

    </div>
  </div>
</template>

<style>
/* 隐藏 iframe 默认滚动条 */
#epub-viewer iframe {
  /* pointer-events: none; 如果需要鼠标选字，请注释掉这一行；如果翻页体验优先，保留这一行 */
}
</style>