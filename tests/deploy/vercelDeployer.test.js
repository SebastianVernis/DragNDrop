/**
 * VercelDeployer Tests
 */

import { VercelDeployer } from '../../src/deploy/vercelDeployer.js';

// Mock dependencies
jest.mock('../../src/deploy/fileUploader.js');
jest.mock('../../src/deploy/deploymentMonitor.js');
jest.mock('../../src/deploy/deploymentHistory.js');

describe('VercelDeployer', () => {
  let deployer;

  beforeEach(() => {
    deployer = new VercelDeployer();
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connect', () => {
    it('should connect with token', () => {
      const token = 'vercel_test_token';
      deployer.connect(token);

      expect(deployer.isConnected()).toBe(true);
      expect(deployer.token).toBe(token);
    });

    it('should save token to localStorage', () => {
      const token = 'vercel_test_token';
      deployer.connect(token);

      expect(localStorage.getItem('vercel_token')).toBe(token);
    });

    it('should connect with team ID', () => {
      const token = 'vercel_test_token';
      const teamId = 'team_123';
      deployer.connect(token, teamId);

      expect(deployer.teamId).toBe(teamId);
      expect(localStorage.getItem('vercel_team_id')).toBe(teamId);
    });
  });

  describe('disconnect', () => {
    it('should disconnect and clear token', () => {
      deployer.connect('test_token');
      deployer.disconnect();

      expect(deployer.isConnected()).toBe(false);
      expect(deployer.token).toBeNull();
      expect(localStorage.getItem('vercel_token')).toBeNull();
    });
  });

  describe('isConnected', () => {
    it('should return false when not connected', () => {
      expect(deployer.isConnected()).toBe(false);
    });

    it('should return true when connected', () => {
      deployer.connect('test_token');
      expect(deployer.isConnected()).toBe(true);
    });
  });

  describe('sanitizeProjectName', () => {
    it('should sanitize project name', () => {
      expect(deployer.sanitizeProjectName('My Project!')).toBe('my-project');
      expect(deployer.sanitizeProjectName('Test_Project_123')).toBe('test-project-123');
      expect(deployer.sanitizeProjectName('UPPERCASE')).toBe('uppercase');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(deployer.sanitizeProjectName('-test-')).toBe('test');
    });

    it('should limit length to 100 characters', () => {
      const longName = 'a'.repeat(150);
      const sanitized = deployer.sanitizeProjectName(longName);
      expect(sanitized.length).toBeLessThanOrEqual(100);
    });
  });

  describe('maskToken', () => {
    it('should mask token for display', () => {
      const token = 'vercel_1234567890abcdef';
      const masked = deployer.maskToken(token);

      expect(masked).toContain('vercel_1');
      expect(masked).toContain('...');
      expect(masked).not.toBe(token);
    });

    it('should handle short tokens', () => {
      const token = 'short';
      const masked = deployer.maskToken(token);

      expect(masked).toBe('***');
    });
  });

  describe('getDeploymentHistory', () => {
    it('should return deployment history', () => {
      deployer.connect('test_token');
      const history = deployer.getDeploymentHistory();

      expect(Array.isArray(history)).toBe(true);
    });

    it('should limit history items', () => {
      deployer.connect('test_token');
      const history = deployer.getDeploymentHistory(5);

      expect(history.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getStatistics', () => {
    it('should return deployment statistics', () => {
      deployer.connect('test_token');
      const stats = deployer.getStatistics();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('successful');
      expect(stats).toHaveProperty('failed');
      expect(stats).toHaveProperty('avgDuration');
    });
  });
});
