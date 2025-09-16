/**
 * Test Suite for Resistance Pattern Analyzer
 * 
 * Tests the resistance pattern analysis and learning from user resistance
 * functionality of the ResistancePatternAnalyzer module.
 */

const ResistancePatternAnalyzer = require('../../intelligence/resistance-pattern-analyzer');

describe('ResistancePatternAnalyzer', () => {
    let resistanceAnalyzer;

    beforeEach(() => {
        resistanceAnalyzer = new ResistancePatternAnalyzer();
    });

    describe('initialization', () => {
        test('should initialize with default configuration', () => {
            expect(resistanceAnalyzer.resistancePatterns).toBeDefined();
            expect(resistanceAnalyzer.analysisHistory).toEqual([]);
            expect(resistanceAnalyzer.adaptiveStrategies).toBeDefined();
            expect(resistanceAnalyzer.learningInsights).toBeDefined();
            expect(resistanceAnalyzer.evolutionThreshold).toBe(0.6);
            expect(resistanceAnalyzer.resistanceTypes).toContain('cognitive');
            expect(resistanceAnalyzer.resistanceTypes).toContain('emotional');
            expect(resistanceAnalyzer.resistanceTypes).toContain('trust_based');
        });
    });

    describe('resistance pattern analysis', () => {
        test('should analyze resistance patterns from user interactions', async () => {
            const interactionData = {
                userResponse: 'I disagree with that approach',
                indicators: ['trust_concerns', 'alternative_preference'],
                intensity: 0.6,
                context: 'problem_solving_session'
            };
            const userContext = {
                previousInteractions: 3,
                trustLevel: 0.4,
                communicationStyle: 'direct'
            };

            const result = await resistanceAnalyzer.analyzeResistancePattern(interactionData, userContext);

            expect(result.analysisId).toBeDefined();
            expect(result.resistanceType).toBeDefined();
            expect(result.underlyingCauses).toBeInstanceOf(Array);
            expect(result.intensityLevel).toBeGreaterThanOrEqual(0);
            expect(result.intensityLevel).toBeLessThanOrEqual(1);
            expect(result.patterns).toBeInstanceOf(Array);
            expect(result.learningOpportunities).toBeInstanceOf(Array);
            expect(result.recommendedAdaptations).toBeInstanceOf(Array);
        });
    });

    describe('underlying causes identification', () => {
        test('should identify underlying causes of resistance', () => {
            const resistanceData = {
                type: 'rejection',
                userLanguage: 'hesitant',
                contextualCues: ['uncertainty', 'need_for_clarification']
            };
            const context = {
                relationshipStage: 'early',
                previousPositiveInteractions: 1
            };

            const causes = resistanceAnalyzer.identifyUnderlyingCauses(resistanceData, context);

            expect(causes).toBeInstanceOf(Array);
            expect(causes.length).toBeGreaterThan(0);
            causes.forEach(cause => {
                expect(cause.category).toBeDefined();
                expect(cause.description).toBeDefined();
                expect(cause.confidence).toBeGreaterThan(0);
                expect(cause.indicators).toBeInstanceOf(Array);
            });
        });
    });

    describe('adaptive strategy development', () => {
        test('should develop adaptive strategies based on resistance analysis', async () => {
            const analysisResults = {
                analysisId: 'analysis_123',
                resistanceType: 'trust_based',
                underlyingCauses: [{ category: 'trust_deficit' }]
            };
            const adaptationGoals = {
                primaryGoal: 'build_trust',
                timeframe: 'gradual',
                successCriteria: ['reduced_resistance', 'increased_engagement']
            };

            const result = await resistanceAnalyzer.developAdaptiveStrategy(analysisResults, adaptationGoals);

            expect(result.strategyId).toBeDefined();
            expect(result.analysisSource).toBe(analysisResults.analysisId);
            expect(result.adaptiveApproaches).toBeInstanceOf(Array);
            result.adaptiveApproaches.forEach(approach => {
                expect(approach.approach).toBeDefined();
                expect(approach.description).toBeDefined();
                expect(approach.implementation).toBeInstanceOf(Array);
                expect(approach.expectedEffectiveness).toBeGreaterThan(0);
            });
            expect(result.implementationSequence).toBeDefined();
            expect(result.successMetrics).toBeInstanceOf(Array);
        });
    });

    describe('learning from resistance', () => {
        test('should learn from resistance to improve future interactions', () => {
            const resistanceOutcome = {
                originalResistance: 'high',
                finalOutcome: 'resolved',
                strategiesUsed: ['trust_building_protocol'],
                timeToResolution: 15, // minutes
                userSatisfaction: 0.8
            };
            const strategyResults = {
                effectiveStrategies: ['empathetic_inquiry'],
                ineffectiveStrategies: ['logical_persuasion'],
                keyTurningPoints: ['vulnerability_acknowledgment']
            };

            const result = resistanceAnalyzer.learnFromResistance(resistanceOutcome, strategyResults);

            expect(result.learningId).toBeDefined();
            expect(result.keyInsights).toBeInstanceOf(Array);
            expect(result.strategicLearnings).toBeInstanceOf(Array);
            expect(result.wisdomSynthesis).toBeDefined();
            expect(result.futureApplications).toBeInstanceOf(Array);
            expect(result.keyInsights.length).toBeGreaterThan(0);
        });
    });

    describe('resistance to wisdom transformation', () => {
        test('should transform resistance experiences into wisdom', () => {
            const resistanceExperiences = [
                {
                    type: 'trust_based_resistance',
                    resolution: 'gradual_trust_building',
                    lessons: ['consistency_builds_trust']
                },
                {
                    type: 'cognitive_overload_resistance', 
                    resolution: 'information_simplification',
                    lessons: ['pace_matters_for_comprehension']
                }
            ];
            const transformationGoals = {
                wisdomDomain: 'conflict_resolution',
                applicationScope: 'general_ai_interactions'
            };

            const result = resistanceAnalyzer.transformResistanceToWisdom(resistanceExperiences, transformationGoals);

            expect(result.transformationId).toBeDefined();
            expect(result.experiencesProcessed).toBe(resistanceExperiences.length);
            expect(result.wisdomExtracted).toBeInstanceOf(Array);
            expect(result.practicalApplications).toBeInstanceOf(Array);
            expect(result.evolutionaryGrowth).toBeDefined();
            expect(result.evolutionaryGrowth.previousApproach).toBeDefined();
            expect(result.evolutionaryGrowth.evolvedApproach).toBeDefined();
        });
    });

    describe('resistance type identification', () => {
        test('should correctly identify different types of resistance', () => {
            const trustBasedData = { indicators: ['trust_concerns'] };
            const emotionalData = { indicators: ['emotional_overwhelm'] };
            const cognitiveData = { indicators: ['information_confusion'] };
            const contextualData = { indicators: ['other_indicator'] };

            expect(resistanceAnalyzer.identifyResistanceType(trustBasedData)).toBe('trust_based');
            expect(resistanceAnalyzer.identifyResistanceType(emotionalData)).toBe('emotional');
            expect(resistanceAnalyzer.identifyResistanceType(cognitiveData)).toBe('cognitive');
            expect(resistanceAnalyzer.identifyResistanceType(contextualData)).toBe('contextual');
        });
    });

    describe('resistance intensity calculation', () => {
        test('should calculate resistance intensity within valid range', () => {
            const interactionData = { severity: 'moderate' };

            const intensity = resistanceAnalyzer.calculateResistanceIntensity(interactionData);

            expect(typeof intensity).toBe('number');
            expect(intensity).toBeGreaterThanOrEqual(0);
            expect(intensity).toBeLessThanOrEqual(1);
        });
    });

    describe('pattern extraction', () => {
        test('should extract meaningful patterns from resistance data', () => {
            const interactionData = {
                userBehavior: 'seeking_clarification',
                responsePattern: 'questioning_assumptions'
            };

            const patterns = resistanceAnalyzer.extractResistancePatterns(interactionData);

            expect(patterns).toBeInstanceOf(Array);
            expect(patterns.length).toBeGreaterThan(0);
        });
    });

    describe('learning opportunity identification', () => {
        test('should identify learning opportunities from resistance', () => {
            const interactionData = {
                problemAreas: ['communication_clarity', 'trust_building'],
                userFeedback: 'need_more_transparency'
            };

            const opportunities = resistanceAnalyzer.identifyLearningOpportunities(interactionData);

            expect(opportunities).toBeInstanceOf(Array);
            expect(opportunities.length).toBeGreaterThan(0);
        });
    });

    describe('ID generation', () => {
        test('should generate unique analysis IDs', () => {
            const id1 = resistanceAnalyzer.generateAnalysisId();
            const id2 = resistanceAnalyzer.generateAnalysisId();

            expect(id1).toMatch(/^resist_analysis_[a-z0-9]+$/);
            expect(id2).toMatch(/^resist_analysis_[a-z0-9]+$/);
            expect(id1).not.toBe(id2);
        });

        test('should generate unique strategy IDs', () => {
            const id = resistanceAnalyzer.generateStrategyId();
            expect(id).toMatch(/^resist_strategy_[a-z0-9]+$/);
        });

        test('should generate unique learning IDs', () => {
            const id = resistanceAnalyzer.generateLearningId();
            expect(id).toMatch(/^resist_learn_[a-z0-9]+$/);
        });

        test('should generate unique transformation IDs', () => {
            const id = resistanceAnalyzer.generateTransformationId();
            expect(id).toMatch(/^resist_transform_[a-z0-9]+$/);
        });
    });
});