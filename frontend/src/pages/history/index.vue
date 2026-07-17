<template>
  <view class="min-h-screen bg-canvas px-4 pb-8 pt-4">
    <view class="rounded-card border border-orange-100 bg-orange-50 px-4 py-3">
      <text class="text-sm leading-6 text-orange-600">温馨提醒：生产版计划仅保留电子照 7 天；当前本地记录可在“我的”中清理。</text>
    </view>

    <view v-if="history.length" class="mt-4 flex flex-col gap-3">
      <view v-for="item in history" :key="item.id" class="flex items-center rounded-card bg-white p-4 card-shadow" @tap="openTask(item.id)">
        <view class="flex h-14 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600">▣</view>
        <view class="ml-4 min-w-0 flex-1">
          <text class="block truncate text-base font-semibold text-ink">{{ findSpecification(item.specId).name }}</text>
          <text class="mt-1 block text-sm text-muted">{{ statusText[item.status] }}</text>
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
import type { GenerationTask } from '../../types/photo'

const history = ref<GenerationTask[]>([])
const statusText: Record<GenerationTask['status'], string> = {
  pending: '等待处理',
  processing: '制作中',
  succeeded: '已生成，可查看下载',
  failed: '生成失败',
}

onShow(() => {
  history.value = (uni.getStorageSync('photo-history') || []) as GenerationTask[]
})

const openTask = (id: string) => uni.navigateTo({ url: `/pages/result/index?id=${encodeURIComponent(id)}` })
const goCreate = () => uni.switchTab({ url: '/pages/index/index' })
</script>
