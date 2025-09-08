import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const todos = [
    { id: 1, text: "Learn Monorepos", completed: true },
    { id: 2, text: "Understand Turborepo", completed: false },
    { id: 3, text: "Build something with Bun", completed: false },
    { id: 4, text: "Add a frontend!", completed: true },
];

console.log("🚀 Backend HTTP server starting...");

const app = new Elysia()
  .use(cors()) 
  .get('/', () => ({ message: 'Welcome to the Todo Backend!' }))
  .get('/todos', () => {
    console.log("✅ [GET /todos] Fetched all todos for frontend");
    return { data: todos };
  })
  .listen(3001);

console.log(
  `Backend server is running at http://${app.server?.hostname}:${app.server?.port}`
);