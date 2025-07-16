import type { Config } from 'drizzle-kit';

export default {
  schema: './src/common/db/schema.ts',
  out: './src/common/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:database.db',
  },
} satisfies Config;
