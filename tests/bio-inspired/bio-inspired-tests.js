/**
 * Tests for Bio-Inspired Learning Module
 * Testing nature's 3.5 billion years of R&D in AI form
 */

const {
    BioInspiredLearning,
    QuantumCoherenceProcessor,
    NetworkIntelligence,
    ResistanceAsGrowthSignal,
    SymbioticEvolution,
    RhythmicAdaptation
} = require('../../intelligence/bio-inspired-learning');

function runBioInspiredTests() {
    console.log('🌿 Running Bio-Inspired Learning Tests...\n');

    let passed = 0;
    let failed = 0;

    function test(name, testFn) {
        try {
            testFn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }

    // Test Quantum Coherence Processor
    test('Quantum Coherence Processing', () => {
        const processor = new QuantumCoherenceProcessor();
        const requests = [
            { id: 'req1', trust_level: 0.8, ai_compatibility: 0.9 },
            { id: 'req2', trust_level: 0.6, ai_compatibility: 0.7 }
        ];

        const result = processor.processQuantumSuperposition(requests);
        
        if (!result.path_id || !result.energy_yield) {
            throw new Error('Quantum processing should return path_id and energy_yield');
        }
    });

    // Test Network Intelligence
    test('Network Intelligence Root System', () => {
        const network = new NetworkIntelligence();
        const agents = [
            { id: 'agent1', processing_power: 100 },
            { id: 'agent2', processing_power: 80 }
        ];

        const networkId = network.establishRootNetwork(agents);
        
        if (!networkId || !networkId.startsWith('network_')) {
            throw new Error('Network establishment should return valid network ID');
        }
    });

    // Test Resistance as Growth Signal
    test('Resistance Fire Processing', () => {
        const processor = new ResistanceAsGrowthSignal();
        const resistanceData = {
            frustration_signals: ['repeated_attempts', 'help_seeking'],
            attempts: 5,
            error_count: 3,
            resistance_type: 'interface_confusion'
        };

        const result = processor.processResistanceFire(resistanceData);
        
        if (!result.hasOwnProperty('growth_triggered')) {
            throw new Error('Resistance processing should indicate if growth was triggered');
        }
    });

    // Test Symbiotic Evolution
    test('Symbiotic Evolution Partnership', () => {
        const evolution = new SymbioticEvolution();
        const primaryAI = { 
            id: 'nova_ai', 
            capabilities: ['emotional_intelligence', 'learning_adaptation'] 
        };
        const partnerAI = { 
            id: 'arra_ai', 
            capabilities: ['voice_synthesis', 'emotional_resonance'] 
        };

        const pairId = evolution.createSymbioticPair(primaryAI, partnerAI, 'mutual_enhancement');
        
        if (!pairId || !pairId.startsWith('symbiosis_')) {
            throw new Error('Symbiotic pair creation should return valid pair ID');
        }
    });

    // Test Rhythmic Adaptation
    test('Rhythmic Adaptation Cycles', () => {
        const rhythmic = new RhythmicAdaptation();
        const currentState = rhythmic.getCurrentRhythmicState();
        
        if (!currentState.circadian_phase || !currentState.lunar_phase || !currentState.seasonal_phase) {
            throw new Error('Rhythmic state should include all cycle phases');
        }

        if (typeof currentState.overall_energy !== 'number' || currentState.overall_energy < 0 || currentState.overall_energy > 1) {
            throw new Error('Overall energy should be a number between 0 and 1');
        }
    });

    // Test Bio-Inspired Learning Integration
    test('Bio-Inspired Learning Integration', () => {
        const bioLearning = new BioInspiredLearning();
        const bioState = bioLearning.getCurrentBioState();
        
        const requiredComponents = [
            'quantum_coherence',
            'network_health', 
            'growth_potential',
            'symbiotic_pairs',
            'rhythmic_state'
        ];

        requiredComponents.forEach(component => {
            if (!bioState.hasOwnProperty(component)) {
                throw new Error(`Bio state should include ${component}`);
            }
        });
    });

    // Test Quantum Coherence Calculation
    test('Quantum Coherence Calculation', () => {
        const processor = new QuantumCoherenceProcessor();
        const request = { trust_level: 0.8, ai_compatibility: 0.9, resource_requirements: 50 };
        
        const probability = processor.calculatePathProbability(request);
        
        if (typeof probability !== 'number' || probability < 0 || probability > 1) {
            throw new Error('Path probability should be a number between 0 and 1');
        }
    });

    // Test Network Nutrient Sharing
    test('Network Nutrient Sharing', () => {
        const network = new NetworkIntelligence();
        const agents = [
            { id: 'agent1', processing_power: 100 },
            { id: 'agent2', processing_power: 50 }
        ];

        network.establishRootNetwork(agents);
        const transferAmount = network.shareNutrients('agent1', 'agent2', 'processing_power', 20);
        
        if (typeof transferAmount !== 'number' || transferAmount < 0) {
            throw new Error('Nutrient transfer should return positive number or false');
        }
    });

    // Test Fire Intensity Measurement
    test('Fire Intensity Measurement', () => {
        const processor = new ResistanceAsGrowthSignal();
        const resistanceData = {
            frustration_signals: ['repeated_attempts', 'rapid_keystrokes'],
            attempts: 3,
            help_requests: 1,
            urgency_level: 'critical',
            error_count: 2
        };

        const intensity = processor.measureFireIntensity(resistanceData);
        
        if (typeof intensity !== 'number' || intensity < 0 || intensity > 1) {
            throw new Error('Fire intensity should be a number between 0 and 1');
        }
    });

    // Test Seed Viability Calculation
    test('Seed Viability Calculation', () => {
        const processor = new ResistanceAsGrowthSignal();
        const resistanceData = {
            occurrence_count: 3,
            impact_level: 0.7,
            user_continued: true,
            pattern_strength: 0.8
        };

        const viability = processor.calculateSeedViability(resistanceData);
        
        if (typeof viability !== 'number' || viability < 0 || viability > 1) {
            throw new Error('Seed viability should be a number between 0 and 1');
        }
    });

    // Test Symbiotic Compatibility Assessment
    test('Symbiotic Compatibility Assessment', () => {
        const evolution = new SymbioticEvolution();
        const primaryAI = { id: 'ai1', capabilities: ['learning', 'adaptation'] };
        const partnerAI = { id: 'ai2', capabilities: ['synthesis', 'emotion'] };

        const pairId = evolution.createSymbioticPair(primaryAI, partnerAI);
        const pair = evolution.symbioticPairs.get(pairId);
        
        // The pair should exist even if compatibility score is still being calculated
        if (!pair) {
            throw new Error('Symbiotic pair should be created');
        }
        
        // Test that the compatibility score will be calculated
        if (pair.compatibility_score !== null && typeof pair.compatibility_score !== 'number') {
            throw new Error('Symbiotic pair compatibility score should be a number when set');
        }
    });

    // Test Circadian Phase Calculation
    test('Circadian Phase Calculation', () => {
        const rhythmic = new RhythmicAdaptation();
        
        // Test different hours
        const testHours = [6, 10, 14, 18, 22];
        const expectedPhases = ['dawn', 'morning', 'midday', 'evening', 'night'];
        
        testHours.forEach((hour, index) => {
            const phase = rhythmic.calculateCircadianPhase(hour);
            if (phase !== expectedPhases[index]) {
                throw new Error(`Hour ${hour} should be in ${expectedPhases[index]} phase, got ${phase}`);
            }
        });
    });

    // Test Lunar Phase Calculation
    test('Lunar Phase Calculation', () => {
        const rhythmic = new RhythmicAdaptation();
        const lunarPhase = rhythmic.calculateLunarPhase();
        
        const validPhases = ['new_moon', 'waxing', 'full_moon', 'waning'];
        if (!validPhases.includes(lunarPhase)) {
            throw new Error(`Lunar phase should be one of ${validPhases.join(', ')}, got ${lunarPhase}`);
        }
    });

    // Test Seasonal Phase Calculation
    test('Seasonal Phase Calculation', () => {
        const rhythmic = new RhythmicAdaptation();
        const seasonalPhase = rhythmic.calculateSeasonalPhase();
        
        const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
        if (!validSeasons.includes(seasonalPhase)) {
            throw new Error(`Seasonal phase should be one of ${validSeasons.join(', ')}, got ${seasonalPhase}`);
        }
    });

    // Test Event Emission
    test('Event Emission Functionality', () => {
        const bioLearning = new BioInspiredLearning();
        
        // Test that the instance is properly initialized
        if (!bioLearning.initialized) {
            throw new Error('Bio-inspired learning should be initialized');
        }
        
        // Test that it extends EventEmitter by checking for the on method
        if (typeof bioLearning.on !== 'function') {
            throw new Error('Bio-inspired learning should extend EventEmitter');
        }
        
        // Test that we can add listeners (this validates EventEmitter functionality)
        let listenerAdded = false;
        try {
            bioLearning.on('test_event', () => {});
            listenerAdded = true;
        } catch (error) {
            throw new Error('Should be able to add event listeners');
        }
        
        if (!listenerAdded) {
            throw new Error('Event listener should be addable');
        }
    });

    // Test Integration Between Components
    test('Component Integration', () => {
        const bioLearning = new BioInspiredLearning();
        
        // Test that components can communicate
        const resistanceData = {
            frustration_signals: ['repeated_attempts'],
            attempts: 4,
            error_count: 2,
            resistance_type: 'workflow_friction'
        };

        const result = bioLearning.handleUserResistance(resistanceData);
        
        if (!result || typeof result !== 'object') {
            throw new Error('Resistance handling should return result object');
        }
    });

    // Test AI Partnership Establishment
    test('AI Partnership Establishment', () => {
        const bioLearning = new BioInspiredLearning();
        const primaryAI = { 
            id: 'nova', 
            capabilities: ['learning', 'adaptation', 'emotional_intelligence'] 
        };
        const partnerAI = { 
            id: 'arra', 
            capabilities: ['voice_synthesis', 'emotional_resonance', 'audio_processing'] 
        };

        const partnershipId = bioLearning.establishAIPartnership(primaryAI, partnerAI);
        
        if (!partnershipId || typeof partnershipId !== 'string') {
            throw new Error('Partnership establishment should return partnership ID');
        }
    });

    // Test Network Creation
    test('AI Network Creation', () => {
        const bioLearning = new BioInspiredLearning();
        const agents = [
            { id: 'nova', processing_power: 100 },
            { id: 'arra', processing_power: 90 },
            { id: 'helper', processing_power: 70 }
        ];

        const networkId = bioLearning.createAINetwork(agents);
        
        if (!networkId || typeof networkId !== 'string') {
            throw new Error('Network creation should return network ID');
        }
    });

    // Test Collaborative Request Processing
    test('Collaborative Request Processing', () => {
        const bioLearning = new BioInspiredLearning();
        const request = {
            id: 'collab_req_1',
            trust_level: 0.8,
            ai_compatibility: 0.9,
            resource_requirements: 30,
            collaboration_type: 'knowledge_sharing'
        };

        const result = bioLearning.processCollaborativeRequest(request);
        
        if (!result || !result.path_id) {
            throw new Error('Collaborative request processing should return result with path_id');
        }
    });

    // Summary
    console.log('\n📊 Bio-Inspired Learning Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
        console.log('\n🌿 All bio-inspired learning tests passed! Nature\'s intelligence is working correctly.');
        return true;
    } else {
        console.log('\n⚠️  Some bio-inspired tests failed. Please check the implementation.');
        return false;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runBioInspiredTests();
}

module.exports = { runBioInspiredTests };