<template>
  <view class="min-h-screen bg-slate-50 px-4 pb-8 pt-5">
    <view v-if="result" class="flex flex-col items-center">
      <view class="rounded-card bg-white p-5 card-shadow">
        <image :src="result.tempFilePath" mode="widthFix" class="w-64 rounded-lg" />
      </view>
      <text class="mt-5 text-base font-semibold text-ink">证件照已生成</text>
      <text class="mt-2 text-sm text-muted">点击下方按钮保存到手机相册。</text>

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
        <view class="flex justify-between py-2">
          <text class="text-sm text-muted">背景色</text>
          <view class="flex items-center gap-2">
            <view class="h-5 w-5 rounded-full border border-line" :style="{ backgroundColor: result.background }" />
            <text class="text-sm text-ink">{{ result.background }}</text>
          </view>
        </view>
      </view>

      <button class="mt-6 w-full rounded-full bg-brand-500 py-3.5 font-semibold text-white card-shadow" @tap="saveResult">
        保存到相册
      </button>
      <button class="mt-3 w-full rounded-full border border-brand-500 bg-white py-3 text-brand-600" @tap="makeAnother">
        继续制作
      </button>
    </view>

    <view v-else class="mt-20 rounded-card bg-white p-8 text-center card-shadow">
      <text class="block text-base font-semibold text-ink">结果不存在</text>
      <text class="mt-2 block text-sm text-muted">请返回重新制作证件照</text>
      <button class="mt-5 rounded-full bg-brand-500 py-3 text-white" @tap="goHome">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { findSpecification } from '../../data/specifications'
import type { PhotoResult } from '../../types/photo'

const result = ref<PhotoResult | null>(null)
const spec = computed(() => findSpecification(result.value?.specId || 'one-inch'))

onLoad(() => {
  const stored = uni.getStorageSync('photo-latest-result') as PhotoResult | undefined
  if (stored?.tempFilePath) result.value = stored
})

onShareAppMessage(() => ({ title: '快速生成标准证件照', path: '/pages/index/index' }))

const saveResult = () => {
  if (!result.value) return
  uni.saveImageToPhotosAlbum({
    filePath: result.value.tempFilePath,
    success: () => uni.showToast({ title: '已保存到相册' }),
    fail: (error) => {
      if (!error.errMsg?.includes('cancel')) {
        uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' })
      }
    },
  })
}

const makeAnother = () => uni.reLaunch({ url: '/pages/index/index' })
const goHome = () => uni.reLaunch({ url: '/pages/index/index' })
</script>
