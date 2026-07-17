<template>
  <view class="min-h-screen bg-white px-4 pb-8 pt-3">
    <view class="overflow-hidden rounded-card border border-line bg-white card-shadow">
      <view class="border-b border-line px-4 py-3">
        <text class="text-base font-semibold text-muted">证件照规格说明</text>
      </view>
      <view class="px-4 py-4">
        <view v-for="row in detailRows" :key="row.label" class="mb-3 flex items-center">
          <text class="w-24 text-sm text-muted">{{ row.label }}</text>
          <text class="flex-1 text-base text-ink">{{ row.value }}</text>
        </view>
        <view class="flex items-start">
          <text class="w-24 pt-2 text-sm text-muted">背景色</text>
          <ColorSwatches v-model="background" :colors="spec.backgrounds" />
        </view>
      </view>
    </view>

    <view class="mt-5 rounded-card border border-line bg-white p-4 card-shadow">
      <text class="text-base font-semibold text-ink">拍照建议</text>
      <view v-for="(tip, index) in tips" :key="tip" class="mt-4 flex items-start gap-3">
        <view class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-500 text-xs text-brand-600">
          {{ index + 1 }}
        </view>
        <text class="flex-1 text-sm leading-6 text-muted">{{ tip }}</text>
      </view>
    </view>

    <view class="mt-7 flex flex-col items-center gap-3">
      <button class="w-64 rounded-full border border-brand-500 bg-white py-3 font-semibold text-brand-600" @tap="selectPhoto('album')">
        相册选择
      </button>
      <button class="w-64 rounded-full bg-brand-500 py-3 font-semibold text-white card-shadow" @tap="selectPhoto('camera')">
        直接拍摄
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ColorSwatches from '../../components/ColorSwatches.vue'
import { findSpecification } from '../../data/specifications'
import type { PhotoDraft } from '../../types/photo'

const specId = ref('one-inch')
const spec = computed(() => findSpecification(specId.value))
const background = ref('#438fd8')

const tips = [
  '表情自然，抬头挺胸，两眼平视前方',
  '请他人协助拍摄，使用后置摄像头效果更佳',
  '穿深色衣服，在白色或纯色背景墙前拍摄',
]

const detailRows = computed(() => [
  { label: '规格名称', value: spec.value.name },
  { label: '打印尺寸', value: `${spec.value.widthMm} × ${spec.value.heightMm}mm` },
  { label: '像素尺寸', value: `${spec.value.widthPx} × ${spec.value.heightPx}px` },
  { label: '文件大小', value: spec.value.maxKb ? `${spec.value.minKb ?? 0}~${spec.value.maxKb}KB` : '无要求' },
  { label: '分辨率', value: `${spec.value.dpi}dpi` },
])

onLoad((options) => {
  if (typeof options?.id === 'string') specId.value = options.id
  background.value = spec.value.backgrounds[0]
  uni.setNavigationBarTitle({ title: spec.value.name })
})

const selectPhoto = (source: 'album' | 'camera') => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: [source],
    success(result) {
      const photoPath = result.tempFilePaths[0]
      if (!photoPath) return
      const draft: PhotoDraft = {
        specId: spec.value.id,
        background: background.value,
        photoPath,
        updatedAt: new Date().toISOString(),
      }
      uni.setStorageSync('photo-draft', draft)
      uni.navigateTo({ url: '/pages/create/index' })
    },
    fail(error) {
      if (!error.errMsg?.includes('cancel')) {
        uni.showToast({ title: '无法读取照片，请检查相册或相机权限', icon: 'none' })
      }
    },
  })
}
</script>
