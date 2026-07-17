<template>
  <view class="rounded-card bg-white p-4 card-shadow" @tap="emit('select', spec.id)">
    <view class="flex items-start justify-between gap-3">
      <view class="min-w-0 flex-1">
        <text class="block truncate text-base font-semibold text-ink">{{ spec.name }}</text>
        <text class="mt-2 block text-sm text-muted">
          {{ spec.widthMm }}×{{ spec.heightMm }}mm · {{ spec.widthPx }}×{{ spec.heightPx }}px
        </text>
      </view>
      <view class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <text class="text-lg">▧</text>
      </view>
    </view>
    <view class="mt-3 flex items-center gap-1.5">
      <view
        v-for="color in spec.backgrounds.slice(0, 7)"
        :key="color"
        class="h-4 w-4 rounded-full border border-line"
        :style="{ backgroundColor: color }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { PhotoSpecification } from '../types/photo'

defineProps<{ spec: PhotoSpecification }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>
