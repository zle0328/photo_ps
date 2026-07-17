<template>
  <view class="min-h-screen bg-canvas px-4 pb-8 pt-4">
    <view v-if="history.length" class="flex flex-col gap-3">
      <view v-for="(item, index) in history" :key="index" class="flex items-center rounded-card bg-white p-4 card-shadow" @tap="openResult(index)">
        <image :src="item.tempFilePath" mode="aspectFill" class="h-14 w-12 rounded-lg" />
        <view class="ml-4 min-w-0 flex-1">
          <text class="block truncate text-base font-semibold text-ink">{{ findSpecification(item.specId).name }}</text>
          <text class="mt-1 block text-sm text-muted">{{ formatDate(item.createdAt) }}</text>
        </view>
        <text class="text-xl text-muted">›</text>
      </view>
    </view>

    <view v-else class="mt-24 flex flex-col items-center text-center">
      <view class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl card-shadow">▤</view>
      <text class="mt-4 text-base font-semibold text-ink">还没有电子照</text>
      <text class="mt-2 text-sm text-muted">生成成功后会显示在这里</text>
      <button class="mt-5 rounded-full bg-brand-500 px-8 py-3 text-white" @tap="goCreate">立即制作</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { findSpecification } from '../../data/specifications'
import type { PhotoResult } from '../../types/photo'

const history = ref<PhotoResult[]>([])

onShow(() => {
  history.value = (uni.getStorageSync('photo-history') || []) as PhotoResult[]
})

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const openResult = (index: number) => {
  uni.setStorageSync('photo-latest-result', history.value[index])
  uni.navigateTo({ url: '/pages/result/index' })
}

const goCreate = () => uni.switchTab({ url: '/pages/index/index' })
</script>
