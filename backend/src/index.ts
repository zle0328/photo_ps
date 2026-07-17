import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env, GenerationTask, RewardSession } from './types'
import { specifications } from './specifications'

const app = new Hono<{ Bindings: Env }>()

app.use('*', async (c, next) => {
  const handler = cors({ origin: c.env.CORS_ORIGIN || '*' })
  return handler(c, next)
})

// ── Health ──

app.get('/health', (c) => c.json({ status: 'ok' }))

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

// ── Reward Sessions (ad unlock) ──

const rewardSessions = new Map<string, RewardSession>()

app.post('/v1/reward-sessions', async (c) => {
  const body = await c.req.json<{ specId: string }>()
  const id = crypto.randomUUID()
  const session: RewardSession = {
    id,
    specId: body.specId,
    status: 'pending',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  }
  rewardSessions.set(id, session)
  return c.json(session, 201)
})

app.post('/v1/reward-sessions/:id/complete', async (c) => {
  const session = rewardSessions.get(c.req.param('id'))
  if (!session) return c.json({ detail: '奖励会话不存在' }, 404)
  if (session.status !== 'pending') return c.json({ detail: '会话已完成或已使用' }, 409)

  const body = await c.req.json<{ completion: string }>()
  if (body.completion !== 'ad_completed' && body.completion !== 'development_bypass') {
    return c.json({ detail: '无效的完成类型' }, 400)
  }

  session.status = 'completed'
  const grantToken = crypto.randomUUID()
  return c.json({
    grantToken,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  })
})

// ── Generation Tasks ──

const tasks = new Map<string, GenerationTask>()

app.post('/v1/generation-tasks', async (c) => {
  const formData = await c.req.formData()
  const photo = formData.get('photo') as File | null
  const specId = formData.get('spec_id') as string
  const background = formData.get('background') as string
  const grantToken = formData.get('grant_token') as string

  if (!photo || !specId || !background || !grantToken) {
    return c.json({ detail: '缺少必填参数' }, 400)
  }

  const spec = specifications.find((s) => s.id === specId)
  if (!spec) return c.json({ detail: '规格不存在' }, 404)

  const taskId = crypto.randomUUID()
  const objectKey = `uploads/${taskId}/${photo.name}`
  await c.env.PHOTOS.put(objectKey, photo.stream(), {
    httpMetadata: { contentType: photo.type },
  })

  const task: GenerationTask = {
    id: taskId,
    status: 'pending',
    specId,
    createdAt: new Date().toISOString(),
  }
  tasks.set(taskId, task)

  processTask(task, objectKey, background, spec, c.env).catch(() => {
    task.status = 'failed'
    task.errorMessage = '处理失败'
  })

  return c.json(task, 201)
})

app.get('/v1/generation-tasks/:id', (c) => {
  const task = tasks.get(c.req.param('id'))
  if (!task) return c.json({ detail: '任务不存在' }, 404)
  return c.json(task)
})

// ── Image Processing (placeholder — swap in Workers AI later) ──

async function processTask(
  task: GenerationTask,
  objectKey: string,
  _background: string,
  _spec: { widthPx: number; heightPx: number },
  env: Env,
) {
  task.status = 'processing'
  try {
    const original = await env.PHOTOS.get(objectKey)
    if (!original) throw new Error('原图丢失')

    // TODO: integrate Workers AI for background removal & resize
    // For now, store original as result to complete the pipeline
    const resultKey = objectKey.replace('uploads/', 'results/')
    await env.PHOTOS.put(resultKey, original.body, {
      httpMetadata: original.httpMetadata,
    })

    task.status = 'succeeded'
    task.resultUrl = `/v1/photos/${resultKey}`
  } catch (e) {
    task.status = 'failed'
    task.errorMessage = e instanceof Error ? e.message : '处理失败'
  }
}

// ── Photo download ──

app.get('/v1/photos/*', async (c) => {
  const key = c.req.path.replace('/v1/photos/', '')
  const object = await c.env.PHOTOS.get(key)
  if (!object) return c.json({ detail: '文件不存在' }, 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(object.body, { headers })
})

export default app
