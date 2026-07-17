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

export interface PhotoDraft {
  specId: string
  background: string
  photoPath: string
  updatedAt: string
}

export interface PhotoResult {
  specId: string
  background: string
  tempFilePath: string
  createdAt: string
}
