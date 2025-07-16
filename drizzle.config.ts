import type { Config } from 'drizzle-kit';

export default {
  schema: './src/common/db/schema.ts',
  out: './src/common/db/migrations',
  driver: 'libsql',
  dbCredentials: {
    url: 'file:database.db',
  },
} satisfies Config;
