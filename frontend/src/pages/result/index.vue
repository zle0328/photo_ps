<template>
  <view class="min-h-screen bg-slate-50 px-4 pb-8 pt-5">
    <view v-if="loading" class="mt-24 flex flex-col items-center">
      <view class="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
      <text class="mt-4 text-sm text-muted">正在读取生成结果…</text>
    </view>

    <view v-else-if="task?.status === 'succeeded' && task.resultUrl" class="flex flex-col items-center">
      <view class="rounded-card bg-white p-5 card-shadow">
        <image :src="absoluteResultUrl" mode="widthFix" class="w-64 rounded-lg" />
      </view>
      <text class="mt-5 text-base font-semibold text-ink">证件照已生成</text>
      <text class="mt-2 text-sm text-muted">结果默认仅用于当前开发环境，请及时下载保存。</text>

      <view class="mt-5 w-full rounded-card bg-white p-4 card-shadow">
        <view class="flex justify-between py-2">
          <text class="text-sm text-muted">规格</text>
          <text class="text-sm text-ink">{{ spec.name }}</text>
        </view>
        <view class="flex justify-between py-2">
          <text class="text-sm text-muted">像素</text>
          <text class="text-sm text-ink">{{ spec.widthPx }}×{{ spec.heightPx }}px</text>
        </view>
        <view class="flex justify-between py-2">
          <text class="text-sm text-muted">分辨率</text>
          <text class="text-sm text-ink">{{ spec.dpi }}dpi</text>
        </view>
      </view>

      <button class="mt-6 w-full rounded-full bg-brand-500 py-3.5 font-semibold text-white card-shadow" @tap="saveResult">
        下载证件照
      </button>
      <button class="mt-3 w-full rounded-full border border-brand-500 bg-white py-3 text-brand-600" open-type="share">
        分享小程序给好友
      </button>
    </view>

    <view v-else class="mt-20 rounded-card bg-white p-8 text-center card-shadow">
      <text class="block text-base font-semibold text-ink">{{ task?.status === 'failed' ? '生成失败' : '结果不存在' }}</text>
      <text class="mt-2 block text-sm text-muted">{{ task?.errorMessage || errorMessage || '请返回重新制作证件照' }}</text>
      <button class="mt-5 rounded-full bg-brand-500 py-3 text-white" @tap="goHome">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { findSpecification } from '../../data/specifications'
import { apiBaseUrl, getGenerationTask } from '../../services/api'
import type { GenerationTask } from '../../types/photo'

const task = ref<GenerationTask | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const spec = computed(() => findSpecification(task.value?.specId || 'one-inch'))
const absoluteResultUrl = computed(() => {
  const path = task.value?.resultUrl || ''
  return path.startsWith('http') ? path : `${apiBaseUrl}${path}`
})

onLoad(async (options) => {
  try {
    if (typeof options?.id !== 'string') throw new Error('缺少任务编号')
    task.value = await getGenerationTask(options.id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '读取结果失败'
  } finally {
    loading.value = false
  }
})

onShareAppMessage(() => ({ title: '快速生成标准证件照', path: '/pages/index/index' }))

const saveResult = () => {
  if (!absoluteResultUrl.value) return
  uni.showLoading({ title: '正在下载' })
  uni.downloadFile({
    url: absoluteResultUrl.value,
    success(download) {
      if (download.statusCode !== 200) {
        uni.showToast({ title: '下载失败', icon: 'none' })
        return
      }
      uni.saveImageToPhotosAlbum({
        filePath: download.tempFilePath,
        success: () => uni.showToast({ title: '已保存到相册' }),
        fail: (error) => {
          if (!error.errMsg?.includes('cancel')) {
            uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' })
          }
        },
      })
    },
    fail: () => uni.showToast({ title: '网络下载失败', icon: 'none' }),
    complete: () => uni.hideLoading(),
  })
}

const goHome = () => uni.reLaunch({ url: '/pages/index/index' })
</script>
