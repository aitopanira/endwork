<script setup>
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NIcon, NDataTable, NImage, NTag, useMessage } from 'naive-ui'
import {
  ArrowBackOutline, PlayCircle,
  MoonOutline, SunnyOutline,
  MusicalNotes, Heart
} from '@vicons/ionicons5'
import { useMusicStore } from '../stores/music'
import axios from 'axios'


const router = useRouter()
const message = useMessage()
const musicStore = useMusicStore()

// === 模拟数据：歌单列表 ===
const playlist = ref([])

const getmusicdata=async()=>{
    try{
    const res=await axios.get('http://127.0.0.1:8000/a/getuser/music/')
    console.log(res.data)
    const data=res.data
    
   // ✅ 2. 核心修复：必须把数据变成“数组”
        if (Array.isArray(data)) {
            // 如果后端直接返回数组，直接用
            playlist.value = data
        } else if (data && typeof data === 'object') {
            // 🔥 如果后端返回的是单个对象（比如你代码里写的 data.id），必须用 [ ] 包起来！
            playlist.value = [data]
        } else {
            playlist.value = []
        }
        
}catch(error){
    console.error('获取歌曲列表失败')
}
}
// === 工具函数 ===
const formatTime = (seconds) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// === 核心逻辑 ===
const toggleTheme = () => {
  musicStore.isDarkMode = !musicStore.isDarkMode
  localStorage.setItem('reader_theme', musicStore.isDarkMode ? 'dark' : 'light')
}

const playAll = () => {
  if (playlist.value.length > 0) playTrack(playlist.value[0], 0)
}

const playTrack = (row, index) => {
  musicStore.playlist = playlist.value
  musicStore.playTrack(index)
}

// === 表格配置 ===
const columns = [
  {
    title: '',
    key: 'index',
    width: 50,
    render: (_, index) => {
      const isCurrent = musicStore.currentIndex === index && musicStore.currentTrack?.id === playlist.value[index].id
      if (isCurrent) return h(NIcon, { size: 18, color: '#ec4141' }, { default: () => h(MusicalNotes) })
      return h('span', { class: 'text-gray-400 font-mono text-xs' }, (index + 1).toString().padStart(2, '0'))
    }
  },
  {
    title: '音乐标题',
    key: 'title',
    render: (row, index) => {
      const isCurrent = musicStore.currentIndex === index && musicStore.currentTrack?.id === row.id
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: `font-medium ${isCurrent ? 'text-[#ec4141]' : ''}` }, row.title),
      ])
    }
  },
  {
    title: '歌手',
    key: 'artist',
    render: (row) => h('span', { class: 'text-gray-500 text-xs' }, row.artist)
  },
  {
    title: '专辑',
    key: 'album',
    render: (row) => h('span', { class: 'text-gray-500 text-xs' }, row.album)
  },
  {
    title: '时长',
    key: 'duration',
    width: 80,
    render: (row) => h('span', { class: 'text-gray-400 font-mono text-xs' }, formatTime(row.duration))
  }
]

const rowProps = (row, index) => {
  const isCurrent = musicStore.currentIndex === index && musicStore.currentTrack?.id === row.id
  return {
    style: 'cursor: pointer;',
    onClick: () => playTrack(row, index),
    class: isCurrent ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
  }
}
onMounted(()=>{
    getmusicdata()
})
</script>

<template>
  <div class="h-screen w-full flex flex-col font-sans overflow-hidden relative transition-colors duration-300" :class="musicStore.isDarkMode ? 'bg-[#121212] text-gray-200' : 'bg-[#fff] text-gray-800'">
    <div class="h-14 flex-none flex justify-between items-center px-4 border-b z-20 transition-colors duration-300" :class="musicStore.isDarkMode ? 'border-gray-800 bg-[#1e1e1e]' : 'border-gray-100 bg-white'">
      <div class="flex items-center gap-3">
        <n-button text circle @click="router.back()">
          <template #icon><n-icon size="22" :component="ArrowBackOutline" /></template>
        </n-button>
        <div class="flex items-baseline gap-2">
          <span class="text-base font-bold">播放列表</span>
          <span class="text-xs opacity-50">{{ playlist.length }}首音乐</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <n-button text circle @click="toggleTheme">
          <template #icon><n-icon size="20" :component="musicStore.isDarkMode ? SunnyOutline : MoonOutline" /></template>
        </n-button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="px-6 py-6 flex items-center gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 mt-1">
            <n-button type="error" round size="small" @click="playAll">
              <template #icon><n-icon :component="PlayCircle" /></template>
              播放全部
            </n-button>
          </div>
        </div>
      </div>
      <n-data-table :columns="columns" :data="playlist" :row-props="rowProps" :bordered="false" :bottom-bordered="false" striped class="text-sm px-2" :class="musicStore.isDarkMode ? 'dark-table' : ''" />
      <div class="h-24"></div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
:deep(.dark-table) {
  --n-td-color: transparent !important;
  --n-td-color-hover: rgba(255, 255, 255, 0.05) !important;
  --n-th-color: #1e1e1e !important;
  --n-th-text-color: rgba(255,255,255,0.6) !important;
  --n-td-text-color: rgba(255,255,255,0.9) !important;
}
:deep(.n-data-table-th) { font-weight: 400; font-size: 12px; color: #999; }
</style>