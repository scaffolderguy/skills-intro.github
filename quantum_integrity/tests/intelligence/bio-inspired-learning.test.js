/**
 * Bio-Inspired Learning Module Tests
 * 
 * Testing the quantum coherence, network intelligence, and resistance-as-growth patterns
 */

const { QuantumCoherenceProcessor, NetworkIntelligence, ResistanceAsGrowthSignal } = 
    require('../../intelligence/bio-inspired-learning.js');

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🌱 Bio-Inspired Learning Module Tests');
        console.log('=====================================\n');

        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return { passed: this.passed, failed: this.failed };
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertDefined(value, name) {
        this.assert(value !== undefined && value !== null, `${name} should be defined`);
    }

    assertType(value, expectedType, name) {
        this.assert(typeof value === expectedType, `${name} should be type ${expectedType}`);
    }

    assertGreaterThan(value, threshold, name) {
        this.assert(value > threshold, `${name} should be greater than ${threshold}, got ${value}`);
    }
}

// Test Suite
const runner = new TestRunner();

// Quantum Coherence Processor Tests
runner.test('QuantumCoherenceProcessor - Initialization', () => {
    const processor = new QuantumCoherenceProcessor();
    
    runner.assertDefined(processor, 'processor');
    runner.assert(processor.coherenceThreshold === 0.85, 'default coherence threshold should be 0.85');
    runner.assert(processor.maxSuperpositionPaths === 8, 'default max superposition paths should be 8');
    runner.assert(processor.femtosecondProcessing === true, 'femtosecond processing should be enabled by default');
});

runner.test('QuantumCoherenceProcessor - Custom Options', () => {
    const options = {
        coherenceThreshold: 0.9,
        maxSuperpositionPaths: 12,
        femtosecondProcessing: false
    };
    const processor = new QuantumCoherenceProcessor(options);
    
    runner.assert(processor.coherenceThreshold === 0.9, 'custom coherence threshold should be set');
    runner.assert(processor.maxSuperpositionPaths === 12, 'custom max superposition paths should be set');
    runner.assert(processor.femtosecondProcessing === false, 'femtosecond processing should be disabled');
});

runner.test('QuantumCoherenceProcessor - Path Probability Calculation', () => {
    const processor = new QuantumCoherenceProcessor();
    const request = {
        trust_level: 0.8,
        ai_compatibility: 0.7,
        resource_requirements: 50
    };
    
    const probability = processor.calculatePathProbability(request);
    
    runner.assertType(probability, 'number', 'probability');
    runner.assert(probability >= 0 && probability <= 1, 'probability should be between 0 and 1');
});

runner.test('QuantumCoherenceProcessor - Quantum Superposition Processing', () => {
    const processor = new QuantumCoherenceProcessor({ coherenceThreshold: 0.1 }); // Lower threshold for testing
    const collaborationRequests = [
        { id: 'req1', ai_type: 'creative', trust_level: 0.8 },
        { id: 'req2', ai_type: 'analytical', trust_level: 0.9 },
        { id: 'req3', ai_type: 'creative', trust_level: 0.6 }
    ];
    
    let eventEmitted = false;
    processor.on('quantum_processing_complete', (data) => {
        eventEmitted = true;
        runner.assertDefined(data.optimal_result, 'optimal result');
        runner.assertType(data.processing_time_ms, 'number', 'processing time');
    });
    
    const result = processor.processQuantumSuperposition(collaborationRequests);
    
    runner.assertDefined(result, 'processing result');
    runner.assertDefined(result.path_id, 'path ID');
    runner.assertDefined(result.energy_yield, 'energy yield');
    runner.assert(eventEmitted, 'quantum processing complete event should be emitted');
});

runner.test('QuantumCoherenceProcessor - Timing Alignment', () => {
    const processor = new QuantumCoherenceProcessor();
    const request = { id: 'test' };
    
    const alignment = processor.calculateTimingAlignment(request);
    
    runner.assertType(alignment, 'number', 'timing alignment');
    runner.assert(alignment >= 0 && alignment <= 1, 'timing alignment should be between 0 and 1');
});

