import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static';

console.log("🚀 Frontend server starting...");

const app = new Elysia()
  // --- IMPORTANT CHANGE ---
  // We are now telling the static plugin to serve files
  // from the current directory ('.') instead of the default 'public' directory.
  .use(staticPlugin({
    assets: ".",
    prefix: ''
  }))
  // -----------------------
  .listen(3000);

console.log(
  `Frontend is running at http://${app.server?.hostname}:${app.server?.port}`
);

