import { defineConfig } from 'prisma/config';

// Prisma 7 no longer reads .env or datasource url/directUrl from schema.prisma.
// Migrations/CLI use DIRECT_URL (unpooled). Runtime uses DATABASE_URL via a driver adapter in lib/prisma.ts.
try {
  process.loadEnvFile();
} catch {
  // no .env (e.g. CI/prod): rely on real environment variables
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DIRECT_URL ?? '' },
});
