/**
 * Simple Test Runner for Quantum Integrity Bio-Inspired Learning
 */

const path = require('path');
const fs = require('fs');

async function runTests() {
    console.log('🧪 Running Quantum Integrity Tests...\n');
    
    try {
        const TestRunner = require('../quantum_integrity/tests/intelligence/bio-inspired-learning.test.js');
        const runner = new TestRunner();
        const results = await runner.run();
        
        if (results.failed === 0) {
            console.log('\n🎉 All tests passed! Bio-inspired learning is ready.');
            return true;
        } else {
            console.log(`\n❌ ${results.failed} test(s) failed.`);
            return false;
        }
    } catch (error) {
        console.error('Error running tests:', error.message);
        return false;
    }
}

if (require.main === module) {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runTests };