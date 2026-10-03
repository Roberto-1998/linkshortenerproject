import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  shortCode: varchar('short_code', { length: 32 }).notNull().unique(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
