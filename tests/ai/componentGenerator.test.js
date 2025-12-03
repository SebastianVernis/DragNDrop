/**
 * Component Generator Tests
 */

// Mock Gemini API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window objects
global.window = {
    promptBuilder: {
        buildComponentPrompt: jest.fn(() => 'test prompt'),
        estimateTokens: jest.fn(() => ({ estimated: 100, canAfford: true }))
    },
    responseParser: {
        parseComponentResponse: jest.fn(() => ({
            success: true,
            html: '<div>Test Component</div>',
            tokens: { input: 50, output: 50, total: 100 },
            validation: { valid: true, issues: [] }
        }))
    },
    tokenTracker: {
        checkLimits: jest.fn(() => ({ canProceed: true, exceeded: false, warnings: [] })),
        track: jest.fn()
    },
    dispatchEvent: jest.fn()
};

describe('AIComponentGenerator', () => {
    let generator;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue('test-api-key');
        
        // Load the class
        const AIComponentGenerator = require('../../src/ai/componentGenerator.js').default || 
                                     global.AIComponentGenerator;
        generator = new AIComponentGenerator();
    });

    describe('Initialization', () => {
        test('should load API key from localStorage', () => {
            expect(localStorageMock.getItem).toHaveBeenCalledWith('gemini_api_key');
            expect(generator.enabled).toBe(true);
        });

        test('should be disabled without API key', () => {
            localStorageMock.getItem.mockReturnValue(null);
            const gen = new AIComponentGenerator();
            expect(gen.enabled).toBe(false);
        });
    });

    describe('API Key Management', () => {
        test('should set API key', () => {
            generator.setApiKey('new-key');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('gemini_api_key', 'new-key');
            expect(generator.enabled).toBe(true);
        });

        test('should throw error for invalid API key', () => {
            expect(() => generator.setApiKey('')).toThrow('Invalid API key');
        });

        test('should check if enabled', () => {
            expect(generator.isEnabled()).toBe(true);
        });
    });

    describe('Component Generation', () => {
        beforeEach(() => {
            fetch.mockResolvedValue({
                ok: true,
                json: async () => ({
                    candidates: [{
                        content: {
                            parts: [{ text: '<div>Generated</div>' }]
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

        test('should generate component successfully', async () => {
            const result = await generator.generate('Create a button', {
                style: 'modern'
            });

            expect(result.success).toBe(true);
            expect(result.html).toBeDefined();
            expect(result.tokens).toBeDefined();
        });

        test('should throw error when not enabled', async () => {
            generator.enabled = false;
            await expect(generator.generate('test')).rejects.toThrow();
        });

        test('should check token limits before generation', async () => {
            await generator.generate('test');
            expect(window.tokenTracker.checkLimits).toHaveBeenCalled();
        });

        test('should track tokens after generation', async () => {
            await generator.generate('test');
            expect(window.tokenTracker.track).toHaveBeenCalled();
        });

        test('should dispatch events', async () => {
            await generator.generate('test');
            expect(window.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'ai:generation:start'
                })
            );
        });
    });

    describe('Token Estimation', () => {
        test('should estimate tokens for description', () => {
            const estimation = generator.estimateTokens('Create a button', 'modern');
            expect(window.promptBuilder.estimateTokens).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        test('should handle API errors', async () => {
            fetch.mockResolvedValue({
                ok: false,
                json: async () => ({ error: { message: 'API Error' } })
            });

            await expect(generator.generate('test')).rejects.toThrow();
        });

        test('should retry on rate limit', async () => {
            fetch
                .mockResolvedValueOnce({
                    ok: false,
                    json: async () => ({ error: { message: '429 Rate Limit' } })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({
                        candidates: [{
                            content: { parts: [{ text: '<div>Test</div>' }] }
                        }],
                        usageMetadata: { totalTokenCount: 100 }
                    })
                });

            const result = await generator.generate('test');
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });
});

describe('PromptBuilder', () => {
    let builder;

    beforeEach(() => {
        const PromptBuilder = require('../../src/ai/promptBuilder.js').default || 
                             global.PromptBuilder;
        builder = new PromptBuilder();
    });

    test('should build component prompt', () => {
        const prompt = builder.buildComponentPrompt('Create a button', 'modern');
        expect(prompt).toContain('Create a button');
        expect(prompt).toContain('modern');
    });

    test('should build refinement prompt', () => {
        const prompt = builder.buildRefinementPrompt('<div>Test</div>', 'Make it blue');
        expect(prompt).toContain('Make it blue');
    });

    test('should estimate tokens', () => {
        const estimate = builder.estimateTokens('test prompt');
        expect(estimate).toBeGreaterThan(0);
    });

    test('should get style presets', () => {
        const presets = builder.getStylePresets();
        expect(presets).toHaveProperty('modern');
        expect(presets).toHaveProperty('gradient');
    });
});

describe('ResponseParser', () => {
    let parser;

    beforeEach(() => {
        const ResponseParser = require('../../src/ai/responseParser.js').default || 
                              global.ResponseParser;
        parser = new ResponseParser();
    });

    test('should parse valid API response', () => {
        const apiResponse = {
            candidates: [{
                content: {
                    parts: [{ text: '<div>Test</div>' }]
                }
            }],
            usageMetadata: {
                promptTokenCount: 50,
                candidatesTokenCount: 50,
                totalTokenCount: 100
            }
        };

        const result = parser.parseResponse(apiResponse);
        expect(result.success).toBe(true);
        expect(result.text).toBe('<div>Test</div>');
        expect(result.tokens.total).toBe(100);
    });

    test('should extract HTML from code blocks', () => {
        const text = '```html\n<div>Test</div>\n```';
        const html = parser.extractHTML(text);
        expect(html).toBe('<div>Test</div>');
    });

    test('should extract JSON', () => {
        const text = '{"key": "value"}';
        const json = parser.extractJSON(text);
        expect(json).toEqual({ key: 'value' });
    });

    test('should validate HTML', () => {
        const validation = parser.validateHTML('<div>Test</div>');
        expect(validation.valid).toBe(true);
    });
});
