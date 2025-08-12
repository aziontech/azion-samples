import { Hono } from 'hono';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from './db';

const app = new Hono();

app.get('/tasks', async (c) => {
  try {
    const tasks = await getTasks();
    return c.json(tasks);
  } catch (error) {
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

app.get('/tasks/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const task = await getTask(Number(id));
    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json(task);
  } catch (error) {
    return c.json({ error: 'Failed to fetch task' }, 500);
  }
});

app.post('/tasks', async (c) => {
  try {
    const { title, completed } = await c.req.json();
    const newTask = await createTask({ title, completed: completed || false });
    return c.json(newTask, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

app.put('/tasks/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { title, completed } = await c.req.json();
    const updatedTask = await updateTask(Number(id), { title, completed });
    if (!updatedTask) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json(updatedTask);
  } catch (error) {
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

app.delete('/tasks/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const success = await deleteTask(Number(id));
    if (!success) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json({ message: 'Task deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

export default app;
