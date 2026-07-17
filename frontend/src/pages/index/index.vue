<template>
  <view class="min-h-screen bg-canvas px-4 pb-6 pt-3">
    <view class="flex items-center rounded-full bg-white px-4 py-3 card-shadow" @tap="openSpecifications()">
      <text class="mr-2 text-lg text-muted">⌕</text>
      <text class="text-sm text-muted">搜索证件照规格名称或像素</text>
    </view>

    <view class="hero-panel relative mt-5 overflow-hidden rounded-card p-6 card-shadow">
      <view class="relative z-10 max-w-52">
        <text class="block text-2xl font-bold leading-tight text-ink">证件照生成器</text>
        <text class="mt-2 block text-lg font-semibold text-ink">3 秒快速制作</text>
        <text class="mt-3 block text-sm leading-6 text-muted">选规格、传照片、看完整广告，即可生成标准电子照。</text>
      </view>
      <view class="photo-figure absolute bottom-0 right-5">
        <view class="photo-head" />
        <view class="photo-body" />
      </view>
    </view>

    <view class="mt-4 flex gap-3">
      <view class="flex-1 rounded-card bg-white p-4 card-shadow" @tap="openSpecifications('one-inch')">
        <view class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">▣</view>
        <text class="block text-base font-semibold text-ink">一寸证件照</text>
        <text class="mt-1 block text-xs text-muted">25×35mm · 295×413px</text>
      </view>
      <view class="flex flex-1 flex-col gap-3">
        <view class="rounded-card bg-white p-4 card-shadow" @tap="openTools('background')">
          <text class="block text-sm font-semibold text-ink">证件照换底色</text>
          <text class="mt-1 block text-xs text-muted">白、蓝、红等常用底色</text>
        </view>
        <view class="rounded-card bg-white p-4 card-shadow" @tap="openTools('resize')">
          <text class="block text-sm font-semibold text-ink">证件照编辑</text>
          <text class="mt-1 block text-xs text-muted">修改尺寸、KB 与 DPI</text>
        </view>
      </view>
    </view>

    <view class="mt-5 flex items-center justify-between px-1">
      <view class="flex items-center gap-2">
        <text>🔥</text>
        <text class="text-lg font-semibold text-ink">热门证件照尺寸</text>
      </view>
      <text class="text-sm text-brand-600" @tap="openSpecifications()">全部规格 ›</text>
    </view>

    <view class="mt-3 flex flex-col gap-3">
      <SpecCard v-for="spec in featuredSpecifications" :key="spec.id" :spec="spec" @select="openSpecification" />
    </view>

    <button class="mt-5 rounded-full bg-white py-3 text-sm text-brand-600 card-shadow" @tap="openSpecifications()">
      查询更多证件照规格 ›
    </button>
  </view>
</template>

<script setup lang="ts">
import SpecCard from '../../components/SpecCard.vue'
import { specifications } from '../../data/specifications'

const featuredSpecifications = specifications.filter((item) => item.featured)

const openSpecification = (id: string) => {
  uni.navigateTo({ url: `/pages/specification-detail/index?id=${encodeURIComponent(id)}` })
}

const openSpecifications = (id?: string) => {
  if (id) {
    openSpecification(id)
    return
  }
  uni.navigateTo({ url: '/pages/specifications/index' })
}

const openTools = (tool: string) => {
  uni.setStorageSync('preferred-tool', tool)
  uni.switchTab({ url: '/pages/tools/index' })
}
</script>

<style scoped>
.hero-panel {
  min-height: 290rpx;
  background: linear-gradient(135deg, #ffffff 0%, #f3f2ff 100%);
}

.photo-figure {
  width: 180rpx;
  height: 230rpx;
}

.photo-head {
  width: 92rpx;
  height: 92rpx;
  margin: 0 auto;
  border-radius: 50%;
  background: #f5c9b7;
  box-shadow: inset 0 20rpx 0 #3d3a49;
}

.photo-body {
  width: 170rpx;
  height: 145rpx;
  margin-top: -5rpx;
  border-radius: 80rpx 80rpx 18rpx 18rpx;
  background: #f9fafb;
  border: 4rpx solid #deddfd;
}
</style>
