#!/usr/bin/env node

/**
 * Test runner for Living Histories system
 */

const { runBasicTests } = require('./basic-functionality');

async function runAllTests() {
    console.log('🚀 Living Histories Test Suite\n');
    console.log('Testing emotional and contextual logging system...\n');
    
    const results = [];
    
    // Run basic functionality tests
    console.log('='.repeat(50));
    console.log('📋 BASIC FUNCTIONALITY TESTS');
    console.log('='.repeat(50));
    const basicTestsPassed = runBasicTests();
    results.push({ name: 'Basic Functionality', passed: basicTestsPassed });
    
    // Future test suites would go here
    // - Integration tests
    // - Performance tests
    // - Schema validation tests
    // - Emotional parser accuracy tests
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 OVERALL TEST RESULTS');
    console.log('='.repeat(50));
    
    const totalSuites = results.length;
    const passedSuites = results.filter(r => r.passed).length;
    
    results.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${result.name}`);
    });
    
    console.log(`\n📈 Test Suites: ${passedSuites}/${totalSuites} passed`);
    
    if (passedSuites === totalSuites) {
        console.log('\n🎉 All test suites passed! The Living Histories system is ready for use.');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some test suites failed. Please review the implementation.');
        process.exit(1);
    }
}

// Run all tests
runAllTests().catch(error => {
    console.error('💥 Test runner error:', error);
    process.exit(1);
});