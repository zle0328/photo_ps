export interface Env {
  PHOTOS: R2Bucket
  AI: Ai
  CORS_ORIGIN: string
  ENVIRONMENT: string
}

export interface PhotoSpecification {
  id: string
  name: string
  category: string
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
  dpi: number
  minKb?: number
  maxKb?: number
  backgrounds: string[]
  featured?: boolean
}

export interface GenerationTask {
  id: string
  status: 'pending' | 'processing' | 'succeeded' | 'failed'
  specId: string
  resultUrl?: string
  errorMessage?: string
  createdAt: string
}

export interface RewardSession {
  id: string
  specId: string
  status: 'pending' | 'completed' | 'consumed'
  expiresAt: string
}
