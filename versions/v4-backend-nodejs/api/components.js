/**
 * Components API Routes
 * 
 * CRUD operations for reusable components
 */

import express from 'express';
import { db } from '../db/client.js';
import { component } from '../db/schema.js';
import { eq, and, or, like, desc, sql } from 'drizzle-orm';
import { requireAuth, optionalAuth } from '../auth/middleware.js';
import { validateComponent } from '../utils/validation.js';

const router = express.Router();

/**
 * GET /api/components
 * Get components (public + user's private)
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      search, 
      limit = 50, 
      offset = 0,
      sortBy = 'createdAt',
      order = 'desc',
      publicOnly = false,
    } = req.query;

    let query = db.select().from(component);

    // Build where conditions
    const conditions = [];

    if (publicOnly === 'true' || !req.user) {
      conditions.push(eq(component.isPublic, true));
    } else {
      // Show public components + user's private components
      conditions.push(
        or(
          eq(component.isPublic, true),
          eq(component.userId, req.user.id)
        )
      );
    }

    if (category) {
      conditions.push(eq(component.category, category));
    }

    if (search) {
      conditions.push(
        or(
          like(component.name, `%${search}%`),
          like(component.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const components = await query
      .orderBy(order === 'desc' ? desc(component[sortBy]) : component[sortBy])
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({
      success: true,
      data: components,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: components.length,
      },
    });
  } catch (error) {
    console.error('Get components error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components',
      message: error.message,
    });
  }
});

/**
 * GET /api/components/:id
 * Get single component by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const [componentData] = await db
      .select()
      .from(component)
      .where(eq(component.id, req.params.id))
      .limit(1);

    if (!componentData) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    // Check access permissions
    if (!componentData.isPublic && (!req.user || componentData.userId !== req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Increment usage count
    await db
      .update(component)
      .set({ usageCount: sql`${component.usageCount} + 1` })
      .where(eq(component.id, req.params.id));

    res.json({
      success: true,
      data: componentData,
    });
  } catch (error) {
    console.error('Get component error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component',
      message: error.message,
    });
  }
});

/**
 * POST /api/components
 * Create new component
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    // Validate input
    const validation = validateComponent(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const componentData = {
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description || null,
      category: req.body.category,
      htmlContent: req.body.htmlContent,
      cssContent: req.body.cssContent || '',
      jsContent: req.body.jsContent || '',
      thumbnail: req.body.thumbnail || null,
      isPublic: req.body.isPublic || false,
      tags: req.body.tags || [],
      metadata: req.body.metadata || {},
      usageCount: 0,
    };

    const [newComponent] = await db
      .insert(component)
      .values(componentData)
      .returning();

    res.status(201).json({
      success: true,
      data: newComponent,
      message: 'Component created successfully',
    });
  } catch (error) {
    console.error('Create component error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create component',
      message: error.message,
    });
  }
});

/**
 * PUT /api/components/:id
 * Update existing component
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    // Check if component exists and belongs to user
    const [existingComponent] = await db
      .select()
      .from(component)
      .where(
        and(
          eq(component.id, req.params.id),
          eq(component.userId, req.user.id)
        )
      )
      .limit(1);

    if (!existingComponent) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    // Validate input
    const validation = validateComponent(req.body, true);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.usageCount;

    const [updatedComponent] = await db
      .update(component)
      .set(updateData)
      .where(eq(component.id, req.params.id))
      .returning();

    res.json({
      success: true,
      data: updatedComponent,
      message: 'Component updated successfully',
    });
  } catch (error) {
    console.error('Update component error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update component',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/components/:id
 * Delete component
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [deletedComponent] = await db
      .delete(component)
      .where(
        and(
          eq(component.id, req.params.id),
          eq(component.userId, req.user.id)
        )
      )
      .returning();

    if (!deletedComponent) {
      return res.status(404).json({
        success: false,
        error: 'Component not found',
      });
    }

    res.json({
      success: true,
      message: 'Component deleted successfully',
    });
  } catch (error) {
    console.error('Delete component error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete component',
      message: error.message,
    });
  }
});

/**
 * GET /api/components/categories
 * Get all available categories
 */
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await db
      .selectDistinct({ category: component.category })
      .from(component)
      .where(eq(component.isPublic, true));

    res.json({
      success: true,
      data: categories.map(c => c.category),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message,
    });
  }
});

export default router;
