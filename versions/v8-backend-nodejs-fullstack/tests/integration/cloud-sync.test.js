/**
 * Cloud Sync Integration Tests
 * 
 * Tests the complete sync workflow
 */

import request from 'supertest';
import app from '../../server.js';

describe('Cloud Sync Integration', () => {
  let authCookie;
  let projectId;

  const testUser = {
    email: 'sync-test@example.com',
    password: 'TestPassword123!',
    name: 'Sync Test User',
  };

  beforeAll(async () => {
    // Create and authenticate user
    await request(app)
      .post('/api/auth/sign-up')
      .send(testUser);

    const signInResponse = await request(app)
      .post('/api/auth/sign-in')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    authCookie = signInResponse.headers['set-cookie'];
  });

  describe('Create and Sync Project', () => {
    it('should create project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send({
          name: 'Sync Test Project',
          htmlContent: '<h1>Initial</h1>',
        });

      expect(response.status).toBe(201);
      projectId = response.body.data.id;
    });

    it('should update project (simulate auto-save)', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send({
          htmlContent: '<h1>Auto-saved</h1>',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.htmlContent).toBe('<h1>Auto-saved</h1>');
    });

    it('should retrieve synced project', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.data.htmlContent).toBe('<h1>Auto-saved</h1>');
    });
  });

  describe('Version History', () => {
    it('should track version changes', async () => {
      // Make multiple updates
      await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send({ htmlContent: '<h1>Version 2</h1>' });

      await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send({ htmlContent: '<h1>Version 3</h1>' });

      // Get version history
      const response = await request(app)
        .get(`/api/projects/${projectId}/versions`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Conflict Detection', () => {
    it('should handle concurrent updates', async () => {
      // Simulate two clients updating simultaneously
      const update1 = request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send({ htmlContent: '<h1>Client 1</h1>' });

      const update2 = request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send({ htmlContent: '<h1>Client 2</h1>' });

      const [response1, response2] = await Promise.all([update1, update2]);

      // Both should succeed (last write wins)
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Verify final state
      const finalState = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Cookie', authCookie);

      expect(finalState.body.data.htmlContent).toBeDefined();
    });
  });

  describe('Offline Queue Simulation', () => {
    it('should handle queued updates', async () => {
      // Simulate multiple queued updates
      const updates = [
        { htmlContent: '<h1>Update 1</h1>' },
        { htmlContent: '<h1>Update 2</h1>' },
        { htmlContent: '<h1>Update 3</h1>' },
      ];

      for (const update of updates) {
        await request(app)
          .put(`/api/projects/${projectId}`)
          .set('Cookie', authCookie)
          .send(update);
      }

      // Verify final state
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.data.htmlContent).toBe('<h1>Update 3</h1>');
    });
  });
});
