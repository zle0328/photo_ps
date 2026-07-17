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

    <view class="mt-4 rounded-card bg-white p-4 card-shadow">
      <view class="flex items-center justify-between">
        <text class="text-sm text-muted">当前 <text class="font-semibold text-ink">{{ activeCategory }}</text></text>
      </view>
      <view class="mt-3 grid grid-cols-4 gap-2">
        <button
          v-for="category in categories"
          :key="category"
          class="rounded-lg border px-2 py-2 text-sm"
          :class="activeCategory === category ? 'border-brand-500 text-brand-600' : 'border-line text-ink'"
          @tap="activeCategory = category"
        >
          {{ category }}
        </button>
      </view>
    </view>

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
import { categories as specCategories, specifications } from '../../data/specifications'

const keyword = ref('')
const activeCategory = ref('全部')
const categories = ['全部', ...specCategories]

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
