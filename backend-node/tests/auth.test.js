/**
 * Authentication Tests
 * 
 * Tests for Better Auth integration
 */

import request from 'supertest';
import app from '../server.js';

describe('Authentication API', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
  };

  describe('POST /api/auth/sign-up', () => {
    it('should create a new user account', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send(testUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/sign-up')
        .send(testUser);

      const response = await request(app)
        .post('/api/auth/sign-up')
        .send(testUser);

      expect(response.status).toBe(400);
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send({
          ...testUser,
          email: 'weak@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/sign-in', () => {
    beforeAll(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/sign-up')
        .send(testUser);
    });

    it('should sign in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: 'nonexistent@example.com',
          password: 'password',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/session', () => {
    let sessionCookie;

    beforeAll(async () => {
      // Sign in to get session
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      sessionCookie = response.headers['set-cookie'];
    });

    it('should return session for authenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('Cookie', sessionCookie)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('session');
    });

    it('should return null for unauthenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeNull();
    });
  });

  describe('POST /api/auth/sign-out', () => {
    let sessionCookie;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      sessionCookie = response.headers['set-cookie'];
    });

    it('should sign out authenticated user', async () => {
      const response = await request(app)
        .post('/api/auth/sign-out')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(200);
    });

    it('should clear session after sign out', async () => {
      await request(app)
        .post('/api/auth/sign-out')
        .set('Cookie', sessionCookie);

      const sessionResponse = await request(app)
        .get('/api/auth/session')
        .set('Cookie', sessionCookie);

      expect(sessionResponse.body.user).toBeNull();
    });
  });
});
