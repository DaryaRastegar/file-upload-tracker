import { rest } from 'msw';

// Mock response for file upload
export const handlers = [
  rest.post('/upload', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ task_id: '12345' })  // Mock task_id response
    );
  }),

  // Mock response for task status
  rest.get('/status/:taskId', (req, res, ctx) => {
    const { taskId } = req.params;

    // Simulate different statuses for taskId
    if (taskId === '12345') {
      return res(
        ctx.status(200),
        ctx.json({ status: 'completed' })  // You can change this to 'in-progress' or 'failed'
      );
    }

    return res(
      ctx.status(404),
      ctx.json({ error: 'Task not found' })
    );
  }),
];