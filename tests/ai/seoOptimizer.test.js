/**
 * SEO Optimizer Tests
 */

// Mock DOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head><title>Test</title></head><body><div id="canvas"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(() => 'test-api-key'),
    setItem: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window objects
global.window.seoRules = {
    checkAll: jest.fn(() => []),
    calculateScore: jest.fn(() => 85)
};

global.window.promptBuilder = {
    buildMetaTagsPrompt: jest.fn(() => 'test prompt')
};

global.window.responseParser = {
    parseResponse: jest.fn(() => ({
        success: true,
        text: 'Test Title',
        tokens: { input: 50, output: 50, total: 100 }
    })),
    parseMetaTagsResponse: jest.fn(() => ({
        success: true,
        metaTags: {
            title: 'Test',
            description: 'Test description',
            og: {}
        },
        tokens: { input: 50, output: 50, total: 100 }
    }))
};

global.window.tokenTracker = {
    track: jest.fn()
};

global.fetch = jest.fn();

describe('SEOOptimizer', () => {
    let optimizer;

    beforeEach(() => {
        jest.clearAllMocks();
        const SEOOptimizer = require('../../src/ai/seoOptimizer.js').default || 
                            global.SEOOptimizer;
        optimizer = new SEOOptimizer();
    });

    describe('Initialization', () => {
        test('should load API key', () => {
            expect(localStorageMock.getItem).toHaveBeenCalledWith('gemini_api_key');
            expect(optimizer.enabled).toBe(true);
        });

        test('should check if enabled', () => {
            expect(optimizer.isEnabled()).toBe(true);
        });
    });

    describe('Analysis', () => {
        test('should analyze page for SEO', () => {
            const results = optimizer.analyze();
            
            expect(results).toHaveProperty('score');
            expect(results).toHaveProperty('issues');
            expect(results).toHaveProperty('recommendations');
            expect(window.seoRules.checkAll).toHaveBeenCalled();
        });

        test('should store analysis results', () => {
            optimizer.analyze();
            expect(optimizer.lastAnalysis).toBeDefined();
        });

        test('should group issues by category', () => {
            const issues = [
                { category: 'meta', severity: 'error' },
                { category: 'content', severity: 'warning' }
            ];
            
            const grouped = optimizer.groupIssues(issues);
            expect(grouped.byCategory.meta).toHaveLength(1);
            expect(grouped.byCategory.content).toHaveLength(1);
        });
    });

    describe('AI Generation', () => {
        beforeEach(() => {
            fetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    candidates: [{
                        content: {
                            parts: [{ text: 'Generated Title' }]
                        }
                    }],
                    usageMetadata: {
                        promptTokenCount: 50,
                        candidatesTokenCount: 50,
                        totalTokenCount: 100
                    }
                })
            });
        });

        test('should generate title with AI', async () => {
            const result = await optimizer.generateTitle();
            
            expect(result.success).toBe(true);
            expect(result.title).toBeDefined();
            expect(window.tokenTracker.track).toHaveBeenCalled();
        });

        test('should generate meta description', async () => {
            const result = await optimizer.generateMetaDescription();
            
            expect(result.success).toBe(true);
            expect(result.description).toBeDefined();
        });

        test('should generate OG tags', async () => {
            const result = await optimizer.generateOGTags();
            
            expect(result.success).toBe(true);
            expect(result.metaTags).toBeDefined();
        });

        test('should throw error when not enabled', async () => {
            optimizer.enabled = false;
            await expect(optimizer.generateTitle()).rejects.toThrow();
        });
    });

    describe('Structured Data', () => {
        test('should generate structured data', () => {
            const result = optimizer.generateStructuredData('WebPage', {
                name: 'Test Page'
            });
            
            expect(result.success).toBe(true);
            expect(result.structuredData).toHaveProperty('@context');
            expect(result.structuredData).toHaveProperty('@type');
            expect(result.script).toContain('application/ld+json');
        });
    });

    describe('Scoring', () => {
        test('should get SEO score', () => {
            optimizer.lastAnalysis = {
                score: 75,
                summary: { status: 'good', message: 'Good SEO' }
            };
            
            const score = optimizer.getScore();
            expect(score.score).toBe(75);
            expect(score.status).toBe('good');
        });

        test('should return null without analysis', () => {
            const score = optimizer.getScore();
            expect(score).toBeNull();
        });
    });

    describe('Report Generation', () => {
        beforeEach(() => {
            optimizer.lastAnalysis = {
                timestamp: Date.now(),
                score: 80,
                totalIssues: 3,
                issues: [{ ruleId: 'test', category: 'meta', severity: 'warning' }],
                grouped: { byCategory: {}, bySeverity: {} },
                recommendations: [],
                summary: { status: 'good', message: 'Good', errorCount: 0, warningCount: 3 }
            };
        });

        test('should generate report', () => {
            const report = optimizer.generateReport();
            
            expect(report).toHaveProperty('metadata');
            expect(report).toHaveProperty('summary');
            expect(report).toHaveProperty('issues');
            expect(report).toHaveProperty('recommendations');
        });

        test('should throw error without analysis', () => {
            optimizer.lastAnalysis = null;
            expect(() => optimizer.generateReport()).toThrow();
        });
    });
});