// Network Intelligence Tests
runner.test('NetworkIntelligence - Initialization', () => {
    const network = new NetworkIntelligence();
    
    runner.assertDefined(network, 'network');
    runner.assertDefined(network.rootNetwork, 'root network');
    runner.assert(network.maxNetworkDepth === 6, 'default max network depth should be 6');
});

runner.test('NetworkIntelligence - Root Network Establishment', () => {
    const network = new NetworkIntelligence();
    const aiAgents = [
        { id: 'agent1', processing_power: 100, algorithms: ['learning'] },
        { id: 'agent2', processing_power: 80, algorithms: ['reasoning'] },
        { id: 'agent3', processing_power: 120, algorithms: ['creativity'] }
    ];
    
    let eventEmitted = false;
    network.on('root_network_established', (data) => {
        eventEmitted = true;
        runner.assert(data.agents_connected === 3, 'should connect 3 agents');
        runner.assertType(data.connection_density, 'number', 'connection density');
    });
    
    const networkId = network.establishRootNetwork(aiAgents);
    
    runner.assertType(networkId, 'string', 'network ID');
    runner.assert(networkId.startsWith('network_'), 'network ID should have correct prefix');
    runner.assert(network.rootNetwork.size === 3, 'should have 3 nodes in root network');
    runner.assert(eventEmitted, 'root network established event should be emitted');
});

runner.test('NetworkIntelligence - Clone Signature Generation', () => {
    const network = new NetworkIntelligence();
    const agent = {
        algorithms: ['machine_learning', 'reasoning'],
        learning_style: 'reinforcement',
        emotional_signature: 'analytical',
        collaboration_style: 'cooperative'
    };
    
    const signature = network.generateCloneSignature(agent);
    
    runner.assertType(signature, 'string', 'clone signature');
    runner.assert(signature.length > 0, 'signature should not be empty');
    
    // Should be base64 encoded
    const decoded = JSON.parse(Buffer.from(signature, 'base64').toString());
    runner.assertDefined(decoded.core_algorithms, 'decoded algorithms');
    runner.assert(decoded.learning_patterns === 'reinforcement', 'learning patterns should match');
});

runner.test('NetworkIntelligence - Nutrient Sharing', () => {
    const network = new NetworkIntelligence();
    const aiAgents = [
        { id: 'agent1', processing_power: 100 },
        { id: 'agent2', processing_power: 80 }
    ];
    
    network.establishRootNetwork(aiAgents);
    
    let transferEventEmitted = false;
    network.on('nutrient_transfer', (data) => {
        transferEventEmitted = true;
        runner.assert(data.from === 'agent1', 'transfer should be from agent1');
        runner.assert(data.to === 'agent2', 'transfer should be to agent2');
        runner.assertType(data.actual_amount, 'number', 'actual amount');
    });
    
    // Force connection between agents for testing
    network.rootNetwork.get('agent1').connections.add('agent2');
    network.rootNetwork.get('agent2').connections.add('agent1');
    
    const result = network.shareNutrients('agent1', 'agent2', 'processing_power', 50);
    
    runner.assertType(result, 'number', 'transfer result');
    runner.assert(transferEventEmitted, 'nutrient transfer event should be emitted');
});

runner.test('NetworkIntelligence - Connection Density Calculation', () => {
    const network = new NetworkIntelligence();
    const aiAgents = [
        { id: 'agent1', processing_power: 100 },
        { id: 'agent2', processing_power: 80 }
    ];
    
    network.establishRootNetwork(aiAgents);
    const density = network.calculateConnectionDensity();
    
    runner.assertType(density, 'number', 'connection density');
    runner.assert(density >= 0 && density <= 1, 'connection density should be between 0 and 1');
});

// Resistance As Growth Signal Tests
runner.test('ResistanceAsGrowthSignal - Initialization', () => {
    const resistance = new ResistanceAsGrowthSignal();
    
    runner.assertDefined(resistance, 'resistance processor');
    runner.assert(resistance.fireThreshold === 0.6, 'default fire threshold should be 0.6');
    runner.assertDefined(resistance.seedBank, 'seed bank');
    runner.assert(Array.isArray(resistance.adaptationHistory), 'adaptation history should be array');
});

