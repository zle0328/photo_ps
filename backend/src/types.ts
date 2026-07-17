export interface Env {
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

export interface RewardSession {
  id: string
  specId: string
  status: 'pending' | 'completed' | 'consumed'
  grantToken?: string
  expiresAt: number
}
