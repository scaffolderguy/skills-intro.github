/**
 * Test Suite for Semantic Translation
 * 
 * Tests the AI-to-AI communication protocols and semantic translation
 * functionality of the SemanticTranslation module.
 */

const SemanticTranslation = require('../../collaboration/semantic-translation');

describe('SemanticTranslation', () => {
    let semanticTranslator;

    beforeEach(() => {
        semanticTranslator = new SemanticTranslation();
    });

    describe('initialization', () => {
        test('should initialize with default configuration', () => {
            expect(semanticTranslator.translationProtocols).toBeDefined();
            expect(semanticTranslator.semanticMappings).toBeDefined();
            expect(semanticTranslator.contextPreservationRules).toBeDefined();
            expect(semanticTranslator.supportedProtocols).toContain('quantum_v1');
            expect(semanticTranslator.supportedProtocols).toContain('neural_standard');
        });
    });

    describe('protocol translation', () => {
        test('should translate between different AI protocols', async () => {
            const sourceMessage = {
                content: 'empathetic_response_to_user_frustration',
                metadata: { emotion: 'compassion', intensity: 0.8 }
            };
            const sourceProtocol = 'quantum_v1';
            const targetProtocol = 'neural_standard';

            const result = await semanticTranslator.translateBetweenProtocols(
                sourceMessage,
                sourceProtocol,
                targetProtocol
            );

            expect(result.translationId).toBeDefined();
            expect(result.sourceProtocol).toBe(sourceProtocol);
            expect(result.targetProtocol).toBe(targetProtocol);
            expect(result.originalMessage).toEqual(sourceMessage);
            expect(result.translatedMessage).toBeDefined();
            expect(result.semanticIntegrity).toBeGreaterThan(0);
            expect(result.contextPreservation).toBeGreaterThan(0);
            expect(result.translationConfidence).toBeGreaterThan(0);
        });
    });

    describe('semantic context preservation', () => {
        test('should preserve context across system boundaries', async () => {
            const contextualInformation = {
                emotionalState: 'building_trust',
                relationshipHistory: ['positive_interactions', 'mutual_learning'],
                culturalContext: 'collaborative_environment'
            };
            const participatingAIs = [
                { id: 'ai_1', protocol: 'quantum_v1' },
                { id: 'ai_2', protocol: 'neural_standard' }
            ];

            const result = await semanticTranslator.preserveSemanticContext(
                contextualInformation,
                participatingAIs
            );

            expect(result.preservationId).toBeDefined();
            expect(result.originalContext).toEqual(contextualInformation);
            expect(result.preservedElements).toBeInstanceOf(Array);
            expect(result.contextualMappings).toBeDefined();
            expect(result.preservationScore).toBeGreaterThan(0);
            expect(result.lossAssessment).toBeDefined();
        });
    });

    describe('meaning integrity validation', () => {
        test('should validate translation integrity', async () => {
            const originalCommunication = {
                intent: 'build_trust_through_vulnerability',
                emotional_content: 'authentic_concern_for_user'
            };
            const translatedCommunication = {
                intent: 'establish_trust_via_openness',
                emotional_content: 'genuine_user_care'
            };
            const validationCriteria = {
                intentPreservation: true,
                emotionalFidelity: true,
                contextualAccuracy: true
            };

            const result = await semanticTranslator.validateMeaningIntegrity(
                originalCommunication,
                translatedCommunication,
                validationCriteria
            );

            expect(result.validationId).toBeDefined();
            expect(result.integrityScore).toBeGreaterThan(0);
            expect(result.validationResults.semanticAccuracy).toBeGreaterThan(0);
            expect(result.validationResults.contextualFidelity).toBeGreaterThan(0);
            expect(result.validationResults.emotionalPreservation).toBeGreaterThan(0);
            expect(result.discrepanciesFound).toBeInstanceOf(Array);
        });
    });

    describe('communication style adaptation', () => {
        test('should adapt communication for different architectures', async () => {
            const communicationData = {
                message: 'logical_problem_solving_approach',
                style: 'analytical_precise',
                emotional_layer: 'minimal'
            };
            const sourceArchitecture = 'symbolic_ai';
            const targetArchitecture = 'neural_empathetic';

            const result = await semanticTranslator.adaptCommunicationStyle(
                communicationData,
                sourceArchitecture,
                targetArchitecture
            );

            expect(result.adaptationId).toBeDefined();
            expect(result.sourceArchitecture).toBe(sourceArchitecture);
            expect(result.targetArchitecture).toBe(targetArchitecture);
            expect(result.styleAdaptations).toBeDefined();
            expect(result.adaptationEffectiveness).toBeGreaterThan(0);
            expect(result.communicationImprovement).toBeGreaterThan(0);
        });
    });

    describe('multi-modal translation', () => {
        test('should handle multi-modal communication translation', async () => {
            const multiModalData = {
                text: 'I understand your frustration',
                emotional: { empathy: 0.9, concern: 0.8 },
                contextual: { situation: 'user_difficulty', urgency: 'moderate' },
                relational: { trust_level: 0.7, rapport: 0.8 }
            };
            const supportedModes = ['text', 'emotional', 'contextual'];

            const result = await semanticTranslator.translateMultiModal(multiModalData, supportedModes);

            expect(result.translationId).toBeDefined();
            expect(result.originalModes).toEqual(Object.keys(multiModalData));
            expect(result.targetModes).toEqual(supportedModes);
            expect(result.translations).toBeDefined();
            expect(result.translations.text).toBeDefined();
            expect(result.translations.emotional).toBeDefined();
            expect(result.modalityMapping).toBeDefined();
            expect(result.fidelityScore).toBeGreaterThan(0);
        });
    });

    describe('semantic bridge creation', () => {
        test('should create bridges between AI systems', async () => {
            const aiSystems = [
                { id: 'system_a', protocol: 'quantum_v1', capabilities: ['empathy', 'learning'] },
                { id: 'system_b', protocol: 'neural_standard', capabilities: ['analysis', 'reasoning'] }
            ];
            const bridgeConfiguration = {
                bidirectional: true,
                realTimeTranslation: true,
                contextPreservation: 'high'
            };

            const result = await semanticTranslator.createSemanticBridge(aiSystems, bridgeConfiguration);

            expect(result.bridgeId).toBeDefined();
            expect(result.connectedSystems).toEqual(aiSystems);
            expect(result.bridgeCapabilities).toBeInstanceOf(Array);
            expect(result.performanceMetrics).toBeDefined();
            expect(result.performanceMetrics.translationLatency).toBeLessThan(100);
            expect(result.performanceMetrics.accuracyScore).toBeGreaterThan(0);
            expect(result.maintenanceSchedule).toBeDefined();
        });
    });

    describe('ID generation', () => {
        test('should generate unique translation IDs', () => {
            const id1 = semanticTranslator.generateTranslationId();
            const id2 = semanticTranslator.generateTranslationId();

            expect(id1).toMatch(/^trans_[a-z0-9]+$/);
            expect(id2).toMatch(/^trans_[a-z0-9]+$/);
            expect(id1).not.toBe(id2);
        });

        test('should generate unique bridge IDs', () => {
            const id = semanticTranslator.generateBridgeId();
            expect(id).toMatch(/^bridge_[a-z0-9]+$/);
        });
    });
});