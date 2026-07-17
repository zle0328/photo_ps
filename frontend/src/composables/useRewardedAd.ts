import { onUnmounted, ref } from 'vue'

export type RewardedAdResult = 'completed' | 'interrupted' | 'unconfigured' | 'unsupported'
export type RewardedAdStatus = 'idle' | 'loading' | 'ready' | 'showing' | 'error' | 'unconfigured' | 'unsupported'

interface AdCloseResult {
  isEnded?: boolean
}

interface AdError {
  errCode?: number
  errMsg?: string
}

interface RewardedAdInstance {
  load(): Promise<void>
  show(): Promise<void>
  destroy?(): void
  onLoad(callback: () => void): void
  offLoad?(callback: () => void): void
  onClose(callback: (result: AdCloseResult) => void): void
  offClose?(callback: (result: AdCloseResult) => void): void
  onError(callback: (error: AdError) => void): void
  offError?(callback: (error: AdError) => void): void
}

interface WechatAdApi {
  createRewardedVideoAd(options: { adUnitId: string }): RewardedAdInstance
}

export function useRewardedAd(adUnitId = import.meta.env.VITE_WECHAT_REWARDED_AD_UNIT_ID?.trim() || '') {
  const status = ref<RewardedAdStatus>(adUnitId ? 'idle' : 'unconfigured')
  const lastError = ref('')
  let ad: RewardedAdInstance | null = null
  let closeResolver: ((result: RewardedAdResult) => void) | null = null

  const onLoad = () => {
    status.value = 'ready'
    lastError.value = ''
  }

  const onClose = (result: AdCloseResult) => {
    status.value = 'idle'
    closeResolver?.(result?.isEnded ? 'completed' : 'interrupted')
    closeResolver = null
  }

  const onError = (error: AdError) => {
    status.value = 'error'
    lastError.value = error.errMsg || `广告加载失败${error.errCode ? `（${error.errCode}）` : ''}`
  }

  const initialize = async () => {
    if (!adUnitId) return
    if (ad) return

    // #ifdef MP-WEIXIN
    const api = wx as unknown as WechatAdApi
    if (typeof api.createRewardedVideoAd !== 'function') {
      status.value = 'unsupported'
      return
    }
    ad = api.createRewardedVideoAd({ adUnitId })
    ad.onLoad(onLoad)
    ad.onClose(onClose)
    ad.onError(onError)
    status.value = 'loading'
    try {
      await ad.load()
    } catch (error) {
      status.value = 'error'
      lastError.value = error instanceof Error ? error.message : '广告加载失败'
    }
    // #endif

    // #ifndef MP-WEIXIN
    status.value = 'unsupported'
    // #endif
  }

  const show = async (): Promise<RewardedAdResult> => {
    if (!adUnitId) return 'unconfigured'
    await initialize()
    if (!ad) return 'unsupported'

    try {
      status.value = 'showing'
      await ad.show()
    } catch {
      status.value = 'loading'
      try {
        await ad.load()
        await ad.show()
      } catch (error) {
        status.value = 'error'
        lastError.value = error instanceof Error ? error.message : '当前没有可展示的广告'
        throw new Error(lastError.value)
      }
    }

    return new Promise<RewardedAdResult>((resolve) => {
      closeResolver = resolve
    })
  }

  onUnmounted(() => {
    if (!ad) return
    ad.offLoad?.(onLoad)
    ad.offClose?.(onClose)
    ad.offError?.(onError)
    ad.destroy?.()
    ad = null
  })

  return { status, lastError, initialize, show }
}
