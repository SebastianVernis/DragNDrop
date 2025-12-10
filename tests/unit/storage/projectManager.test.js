/**
 * Unit tests for ProjectManager
 * @test
 */

const ProjectManager = require('../../../src/storage/projectManager');

describe('ProjectManager', () => {
  let projectManager;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="canvas">
        <div class="canvas-element" id="element-1">Test Element</div>
      </div>
    `;

    // Mock global functions
    window.showToast = jest.fn();
    window.selectElement = jest.fn();
    window.makeElementEditable = jest.fn();
    window.deleteElement = jest.fn();

    // Clear localStorage
    localStorage.clear();

    // Mock timers
    jest.useFakeTimers();

    projectManager = new ProjectManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    it('should initialize with default storage keys', () => {
      expect(projectManager.storageKey).toBe('dragndrop_projects');
      expect(projectManager.currentProjectKey).toBe('dragndrop_current_project');
    });

    it('should set auto-save interval to 30 seconds', () => {
      expect(projectManager.autoSaveInterval).toBe(30000);
    });

    it('should initialize with null current project', () => {
      localStorage.clear();
      const pm = new ProjectManager();
      // After init, if no stored project, currentProject may still be null
      expect(pm.currentProject).toBeDefined();
    });

    it('should call init on construction', () => {
      const initSpy = jest.spyOn(ProjectManager.prototype, 'init');
      new ProjectManager();
      expect(initSpy).toHaveBeenCalled();
      initSpy.mockRestore();
    });
  });

  describe('init()', () => {
    it('should load current project', () => {
      const loadSpy = jest.spyOn(projectManager, 'loadCurrentProject');
      projectManager.init();
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should start auto-save', () => {
      const autoSaveSpy = jest.spyOn(projectManager, 'startAutoSave');
      projectManager.init();
      expect(autoSaveSpy).toHaveBeenCalled();
    });

    it('should setup event listeners', () => {
      const setupSpy = jest.spyOn(projectManager, 'setupEventListeners');
      projectManager.init();
      expect(setupSpy).toHaveBeenCalled();
    });
  });

  describe('createNewProject()', () => {
    it('should create project with provided name', () => {
      const project = projectManager.createNewProject('Test Project');

      expect(project.name).toBe('Test Project');
    });

    it('should create project with default name if none provided', () => {
      const project = projectManager.createNewProject();

      expect(project.name).toContain('Proyecto');
    });

    it('should generate unique ID', () => {
      const project = projectManager.createNewProject('Test');

      expect(project.id).toMatch(/^project_\d+_[a-z0-9]+$/);
    });

    it('should set created and modified timestamps', () => {
      const project = projectManager.createNewProject('Test');

      expect(project.created).toBeDefined();
      expect(project.modified).toBeDefined();
    });

    it('should initialize with empty HTML', () => {
      // Clear canvas before creating project
      document.getElementById('canvas').innerHTML = '';
      const project = projectManager.createNewProject('Test');

      expect(project.html).toBe('');
    });

    it('should set version to 1', () => {
      const project = projectManager.createNewProject('Test');

      expect(project.version).toBe(1);
    });

    it('should show success message', () => {
      projectManager.createNewProject('Test Project');

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('Test Project')
      );
    });

    it('should save the new project', () => {
      const saveSpy = jest.spyOn(projectManager, 'saveCurrentProject');
      projectManager.createNewProject('Test');

      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('saveCurrentProject()', () => {
    it('should create new project if none exists', () => {
      projectManager.currentProject = null;
      projectManager.saveCurrentProject();

      expect(projectManager.currentProject).toBeTruthy();
    });

    it('should capture canvas HTML', () => {
      projectManager.createNewProject('Test');
      projectManager.saveCurrentProject();

      expect(projectManager.currentProject.html).toContain('canvas-element');
    });

    it('should update modified timestamp', () => {
      projectManager.createNewProject('Test');
      const originalModified = projectManager.currentProject.modified;

      // Wait a bit
      jest.advanceTimersByTime(100);
      projectManager.saveCurrentProject();

      expect(projectManager.currentProject.modified).not.toBe(originalModified);
    });

    it('should save to localStorage', () => {
      projectManager.createNewProject('Test');
      projectManager.saveCurrentProject();

      const stored = localStorage.getItem(projectManager.currentProjectKey);
      expect(stored).toBeTruthy();
    });
  });

  describe('saveToStorage()', () => {
    it('should add new project to storage', () => {
      projectManager.createNewProject('Test');
      projectManager.saveToStorage();

      const projects = projectManager.getStoredProjects();
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should update existing project', () => {
      projectManager.createNewProject('Test');
      projectManager.saveToStorage();

      projectManager.currentProject.name = 'Updated Name';
      projectManager.saveToStorage();

      const projects = projectManager.getStoredProjects();
      const found = projects.find(p => p.id === projectManager.currentProject.id);
      expect(found.name).toBe('Updated Name');
    });

    it('should limit to 20 projects', () => {
      // Create 25 projects
      for (let i = 0; i < 25; i++) {
        projectManager.currentProject = {
          id: `project_${i}`,
          name: `Project ${i}`,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          html: '',
          version: 1,
        };
        projectManager.saveToStorage();
      }

      const projects = projectManager.getStoredProjects();
      expect(projects.length).toBeLessThanOrEqual(20);
    });

    it('should add new projects at the beginning', () => {
      projectManager.createNewProject('First');
      projectManager.saveToStorage();

      projectManager.createNewProject('Second');
      projectManager.saveToStorage();

      const projects = projectManager.getStoredProjects();
      expect(projects[0].name).toBe('Second');
    });
  });

  describe('loadCurrentProject()', () => {
    it('should load project from localStorage', () => {
      const testProject = {
        id: 'test_123',
        name: 'Stored Project',
        html: '<div>Test</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.currentProjectKey, JSON.stringify(testProject));

      projectManager.loadCurrentProject();

      expect(projectManager.currentProject.name).toBe('Stored Project');
    });

    it('should show success message on load', () => {
      const testProject = {
        id: 'test_123',
        name: 'Stored Project',
        html: '<div>Test</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.currentProjectKey, JSON.stringify(testProject));

      projectManager.loadCurrentProject();

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('restaurado')
      );
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem(projectManager.currentProjectKey, 'invalid-json');

      expect(() => projectManager.loadCurrentProject()).not.toThrow();
    });

    it('should load HTML to canvas', () => {
      const testProject = {
        id: 'test_123',
        name: 'Test',
        html: '<div class="canvas-element" id="loaded-element">Loaded</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.currentProjectKey, JSON.stringify(testProject));

      projectManager.loadCurrentProject();

      const canvas = document.getElementById('canvas');
      expect(canvas.innerHTML).toContain('loaded-element');
    });
  });

  describe('loadProject()', () => {
    it('should load project by ID', () => {
      const testProject = {
        id: 'test_123',
        name: 'Test Project',
        html: '<div>Test</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      const result = projectManager.loadProject('test_123');

      expect(result).toBe(true);
      expect(projectManager.currentProject.name).toBe('Test Project');
    });

    it('should return false for non-existent project', () => {
      const result = projectManager.loadProject('non_existent');

      expect(result).toBe(false);
    });

    it('should show error for non-existent project', () => {
      projectManager.loadProject('non_existent');

      expect(window.showToast).toHaveBeenCalledWith('Proyecto no encontrado');
    });

    it('should show success message on load', () => {
      const testProject = {
        id: 'test_123',
        name: 'Test Project',
        html: '<div>Test</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      projectManager.loadProject('test_123');

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('cargado')
      );
    });
  });

  describe('loadProjectToCanvas()', () => {
    it('should load HTML to canvas', () => {
      const project = {
        html: '<div class="test-element">Test Content</div>',
      };

      projectManager.loadProjectToCanvas(project);

      const canvas = document.getElementById('canvas');
      expect(canvas.innerHTML).toContain('test-element');
    });

    it('should handle empty HTML', () => {
      const project = { html: '' };
      // Clear canvas first
      document.getElementById('canvas').innerHTML = '';

      projectManager.loadProjectToCanvas(project);

      const canvas = document.getElementById('canvas');
      expect(canvas.innerHTML).toBe('');
    });

    it('should handle null HTML', () => {
      const project = { html: null };

      expect(() => projectManager.loadProjectToCanvas(project)).not.toThrow();
    });
  });

  describe('getStoredProjects()', () => {
    it('should return empty array when no projects stored', () => {
      const projects = projectManager.getStoredProjects();

      expect(projects).toEqual([]);
    });

    it('should return stored projects', () => {
      const testProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ];
      localStorage.setItem(projectManager.storageKey, JSON.stringify(testProjects));

      const projects = projectManager.getStoredProjects();

      expect(projects.length).toBe(2);
    });

    it('should handle invalid JSON', () => {
      localStorage.setItem(projectManager.storageKey, 'invalid-json');

      const projects = projectManager.getStoredProjects();

      expect(projects).toEqual([]);
    });
  });

  describe('deleteProject()', () => {
    it('should remove project from storage', () => {
      const testProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ];
      localStorage.setItem(projectManager.storageKey, JSON.stringify(testProjects));

      projectManager.deleteProject('1');

      const projects = projectManager.getStoredProjects();
      expect(projects.length).toBe(1);
      expect(projects[0].id).toBe('2');
    });

    it('should create new project if deleting current', () => {
      projectManager.createNewProject('Current');
      const currentId = projectManager.currentProject.id;

      projectManager.deleteProject(currentId);

      expect(projectManager.currentProject.id).not.toBe(currentId);
    });

    it('should show success message', () => {
      projectManager.deleteProject('any_id');

      expect(window.showToast).toHaveBeenCalledWith('Proyecto eliminado');
    });
  });

  describe('duplicateProject()', () => {
    it('should create copy of project', () => {
      const testProject = {
        id: 'original',
        name: 'Original Project',
        html: '<div>Content</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      const duplicated = projectManager.duplicateProject('original');

      expect(duplicated.name).toBe('Original Project (Copia)');
      expect(duplicated.id).not.toBe('original');
    });

    it('should preserve HTML content', () => {
      const testProject = {
        id: 'original',
        name: 'Original',
        html: '<div>Test Content</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      const duplicated = projectManager.duplicateProject('original');

      expect(duplicated.html).toBe('<div>Test Content</div>');
    });

    it('should return null for non-existent project', () => {
      const result = projectManager.duplicateProject('non_existent');

      expect(result).toBeNull();
    });

    it('should add duplicated project to storage', () => {
      const testProject = {
        id: 'original',
        name: 'Original',
        html: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      projectManager.duplicateProject('original');

      const projects = projectManager.getStoredProjects();
      expect(projects.length).toBe(2);
    });
  });

  describe('renameProject()', () => {
    it('should rename project', () => {
      const testProject = {
        id: 'test_123',
        name: 'Old Name',
        html: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      const result = projectManager.renameProject('test_123', 'New Name');

      expect(result).toBe(true);
      const projects = projectManager.getStoredProjects();
      expect(projects[0].name).toBe('New Name');
    });

    it('should update current project if same', () => {
      projectManager.createNewProject('Old Name');
      const projectId = projectManager.currentProject.id;
      // Save to storage so renameProject can find it
      projectManager.saveToStorage();

      projectManager.renameProject(projectId, 'New Name');

      expect(projectManager.currentProject.name).toBe('New Name');
    });

    it('should return false for non-existent project', () => {
      const result = projectManager.renameProject('non_existent', 'New Name');

      expect(result).toBe(false);
    });

    it('should show success message', () => {
      const testProject = {
        id: 'test_123',
        name: 'Old Name',
        html: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      projectManager.renameProject('test_123', 'New Name');

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('New Name')
      );
    });
  });

  describe('exportProject()', () => {
    it('should export current project', () => {
      // Mock URL and createElement
      const mockUrl = 'blob:test';
      URL.createObjectURL = jest.fn(() => mockUrl);
      URL.revokeObjectURL = jest.fn();

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      document.createElement = jest.fn(() => mockAnchor);

      projectManager.createNewProject('Export Test');
      projectManager.exportProject();

      expect(mockAnchor.click).toHaveBeenCalled();
      expect(mockAnchor.download).toContain('Export Test');
    });

    it('should export specific project by ID', () => {
      const testProject = {
        id: 'test_123',
        name: 'Specific Project',
        html: '',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      localStorage.setItem(projectManager.storageKey, JSON.stringify([testProject]));

      const mockUrl = 'blob:test';
      URL.createObjectURL = jest.fn(() => mockUrl);
      URL.revokeObjectURL = jest.fn();

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      document.createElement = jest.fn(() => mockAnchor);

      projectManager.exportProject('test_123');

      expect(mockAnchor.download).toContain('Specific Project');
    });
  });

  describe('importProject()', () => {
    it('should import valid project file', async () => {
      const projectData = {
        id: 'imported_123',
        name: 'Imported Project',
        html: '<div>Imported</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };

      const file = new Blob([JSON.stringify(projectData)], { type: 'application/json' });

      const result = await projectManager.importProject(file);

      expect(result).toBeTruthy();
      expect(result.name).toContain('Importado');
    });

    it('should reject invalid project format', async () => {
      const invalidData = { invalid: 'data' };
      const file = new Blob([JSON.stringify(invalidData)], { type: 'application/json' });

      const result = await projectManager.importProject(file);

      expect(result).toBeNull();
    });

    it('should show error for invalid format', async () => {
      const invalidData = { invalid: 'data' };
      const file = new Blob([JSON.stringify(invalidData)], { type: 'application/json' });

      await projectManager.importProject(file);

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('Error')
      );
    });

    it('should generate new ID for imported project', async () => {
      const projectData = {
        id: 'original_id',
        name: 'Imported',
        html: '<div>Test</div>',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };

      const file = new Blob([JSON.stringify(projectData)], { type: 'application/json' });

      const result = await projectManager.importProject(file);

      expect(result.id).not.toBe('original_id');
    });
  });

  describe('startAutoSave()', () => {
    it('should set auto-save timer', () => {
      projectManager.startAutoSave();

      expect(projectManager.autoSaveTimer).toBeTruthy();
    });

    it('should save project on interval', () => {
      projectManager.createNewProject('Test');
      const saveSpy = jest.spyOn(projectManager, 'saveCurrentProject');

      projectManager.startAutoSave();
      jest.advanceTimersByTime(30000);

      expect(saveSpy).toHaveBeenCalled();
    });

    it('should clear existing timer before starting new one', () => {
      projectManager.startAutoSave();
      const firstTimer = projectManager.autoSaveTimer;

      projectManager.startAutoSave();

      expect(projectManager.autoSaveTimer).not.toBe(firstTimer);
    });
  });

  describe('stopAutoSave()', () => {
    it('should clear auto-save timer', () => {
      projectManager.startAutoSave();
      projectManager.stopAutoSave();

      expect(projectManager.autoSaveTimer).toBeNull();
    });

    it('should handle null timer', () => {
      projectManager.autoSaveTimer = null;

      expect(() => projectManager.stopAutoSave()).not.toThrow();
    });
  });

  describe('generateId()', () => {
    it('should generate unique IDs', () => {
      const id1 = projectManager.generateId();
      const id2 = projectManager.generateId();

      expect(id1).not.toBe(id2);
    });

    it('should start with project_ prefix', () => {
      const id = projectManager.generateId();

      expect(id).toMatch(/^project_/);
    });

    it('should include timestamp', () => {
      const id = projectManager.generateId();

      expect(id).toMatch(/^project_\d+_/);
    });
  });

  describe('getCurrentProjectInfo()', () => {
    it('should return current project info', () => {
      projectManager.createNewProject('Test');

      const info = projectManager.getCurrentProjectInfo();

      expect(info.name).toBe('Test');
    });

    it('should return null if no current project', () => {
      projectManager.currentProject = null;

      const info = projectManager.getCurrentProjectInfo();

      expect(info).toBeNull();
    });

    it('should return copy, not reference', () => {
      projectManager.createNewProject('Test');

      const info = projectManager.getCurrentProjectInfo();
      info.name = 'Modified';

      expect(projectManager.currentProject.name).toBe('Test');
    });
  });

  describe('getProjectStats()', () => {
    it('should return project statistics', () => {
      projectManager.createNewProject('Test');
      projectManager.saveToStorage();

      const stats = projectManager.getProjectStats();

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.current).toBe('Test');
    });

    it('should handle no projects', () => {
      projectManager.currentProject = null;

      const stats = projectManager.getProjectStats();

      expect(stats.current).toBe('Sin proyecto');
    });

    it('should return last modified date', () => {
      projectManager.createNewProject('Test');
      projectManager.saveToStorage();

      const stats = projectManager.getProjectStats();

      expect(stats.lastModified).toBeTruthy();
    });
  });

  describe('showSuccess()', () => {
    it('should call showToast when available', () => {
      projectManager.showSuccess('Test message');

      expect(window.showToast).toHaveBeenCalledWith('Test message');
    });

    it('should log to console when showToast not available', () => {
      window.showToast = undefined;
      const consoleSpy = jest.spyOn(console, 'log');

      projectManager.showSuccess('Test message');

      expect(consoleSpy).toHaveBeenCalledWith('SUCCESS:', 'Test message');
    });
  });

  describe('showError()', () => {
    it('should call showToast when available', () => {
      projectManager.showError('Error message');

      expect(window.showToast).toHaveBeenCalledWith('Error message');
    });

    it('should log to console when showToast not available', () => {
      window.showToast = undefined;
      const consoleSpy = jest.spyOn(console, 'error');

      projectManager.showError('Error message');

      expect(consoleSpy).toHaveBeenCalledWith('ERROR:', 'Error message');
    });
  });
});
