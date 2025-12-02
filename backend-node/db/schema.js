/**
 * Database Schema - Drizzle ORM
 * 
 * Includes Better Auth required tables + custom application tables
 */

import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ================================================
// BETTER AUTH REQUIRED TABLES
// ================================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// ================================================
// APPLICATION TABLES
// ================================================

export const project = pgTable('project', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  htmlContent: text('htmlContent').notNull().default(''),
  cssContent: text('cssContent').notNull().default(''),
  jsContent: text('jsContent').notNull().default(''),
  thumbnail: text('thumbnail'),
  isPublic: boolean('isPublic').notNull().default(false),
  template: varchar('template', { length: 100 }),
  metadata: jsonb('metadata').default({}),
  version: integer('version').notNull().default(1),
  lastSyncedAt: timestamp('lastSyncedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const component = pgTable('component', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  htmlContent: text('htmlContent').notNull(),
  cssContent: text('cssContent').notNull().default(''),
  jsContent: text('jsContent').notNull().default(''),
  thumbnail: text('thumbnail'),
  isPublic: boolean('isPublic').notNull().default(false),
  tags: jsonb('tags').default([]),
  usageCount: integer('usageCount').notNull().default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const deployment = pgTable('deployment', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(), // 'vercel', 'netlify', 'github-pages'
  deploymentUrl: text('deploymentUrl'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // 'pending', 'building', 'ready', 'error'
  buildLog: text('buildLog'),
  errorMessage: text('errorMessage'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const projectVersion = pgTable('projectVersion', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  htmlContent: text('htmlContent').notNull(),
  cssContent: text('cssContent').notNull(),
  jsContent: text('jsContent').notNull(),
  changeDescription: text('changeDescription'),
  createdBy: text('createdBy')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const aiUsage = pgTable('aiUsage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  feature: varchar('feature', { length: 100 }).notNull(), // 'component-generation', 'code-validation', etc.
  tokensUsed: integer('tokensUsed').notNull().default(0),
  cost: integer('cost').notNull().default(0), // in cents
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// ================================================
// RELATIONS
// ================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(project),
  components: many(component),
  deployments: many(deployment),
  aiUsage: many(aiUsage),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  deployments: many(deployment),
  versions: many(projectVersion),
}));

export const componentRelations = relations(component, ({ one }) => ({
  user: one(user, {
    fields: [component.userId],
    references: [user.id],
  }),
}));

export const deploymentRelations = relations(deployment, ({ one }) => ({
  project: one(project, {
    fields: [deployment.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [deployment.userId],
    references: [user.id],
  }),
}));
