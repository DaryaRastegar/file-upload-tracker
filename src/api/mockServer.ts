import { setupWorker, rest, RestRequest, ResponseComposition, RestContext } from 'msw';

let tasks: Record<string, { status: 'pending' | 'success' | 'error'; timeLeft: number }> = {}

const worker = setupWorker(
  rest.post('/upload', async (_req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const taskId = `task-${Date.now()}`
    tasks[taskId] = { status: 'pending', timeLeft: Math.floor(Math.random() * 6) + 5 }

    return res(ctx.status(200), ctx.json({ taskId }))
  }),

  rest.get('/status/:taskId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { taskId } = req.params
    const task = tasks[taskId as string]

    if (!task) return res(ctx.status(404), ctx.json({ error: 'Task not found' }))

    if (task.timeLeft <= 0) {
      if (task.status === 'pending') {
        task.status = Math.random() > 0.2 ? 'success' : 'error'
      }
    } else {
      task.timeLeft -= 1
    }

    return res(ctx.delay(1000), ctx.json({ status: task.status }))
  }),

  rest.post('/cancel/:taskId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { taskId } = req.params
    delete tasks[taskId as string]
    return res(ctx.status(200), ctx.json({ status: 'cancelled' }))
  })
)

export { worker }
