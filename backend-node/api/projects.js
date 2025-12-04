/**
 * Projects API Routes
 * 
 * CRUD operations for user projects
 */

import express from 'express';
import { db } from '../db/client.js';
import { project, projectVersion } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../auth/middleware.js';
import { validateProject } from '../utils/validation.js';

const router = express.Router();

/**
 * GET /api/projects
 * Get all projects for authenticated user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { limit = 50, offset = 0, sortBy = 'updatedAt', order = 'desc' } = req.query;

    const projects = await db
      .select()
      .from(project)
      .where(eq(project.userId, req.user.id))
      .orderBy(order === 'desc' ? desc(project[sortBy]) : project[sortBy])
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({
      success: true,
      data: projects,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: projects.length,
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: error.message,
    });
  }
});

/**
 * GET /api/projects/:id
 * Get single project by ID
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [projectData] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, req.params.id),
          eq(project.userId, req.user.id)
        )
      )
      .limit(1);

    if (!projectData) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: projectData,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      message: error.message,
    });
  }
});

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    // Validate input
    const validation = validateProject(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const projectData = {
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description || null,
      htmlContent: req.body.htmlContent || '',
      cssContent: req.body.cssContent || '',
      jsContent: req.body.jsContent || '',
      thumbnail: req.body.thumbnail || null,
      isPublic: req.body.isPublic || false,
      template: req.body.template || null,
      metadata: req.body.metadata || {},
      version: 1,
    };

    const [newProject] = await db
      .insert(project)
      .values(projectData)
      .returning();

    // Create initial version
    await db.insert(projectVersion).values({
      projectId: newProject.id,
      version: 1,
      htmlContent: newProject.htmlContent,
      cssContent: newProject.cssContent,
      jsContent: newProject.jsContent,
      changeDescription: 'Initial version',
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      message: error.message,
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update existing project
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    // Check if project exists and belongs to user
    const [existingProject] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, req.params.id),
          eq(project.userId, req.user.id)
        )
      )
      .limit(1);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Validate input
    const validation = validateProject(req.body, true);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const updateData = {
      ...req.body,
      version: existingProject.version + 1,
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    const [updatedProject] = await db
      .update(project)
      .set(updateData)
      .where(eq(project.id, req.params.id))
      .returning();

    // Create version snapshot if content changed
    const contentChanged = 
      req.body.htmlContent !== undefined ||
      req.body.cssContent !== undefined ||
      req.body.jsContent !== undefined;

    if (contentChanged) {
      await db.insert(projectVersion).values({
        projectId: updatedProject.id,
        version: updatedProject.version,
        htmlContent: updatedProject.htmlContent,
        cssContent: updatedProject.cssContent,
        jsContent: updatedProject.jsContent,
        changeDescription: req.body.changeDescription || 'Updated project',
        createdBy: req.user.id,
      });
    }

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [deletedProject] = await db
      .delete(project)
      .where(
        and(
          eq(project.id, req.params.id),
          eq(project.userId, req.user.id)
        )
      )
      .returning();

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      message: error.message,
    });
  }
});

/**
 * GET /api/projects/:id/versions
 * Get project version history
 */
router.get('/:id/versions', requireAuth, async (req, res) => {
  try {
    // Verify project ownership
    const [projectData] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, req.params.id),
          eq(project.userId, req.user.id)
        )
      )
      .limit(1);

    if (!projectData) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    const versions = await db
      .select()
      .from(projectVersion)
      .where(eq(projectVersion.projectId, req.params.id))
      .orderBy(desc(projectVersion.version));

    res.json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch versions',
      message: error.message,
    });
  }
});

export default router;
