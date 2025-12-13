/**
 * Deployments API Routes
 * 
 * Track and manage project deployments
 */

import express from 'express';
import { db } from '../db/client.js';
import { deployment, project } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '../auth/middleware.js';

const router = express.Router();

/**
 * GET /api/deployments
 * Get all deployments for authenticated user
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { projectId, provider, status, limit = 50, offset = 0 } = req.query;

    let query = db
      .select()
      .from(deployment)
      .where(eq(deployment.userId, req.user.id));

    // Apply filters
    const conditions = [eq(deployment.userId, req.user.id)];

    if (projectId) {
      conditions.push(eq(deployment.projectId, projectId));
    }

    if (provider) {
      conditions.push(eq(deployment.provider, provider));
    }

    if (status) {
      conditions.push(eq(deployment.status, status));
    }

    const deployments = await db
      .select()
      .from(deployment)
      .where(and(...conditions))
      .orderBy(desc(deployment.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({
      success: true,
      data: deployments,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: deployments.length,
      },
    });
  } catch (error) {
    console.error('Get deployments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deployments',
      message: error.message,
    });
  }
});

/**
 * GET /api/deployments/:id
 * Get single deployment by ID
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [deploymentData] = await db
      .select()
      .from(deployment)
      .where(
        and(
          eq(deployment.id, req.params.id),
          eq(deployment.userId, req.user.id)
        )
      )
      .limit(1);

    if (!deploymentData) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
      });
    }

    res.json({
      success: true,
      data: deploymentData,
    });
  } catch (error) {
    console.error('Get deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deployment',
      message: error.message,
    });
  }
});

/**
 * POST /api/deployments
 * Create new deployment
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { projectId, provider, metadata } = req.body;

    if (!projectId || !provider) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, provider',
      });
    }

    // Verify project ownership
    const [projectData] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, projectId),
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

    const deploymentData = {
      projectId,
      userId: req.user.id,
      provider,
      status: 'pending',
      metadata: metadata || {},
    };

    const [newDeployment] = await db
      .insert(deployment)
      .values(deploymentData)
      .returning();

    res.status(201).json({
      success: true,
      data: newDeployment,
      message: 'Deployment created successfully',
    });
  } catch (error) {
    console.error('Create deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create deployment',
      message: error.message,
    });
  }
});

/**
 * PUT /api/deployments/:id
 * Update deployment status
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { status, deploymentUrl, buildLog, errorMessage, metadata } = req.body;

    // Check if deployment exists and belongs to user
    const [existingDeployment] = await db
      .select()
      .from(deployment)
      .where(
        and(
          eq(deployment.id, req.params.id),
          eq(deployment.userId, req.user.id)
        )
      )
      .limit(1);

    if (!existingDeployment) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
      });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (deploymentUrl) updateData.deploymentUrl = deploymentUrl;
    if (buildLog) updateData.buildLog = buildLog;
    if (errorMessage) updateData.errorMessage = errorMessage;
    if (metadata) updateData.metadata = metadata;

    const [updatedDeployment] = await db
      .update(deployment)
      .set(updateData)
      .where(eq(deployment.id, req.params.id))
      .returning();

    res.json({
      success: true,
      data: updatedDeployment,
      message: 'Deployment updated successfully',
    });
  } catch (error) {
    console.error('Update deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update deployment',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/deployments/:id
 * Delete deployment record
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [deletedDeployment] = await db
      .delete(deployment)
      .where(
        and(
          eq(deployment.id, req.params.id),
          eq(deployment.userId, req.user.id)
        )
      )
      .returning();

    if (!deletedDeployment) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
      });
    }

    res.json({
      success: true,
      message: 'Deployment deleted successfully',
    });
  } catch (error) {
    console.error('Delete deployment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete deployment',
      message: error.message,
    });
  }
});

/**
 * GET /api/deployments/project/:projectId
 * Get all deployments for a specific project
 */
router.get('/project/:projectId', requireAuth, async (req, res) => {
  try {
    // Verify project ownership
    const [projectData] = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.id, req.params.projectId),
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

    const deployments = await db
      .select()
      .from(deployment)
      .where(eq(deployment.projectId, req.params.projectId))
      .orderBy(desc(deployment.createdAt));

    res.json({
      success: true,
      data: deployments,
    });
  } catch (error) {
    console.error('Get project deployments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project deployments',
      message: error.message,
    });
  }
});

export default router;
