import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/marketing-schema.ts',
  out: './drizzle/marketing',
  dialect: 'sqlite',
  driver: 'd1-http',
} satisfies Config
