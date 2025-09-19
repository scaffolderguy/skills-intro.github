/**
 * Example Usage of the Diamond Kernel System
 * 
 * This file demonstrates how to use the Codon Interpreter Kernel
 * for symbolic execution and agent coordination.
 */

import { DiamondKernel, createKernel } from './index';

// Example 1: Basic codon execution
function basicExample() {
  console.log('\n=== BASIC CODON EXECUTION EXAMPLE ===');
  
  const kernel = createKernel(true);
  
  // Execute individual codons
  kernel.executeCodon('XJ-42'); // Narrative: activate memory
  kernel.executeCodon('ZQ-88'); // Energy: distribute flow
  kernel.executeCodon('LM-17'); // Biodata: initiate healing
  
  // Show system status
  setTimeout(() => {
    kernel.generateSystemVisualization();
  }, 500);
}

// Example 2: Sequence execution with custom actions
function sequenceExample() {
  console.log('\n=== CODON SEQUENCE EXECUTION EXAMPLE ===');
  
  const kernel = createKernel(true);
  
  // Execute a sequence of codons
  const ritualSequence = ['XJ-42', 'ZQ-88', 'LM-17', 'NK-73', 'PY-15'];
  kernel.executeCodons(ritualSequence);
  
  // Wait for async operations and show results
  setTimeout(() => {
    const status = kernel.getSystemStatus();
    console.log('\n📊 Final System Status:', JSON.stringify(status, null, 2));
  }, 1000);
}

// Example 3: Custom symbolic actions
function customActionExample() {
  console.log('\n=== CUSTOM SYMBOLIC ACTION EXAMPLE ===');
  
  const kernel = createKernel(true);
  
  // Execute custom symbolic actions
  kernel.executeAction({
    type: 'energy',
    action: 'distributeFlow',
    amount: 25,
    target: 'healing-network',
    priority: 'high'
  });
  
  kernel.executeAction({
    type: 'narrative',
    action: 'activateMemory',
    memoryUnits: 12,
    context: 'ancient-wisdom',
    depth: 5
  });
  
  // Show the token flow visualization
  setTimeout(() => {
    kernel.getBarterMapper().generateFlowVisualization();
  }, 300);
}

// Example 4: Agent registration and custom behavior
function customAgentExample() {
  console.log('\n=== CUSTOM AGENT REGISTRATION EXAMPLE ===');
  
  const kernel = new DiamondKernel(true);
  
  // Register a custom agent before initialization
  kernel.getFlowEngine().registerAgent('custom', (action) => {
    console.log('🎭 Custom Agent: Handling custom action:', action);
    
    // Custom logic here
    if (action.action === 'mysticalRitual') {
      console.log('🎭 Performing mystical ritual with parameters:', action);
      
      // Integrate with other systems
      kernel.getLedger().recordTransaction(action, action.codon, {
        ritualType: action.ritualType || 'generic',
        participants: action.participants || 1
      });
    }
  });
  
  // Add a custom codon to the registry
  kernel.getCodonRegistry().register('MR-99', {
    type: 'custom',
    action: 'mysticalRitual',
    ritualType: 'moonlight-invocation'
  });
  
  kernel.initialize();
  
  // Execute the custom codon
  kernel.executeCodon('MR-99');
  
  // Execute custom action directly
  kernel.executeAction({
    type: 'custom',
    action: 'mysticalRitual',
    ritualType: 'solar-alignment',
    participants: 7,
    codon: 'MR-99'
  });
}

// Example 5: Feedback and adaptation
function feedbackExample() {
  console.log('\n=== FEEDBACK AND ADAPTATION EXAMPLE ===');
  
  const kernel = createKernel(true);
  
  // Execute multiple actions to generate feedback data
  const testSequence = ['XJ-42', 'ZQ-88', 'LM-17', 'XJ-42', 'ZQ-88'];
  testSequence.forEach((codon, index) => {
    setTimeout(() => {
      kernel.executeCodon(codon);
    }, index * 100);
  });
  
  // Show feedback statistics after execution
  setTimeout(() => {
    const feedback = kernel.getFeedback();
    const stats = feedback.getFeedbackStatistics();
    console.log('\n🔄 Feedback Statistics:', stats);
    
    // Manually adjust behavior
    feedback.overrideBehaviorParameter('energy', 'efficiency', 1.5);
    
    // Execute another action to see the effect
    kernel.executeCodon('ZQ-88');
  }, 1000);
}

// Example 6: Complex ritual orchestration
function complexRitualExample() {
  console.log('\n=== COMPLEX RITUAL ORCHESTRATION EXAMPLE ===');
  
  const kernel = createKernel(true);
  
  // Define a complex ritual sequence with timing
  const ritualSteps = [
    { codon: 'XJ-42', delay: 0, description: 'Awaken ancient memories' },
    { codon: 'ZQ-88', delay: 200, description: 'Channel energy flows' },
    { codon: 'LM-17', delay: 400, description: 'Initiate healing cascade' },
    { codon: 'PY-15', delay: 600, description: 'Map token flows' },
    { codon: 'QR-91', delay: 800, description: 'Adjust system behavior' },
    { codon: 'NK-73', delay: 1000, description: 'Record ritual completion' }
  ];
  
  console.log('🎭 Beginning Complex Ritual Sequence...');
  
  ritualSteps.forEach(step => {
    setTimeout(() => {
      console.log(`🎭 Ritual Step: ${step.description}`);
      kernel.executeCodon(step.codon);
    }, step.delay);
  });
  
  // Generate final visualization after all steps
  setTimeout(() => {
    console.log('\n🎭 RITUAL COMPLETION VISUALIZATION:');
    kernel.generateSystemVisualization();
  }, 1500);
}

// Main execution function
async function runExamples() {
  console.log('💎 DIAMOND KERNEL - CODON INTERPRETER SYSTEM');
  console.log('===========================================');
  
  // Run examples with delays to prevent overlap
  basicExample();
  
  setTimeout(() => sequenceExample(), 2000);
  setTimeout(() => customActionExample(), 4000);
  setTimeout(() => customAgentExample(), 6000);
  setTimeout(() => feedbackExample(), 8000);
  setTimeout(() => complexRitualExample(), 11000);
}

// Export for external use
export {
  basicExample,
  sequenceExample,
  customActionExample,
  customAgentExample,
  feedbackExample,
  complexRitualExample,
  runExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples();
}