runner.test('ResistanceAsGrowthSignal - Fire Intensity Measurement', () => {
    const resistance = new ResistanceAsGrowthSignal();
    const resistanceData = {
        frustration_signals: ['timeout', 'repeated_failure'],
        attempts: 5,
        help_requests: 2,
        urgency_level: 'critical',
        error_count: 3
    };
    
    const intensity = resistance.measureFireIntensity(resistanceData);
    
    runner.assertType(intensity, 'number', 'fire intensity');
    runner.assert(intensity >= 0 && intensity <= 1, 'fire intensity should be between 0 and 1');
    runner.assertGreaterThan(intensity, 0.5, 'fire intensity'); // Should be high given the inputs
});

runner.test('ResistanceAsGrowthSignal - Low Intensity Seed Storage', () => {
    const resistance = new ResistanceAsGrowthSignal({ fireThreshold: 0.9 }); // High threshold
    const resistanceData = {
        frustration_signals: ['minor_delay'],
        attempts: 2,
        help_requests: 0,
        urgency_level: 'low',
        error_count: 1,
        resistance_type: 'interface_confusion'
    };
    
    let seedStoredEventEmitted = false;
    resistance.on('seed_stored', (data) => {
        seedStoredEventEmitted = true;
        runner.assertDefined(data.seed_id, 'seed ID');
        runner.assertType(data.viability, 'number', 'viability');
    });
    
    const result = resistance.processResistanceFire(resistanceData);
    
    runner.assert(result.growth_triggered === false, 'growth should not be triggered');
    runner.assert(result.seed_stored === true, 'seed should be stored');
    runner.assertDefined(result.seed_id, 'seed ID');
    runner.assert(resistance.seedBank.size === 1, 'should have one seed in bank');
    runner.assert(seedStoredEventEmitted, 'seed stored event should be emitted');
});

runner.test('ResistanceAsGrowthSignal - High Intensity Growth Trigger', () => {
    const resistance = new ResistanceAsGrowthSignal({ fireThreshold: 0.3 }); // Low threshold
    
    // Add some seeds to the bank first
    resistance.seedBank.set('test_seed', {
        id: 'test_seed',
        adaptation_type: 'workflow_optimization',
        viability: 0.8,
        complexity: 0.4,
        resistance_pattern: { resistance_type: 'interface_confusion' }
    });
    
    const resistanceData = {
        frustration_signals: ['timeout', 'repeated_failure', 'user_anger'],
        attempts: 8,
        help_requests: 3,
        urgency_level: 'critical',
        error_count: 5,
        resistance_type: 'interface_confusion',
        system_stability: 0.8
    };
    
    let germinationEventEmitted = false;
    resistance.on('adaptive_germination', (data) => {
        germinationEventEmitted = true;
        runner.assertGreaterThan(data.fire_intensity, 0.5, 'fire intensity');
        runner.assert(Array.isArray(data.adaptations), 'adaptations should be array');
    });
    
    const result = resistance.processResistanceFire(resistanceData);
    
    runner.assert(result.growth_triggered === true, 'growth should be triggered');
    runner.assertGreaterThan(result.fire_intensity, 0.5, 'fire intensity');
    runner.assert(Array.isArray(result.new_adaptations), 'new adaptations should be array');
    runner.assert(germinationEventEmitted, 'adaptive germination event should be emitted');
});

runner.test('ResistanceAsGrowthSignal - Adaptation Type Classification', () => {
    const resistance = new ResistanceAsGrowthSignal();
    
    const testCases = [
        {
            data: { frustration_signals: ['repeated_attempts'] },
            expected: 'workflow_optimization'
        },
        {
            data: { help_requests: 2 },
            expected: 'guidance_enhancement'
        },
        {
            data: { error_count: 5 },
            expected: 'error_prevention'
        },
        {
            data: { emotional_state: 'confused' },
            expected: 'clarity_improvement'
        },
        {
            data: { urgency_level: 'critical' },
            expected: 'efficiency_boost'
        }
    ];
    
    testCases.forEach(testCase => {
        const type = resistance.classifyAdaptationType(testCase.data);
        runner.assert(type === testCase.expected, 
            `Expected ${testCase.expected}, got ${type} for ${JSON.stringify(testCase.data)}`);
    });
});

