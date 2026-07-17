<template>
  <view class="min-h-screen bg-canvas pb-8">
    <view class="profile-hero px-6 py-8 text-center">
      <view class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-white/80 text-4xl">♟</view>
      <text class="mt-4 block text-xl font-semibold text-white">Hi，微信用户</text>
    </view>

    <view class="mx-4 -mt-2 overflow-hidden rounded-card bg-white card-shadow">
      <view v-for="item in menu" :key="item.name" class="flex items-center border-b border-line px-5 py-4 last:border-0" @tap="handleMenu(item.action)">
        <text class="mr-4 text-xl">{{ item.icon }}</text>
        <text class="flex-1 text-base text-ink">{{ item.name }}</text>
        <text class="text-xl text-muted">›</text>
      </view>
    </view>

    <view class="mx-4 mt-4 flex items-center rounded-card bg-amber-50 px-4 py-3">
      <text class="mr-3 text-lg">★</text>
      <view class="flex-1">
        <text class="block text-sm font-semibold text-ink">添加到我的小程序</text>
        <text class="block text-xs text-muted">点击右上角 ··· 下次直接打开</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const menu = [
  { name: '我的订单', icon: '▣', action: 'history' },
  { name: '常见问题', icon: '?', action: 'help' },
  { name: '拍摄攻略', icon: '▤', action: 'guide' },
  { name: '联系客服', icon: '☺', action: 'contact' },
  { name: '分享小程序', icon: '➤', action: 'share' },
]

const handleMenu = (action: string) => {
  if (action === 'history') {
    uni.switchTab({ url: '/pages/history/index' })
    return
  }
  if (action === 'contact') {
    uni.showToast({ title: '客服功能正在接入中', icon: 'none' })
    return
  }
  if (action === 'share') {
    uni.showShareMenu({ withShareTicket: true })
    uni.showToast({ title: '请点击右上角分享', icon: 'none' })
    return
  }
  uni.showToast({ title: '内容正在整理中', icon: 'none' })
}
</script>

<style scoped>
.profile-hero {
  background: linear-gradient(135deg, #9d9af9 0%, #6865ed 70%, #514dd3 100%);
}
</style>
