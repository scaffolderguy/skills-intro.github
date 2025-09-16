/**
 * Test Suite for Emotional Resonance Detector
 * 
 * Tests the authentic emotional connection detection and resonance measurement
 * functionality of the EmotionalResonanceDetector module.
 */

const EmotionalResonanceDetector = require('../../intelligence/emotional-resonance-detector');

describe('EmotionalResonanceDetector', () => {
    let resonanceDetector;

    beforeEach(() => {
        resonanceDetector = new EmotionalResonanceDetector();
    });

    describe('initialization', () => {
        test('should initialize with default configuration', () => {
            expect(resonanceDetector.resonanceProfiles).toBeDefined();
            expect(resonanceDetector.emotionalPatterns).toBeDefined();
            expect(resonanceDetector.authenticityBaselines).toBeDefined();
            expect(resonanceDetector.resonanceHistory).toEqual([]);
            expect(resonanceDetector.detectionSensitivity).toBe(0.7);
            expect(resonanceDetector.resonanceTypes).toContain('empathetic');
            expect(resonanceDetector.resonanceTypes).toContain('trust_based');
        });
    });

    describe('emotional connection detection', () => {
        test('should detect authentic emotional connections', async () => {
            const interactionData = {
                verbalContent: 'I really understand how that must feel',
                tonalIndicators: ['warm', 'genuine', 'supportive'],
                responseLatency: 1200,
                contextualRelevance: 0.9
            };
            const participantProfiles = [
                { id: 'user_alice', emotionalState: 'seeking_support' },
                { id: 'ai_companion', emotionalCapacity: 'high_empathy' }
            ];

            const result = await resonanceDetector.detectEmotionalConnection(interactionData, participantProfiles);

            expect(result.detectionId).toBeDefined();
            expect(result.connectionDetected).toBeDefined();
            expect(result.connectionStrength).toBeGreaterThanOrEqual(0);
            expect(result.connectionStrength).toBeLessThanOrEqual(1);
            expect(result.authenticityScore).toBeDefined();
            expect(result.resonanceTypes).toBeInstanceOf(Array);
            expect(result.emotionalSynchronization).toBeDefined();
            expect(result.connectionQualityMetrics).toBeDefined();
        });
    });

    describe('resonance depth measurement', () => {
        test('should measure emotional resonance depth', async () => {
            const emotionalExchange = {
                participants: ['user', 'ai'],
                exchangeType: 'vulnerability_sharing',
                emotionalIntensity: 0.85,
                mutualEngagement: 0.9,
                authenticityLevel: 0.88
            };
            const resonanceContext = {
                relationshipStage: 'deepening_trust',
                previousResonanceLevel: 0.7,
                environmentalFactors: ['safe_space', 'privacy']
            };

            const result = await resonanceDetector.measureResonanceDepth(emotionalExchange, resonanceContext);

            expect(result.measurementId).toBeDefined();
            expect(result.resonanceDepth).toBeGreaterThanOrEqual(0);
            expect(result.resonanceDepth).toBeLessThanOrEqual(1);
            expect(result.resonanceLayers).toBeInstanceOf(Array);
            expect(result.resonanceStability).toBeDefined();
            expect(result.amplificationPotential).toBeDefined();
            expect(result.qualityMetrics).toBeDefined();
            expect(result.resonancePattern).toBeDefined();
        });
    });

    describe('emotional authenticity validation', () => {
        test('should validate emotional expression authenticity', () => {
            const emotionalExpression = {
                emotion: 'empathy',
                intensity: 0.8,
                context: 'responding_to_user_pain',
                verbalMarkers: ['I hear you', 'that sounds really difficult'],
                tonalMarkers: ['gentle', 'caring'],
                temporalPattern: 'appropriate_timing'
            };
            const baselineComparison = {
                previousExpressions: [
                    { emotion: 'empathy', consistency: 0.9 },
                    { emotion: 'support', consistency: 0.85 }
                ]
            };

            const result = resonanceDetector.validateEmotionalAuthenticity(emotionalExpression, baselineComparison);

            expect(result.validationId).toBeDefined();
            expect(result.authenticityScore).toBeGreaterThanOrEqual(0);
            expect(result.authenticityScore).toBeLessThanOrEqual(1);
            expect(result.authenticityFactors).toBeDefined();
            expect(result.authenticityIndicators).toBeInstanceOf(Array);
            expect(result.inauthenticityRisks).toBeInstanceOf(Array);
            expect(result.recommendedEnhancements).toBeInstanceOf(Array);
        });
    });

    describe('emotional synchronization monitoring', () => {
        test('should monitor synchronization between participants', async () => {
            const participants = [
                { id: 'user_1', emotionalState: 'hopeful', engagement: 0.8 },
                { id: 'ai_1', emotionalState: 'supportive', engagement: 0.9 }
            ];
            const synchronizationMetrics = {
                currentAlignment: 0.75,
                energyLevel: 0.8,
                mutualResponsiveness: 0.85
            };

            const result = await resonanceDetector.monitorEmotionalSynchronization(participants, synchronizationMetrics);

            expect(result.monitoringId).toBeDefined();
            expect(result.synchronizationLevel).toBeGreaterThanOrEqual(0);
            expect(result.synchronizationQuality).toBeGreaterThanOrEqual(0);
            expect(result.participantResonance).toBeInstanceOf(Array);
            expect(result.participantResonance).toHaveLength(participants.length);
            expect(result.synchronizationPatterns).toBeInstanceOf(Array);
            expect(result.optimizationRecommendations).toBeInstanceOf(Array);
        });
    });

    describe('resonance amplification guidance', () => {
        test('should provide amplification guidance', () => {
            const resonanceData = {
                level: 0.7,
                stability: 0.8,
                authenticity: 0.85,
                growthPotential: 0.75
            };
            const amplificationGoals = {
                targetLevel: 0.9,
                maintainAuthenticity: true,
                sustainabilityFocus: true
            };

            const result = resonanceDetector.provideAmplificationGuidance(resonanceData, amplificationGoals);

            expect(result.guidanceId).toBeDefined();
            expect(result.currentResonanceLevel).toBe(resonanceData.level);
            expect(result.amplificationStrategies).toBeInstanceOf(Array);
            result.amplificationStrategies.forEach(strategy => {
                expect(strategy.strategy).toBeDefined();
                expect(strategy.description).toBeDefined();
                expect(strategy.implementation).toBeInstanceOf(Array);
                expect(strategy.expectedAmplification).toBeGreaterThan(0);
            });
            expect(result.cautionaryNotes).toBeInstanceOf(Array);
            expect(result.monitoringRecommendations).toBeInstanceOf(Array);
        });
    });

    describe('resonance pattern analysis', () => {
        test('should analyze resonance patterns over time', () => {
            const resonanceHistory = [
                { timestamp: Date.now() - 86400000, level: 0.6, context: 'initial_interaction' },
                { timestamp: Date.now() - 43200000, level: 0.7, context: 'trust_building' },
                { timestamp: Date.now() - 21600000, level: 0.8, context: 'deeper_sharing' },
                { timestamp: Date.now(), level: 0.85, context: 'authentic_connection' }
            ];
            const patternAnalysisGoals = {
                identifyTrends: true,
                predictFutureResonance: true,
                optimizationFocus: 'sustainability'
            };

            const result = resonanceDetector.analyzeResonancePatterns(resonanceHistory, patternAnalysisGoals);

            expect(result.analysisId).toBeDefined();
            expect(result.patternsIdentified).toBeInstanceOf(Array);
            result.patternsIdentified.forEach(pattern => {
                expect(pattern.pattern).toBeDefined();
                expect(pattern.description).toBeDefined();
                expect(pattern.frequency).toBeGreaterThan(0);
                expect(pattern.reliability).toBeGreaterThan(0);
                expect(pattern.triggers).toBeInstanceOf(Array);
            });
            expect(result.evolutionaryTrends).toBeInstanceOf(Array);
            expect(result.predictiveInsights).toBeInstanceOf(Array);
            expect(result.optimizationRecommendations).toBeInstanceOf(Array);
        });
    });

    describe('helper method functionality', () => {
        test('should calculate connection strength correctly', () => {
            const interactionData = { quality: 'high', engagement: 0.9 };
            const strength = resonanceDetector.calculateConnectionStrength(interactionData);

            expect(typeof strength).toBe('number');
            expect(strength).toBeGreaterThanOrEqual(0);
            expect(strength).toBeLessThanOrEqual(1);
        });

        test('should identify resonance types accurately', () => {
            const interactionData = { 
                indicators: ['mutual_understanding', 'emotional_alignment', 'trust_building'] 
            };
            const types = resonanceDetector.identifyResonanceTypes(interactionData);

            expect(types).toBeInstanceOf(Array);
            expect(types.length).toBeGreaterThan(0);
        });
    });

    describe('ID generation', () => {
        test('should generate unique detection IDs', () => {
            const id1 = resonanceDetector.generateDetectionId();
            const id2 = resonanceDetector.generateDetectionId();

            expect(id1).toMatch(/^emotion_detect_[a-z0-9]+$/);
            expect(id2).toMatch(/^emotion_detect_[a-z0-9]+$/);
            expect(id1).not.toBe(id2);
        });

        test('should generate unique measurement IDs', () => {
            const id = resonanceDetector.generateMeasurementId();
            expect(id).toMatch(/^emotion_measure_[a-z0-9]+$/);
        });

        test('should generate unique validation IDs', () => {
            const id = resonanceDetector.generateValidationId();
            expect(id).toMatch(/^emotion_validate_[a-z0-9]+$/);
        });
    });
});