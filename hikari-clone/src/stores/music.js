import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
// ✅ 1. 引入现代元数据解析库 (记得 npm install music-metadata-browser)
import * as mm from 'music-metadata-browser'

export const useMusicStore = defineStore('music', () => {
  // === State ===
  // 初始为空，等待后端拉取
  const playlist = ref([])
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(50)
  const isDarkMode = ref(localStorage.getItem('reader_theme') === 'dark')

  // 封面缓存 (避免重复解析同一首歌)
  const coverCache = new Map()
  // 默认封面 (在解析完成前显示)
  const defaultCover = "https://picsum.photos/300/300?grayscale"

  // 音频元素引用
  let audioEl = null

  // === Getters ===
  const currentTrack = computed(() => {
    if (playlist.value.length === 0) return null
    return playlist.value[currentIndex.value]
  })

  // === Actions: 数据获取 ===
const fetchPlaylist = async () => {
    try {
      const res = await axios.get('/a/music/')
      
      // 🔍 调试打印：看看后端到底返了什么
      console.log('Django 返回的原始数据:', res.data)

      let rawData = []

      // 🛡️ 兼容性处理：无论后端返回 Array 还是 Object，都强行转成 Array
      if (Array.isArray(res.data)) {
        // 情况 A: 后端分页已关，直接就是数组 [{}, {}]
        rawData = res.data
      } else if (res.data && Array.isArray(res.data.results)) {
        // 情况 B: 后端分页未关，数据在 results 里 { count: 10, results: [{}, {}] }
        rawData = res.data.results
      } else {
        console.error('⚠️ 数据格式严重错误，既不是数组也就没有 results 字段:', res.data)
        rawData = [] // 兜底为空数组，防止报错
      }

      // 赋值
      if (rawData.length > 0) {
        playlist.value = rawData.map(track => ({
          ...track,
          cover: defaultCover 
        }))
        console.log('✅ 成功载入歌曲:', playlist.value.length, '首')
      } else {
        playlist.value = [] // 确保是空数组
      }

    } catch (error) {
      console.error('❌ 获取歌单失败:', error)
      playlist.value = [] // 出错也要重置为空数组
    }
  }

  // === Actions: 封面解析 (核心黑科技) ===
  const extractCover = async (track) => {
    // 1. 如果这首歌已经解析过，直接用缓存
    if (coverCache.has(track.id)) {
      track.cover = coverCache.get(track.id)
      return
    }

    // 2. 如果是 http 开头的远程音频，尝试解析
    if (!track.url) return

    try {
      // 使用 music-metadata-browser 读取音频元数据
      // ⚠️ 注意：这需要 Cloudflare R2 配置允许跨域 (CORS)
      const metadata = await mm.fetchFromUrl(track.url)
      
      // 获取图片数据
      const picture = metadata.common.picture?.[0]
      
      if (picture) {
        // 将二进制 Buffer 转为 Base64 字符串
        let base64String = ""
        for (let i = 0; i < picture.data.length; i++) {
          base64String += String.fromCharCode(picture.data[i])
        }
        const base64 = `data:${picture.format};base64,${window.btoa(base64String)}`
        
        // 更新封面并写入缓存
        track.cover = base64
        coverCache.set(track.id, base64)
        console.log(`✅ 封面解析成功: ${track.title}`)
      } else {
        console.log(`⚠️ 该歌曲无内置封面: ${track.title}`)
      }
    } catch (error) {
      console.error(`❌ 封面解析失败 (${track.title}):`, error.message)
    }
  }

  // === Actions: 播放控制 ===
  const setAudioElement = (el) => {
    audioEl = el
    if (audioEl) audioEl.volume = volume.value / 100
  }

  const togglePlay = () => {
    if (!audioEl || !currentTrack.value) return
    if (isPlaying.value) audioEl.pause()
    else audioEl.play()
    isPlaying.value = !isPlaying.value
  }

  const playTrack = (index) => {
  if (!playlist.value[index]) return
 
    // 🔥 新增：切歌前先重置状态，防止 UI 跳变
    currentTime.value = 0
    duration.value = 0 
    
    currentIndex.value = index
    isPlaying.value = true

setTimeout(() => {
   if (audioEl) audioEl.play().catch(e => console.log('等待交互:', e))
  }, 100)

  extractCover(playlist.value[index])
 }
  const prevTrack = () => {
    let index = currentIndex.value - 1
    if (index < 0) index = playlist.value.length - 1
    playTrack(index)
  }

  const nextTrack = () => {
    let index = currentIndex.value + 1
    if (index >= playlist.value.length) index = 0
    playTrack(index)
  }

  const seek = (time) => {
    if (audioEl) {
      audioEl.currentTime = time
      currentTime.value = time
    }
  }

  // === 监听器 ===
  const onTimeUpdate = (e) => { currentTime.value = e.target.currentTime }
  
  const onLoadedMetadata = (e) => { 
    // 如果后端数据库没有存时长，这里可以作为兜底
    // 但建议优先使用数据库存的时长，因为加载文件需要时间
        duration.value = e.target.duration 
    
  }

  watch(volume, (val) => {
    if (audioEl) audioEl.volume = val / 100
  })

  return {
    playlist,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isDarkMode,
    setAudioElement,
    togglePlay,
    playTrack,
    prevTrack,
    nextTrack,
    seek,
    onTimeUpdate,
    onLoadedMetadata,
    fetchPlaylist // 导出拉取函数
  }
})  