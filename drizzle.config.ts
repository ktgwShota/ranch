import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/core/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
});
