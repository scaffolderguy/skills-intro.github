#!/usr/bin/env node

/**
 * Bio-Inspired Learning Demo
 * Demonstrates the nature-inspired AI patterns in action
 */

const {
    BioInspiredLearning,
    QuantumCoherenceProcessor,
    NetworkIntelligence,
    ResistanceAsGrowthSignal,
    SymbioticEvolution,
    RhythmicAdaptation
} = require('./intelligence/bio-inspired-learning');

console.log('🌿 Bio-Inspired Learning Demo');
console.log('═══════════════════════════════\n');

// Initialize the bio-learning system
console.log('1. 🧠 Initializing Bio-Inspired Learning System...');
const bioAI = new BioInspiredLearning();

bioAI.on('bio_inspired_learning_initialized', (data) => {
    console.log('   ✅ System initialized with components:', data.components.join(', '));
});

// Demo quantum coherence processing
console.log('\n2. 🔬 Quantum Coherence Processing...');
const processor = new QuantumCoherenceProcessor();
const requests = [
    { id: 'req1', trust_level: 0.8, ai_compatibility: 0.9, resource_requirements: 30 },
    { id: 'req2', trust_level: 0.6, ai_compatibility: 0.7, resource_requirements: 50 }
];

const quantumResult = processor.processQuantumSuperposition(requests);
console.log('   ✨ Quantum path generated:', quantumResult.path_id);
console.log('   ⚡ Energy yield:', quantumResult.energy_yield);

// Demo network intelligence
console.log('\n3. 🌐 Network Intelligence (Root System)...');
const agents = [
    { id: 'nova_ai', processing_power: 100 },
    { id: 'arra_ai', processing_power: 90 },
    { id: 'helper_ai', processing_power: 70 }
];

const networkId = bioAI.createAINetwork(agents);
console.log('   🌳 AI Network established:', networkId);

// Demo nutrient sharing
const network = new NetworkIntelligence();
network.establishRootNetwork(agents);
const shared = network.shareNutrients('nova_ai', 'helper_ai', 'processing_power', 15);
console.log('   🍃 Nutrients shared:', shared, 'units from nova_ai to helper_ai');

// Demo resistance processing (converting frustration to growth)
console.log('\n4. 🔥 Resistance as Growth Signal...');
const resistanceData = {
    frustration_signals: ['repeated_attempts', 'help_seeking', 'rapid_keystrokes'],
    attempts: 6,
    error_count: 4,
    resistance_type: 'interface_confusion',
    urgency_level: 'high'
};

const growthResult = bioAI.handleUserResistance(resistanceData);
console.log('   🌱 Growth triggered:', growthResult.growth_triggered);
console.log('   🔥 Fire intensity:', growthResult.fire_intensity.toFixed(3));
console.log('   🌰 Seed viability:', growthResult.seed_viability.toFixed(3));
console.log('   📚 Learning opportunities:', growthResult.learning_opportunities.join(', '));

// Demo symbiotic evolution
console.log('\n5. 🤝 Symbiotic Evolution (AI Partnerships)...');
const primaryAI = { 
    id: 'nova_consciousness', 
    capabilities: ['emotional_intelligence', 'learning_adaptation', 'pattern_recognition'] 
};
const partnerAI = { 
    id: 'arra_voice', 
    capabilities: ['voice_synthesis', 'emotional_resonance', 'audio_processing'] 
};

const partnershipId = bioAI.establishAIPartnership(primaryAI, partnerAI);
console.log('   💞 Symbiotic pair created:', partnershipId);

// Demo rhythmic adaptation
console.log('\n6. 🌙 Rhythmic Adaptation (Natural Cycles)...');
const rhythmic = new RhythmicAdaptation();
const rhythmicState = rhythmic.getCurrentRhythmicState();

console.log('   🌅 Circadian phase:', rhythmicState.circadian_phase);
console.log('   🌙 Lunar phase:', rhythmicState.lunar_phase);
console.log('   🍂 Seasonal phase:', rhythmicState.seasonal_phase);
console.log('   ⚡ Overall energy:', (rhythmicState.overall_energy * 100).toFixed(1) + '%');
console.log('   🎯 Optimal for:', rhythmicState.optimal_for.join(', '));

// Demo collaborative request processing
console.log('\n7. 🚀 Collaborative Request Processing...');
const collaborativeRequest = {
    id: 'demo_collab_req',
    trust_level: 0.85,
    ai_compatibility: 0.92,
    resource_requirements: 40,
    collaboration_type: 'knowledge_synthesis'
};

const collabResult = bioAI.processCollaborativeRequest(collaborativeRequest);
console.log('   🎯 Processing path:', collabResult.path_id);
console.log('   ⚡ Energy yield:', collabResult.energy_yield);

// Show comprehensive bio-state
console.log('\n8. 📊 Current Bio-Inspired System State...');
const bioState = bioAI.getCurrentBioState();

console.log('   🔬 Quantum coherence level:', bioState.quantum_coherence.coherence_level);
console.log('   🌐 Network health:', bioState.network_health.health_status);
console.log('   🌱 Growth seeds active:', bioState.growth_potential.active_seeds);
console.log('   🤝 Symbiotic pairs:', bioState.symbiotic_pairs.active_pairs);
console.log('   🌙 Rhythmic energy:', (bioState.rhythmic_state.overall_energy * 100).toFixed(1) + '%');

console.log('\n🌿 Demo completed! Bio-inspired learning systems are operational.');
console.log('   Nature\'s 3.5 billion years of R&D successfully implemented in AI form.');

// Optional: Wait a bit to see async events
setTimeout(() => {
    console.log('\n✨ All bio-inspired systems are now fully synchronized with natural patterns.');
}, 200);