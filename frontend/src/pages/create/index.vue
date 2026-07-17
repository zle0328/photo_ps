<template>
  <view class="min-h-screen bg-canvas px-4 pb-8 pt-3">
    <view v-if="draft" class="rounded-card bg-white p-4 card-shadow">
      <view class="overflow-hidden rounded-xl bg-slate-100">
        <image :src="draft.photoPath" mode="aspectFit" class="h-96 w-full" />
      </view>
      <view class="mt-4 flex items-center justify-between">
        <view>
          <text class="block text-base font-semibold text-ink">{{ spec.name }}</text>
          <text class="mt-1 block text-sm text-muted">{{ spec.widthPx }}×{{ spec.heightPx }}px · {{ spec.dpi }}dpi</text>
        </view>
        <view class="h-10 w-10 rounded-full border-2 border-white card-shadow" :style="{ backgroundColor: draft.background }" />
      </view>
    </view>

    <view v-else class="rounded-card bg-white p-8 text-center card-shadow">
      <text class="block text-base font-semibold text-ink">照片草稿已失效</text>
      <text class="mt-2 block text-sm text-muted">临时照片可能在小程序重启后失效，请重新选择。</text>
      <button class="mt-5 rounded-full bg-brand-500 py-3 text-white" @tap="goHome">重新选择</button>
    </view>

    <view v-if="draft" class="mt-4 rounded-card bg-white p-4 card-shadow">
      <view class="flex items-start gap-3">
        <view class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">▶</view>
        <view class="flex-1">
          <text class="block text-base font-semibold text-ink">观看完整视频，免费生成</text>
          <text class="mt-1 block text-sm leading-6 text-muted">完整观看后获得一次生成资格；提前关闭不会消耗照片草稿。</text>
        </view>
      </view>
      <text v-if="lastError" class="mt-3 block rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{{ lastError }}</text>
    </view>

    <button
      v-if="draft"
      class="mt-5 rounded-full bg-brand-500 py-3.5 font-semibold text-white card-shadow disabled:opacity-50"
      :disabled="submitting"
      @tap="startGeneration"
    >
      {{ submitting ? actionText : '观看视频并开始生成' }}
    </button>

    <button v-if="draft" class="mt-3 rounded-full border border-brand-500 bg-white py-3 text-brand-600" @tap="chooseAgain">
      重新选择照片
    </button>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRewardedAd } from '../../composables/useRewardedAd'
import { findSpecification } from '../../data/specifications'
import { completeRewardSession, createGenerationTask, createRewardSession } from '../../services/api'
import type { GenerationTask, PhotoDraft } from '../../types/photo'

const draft = ref<PhotoDraft | null>(null)
const submitting = ref(false)
const actionText = ref('准备中…')
const spec = computed(() => findSpecification(draft.value?.specId || 'one-inch'))
const { lastError, initialize, show } = useRewardedAd()

onMounted(() => {
  const stored = uni.getStorageSync('photo-draft') as PhotoDraft | undefined
  if (stored?.photoPath && stored?.specId) draft.value = stored
  void initialize()
})

const confirmDevelopmentBypass = () =>
  new Promise<boolean>((resolve) => {
    uni.showModal({
      title: '开发模式',
      content: '尚未配置微信激励视频广告位。本次仅允许本地开发绕过，生产环境必须配置真实广告位。',
      confirmText: '继续测试',
      success: (result) => resolve(result.confirm),
      fail: () => resolve(false),
    })
  })

const rememberTask = (task: GenerationTask) => {
  const existing = (uni.getStorageSync('photo-history') || []) as GenerationTask[]
  uni.setStorageSync('photo-history', [task, ...existing.filter((item) => item.id !== task.id)].slice(0, 20))
}

const startGeneration = async () => {
  if (!draft.value || submitting.value) return
  submitting.value = true
  lastError.value = ''
  try {
    actionText.value = '创建生成资格…'
    const rewardSession = await createRewardSession(draft.value.specId)

    actionText.value = '等待广告完成…'
    const adResult = await show()
    let completion: 'ad_completed' | 'development_bypass'
    if (adResult === 'completed') {
      completion = 'ad_completed'
    } else if (adResult === 'unconfigured' && (await confirmDevelopmentBypass())) {
      completion = 'development_bypass'
    } else if (adResult === 'interrupted') {
      throw new Error('需要完整观看视频后才能生成')
    } else {
      throw new Error('当前环境无法展示激励视频，请稍后重试')
    }

    actionText.value = '校验生成资格…'
    const grant = await completeRewardSession(rewardSession.id, completion)
    actionText.value = '上传并生成…'
    const task = await createGenerationTask(draft.value.photoPath, {
      specId: draft.value.specId,
      background: draft.value.background,
      grantToken: grant.grantToken,
    })
    rememberTask(task)
    uni.navigateTo({ url: `/pages/result/index?id=${encodeURIComponent(task.id)}` })
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : '生成失败，请稍后重试'
    uni.showToast({ title: lastError.value, icon: 'none', duration: 2600 })
  } finally {
    submitting.value = false
    actionText.value = '准备中…'
  }
}

const chooseAgain = () => uni.navigateBack()
const goHome = () => uni.reLaunch({ url: '/pages/index/index' })
</script>