describe('SEORules', () => {
    let rules;

    beforeEach(() => {
        const SEORules = require('../../src/ai/seoRules.js').default || 
                        global.SEORules;
        rules = new SEORules();
    });

    test('should have multiple rules', () => {
        const allRules = rules.getAllRules();
        expect(allRules.length).toBeGreaterThan(10);
    });

    test('should get rule by ID', () => {
        const rule = rules.getRule('title-length');
        expect(rule).toBeDefined();
        expect(rule.id).toBe('title-length');
    });

    test('should get rules by category', () => {
        const metaRules = rules.getRulesByCategory('meta');
        expect(metaRules.length).toBeGreaterThan(0);
    });

    test('should check all rules', () => {
        const element = document.createElement('div');
        const issues = rules.checkAll(element);
        expect(Array.isArray(issues)).toBe(true);
    });

    test('should calculate score', () => {
        const issues = [
            { severity: 'error' },
            { severity: 'warning' }
        ];
        const score = rules.calculateScore(issues);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
    });
});

describe('TokenTracker', () => {
    let tracker;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            daily: { input: 0, output: 0, requests: 0 },
            monthly: { input: 0, output: 0, requests: 0 },
            total: { input: 0, output: 0, requests: 0 },
            byFeature: {},
            history: [],
            lastResetDate: new Date().toDateString(),
            monthStartDate: new Date().toISOString().slice(0, 7)
        }));

        const TokenTracker = require('../../src/ai/tokenTracker.js').default || 
                            global.TokenTracker;
        tracker = new TokenTracker();
    });

    test('should track token usage', () => {
        const result = tracker.track(
            { inputTokens: 50, outputTokens: 50 },
            'test-feature'
        );
        
        expect(result.daily.input).toBe(50);
        expect(result.daily.output).toBe(50);
    });

    test('should calculate cost', () => {
        const cost = tracker.calculateCost(1000, 1000);
        expect(cost).toBeGreaterThan(0);
    });

    test('should check limits', () => {
        const limits = tracker.checkLimits();
        expect(limits).toHaveProperty('exceeded');
        expect(limits).toHaveProperty('warnings');
        expect(limits).toHaveProperty('canProceed');
    });

    test('should estimate tokens', () => {
        const estimation = tracker.estimateTokens('test prompt');
        expect(estimation.estimated).toBeGreaterThan(0);
        expect(estimation).toHaveProperty('canAfford');
    });

    test('should get usage statistics', () => {
        const usage = tracker.getUsage();
        expect(usage).toHaveProperty('daily');
        expect(usage).toHaveProperty('monthly');
        expect(usage).toHaveProperty('costs');
    });

    test('should reset daily usage', () => {
        tracker.usage.daily = { input: 100, output: 100, requests: 5 };
        tracker.resetDaily();
        expect(tracker.usage.daily.input).toBe(0);
    });
});
