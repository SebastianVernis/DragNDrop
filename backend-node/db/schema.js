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
// COLLABORATION TABLES
// ================================================

export const projectSession = pgTable('projectSession', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  startedAt: timestamp('startedAt').notNull().defaultNow(),
  endedAt: timestamp('endedAt'),
  activeUsers: integer('activeUsers').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const userPresence = pgTable('userPresence', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('sessionId')
    .notNull()
    .references(() => projectSession.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  userName: varchar('userName', { length: 255 }).notNull(),
  userColor: varchar('userColor', { length: 7 }).notNull(), // Hex color
  cursorX: integer('cursorX'),
  cursorY: integer('cursorY'),
  selectedElementId: varchar('selectedElementId', { length: 255 }),
  isActive: boolean('isActive').notNull().default(true),
  lastSeen: timestamp('lastSeen').notNull().defaultNow(),
  joinedAt: timestamp('joinedAt').notNull().defaultNow(),
  leftAt: timestamp('leftAt'),
});

export const projectSnapshot = pgTable('projectSnapshot', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('projectId')
    .notNull()
    .references(() => project.id, { onDelete: 'cascade' }),
  sessionId: uuid('sessionId')
    .references(() => projectSession.id, { onDelete: 'set null' }),
  snapshotData: text('snapshotData').notNull(), // Compressed Yjs state (base64)
  operationCount: integer('operationCount').notNull().default(0),
  createdBy: text('createdBy')
    .references(() => user.id),
  snapshotType: varchar('snapshotType', { length: 20 }).notNull(), // 'auto', 'manual', 'checkpoint'
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const projectOperation = pgTable('projectOperation', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('sessionId')
    .notNull()
    .references(() => projectSession.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  operationType: varchar('operationType', { length: 50 }).notNull(),
  elementId: varchar('elementId', { length: 255 }),
  operationData: jsonb('operationData').notNull(),
  timestamp: varchar('timestamp', { length: 50 }).notNull(), // Bigint as string
  clientId: varchar('clientId', { length: 255 }).notNull(),
  isUndone: boolean('isUndone').notNull().default(false),
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

export const projectSessionRelations = relations(projectSession, ({ one, many }) => ({
  project: one(project, {
    fields: [projectSession.projectId],
    references: [project.id],
  }),
  userPresences: many(userPresence),
  operations: many(projectOperation),
  snapshots: many(projectSnapshot),
}));

export const userPresenceRelations = relations(userPresence, ({ one }) => ({
  session: one(projectSession, {
    fields: [userPresence.sessionId],
    references: [projectSession.id],
  }),
  user: one(user, {
    fields: [userPresence.userId],
    references: [user.id],
  }),
}));

export const projectSnapshotRelations = relations(projectSnapshot, ({ one }) => ({
  project: one(project, {
    fields: [projectSnapshot.projectId],
    references: [project.id],
  }),
  session: one(projectSession, {
    fields: [projectSnapshot.sessionId],
    references: [projectSession.id],
  }),
  createdByUser: one(user, {
    fields: [projectSnapshot.createdBy],
    references: [user.id],
  }),
}));

export const projectOperationRelations = relations(projectOperation, ({ one }) => ({
  session: one(projectSession, {
    fields: [projectOperation.sessionId],
    references: [projectSession.id],
  }),
  user: one(user, {
    fields: [projectOperation.userId],
    references: [user.id],
  }),
}));
