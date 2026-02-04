<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios, { spread } from 'axios'
import { useUserStore } from '../stores/user'
import { 
  NButton, NSpin, NResult, NUpload, NUploadDragger, 
  NIcon, NText, useMessage, NDrawer, NDrawerContent, 
  NList, NListItem, NEllipsis
} from 'naive-ui'
import { 
  ArrowBackOutline, SaveOutline, BookOutline,
  ArchiveOutline, ListOutline 
} from '@vicons/ionicons5'
import ePub from 'epubjs'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const props = defineProps({
  url: String,
  title: String,
  id: String
})

// 状态管理
const isBookLoaded = ref(false)
const isLoading = ref(false)
const bookTitle = ref(props.title || '') 
const toc = ref([])
const showToc = ref(false)
const currentPage = ref(1) // 默认从第1页开始
const totalPages = ref(0)

let book = null
let rendition = null
let saveTimer = null 

// 手动获取 CSRF Token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

onMounted(() => {
  if (props.url && typeof props.url === 'string' && props.url.trim() !== '') {
    isLoading.value = true
    initBook(props.url)
  } else {
    isLoading.value = false
    console.log('无自动加载链接，等待用户上传...')
  }
})

// === 书籍初始化 ===
const initBook = (source) => {
  try {
    book = ePub(source)
    
    book.ready.then(() => {
      console.log('正在计算页数...')
      // 1000字符/页
      return book.locations.generate(1000)
    }).then(() => {
      isBookLoaded.value = true
      isLoading.value = false
      
      totalPages.value = book.locations.total
      
      if (!bookTitle.value && book.package.metadata.title) {
        bookTitle.value = book.package.metadata.title
      }
      
      if (book.navigation) {
        toc.value = book.navigation.toc
      }
      renderBook()
    }).catch(err => {
      console.error('书籍解析错误:', err)
      message.error('书籍加载失败')
      isLoading.value = false
    })
  } catch (error) {
    console.error('epub.js 初始化错误:', error)
    isLoading.value = false
  }
}

