/**
 * Test Suite for Meta Learning Evolution
 * 
 * Tests the adaptive learning mechanisms that evolve from user resistance
 * and feedback in the MetaLearningEvolution module.
 */

const MetaLearningEvolution = require('../../core/meta-learning-evolution');

describe('MetaLearningEvolution', () => {
    let learningEvolution;

    beforeEach(() => {
        learningEvolution = new MetaLearningEvolution();
    });

    describe('initialization', () => {
        test('should initialize with default configuration', () => {
            expect(learningEvolution.learningHistory).toEqual([]);
            expect(learningEvolution.resistancePatterns).toBeDefined();
            expect(learningEvolution.adaptationStrategies).toBeDefined();
            expect(learningEvolution.evolutionThreshold).toBe(0.6);
        });
    });

    describe('resistance analysis', () => {
        test('should analyze resistance patterns', async () => {
            const resistanceEvent = {
                type: 'pushback',
                intensity: 0.7,
                context: 'suggestion_rejection'
            };
            const context = 'collaborative_session';

            const result = await learningEvolution.analyzeResistance(resistanceEvent, context);

            expect(result.patternId).toBeDefined();
            expect(result.resistanceType).toBeDefined();
            expect(result.learningOpportunity).toBeDefined();
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.suggestedAdaptations).toBeInstanceOf(Array);
        });

        test('should generate unique pattern IDs', async () => {
            const resistanceEvent = { type: 'disagreement' };
            const context = 'discussion';

            const result1 = await learningEvolution.analyzeResistance(resistanceEvent, context);
            const result2 = await learningEvolution.analyzeResistance(resistanceEvent, context);

            expect(result1.patternId).not.toBe(result2.patternId);
        });
    });

    describe('behavior pattern evolution', () => {
        test('should evolve behavior patterns', async () => {
            const patternId = 'test_pattern_123';
            const evolutionParameters = { 
                targetImprovement: 0.2,
                adaptationSpeed: 'moderate'
            };

            const result = await learningEvolution.evolveBehaviorPattern(patternId, evolutionParameters);

            expect(result.evolutionId).toBeDefined();
            expect(result.originalPattern).toBe(patternId);
            expect(result.evolvedPattern).toContain(patternId);
            expect(result.improvementMetrics).toBeDefined();
            expect(result.improvementMetrics.effectiveness).toBeGreaterThan(0);
        });
    });

    describe('feedback integration', () => {
        test('should integrate feedback into learning history', () => {
            const feedback = {
                type: 'positive',
                content: 'Great empathetic response',
                score: 0.9
            };
            const interactionId = 'interaction_123';

            learningEvolution.integrateFeeback(feedback, interactionId);

            expect(learningEvolution.learningHistory).toHaveLength(1);
            expect(learningEvolution.learningHistory[0].feedback).toEqual(feedback);
            expect(learningEvolution.learningHistory[0].interactionId).toBe(interactionId);
            expect(learningEvolution.learningHistory[0].processed).toBe(false);
        });
    });

    describe('wisdom synthesis', () => {
        test('should synthesize wisdom from learning', () => {
            const domain = 'empathy_development';

            const result = learningEvolution.synthesizeWisdom(domain);

            expect(result.domain).toBe(domain);
            expect(result.wisdomPoints).toBeInstanceOf(Array);
            expect(result.actionableInsights).toBeInstanceOf(Array);
            expect(result.wisdomPoints.length).toBeGreaterThan(0);
            expect(result.actionableInsights.length).toBeGreaterThan(0);
        });

        test('should synthesize general wisdom when no domain specified', () => {
            const result = learningEvolution.synthesizeWisdom();

            expect(result.domain).toBeNull();
            expect(result.wisdomPoints).toBeInstanceOf(Array);
            expect(result.actionableInsights).toBeInstanceOf(Array);
        });
    });

    describe('ID generation', () => {
        test('should generate valid pattern IDs', () => {
            const patternId = learningEvolution.generatePatternId();

            expect(patternId).toMatch(/^pattern_[a-z0-9]+$/);
            expect(patternId.length).toBeGreaterThan(8);
        });

        test('should generate valid evolution IDs', () => {
            const evolutionId = learningEvolution.generateEvolutionId();

            expect(evolutionId).toMatch(/^evolution_[a-z0-9]+$/);
            expect(evolutionId.length).toBeGreaterThan(10);
        });
    });
});