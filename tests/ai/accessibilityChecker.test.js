/**
 * Accessibility Checker Tests
 */

// Mock DOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="canvas"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Mock window objects
global.window.wcagRules = {
    checkAll: jest.fn(() => []),
    calculateScore: jest.fn(() => 100)
};

global.window.accessibilityFixes = {
    applyAllFixes: jest.fn(() => ({ success: true, totalFixed: 5, results: [] })),
    applyFix: jest.fn(() => ({ success: true, fixed: 1, message: 'Fixed' })),
    hasFixFor: jest.fn(() => true)
};

describe('AccessibilityChecker', () => {
    let checker;

    beforeEach(() => {
        jest.clearAllMocks();
        const AccessibilityChecker = require('../../src/ai/accessibilityChecker.js').default || 
                                     global.AccessibilityChecker;
        checker = new AccessibilityChecker();
    });

    describe('Scanning', () => {
        test('should scan canvas for issues', () => {
            const results = checker.scan();
            
            expect(results).toHaveProperty('score');
            expect(results).toHaveProperty('issues');
            expect(results).toHaveProperty('grouped');
            expect(window.wcagRules.checkAll).toHaveBeenCalled();
        });

        test('should scan specific element', () => {
            const element = document.createElement('div');
            const results = checker.scanElement(element);
            
            expect(results).toBeDefined();
            expect(results.element).toBe(element);
        });

        test('should throw error without element', () => {
            expect(() => checker.scanElement(null)).toThrow();
        });

        test('should store scan results', () => {
            checker.scan();
            expect(checker.lastScanResults).toBeDefined();
        });

        test('should add to scan history', () => {
            checker.scan();
            expect(checker.scanHistory.length).toBeGreaterThan(0);
        });
    });

    describe('Issue Grouping', () => {
        test('should group issues by level', () => {
            const issues = [
                { level: 'A', ruleId: 'test1' },
                { level: 'AA', ruleId: 'test2' }
            ];
            
            const grouped = checker.groupIssues(issues);
            expect(grouped.byLevel.A).toHaveLength(1);
            expect(grouped.byLevel.AA).toHaveLength(1);
        });

        test('should group issues by rule', () => {
            const issues = [
                { ruleId: 'test1', level: 'A' },
                { ruleId: 'test1', level: 'A' }
            ];
            
            const grouped = checker.groupIssues(issues);
            expect(grouped.byRule.test1).toHaveLength(2);
        });
    });

    describe('Auto-Fix', () => {
        beforeEach(() => {
            checker.lastScanResults = {
                element: document.createElement('div'),
                score: 50,
                issues: [{ ruleId: 'test', level: 'A' }]
            };
        });

        test('should auto-fix all issues', () => {
            const result = checker.autoFixAll();
            
            expect(result.success).toBe(true);
            expect(result.totalFixed).toBeGreaterThan(0);
            expect(window.accessibilityFixes.applyAllFixes).toHaveBeenCalled();
        });

        test('should auto-fix specific issue', () => {
            const result = checker.autoFixIssue(0);
            
            expect(result.success).toBe(true);
            expect(window.accessibilityFixes.applyFix).toHaveBeenCalled();
        });

        test('should throw error without scan results', () => {
            checker.lastScanResults = null;
            expect(() => checker.autoFixAll()).toThrow();
        });
    });

    describe('Scoring', () => {
        test('should get accessibility score', () => {
            checker.lastScanResults = {
                score: 85,
                summary: { status: 'good', message: 'Good accessibility' }
            };
            
            const score = checker.getScore();
            expect(score.score).toBe(85);
            expect(score.status).toBe('good');
        });

        test('should return null without results', () => {
            const score = checker.getScore();
            expect(score).toBeNull();
        });
    });

    describe('Report Generation', () => {
        beforeEach(() => {
            checker.lastScanResults = {
                timestamp: Date.now(),
                score: 75,
                totalIssues: 5,
                issues: [{ ruleId: 'test', level: 'A', message: 'Test issue' }],
                grouped: { critical: [], warnings: [] },
                summary: { status: 'good', message: 'Good', levelCounts: { A: 1, AA: 0 } }
            };
        });

        test('should generate report', () => {
            const report = checker.generateReport();
            
            expect(report).toHaveProperty('metadata');
            expect(report).toHaveProperty('summary');
            expect(report).toHaveProperty('issues');
            expect(report).toHaveProperty('recommendations');
        });

        test('should throw error without results', () => {
            checker.lastScanResults = null;
            expect(() => checker.generateReport()).toThrow();
        });
    });
});

describe('WCAGRules', () => {
    let rules;

    beforeEach(() => {
        const WCAGRules = require('../../src/ai/wcagRules.js').default || 
                         global.WCAGRules;
        rules = new WCAGRules();
    });

    test('should have multiple rules', () => {
        const allRules = rules.getAllRules();
        expect(allRules.length).toBeGreaterThan(10);
    });

    test('should get rule by ID', () => {
        const rule = rules.getRule('img-alt');
        expect(rule).toBeDefined();
        expect(rule.id).toBe('img-alt');
    });

    test('should get rules by level', () => {
        const levelARules = rules.getRulesByLevel('A');
        expect(levelARules.length).toBeGreaterThan(0);
    });

    test('should check all rules', () => {
        const element = document.createElement('div');
        const issues = rules.checkAll(element);
        expect(Array.isArray(issues)).toBe(true);
    });

    test('should calculate score', () => {
        const issues = [{ ruleId: 'test1' }, { ruleId: 'test2' }];
        const score = rules.calculateScore(issues);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
    });
});

describe('AccessibilityFixes', () => {
    let fixes;

    beforeEach(() => {
        const AccessibilityFixes = require('../../src/ai/accessibilityFixes.js').default || 
                                   global.AccessibilityFixes;
        fixes = new AccessibilityFixes();
    });

    test('should have multiple fixes', () => {
        const availableFixes = fixes.getAvailableFixes();
        expect(availableFixes.length).toBeGreaterThan(5);
    });

    test('should check if fix is available', () => {
        expect(fixes.hasFixFor('img-alt')).toBe(true);
        expect(fixes.hasFixFor('nonexistent')).toBe(false);
    });

    test('should apply fix for img-alt', () => {
        const element = document.createElement('div');
        element.innerHTML = '<img src="test.jpg">';
        
        const result = fixes.applyFix('img-alt', element);
        expect(result.success).toBe(true);
    });

    test('should apply all fixes', () => {
        const element = document.createElement('div');
        const result = fixes.applyAllFixes(element);
        
        expect(result.success).toBe(true);
        expect(result.results).toBeDefined();
    });
});
