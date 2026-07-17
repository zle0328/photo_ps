/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_WECHAT_REWARDED_AD_UNIT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
