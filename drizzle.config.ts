import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "crossover.proxy.rlwy.net",
    port: 24752,
    user: "root",
    password: "xYWLnkwAQYJyslPYzhoORxClyprTIFzp",
    database: "railway",
  },
});
