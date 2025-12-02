/**
 * Projects API Tests
 */

import request from 'supertest';
import app from '../server.js';

describe('Projects API', () => {
  let authCookie;
  let testProjectId;

  const testUser = {
    email: 'projects-test@example.com',
    password: 'TestPassword123!',
    name: 'Projects Test User',
  };

  const testProject = {
    name: 'Test Project',
    description: 'A test project',
    htmlContent: '<h1>Hello World</h1>',
    cssContent: 'h1 { color: blue; }',
    jsContent: 'console.log("test");',
  };

  beforeAll(async () => {
    // Create and sign in test user
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

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(testProject)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(testProject.name);

      testProjectId = response.body.data.id;
    });

    it('should reject unauthenticated request', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send(testProject);

      expect(response.status).toBe(401);
    });

    it('should reject invalid data', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send({ name: '' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/projects', () => {
    it('should get all user projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Cookie', authCookie)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/projects?limit=5&offset=0')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get project by ID', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .set('Cookie', authCookie)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testProjectId);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project', async () => {
      const updates = {
        name: 'Updated Project Name',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/projects/${testProjectId}`)
        .set('Cookie', authCookie)
        .send(updates)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
    });

    it('should increment version on update', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProjectId}`)
        .set('Cookie', authCookie)
        .send({ htmlContent: '<h1>Updated</h1>' });

      expect(response.body.data.version).toBeGreaterThan(1);
    });
  });

  describe('GET /api/projects/:id/versions', () => {
    it('should get project version history', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProjectId}/versions`)
        .set('Cookie', authCookie)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProjectId}`)
        .set('Cookie', authCookie)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 after deletion', async () => {
      const response = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
    });
  });
});
