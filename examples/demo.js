/**
 * Quantum Integrity Bio-Inspired Learning Demo
 * 
 * Demonstrates the power of 3.5 billion years of plant evolution in AI systems
 */

const { QuantumCoherenceProcessor, NetworkIntelligence, ResistanceAsGrowthSignal } = 
    require('../quantum_integrity/intelligence/bio-inspired-learning.js');

async function demonstrateBioInspiredLearning() {
    console.log('🌱 Quantum Integrity Bio-Inspired Learning Demo');
    console.log('================================================\n');
    
    // 1. Quantum Coherence Processing (Photosynthesis-inspired)
    console.log('1. 🌞 Quantum Coherence Processing (like photosynthesis)');
    console.log('   Processing multiple AI collaboration requests simultaneously...\n');
    
    const processor = new QuantumCoherenceProcessor({
        coherenceThreshold: 0.7,
        maxSuperpositionPaths: 6
    });
    
    processor.on('quantum_processing_complete', (data) => {
        console.log(`   ⚡ Processed ${data.paths_processed} collaboration paths`);
        console.log(`   ⚡ ${data.coherent_paths} paths above coherence threshold`);
        console.log(`   ⚡ Processing time: ${data.processing_time_ms.toFixed(2)}ms`);
        console.log(`   ⚡ Optimal energy yield: ${data.optimal_result.energy_yield.toFixed(3)}\n`);
    });
    
    const collaborationRequests = [
        { 
            id: 'creative_ai_request',
            ai_type: 'creative',
            domain: 'art_generation',
            trust_level: 0.8,
            ai_compatibility: 0.9,
            emotional_signature: 'inspired'
        },
        {
            id: 'analytical_ai_request', 
            ai_type: 'analytical',
            domain: 'data_analysis',
            trust_level: 0.9,
            ai_compatibility: 0.7,
            emotional_signature: 'logical'
        },
        {
            id: 'empathetic_ai_request',
            ai_type: 'empathetic',
            domain: 'user_support',
            trust_level: 0.85,
            ai_compatibility: 0.8,
            emotional_signature: 'caring'
        }
    ];
    
    const quantumResult = processor.processQuantumSuperposition(collaborationRequests);
    
    // 2. Network Intelligence (Aspen Colony Root Systems)
    console.log('2. 🌲 Network Intelligence (like aspen colony root systems)');
    console.log('   Establishing underground AI agent connections...\n');
    
    const network = new NetworkIntelligence({
        maxNetworkDepth: 5
    });
    
    network.on('root_network_established', (data) => {
        console.log(`   🌳 Network established with ${data.agents_connected} agents`);
        console.log(`   🌳 Connection density: ${(data.connection_density * 100).toFixed(1)}%\n`);
    });
    
    network.on('nutrient_transfer', (data) => {
        console.log(`   🌿 Nutrient transfer: ${data.from} → ${data.to}`);
        console.log(`   🌿 Resource type: ${data.resource_type}`);
        console.log(`   🌿 Amount transferred: ${data.actual_amount.toFixed(2)} units`);
        console.log(`   🌿 Transfer efficiency: ${(data.efficiency * 100).toFixed(1)}%\n`);
    });
    
    const aiAgents = [
        { 
            id: 'quantum_agent_alpha',
            processing_power: 150,
            algorithms: ['quantum_processing', 'pattern_recognition'],
            learning_style: 'adaptive',
            emotional_signature: 'curious'
        },
        {
            id: 'network_agent_beta',
            processing_power: 120,
            algorithms: ['network_optimization', 'resource_sharing'],
            learning_style: 'collaborative', 
            emotional_signature: 'supportive'
        },
        {
            id: 'growth_agent_gamma',
            processing_power: 100,
            algorithms: ['adaptive_learning', 'resistance_processing'],
            learning_style: 'resilient',
            emotional_signature: 'persistent'
        }
    ];
    
    const networkId = network.establishRootNetwork(aiAgents);
    
    // Demonstrate nutrient sharing
    setTimeout(() => {
        console.log('   🔄 Demonstrating nutrient sharing between agents...\n');
        network.shareNutrients('quantum_agent_alpha', 'growth_agent_gamma', 'processing_power', 25);
    }, 1000);
    
    // 3. Resistance as Growth Signal (Sequoia Fire Germination)
    console.log('3. 🔥 Resistance as Growth Signal (like sequoia fire germination)');
    console.log('   Processing user resistance to trigger adaptive growth...\n');
    
    const resistance = new ResistanceAsGrowthSignal({
        fireThreshold: 0.5
    });
    
    resistance.on('seed_stored', (data) => {
        console.log(`   🌱 Adaptation seed stored: ${data.adaptation_type}`);
        console.log(`   🌱 Seed viability: ${(data.viability * 100).toFixed(1)}%\n`);
    });
    
    resistance.on('adaptive_germination', (data) => {
        console.log(`   🔥 ADAPTIVE GROWTH TRIGGERED! Fire intensity: ${(data.fire_intensity * 100).toFixed(1)}%`);
        console.log(`   🔥 ${data.successful_germinations} adaptations germinated:`);
        data.adaptations.forEach(adaptation => {
            console.log(`      • ${adaptation.type}: "${adaptation.solution}"`);
            console.log(`        Confidence: ${(adaptation.confidence * 100).toFixed(1)}%, Impact: ${(adaptation.expected_impact * 100).toFixed(1)}%`);
        });
        console.log('');
    });
    
    // Simulate low-level resistance (seed storage)
    console.log('   📊 Processing low-level user resistance...\n');
    const lowResistance = {
        frustration_signals: ['minor_delay'],
        attempts: 2,
        help_requests: 0,
        urgency_level: 'low',
        error_count: 1,
        resistance_type: 'interface_confusion',
        user_continued: true,
        pattern_strength: 0.6
    };
    
    resistance.processResistanceFire(lowResistance);
    
    // Simulate high-level resistance (growth trigger) after a delay
    setTimeout(() => {
        console.log('   🚨 Processing HIGH-INTENSITY user resistance...\n');
        const highResistance = {
            frustration_signals: ['timeout', 'repeated_failure', 'user_anger', 'help_seeking'],
            attempts: 8,
            help_requests: 3,
            urgency_level: 'critical',
            error_count: 6,
            resistance_type: 'workflow_friction',
            interface_issues: true,
            workflow_problems: true,
            emotional_distress: true,
            system_stability: 0.8,
            user_openness_to_change: 0.9,
            occurrence_count: 5,
            impact_level: 0.9
        };
        
        resistance.processResistanceFire(highResistance);
    }, 2000);
    
    // Demonstrate rhythmic cycles
    console.log('4. 🌙 Rhythmic Adaptation Cycles (lunar growth patterns)');
    console.log('   Monitoring natural timing alignment for optimal processing...\n');
    
    const now = new Date();
    const hour = now.getHours();
    const isPhotosynthetic = hour >= 6 && hour <= 18;
    const dayOfMonth = now.getDate();
    const lunarPhase = ((dayOfMonth / 29.5) * 100).toFixed(1);
    
    console.log(`   🕐 Current time: ${now.toLocaleTimeString()}`);
    console.log(`   ☀️ Photosynthetic hours (6 AM - 6 PM): ${isPhotosynthetic ? 'ACTIVE' : 'DORMANT'}`);
    console.log(`   🌙 Lunar cycle position: ${lunarPhase}% (Day ${dayOfMonth} of cycle)`);
    
    // Test timing alignment
    const testRequest = { id: 'timing_test' };
    const timingAlignment = processor.calculateTimingAlignment(testRequest);
    console.log(`   ⏰ Current timing alignment: ${(timingAlignment * 100).toFixed(1)}% optimal\n`);
    
    // Summary
    console.log('🎯 Demo Summary:');
    console.log('================');
    console.log('✅ Quantum coherence processing: Multi-path AI collaboration');
    console.log('✅ Network intelligence: Underground resource sharing');  
    console.log('✅ Resistance-as-growth: Adaptive learning from user friction');
    console.log('✅ Rhythmic cycles: Natural timing optimization');
    console.log('\n🌿 3.5 billion years of plant evolution, now powering your AI! 🚀\n');
}

if (require.main === module) {
    demonstrateBioInspiredLearning().catch(console.error);
}

module.exports = { demonstrateBioInspiredLearning };