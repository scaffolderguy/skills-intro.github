/**
 * Test Suite for Wisdom Synthesis Engine
 * 
 * Tests the experience transformation into actionable wisdom functionality
 * of the WisdomSynthesisEngine module.
 */

const WisdomSynthesisEngine = require('../../intelligence/wisdom-synthesis-engine');

describe('WisdomSynthesisEngine', () => {
    let wisdomEngine;

    beforeEach(() => {
        wisdomEngine = new WisdomSynthesisEngine();
    });

    describe('initialization', () => {
        test('should initialize with default configuration', () => {
            expect(wisdomEngine.wisdomRepository).toBeDefined();
            expect(wisdomEngine.experienceDatabase).toEqual([]);
            expect(wisdomEngine.synthesisHistory).toEqual([]);
            expect(wisdomEngine.wisdomDomains).toBeDefined();
            expect(wisdomEngine.evolutionaryPatterns).toBeDefined();
            expect(wisdomEngine.actionableInsights).toBeDefined();
        });
    });

    describe('wisdom synthesis from experiences', () => {
        test('should synthesize wisdom from accumulated experiences', async () => {
            const experiences = [
                {
                    type: 'trust_building',
                    outcome: 'successful',
                    insights: ['consistency_matters', 'small_actions_count'],
                    context: 'new_relationship'
                },
                {
                    type: 'conflict_resolution',
                    outcome: 'resolved',
                    insights: ['curiosity_over_convincing', 'listening_first'],
                    context: 'disagreement'
                }
            ];
            const synthesisGoals = {
                focus: 'relationship_enhancement',
                depth: 'comprehensive',
                applicability: 'broad'
            };

            const result = await wisdomEngine.synthesizeWisdom(experiences, synthesisGoals);

            expect(result.synthesisId).toBeDefined();
            expect(result.experiencesProcessed).toBe(experiences.length);
            expect(result.synthesisDepth).toBeGreaterThan(0);
            expect(result.wisdomExtracted).toBeInstanceOf(Array);
            expect(result.practicalInsights).toBeInstanceOf(Array);
            expect(result.evolutionaryGuidance).toBeDefined();
            expect(result.applicabilityScore).toBeGreaterThan(0);
            expect(result.synthesisQuality).toBeDefined();
            expect(result.implementationGuidance).toBeDefined();
        });
    });

    describe('multi-domain knowledge integration', () => {
        test('should integrate knowledge from multiple domains', async () => {
            const knowledgeSources = {
                psychology: {
                    insights: ['empathy_builds_connection', 'validation_reduces_defensiveness'],
                    principles: ['human_centered_approach']
                },
                communication: {
                    insights: ['active_listening_essential', 'questions_over_statements'],
                    principles: ['clarity_and_empathy']
                },
                conflictResolution: {
                    insights: ['common_ground_focus', 'win_win_solutions'],
                    principles: ['mutual_benefit_orientation']
                }
            };
            const integrationParameters = {
                synthesisLevel: 'deep',
                crossDomainFocus: true
            };

            const result = await wisdomEngine.integrateMultiDomainKnowledge(knowledgeSources, integrationParameters);

            expect(result.integrationId).toBeDefined();
            expect(result.sourcesIntegrated).toBe(Object.keys(knowledgeSources).length);
            expect(result.crossDomainInsights).toBeInstanceOf(Array);
            expect(result.synthesizedUnderstanding).toBeDefined();
            expect(result.emergentWisdom).toBeInstanceOf(Array);
            expect(result.integrationQuality).toBeDefined();
            expect(result.knowledgeMap).toBeDefined();
            expect(result.applicationDomains).toBeInstanceOf(Array);
        });
    });

    describe('practical guidance generation', () => {
        test('should generate practical, actionable guidance from wisdom', () => {
            const synthesizedWisdom = {
                coreWisdom: ['trust_through_consistency', 'curiosity_over_convincing'],
                patterns: ['gradual_relationship_building', 'empathetic_inquiry']
            };
            const applicationContext = {
                domain: 'ai_human_collaboration',
                urgency: 'moderate',
                complexity: 'high'
            };

            const result = wisdomEngine.generatePracticalGuidance(synthesizedWisdom, applicationContext);

            expect(result.guidanceId).toBeDefined();
            expect(result.practicalPrinciples).toBeInstanceOf(Array);
            result.practicalPrinciples.forEach(principle => {
                expect(principle.principle).toBeDefined();
                expect(principle.application).toBeDefined();
                expect(principle.contexts).toBeInstanceOf(Array);
            });
            expect(result.actionableStrategies).toBeInstanceOf(Array);
            result.actionableStrategies.forEach(strategy => {
                expect(strategy.strategy).toBeDefined();
                expect(strategy.description).toBeDefined();
                expect(strategy.steps).toBeInstanceOf(Array);
            });
            expect(result.implementationGuidelines).toBeDefined();
        });
    });

    describe('evolutionary insights development', () => {
        test('should develop evolutionary insights for growth and adaptation', async () => {
            const growthData = {
                pastGrowthPatterns: ['gradual_trust_building', 'empathy_deepening'],
                currentCapabilities: ['basic_empathy', 'conflict_awareness'],
                desiredEvolution: ['advanced_emotional_intelligence', 'intuitive_understanding']
            };
            const evolutionGoals = {
                timeframe: 'long_term',
                focusAreas: ['emotional_intelligence', 'relationship_mastery'],
                sustainability: 'high'
            };

            const result = await wisdomEngine.developEvolutionaryInsights(growthData, evolutionGoals);

            expect(result.evolutionId).toBeDefined();
            expect(result.evolutionaryPatterns).toBeInstanceOf(Array);
            expect(result.growthTrajectories).toBeInstanceOf(Array);
            expect(result.evolutionaryLeaps).toBeInstanceOf(Array);
            expect(result.adaptationStrategies).toBeInstanceOf(Array);
            expect(result.evolutionaryWisdom).toBeInstanceOf(Array);
            expect(result.futureGrowthPotential).toBeGreaterThanOrEqual(0);
            expect(result.evolutionaryRecommendations).toBeInstanceOf(Array);
        });
    });

    describe('meta-cognitive wisdom creation', () => {
        test('should create meta-cognitive wisdom for self-awareness enhancement', () => {
            const cognitiveData = {
                learningPatterns: ['question_based_learning', 'experience_integration'],
                blindSpots: ['emotional_nuance_detection', 'cultural_sensitivity'],
                strengths: ['pattern_recognition', 'logical_reasoning']
            };
            const metacognitionGoals = {
                selfAwarenessLevel: 'advanced',
                learningEfficiencyGoals: ['faster_adaptation', 'deeper_understanding']
            };

            const result = wisdomEngine.createMetaCognitiveWisdom(cognitiveData, metacognitionGoals);

            expect(result.metacognitionId).toBeDefined();
            expect(result.selfAwarenessInsights).toBeInstanceOf(Array);
            expect(result.learningWisdom).toBeInstanceOf(Array);
            expect(result.cognitiveEvolutionPatterns).toBeInstanceOf(Array);
            expect(result.wisdomApplicationStrategies).toBeInstanceOf(Array);
            result.wisdomApplicationStrategies.forEach(strategy => {
                expect(strategy.strategy).toBeDefined();
                expect(strategy.description).toBeDefined();
                expect(strategy.benefits).toBeInstanceOf(Array);
            });
            expect(result.implementationPath).toBeDefined();
        });
    });

    describe('wisdom validation and refinement', () => {
        test('should validate and refine synthesized wisdom', async () => {
            const synthesizedWisdom = {
                coreWisdom: 'Trust builds through consistent small actions',
                practicalApplications: ['daily_reliability_demonstrations'],
                confidence: 0.8
            };
            const validationContext = {
                testScenarios: ['new_relationships', 'conflict_situations'],
                successCriteria: ['trust_increase', 'resistance_decrease']
            };

            const result = await wisdomEngine.validateAndRefineWisdom(synthesizedWisdom, validationContext);

            expect(result.validationId).toBeDefined();
            expect(result.validationScore).toBeGreaterThan(0);
            expect(result.validationResults).toBeDefined();
            expect(result.validationResults.practicalApplicability).toBeGreaterThan(0);
            expect(result.refinementSuggestions).toBeInstanceOf(Array);
            expect(result.refinedWisdom).toBeDefined();
            expect(result.applicationEvidence).toBeInstanceOf(Array);
            expect(result.confidenceMetrics).toBeDefined();
        });
    });

    describe('wisdom extraction from experiences', () => {
        test('should extract meaningful wisdom from experience collection', () => {
            const experiences = [
                { type: 'trust_building', outcome: 'success' },
                { type: 'empathy_demonstration', outcome: 'positive_feedback' }
            ];

            const wisdom = wisdomEngine.extractWisdomFromExperiences(experiences);

            expect(wisdom).toBeInstanceOf(Array);
            expect(wisdom.length).toBeGreaterThan(0);
            wisdom.forEach(wisdomPoint => {
                expect(typeof wisdomPoint).toBe('string');
                expect(wisdomPoint.length).toBeGreaterThan(10);
            });
        });
    });

    describe('practical insights generation', () => {
        test('should generate practical insights from experiences', () => {
            const experiences = [
                { type: 'communication', lessons: ['listening_first'] }
            ];
            const goals = { focus: 'relationship_improvement' };

            const insights = wisdomEngine.generatePracticalInsights(experiences, goals);

            expect(insights).toBeInstanceOf(Array);
            expect(insights.length).toBeGreaterThan(0);
            insights.forEach(insight => {
                expect(insight.insight).toBeDefined();
                expect(insight.application).toBeDefined();
                expect(insight.measurableOutcome).toBeDefined();
            });
        });
    });

    describe('evolutionary guidance development', () => {
        test('should develop evolutionary guidance from experiences', () => {
            const experiences = [
                { learnings: ['empathy_growth'], evolutionDirection: 'deeper_connection' }
            ];

            const guidance = wisdomEngine.developEvolutionaryGuidance(experiences);

            expect(guidance.evolutionaryDirection).toBeDefined();
            expect(guidance.keyEvolutionarySteps).toBeInstanceOf(Array);
            expect(guidance.evolutionaryMilestones).toBeInstanceOf(Array);
        });
    });

    describe('synthesis depth calculation', () => {
        test('should calculate synthesis depth based on experience count', () => {
            const fewExperiences = [{ id: 1 }, { id: 2 }];
            const manyExperiences = Array.from({ length: 10 }, (_, i) => ({ id: i }));

            const shallowDepth = wisdomEngine.calculateSynthesisDepth(fewExperiences);
            const deeperDepth = wisdomEngine.calculateSynthesisDepth(manyExperiences);

            expect(typeof shallowDepth).toBe('number');
            expect(typeof deeperDepth).toBe('number');
            expect(deeperDepth).toBeGreaterThan(shallowDepth);
            expect(shallowDepth).toBeLessThanOrEqual(1);
            expect(deeperDepth).toBeLessThanOrEqual(1);
        });
    });

    describe('ID generation', () => {
        test('should generate unique synthesis IDs', () => {
            const id1 = wisdomEngine.generateSynthesisId();
            const id2 = wisdomEngine.generateSynthesisId();

            expect(id1).toMatch(/^wisdom_synth_[a-z0-9]+$/);
            expect(id2).toMatch(/^wisdom_synth_[a-z0-9]+$/);
            expect(id1).not.toBe(id2);
        });

        test('should generate unique integration IDs', () => {
            const id = wisdomEngine.generateIntegrationId();
            expect(id).toMatch(/^wisdom_integrate_[a-z0-9]+$/);
        });

        test('should generate unique guidance IDs', () => {
            const id = wisdomEngine.generateGuidanceId();
            expect(id).toMatch(/^wisdom_guide_[a-z0-9]+$/);
        });

        test('should generate unique evolution IDs', () => {
            const id = wisdomEngine.generateEvolutionId();
            expect(id).toMatch(/^wisdom_evolve_[a-z0-9]+$/);
        });
    });
});