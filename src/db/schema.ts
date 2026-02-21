import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const materials = sqliteTable("materials", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileKey: text("file_key").notNull(),
  category: text("category"), // can be used for tags
  userId: text("user_id").references(() => users.id),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }).default(false),
  upvotesCount: integer("upvotes_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  materialId: text("material_id").notNull().references(() => materials.id),
  userId: text("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const upvotes = sqliteTable("upvotes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  materialId: text("material_id").notNull().references(() => materials.id),
});
