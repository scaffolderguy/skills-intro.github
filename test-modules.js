// Simple test script for individual modules
console.log('🧪 Testing individual modules...');

try {
    console.log('Testing ResonantBondTracker...');
    const ResonantBondTracker = require('./core/resonant-bond-tracker');
    console.log('✅ ResonantBondTracker loaded');
    
    console.log('Testing MetaLearningEvolution...');
    const MetaLearningEvolution = require('./core/meta-learning-evolution');
    console.log('✅ MetaLearningEvolution loaded');
    
    console.log('Testing QuantumCoherenceProcessor...');
    const QuantumCoherenceProcessor = require('./intelligence/quantum-coherence-processor');
    console.log('✅ QuantumCoherenceProcessor loaded');
    
    console.log('Testing NetworkIntelligence...');
    const NetworkIntelligence = require('./intelligence/network-intelligence');
    console.log('✅ NetworkIntelligence loaded');
    
    console.log('🎉 All core modules loaded successfully!');
    
    // Test basic functionality
    console.log('\n🔍 Testing basic functionality...');
    const bondTracker = new ResonantBondTracker();
    const bond = bondTracker.createBond('AI_A', 'AI_B', 0.7);
    console.log('✅ Bond created successfully:', bond.bondId);
    
    const metaLearning = new MetaLearningEvolution();
    const progress = metaLearning.getLearningProgress();
    console.log('✅ Meta learning progress:', progress.generation);
    
    console.log('🎉 Basic functionality tests passed!');
    
} catch (e) {
    console.log('❌ Error testing modules:', e.message);
    console.log('Stack:', e.stack?.split('\n')[0]);
}