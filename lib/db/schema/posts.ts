import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tags: text('tag').array().notNull(),
  like: integer('like').notNull().default(0),
  pv: integer('pv').notNull().default(0),
  isPublic: boolean('is_public').notNull().default(false),
  posterUrl: text('poster_url').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Schema for posts - used to validate API requests
export const insertPostSchema = createSelectSchema(posts).extend({}).omit({
  id: true,
  like: true,
  pv: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true
})

// Type for posts - used to type API request params and within Components
export type NewPostParams = z.infer<typeof insertPostSchema>