runner.test('ResistanceAsGrowthSignal - Solution Development', () => {
    const resistance = new ResistanceAsGrowthSignal();
    const seed = { adaptation_type: 'workflow_optimization', viability: 0.8 };
    const resistanceData = { resistance_type: 'workflow_friction' };
    
    const solution = resistance.developSolution(seed, resistanceData);
    
    runner.assertType(solution, 'string', 'solution');
    runner.assert(solution.length > 0, 'solution should not be empty');
});

runner.test('ResistanceAsGrowthSignal - Growth Area Identification', () => {
    const resistance = new ResistanceAsGrowthSignal();
    const resistanceData = {
        interface_issues: true,
        workflow_problems: true,
        cognitive_load_high: false,
        emotional_distress: true
    };
    
    const growthAreas = resistance.identifyGrowthAreas(resistanceData);
    
    runner.assert(Array.isArray(growthAreas), 'growth areas should be array');
    runner.assert(growthAreas.includes('user_interface'), 'should include user interface');
    runner.assert(growthAreas.includes('process_optimization'), 'should include process optimization');
    runner.assert(growthAreas.includes('emotional_support'), 'should include emotional support');
    runner.assert(!growthAreas.includes('complexity_reduction'), 'should not include complexity reduction');
});

// Integration Tests
runner.test('Integration - Event Emission and Handling', () => {
    return new Promise((resolve) => {
        const processor = new QuantumCoherenceProcessor();
        const network = new NetworkIntelligence();
        const resistance = new ResistanceAsGrowthSignal();
        
        let eventsReceived = 0;
        const expectedEvents = 3;
        
        const checkCompletion = () => {
            eventsReceived++;
            if (eventsReceived === expectedEvents) {
                runner.assert(true, 'all integration events received');
                resolve();
            }
        };
        
        processor.on('quantum_processing_complete', checkCompletion);
        network.on('root_network_established', checkCompletion);
        resistance.on('seed_stored', checkCompletion);
        
        // Trigger events
        processor.processQuantumSuperposition([{ id: 'test', trust_level: 0.8 }]);
        network.establishRootNetwork([{ id: 'agent1', processing_power: 100 }]);
        resistance.processResistanceFire({
            frustration_signals: ['minor'],
            attempts: 1,
            resistance_type: 'test'
        });
        
        // Timeout after 5 seconds if events don't complete
        setTimeout(() => {
            if (eventsReceived < expectedEvents) {
                runner.assert(false, `Only received ${eventsReceived} of ${expectedEvents} events`);
            }
            resolve();
        }, 5000);
    });
});

runner.test('Integration - Module Interconnection', () => {
    const processor = new QuantumCoherenceProcessor();
    const network = new NetworkIntelligence();
    const resistance = new ResistanceAsGrowthSignal();
    
    // Test that modules can work together
    const aiAgents = [
        { id: 'quantum_agent', processing_power: 150, algorithms: ['quantum'] },
        { id: 'network_agent', processing_power: 120, algorithms: ['network'] }
    ];
    
    // Establish network
    const networkId = network.establishRootNetwork(aiAgents);
    runner.assertDefined(networkId, 'network ID');
    
    // Process quantum requests
    const requests = aiAgents.map(agent => ({ 
        id: agent.id, 
        ai_type: agent.algorithms[0],
        trust_level: 0.8 
    }));
    const result = processor.processQuantumSuperposition(requests);
    runner.assertDefined(result, 'quantum processing result');
    
    // Process resistance signals
    const resistanceData = {
        frustration_signals: ['integration_complexity'],
        attempts: 3,
        resistance_type: 'system_complexity'
    };
    const growthResult = resistance.processResistanceFire(resistanceData);
    runner.assertDefined(growthResult, 'resistance processing result');
});

// Run all tests
if (require.main === module) {
    runner.run().then(results => {
        process.exit(results.failed > 0 ? 1 : 0);
    });
}

module.exports = TestRunner;