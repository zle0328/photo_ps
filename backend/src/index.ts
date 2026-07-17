import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env, RewardSession } from './types'
import { specifications } from './specifications'

const app = new Hono<{ Bindings: Env }>()

app.use('*', async (c, next) => {
  const handler = cors({ origin: c.env.CORS_ORIGIN || '*' })
  return handler(c, next)
})

// ── Health ──

app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// ── Specifications ──

app.get('/v1/specifications', (c) => {
  const q = c.req.query('q')?.toLowerCase()
  const category = c.req.query('category')
  let results = specifications
  if (q) results = results.filter((s) => s.name.includes(q) || s.category.includes(q))
  if (category) results = results.filter((s) => s.category === category)
  return c.json(results)
})

app.get('/v1/specifications/:id', (c) => {
  const spec = specifications.find((s) => s.id === c.req.param('id'))
  if (!spec) return c.json({ detail: '规格不存在' }, 404)
  return c.json(spec)
})

// ── Reward Sessions ──

const rewardSessions = new Map<string, RewardSession>()

app.post('/v1/reward-sessions', async (c) => {
  const body = await c.req.json<{ specId: string }>()
  if (!body.specId) return c.json({ detail: '缺少 specId' }, 400)

  const id = crypto.randomUUID()
  const session: RewardSession = {
    id,
    specId: body.specId,
    status: 'pending',
    expiresAt: Date.now() + 10 * 60 * 1000,
  }
  rewardSessions.set(id, session)
  return c.json({ id: session.id, status: session.status, expiresAt: new Date(session.expiresAt).toISOString() }, 201)
})

app.post('/v1/reward-sessions/:id/complete', async (c) => {
  const session = rewardSessions.get(c.req.param('id'))
  if (!session) return c.json({ detail: '奖励会话不存在' }, 404)
  if (session.status !== 'pending') return c.json({ detail: '会话已完成或已使用' }, 409)
  if (Date.now() > session.expiresAt) return c.json({ detail: '会话已过期' }, 410)

  const body = await c.req.json<{ completion: string }>()
  if (body.completion !== 'ad_completed' && body.completion !== 'development_bypass') {
    return c.json({ detail: '无效的完成类型' }, 400)
  }

  session.status = 'completed'
  session.grantToken = crypto.randomUUID()
  return c.json({
    grantToken: session.grantToken,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  })
})

// ── Photo Processing (stateless, returns result directly) ──

app.post('/v1/process-photo', async (c) => {
  const formData = await c.req.formData()
  const photo = formData.get('photo') as File | null
  const specId = formData.get('spec_id') as string
  const background = formData.get('background') as string
  const grantToken = formData.get('grant_token') as string

  if (!photo || !specId) return c.json({ detail: '缺少 photo 或 spec_id' }, 400)

  const spec = specifications.find((s) => s.id === specId)
  if (!spec) return c.json({ detail: '规格不存在' }, 404)

  // Validate grant token
  const session = [...rewardSessions.values()].find((s) => s.grantToken === grantToken)
  if (!session && c.env.ENVIRONMENT !== 'development') {
    return c.json({ detail: '无效的授权令牌' }, 403)
  }
  if (session) {
    session.status = 'consumed'
  }

  // TODO: integrate image processing (crop, resize, background replacement)
  const arrayBuffer = await photo.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const mimeType = photo.type || 'image/jpeg'

  return c.json({
    image: `data:${mimeType};base64,${base64}`,
    specId,
    background: background || spec.backgrounds[0],
    widthPx: spec.widthPx,
    heightPx: spec.heightPx,
  })
})

export default app