// === 渲染书籍 & 获取进度 ===
// === 渲染书籍 & 获取进度 ===
const renderBook = async () => {
  const uniqueId = props.id || bookTitle.value || 'unknown_book'
  
  rendition = book.renderTo('epub-viewer', {
    width: '100%',
    height: '100%',
    flow: 'paginated', 
    manager: 'default',
    allowScriptedContent: true,
    spread:'always',
    minSpreadWidth: 10000, 
    allowScriptedContent: true
  })

  let targetLocation = null 

  // 1. 尝试获取云端进度
  if (userStore.userInfo && props.id) {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/a/progress/query/?volume_id=${props.id}&user_id=${userStore.userInfo.id}`, {
        withCredentials: true 
      })
      if (res.data.cfi) {
        targetLocation = res.data.cfi
      }
    } catch (e) {
      console.warn('云端进度获取失败或未登录，转为本地')
    }
  }

  // 2. 尝试获取本地进度
  if (!targetLocation) {
    targetLocation = localStorage.getItem(`read_progress_${uniqueId}`)
  }

  // 🔥🔥🔥 核心修复：数据清洗与容错 🔥🔥🔥
  let startPage = 1 // 默认第1页

  if (targetLocation) {
    const parsedPage = parseInt(targetLocation)
    // 检查是否为有效数字 (防止旧的 epubcfi 字符串导致 NaN)
    if (!isNaN(parsedPage) && parsedPage > 0) {
      startPage = parsedPage
      message.success(`回到上次进度：第 ${startPage} 页`)
    } else {
      console.log('发现无效或旧版进度格式，重置为第 1 页')
    }
  }

  try {
    // 将页数转为 CFI
    const cfi = book.locations.cfiFromLocation(startPage)
    
    if (cfi) {
      await rendition.display(cfi)
      currentPage.value = startPage
    } else {
      // 如果算出来的 CFI 是空的（比如页数超出了总页数），回第1页
      await rendition.display()
      currentPage.value = 1
    }
  } catch (err) {
    console.error('渲染出错 (No Section Found)，尝试回滚到首页:', err)
    rendition.display() // 最后的兜底
    currentPage.value = 1
  }

  // 4. 监听翻页
  rendition.on('relocated', (location) => {
    currentPage.value = location.start.location
    autoSaveToCloud() 
  })

  document.addEventListener('keyup', handleKeyUp)
}

// === 翻页 ===
const prevPage = () => { if (rendition) rendition.prev() }
const nextPage = () => { if (rendition) rendition.next() }
const handleKeyUp = (e) => {
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'ArrowRight') nextPage()
}

// === 自动保存 ===
const autoSaveToCloud = () => {
  const currentLocation = rendition.currentLocation()
  if (!currentLocation || !currentLocation.start) return
  
  const pageNum = currentLocation.start.location

  const uniqueId = props.id || bookTitle.value || 'unknown_book'
  localStorage.setItem(`read_progress_${uniqueId}`, pageNum)

  if (!userStore.userInfo) return

  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(async () => {
    try {
      const csrfToken = getCookie('csrftoken')

      await axios.post('http://127.0.0.1:8000/a/progress/sync/', {
        volume_id: props.id,
        user_id: userStore.userInfo.id,
        cfi: pageNum.toString()
      }, {
        withCredentials: true,
        headers: {
            'X-CSRFToken': csrfToken 
        }
      })
      console.log('☁️ 进度(页数)已保存:', pageNum)
    } catch (e) {
      console.error('云同步失败', e)
    }
  }, 1000)
}

// === 手动保存 ===
const saveProgress = async () => {
  if (!rendition) return
  
  const currentLocation = rendition.currentLocation()
  if (!currentLocation || !currentLocation.start) return
  const pageNum = currentLocation.start.location

  const uniqueId = props.id || bookTitle.value || 'unknown_book'
  localStorage.setItem(`read_progress_${uniqueId}`, pageNum)

  if (userStore.userInfo) {
    try {
      const csrfToken = getCookie('csrftoken')
      
      await axios.post('http://127.0.0.1:8000/a/progress/sync/', {
        volume_id: props.id,
        user_id: userStore.userInfo.id,
        cfi: pageNum.toString()
      }, {
        withCredentials: true,
        headers: {
            'X-CSRFToken': csrfToken
        }
      })
      message.success(`已保存到第 ${pageNum} 页 ✅`)
    } catch (e) {
      console.error(e)
      message.error('云端保存失败，已存本地')
    }
  } else {
    message.success('进度已保存到本地 💾')
  }
}

const jumpToChapter = (href) => {
  if (rendition) {
    rendition.display(href)
    showToc.value = false
  }
}

const handleUpload = ({ file }) => {
  const fileObj = file.file
  if (!fileObj) return
  isLoading.value = true
  initBook(fileObj)
}

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp)
  if (saveTimer) clearTimeout(saveTimer)
  if (rendition) {
    try { rendition.destroy() } catch (e) {}
    rendition = null
  }
  if (book) {
    try { if (typeof book.destroy === 'function') book.destroy() } catch (e) {}
    book = null
  }
})
</script>

<template>
  <div class="h-screen w-full bg-[#fcfcfc] flex flex-col overflow-hidden relative font-sans">
    
    <div v-if="isLoading" class="flex-1 flex flex-col justify-center items-center bg-white z-50">
      <n-spin size="large" />
      <p class="mt-4 text-gray-500 font-medium">
         正在加载资源并计算页数，请稍候...<br>
         <span class="text-xs text-gray-400">大文件可能需要几秒钟</span>
      </p>
    </div>

    <div v-else-if="!isBookLoaded" class="flex-1 flex justify-center items-center bg-gray-50">
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

          <div class="flex flex-col">
             <span class="font-bold text-gray-700 truncate max-w-[150px] md:max-w-[200px] text-sm leading-tight">
               {{ bookTitle }}
             </span>
             <span class="text-xs text-gray-400 scale-90 origin-left" v-if="totalPages > 0">
                第 {{ currentPage }} / {{ totalPages }} 页
             </span>
          </div>
        </div>
        
        <div class="flex gap-2">
          <n-button size="small" secondary type="primary" @click="saveProgress">
            <template #icon><n-icon :component="SaveOutline" /></template>
            保存
          </n-button>
        </div>
      </div>

      <div id="epub-viewer" class="flex-1 bg-white"></div>

      <div class="absolute top-14 bottom-0 left-0 w-[15%] z-10 cursor-pointer hover:bg-black/5 transition" @click="prevPage" title="上一页"></div>
      <div class="absolute top-14 bottom-0 right-0 w-[15%] z-10 cursor-pointer hover:bg-black/5 transition" @click="nextPage" title="下一页"></div>

      <n-drawer v-model:show="showToc" :width="320" placement="left">
        <n-drawer-content title="目录" closable>
          <template #header-extra>
             <n-text depth="3" class="text-xs">共 {{ toc.length }} 章</n-text>
          </template>
          <div v-if="toc.length === 0" class="py-10 text-center text-gray-400">暂无目录信息</div>
          <n-list hoverable clickable v-else>
            <n-list-item v-for="(item, index) in toc" :key="index" @click="jumpToChapter(item.href)">
              <div class="flex items-center gap-2 py-1">
                <span class="text-gray-300 text-xs w-6">{{ index + 1 }}</span>
                <n-ellipsis style="max-width: 220px">{{ item.label.trim() }}</n-ellipsis>
              </div>
            </n-list-item>
          </n-list>
        </n-drawer-content>
      </n-drawer>

    </div>
  </div>
</template>

<style>
#epub-viewer iframe {
}
</style>