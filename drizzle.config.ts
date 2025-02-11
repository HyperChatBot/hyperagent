import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema',
  dialect: 'postgresql',
  out: './lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
