const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
export const apiBaseUrl = (configuredBaseUrl || 'https://id-photo-api.2712182807.workers.dev').replace(/\/$/, '')

interface ApiErrorBody {
  detail?: string
  message?: string
}

interface RewardSessionResponse {
  id: string
  status: 'pending' | 'completed' | 'consumed'
  expiresAt: string
}

interface RewardGrantResponse {
  grantToken: string
  expiresAt: string
}

export interface ProcessPhotoResult {
  image: string
  specId: string
  background: string
  widthPx: number
  heightPx: number
}

const request = <T>(path: string, method: 'GET' | 'POST', data?: object) =>
  new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${apiBaseUrl}${path}`,
      method,
      data,
      timeout: 12_000,
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data as T)
          return
        }
        const body = response.data as ApiErrorBody
        reject(new Error(body.detail || body.message || `请求失败（${response.statusCode}）`))
      },
      fail(error) {
        reject(new Error(error.errMsg || '网络连接失败'))
      },
    })
  })

export const createRewardSession = (specId: string) =>
  request<RewardSessionResponse>('/v1/reward-sessions', 'POST', { specId })

export const completeRewardSession = (sessionId: string, completion: 'ad_completed' | 'development_bypass') =>
  request<RewardGrantResponse>(`/v1/reward-sessions/${encodeURIComponent(sessionId)}/complete`, 'POST', { completion })

interface ProcessPhotoInput {
  specId: string
  background: string
  grantToken: string
}

export const processPhoto = (photoPath: string, input: ProcessPhotoInput) =>
  new Promise<ProcessPhotoResult>((resolve, reject) => {
    uni.uploadFile({
      url: `${apiBaseUrl}/v1/process-photo`,
      filePath: photoPath,
      name: 'photo',
      timeout: 30_000,
      formData: {
        spec_id: input.specId,
        background: input.background,
        grant_token: input.grantToken,
      },
      success(response) {
        let body: ProcessPhotoResult | ApiErrorBody
        try {
          body = JSON.parse(response.data) as ProcessPhotoResult | ApiErrorBody
        } catch {
          reject(new Error('服务器返回了无法识别的数据'))
          return
        }
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(body as ProcessPhotoResult)
          return
        }
        const errorBody = body as ApiErrorBody
        reject(new Error(errorBody.detail || errorBody.message || `处理失败（${response.statusCode}）`))
      },
      fail(error) {
        reject(new Error(error.errMsg || '照片上传失败'))
      },
    })
  })
