<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NIcon, NSlider, NImage } from 'naive-ui'
import { 
  PlayCircle, PauseCircle, PlaySkipBack, PlaySkipForward, 
  VolumeHigh, VolumeMute, ExpandOutline
} from '@vicons/ionicons5'
import { useMusicStore } from '../stores/music'

const router = useRouter()
const route = useRoute()
const musicStore = useMusicStore()
const globalAudio = ref(null) // 绑定 audio 标签

const isMini = ref(true)

watch(() => route.path, (newPath) => {
  if (newPath === '/music-list' || newPath === '/music') {
    isMini.value = false
  } else {
    isMini.value = true
  }
}, { immediate: true })

// 🔥 核心修复：监听 audio 元素，一旦渲染就绑定到 Store
watch(globalAudio, (el) => {
  if (el) {
    musicStore.setAudioElement(el)
  }
})

const formatTime = (seconds) => {
  if (!seconds) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const onSliderChange = (val) => {
  musicStore.seek(val)
}

const goToFullPlayer = () => {
  if (route.path !== '/music') {
      router.push('/music')
  }
}
</script>

<template>
  <div>
    <div v-if="musicStore.currentTrack">
      
      <div 
        v-if="!isMini"
        class="fixed bottom-0 left-0 right-0 h-[72px] z-[9999] bg-white/95 backdrop-blur-md border-t border-gray-200 flex items-center justify-between px-4 transition-all duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        :class="musicStore.isDarkMode ? 'bg-[#1e1e1e]/95 border-gray-700 text-white' : ''"
      >
        <div class="absolute top-[-6px] left-0 right-0 h-[6px] group cursor-pointer z-50 hover:h-[10px] transition-all">
            <n-slider 
               v-model:value="musicStore.currentTime" 
               :max="musicStore.duration" 
               :step="1"
               :tooltip="false"
               @update:value="onSliderChange"
               class="netease-slider w-full"
            />
        </div>

        <div class="flex items-center gap-3 w-[200px] md:w-[250px] cursor-pointer group" @click="goToFullPlayer">
           <div class="relative w-12 h-12 flex-none">
               <n-image 
                  :src="musicStore.currentTrack.cover" 
                  class="w-full h-full rounded shadow-sm border border-gray-100" 
                  preview-disabled
               />
               <div class="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                  <n-icon :component="ExpandOutline" />
               </div>
           </div>
           <div class="flex flex-col min-w-0">
              <span class="font-medium truncate text-sm">{{ musicStore.currentTrack.title }}</span>
              <span class="text-xs opacity-60 truncate">{{ musicStore.currentTrack.artist }}</span>
           </div>
        </div>

        <div class="flex items-center justify-center gap-4 md:gap-6 flex-1">
            <n-button text circle size="medium" class="hover:text-red-500" @click.stop="musicStore.prevTrack">
               <template #icon><n-icon size="22" :component="PlaySkipBack" /></template>
            </n-button>
            <button 
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-black hover:bg-gray-200 transition dark:bg-gray-700 dark:text-white"
                @click.stop="musicStore.togglePlay"
            >
               <n-icon size="22" :component="musicStore.isPlaying ? PauseCircle : PlayCircle" class="ml-[2px]" />
            </button>
            <n-button text circle size="medium" class="hover:text-red-500" @click.stop="musicStore.nextTrack">
               <template #icon><n-icon size="22" :component="PlaySkipForward" /></template>
            </n-button>
        </div>

        <div class="flex items-center justify-end gap-3 md:gap-5 w-[200px] md:w-[250px]">
           <span class="text-xs font-mono opacity-50 select-none hidden md:inline">
              {{ formatTime(musicStore.currentTime) }} / {{ formatTime(musicStore.duration) }}
           </span>
           <div class="flex items-center gap-2 w-24 group/vol">
               <n-icon size="20" :component="musicStore.volume === 0 ? VolumeMute : VolumeHigh" class="opacity-60 cursor-pointer"/>
               <n-slider v-model:value="musicStore.volume" :step="1" :tooltip="false" class="w-full opacity-60 group-hover/vol:opacity-100 transition" />
           </div>
        </div>
      </div>

      <div 
        v-else
        class="fixed bottom-6 right-6 z-[9999] flex items-center bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full pr-2 pl-2 py-1 gap-3 w-[200px] cursor-pointer hover:scale-105 transition-transform"
        :class="musicStore.isDarkMode ? 'bg-[#1e1e1e]/90 border-gray-700 text-white' : ''"
        @click="goToFullPlayer"
      >
        <div class="relative flex-none w-10 h-10">
           <n-image 
              :src="musicStore.currentTrack.cover" 
              class="rounded-full w-full h-full border border-gray-200" 
              :class="musicStore.isPlaying ? 'animate-spin-slow' : ''"
              preview-disabled
           />
           <div class="absolute inset-0 flex items-center justify-center">
               <div class="w-2 h-2 bg-black rounded-full border border-gray-600"></div>
           </div>
        </div>
        <div class="flex flex-col min-w-0 flex-1">
           <span class="font-bold truncate text-xs">{{ musicStore.currentTrack.title }}</span>
           <span class="text-[10px] opacity-60 truncate">{{ musicStore.currentTrack.artist }}</span>
        </div>
        <div class="flex items-center gap-1">
           <n-button text circle size="small" @click.stop="musicStore.togglePlay">
               <template #icon>
                  <n-icon size="22" :component="musicStore.isPlaying ? PauseCircle : PlayCircle" class="text-red-500" />
               </template>
           </n-button>
        </div>
      </div>

    </div>

    <audio 
      ref="globalAudio"
      :src="musicStore.currentTrack?.url" 
      @timeupdate="musicStore.onTimeUpdate" 
      @loadedmetadata="musicStore.onLoadedMetadata" 
      @ended="musicStore.nextTrack"
      autoplay
    ></audio>

  </div>
</template>

<style scoped>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin 8s linear infinite; }

:deep(.netease-slider .n-slider-rail) { height: 3px; background-color: transparent; border-radius: 0; }
:deep(.netease-slider:hover .n-slider-rail) { background-color: rgba(0,0,0,0.05); }
:deep(.netease-slider .n-slider-rail .n-slider-rail__fill) { background-color: #ec4141; border-radius: 0; }
:deep(.netease-slider .n-slider-handle) { width: 10px; height: 10px; border: 1px solid rgba(0,0,0,0.1); background-color: #ec4141; box-shadow: 0 0 4px rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.2s; }
.group:hover :deep(.netease-slider .n-slider-handle) { opacity: 1; }
</style>