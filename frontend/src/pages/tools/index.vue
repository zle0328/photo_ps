<template>
  <view class="min-h-screen bg-canvas px-4 pb-8 pt-4">
    <view class="grid grid-cols-3 gap-3">
      <view v-for="tool in tools" :key="tool.id" class="rounded-card bg-white p-3 text-center card-shadow" @tap="openTool(tool.id)">
        <view class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" :style="{ backgroundColor: tool.tint }">
          <text class="text-xl">{{ tool.icon }}</text>
        </view>
        <text class="mt-3 block text-sm font-semibold text-ink">{{ tool.name }}</text>
        <text class="mt-1 block truncate text-xs text-muted">{{ tool.description }}</text>
      </view>
    </view>

    <view class="mt-6 rounded-card border border-brand-100 bg-white p-4">
      <text class="text-sm font-semibold text-ink">MVP 说明</text>
      <text class="mt-2 block text-sm leading-6 text-muted">换底色、尺寸和 KB 调整会复用证件照生成流程；水印、排版、黑白上色和批量采集将在后续版本开放。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const tools = [
  { id: 'background', name: '更换底色', icon: '◉', tint: '#eeedff', description: '常用纯色背景' },
  { id: 'resize', name: '自定义尺寸', icon: '⌗', tint: '#e8f8ff', description: '像素、KB、DPI' },
  { id: 'format', name: '格式转换', icon: '↻', tint: '#f4edff', description: 'JPG、PNG' },
  { id: 'watermark', name: '照片加水印', icon: '◇', tint: '#fff0f1', description: '防盗用文字水印' },
  { id: 'layout', name: '证件照排版', icon: '▦', tint: '#fff4df', description: '打印排版照' },
  { id: 'portrait', name: '职业形象照', icon: '♙', tint: '#eaf0ff', description: '后续版本开放' },
]

const openTool = (id: string) => {
  if (id === 'background' || id === 'resize') {
    uni.navigateTo({ url: '/pages/specifications/index' })
    return
  }
  uni.showToast({ title: '该工具将在后续版本开放', icon: 'none' })
}
</script>
