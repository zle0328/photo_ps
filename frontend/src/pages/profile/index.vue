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

    <view class="mx-4 mt-4 rounded-card bg-amber-50 p-4">
      <text class="block text-sm font-semibold text-ink">照片与隐私</text>
      <text class="mt-2 block text-sm leading-6 text-muted">本地草稿只保留在当前设备；生产后端需配置原图自动删除和结果 7 天生命周期。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const menu = [
  { name: '我的电子照', icon: '▣', action: 'history' },
  { name: '常见问题', icon: '?', action: 'help' },
  { name: '拍摄攻略', icon: '▤', action: 'guide' },
  { name: '清理本地照片记录', icon: '⌫', action: 'clear' },
  { name: '分享小程序', icon: '➤', action: 'share' },
]

const handleMenu = (action: string) => {
  if (action === 'history') {
    uni.switchTab({ url: '/pages/history/index' })
    return
  }
  if (action === 'clear') {
    uni.showModal({
      title: '清理本地记录',
      content: '将清除照片草稿和电子照列表，不会删除系统相册中已保存的照片。',
      success(result) {
        if (!result.confirm) return
        uni.removeStorageSync('photo-draft')
        uni.removeStorageSync('photo-history')
        uni.showToast({ title: '已清理' })
      },
    })
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
