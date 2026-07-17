<template>
  <view class="min-h-screen bg-canvas px-4 pb-8 pt-3">
    <view class="flex items-center rounded-full bg-white px-4 py-3 card-shadow">
      <text class="mr-2 text-lg text-muted">⌕</text>
      <input
        v-model="keyword"
        class="min-w-0 flex-1 text-sm text-ink"
        confirm-type="search"
        placeholder="搜索证件照规格名称、像素"
        placeholder-class="text-muted"
      />
      <text v-if="keyword" class="text-muted" @tap="keyword = ''">×</text>
    </view>

    <scroll-view scroll-x class="mt-4 whitespace-nowrap">
      <view class="inline-flex gap-2 pb-2">
        <button
          v-for="category in categories"
          :key="category"
          class="rounded-full px-4 py-2 text-sm"
          :class="activeCategory === category ? 'bg-brand-500 text-white' : 'bg-white text-ink'"
          @tap="activeCategory = category"
        >
          {{ category }}
        </button>
      </view>
    </scroll-view>

    <view v-if="filteredSpecifications.length" class="mt-2 grid grid-cols-2 gap-3">
      <SpecCard
        v-for="spec in filteredSpecifications"
        :key="spec.id"
        :spec="spec"
        @select="openSpecification"
      />
    </view>

    <view v-else class="mt-24 flex flex-col items-center text-center">
      <view class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl card-shadow">⌕</view>
      <text class="mt-4 text-base font-semibold text-ink">没有找到匹配规格</text>
      <text class="mt-2 text-sm text-muted">换个名称或像素尺寸再试试</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SpecCard from '../../components/SpecCard.vue'
import { specifications } from '../../data/specifications'

const keyword = ref('')
const activeCategory = ref('全部')
const categories = ['全部', '常用', '考试', '资格证', '学籍']

const filteredSpecifications = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return specifications.filter((item) => {
    const categoryMatched = activeCategory.value === '全部' || item.category === activeCategory.value
    const searchable = `${item.name} ${item.widthPx}x${item.heightPx} ${item.widthMm}x${item.heightMm}`.toLowerCase()
    return categoryMatched && (!query || searchable.includes(query))
  })
})

const openSpecification = (id: string) => {
  uni.navigateTo({ url: `/pages/specification-detail/index?id=${encodeURIComponent(id)}` })
}
</script>
