/**
 * Comprehensive Tests for Codon Registry
 * Tests the critical bug fix and enhanced functionality
 */

// Simple test framework for Node.js environment
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertArrayEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Assertion failed: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

// Import the CodonRegistry
const { CodonRegistry } = require('../src/codonRegistry.js');

function runTests() {
  console.log('🧪 Starting Codon Registry Tests...\n');
  
  let testsPassed = 0;
  let testsFailed = 0;

  function runTest(testName, testFunction) {
    try {
      testFunction();
      console.log(`✅ ${testName}`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ ${testName}: ${error.message}`);
      testsFailed++;
    }
  }

  // Test 1: Critical Bug Fix - isValidCodon with correct regex
  runTest('Critical Bug Fix: isValidCodon should accept valid codons with \\d pattern', () => {
    const registry = new CodonRegistry();
    
    // These should all be valid with the corrected regex
    const validCodons = ['AB-12', 'XY-99', 'ZZ-00', 'AA-01', 'BC-88'];
    
    validCodons.forEach(codon => {
      assert(registry.isValidCodon(codon), `${codon} should be valid`);
    });
  });

  // Test 2: Verify the old buggy pattern would fail
  runTest('Verify old pattern would fail: literal "d" should not match digits', () => {
    const registry = new CodonRegistry();
    
    // Test that the pattern works correctly now
    assert(registry.isValidCodon('AB-12'), 'AB-12 should be valid');
    assert(registry.isValidCodon('XY-34'), 'XY-34 should be valid');
    
    // These would only work with the buggy pattern (literal 'd')
    assert(!registry.isValidCodon('AB-d2'), 'AB-d2 should be invalid');
    assert(!registry.isValidCodon('XY-1d'), 'XY-1d should be invalid');
  });

  // Test 3: Invalid codon patterns
  runTest('isValidCodon should reject invalid patterns', () => {
    const registry = new CodonRegistry();
    
    const invalidCodons = [
      'AB-1',      // Too short suffix
      'AB-123',    // Too long suffix
      'A-12',      // Too short prefix
      'ABC-12',    // Too long prefix
      'ab-12',     // Lowercase letters
      'AB_12',     // Wrong separator
      'AB12',      // Missing separator
      '12-AB',     // Numbers and letters swapped
      '',          // Empty string
      'AB-1a',     // Mixed digit/letter in suffix
      'A1-12',     // Mixed letter/digit in prefix
    ];
    
    invalidCodons.forEach(codon => {
      assert(!registry.isValidCodon(codon), `${codon} should be invalid`);
    });
  });

  // Test 4: Type validation
  runTest('isValidCodon should handle non-string inputs', () => {
    const registry = new CodonRegistry();
    
    assert(!registry.isValidCodon(null), 'null should be invalid');
    assert(!registry.isValidCodon(undefined), 'undefined should be invalid');
    assert(!registry.isValidCodon(123), 'number should be invalid');
    assert(!registry.isValidCodon({}), 'object should be invalid');
    assert(!registry.isValidCodon([]), 'array should be invalid');
  });

  // Test 5: Adding valid codons
  runTest('addCodon should accept valid codons', () => {
    const registry = new CodonRegistry();
    
    const result = registry.addCodon('AB-12', { type: 'test', priority: 1 });
    
    assert(result.success, 'Should successfully add valid codon');
    assertEquals(result.codon, 'AB-12', 'Should return correct codon');
    assert(result.entry, 'Should return entry data');
    assertEquals(result.entry.id, 'AB-12', 'Entry should have correct ID');
  });

  // Test 6: Rejecting invalid codons
  runTest('addCodon should reject invalid codons', () => {
    const registry = new CodonRegistry();
    
    const result = registry.addCodon('invalid');
    
    assert(!result.success, 'Should fail to add invalid codon');
    assert(result.error, 'Should provide error message');
    assertEquals(result.codon, 'invalid', 'Should return attempted codon');
  });

  // Test 7: Duplicate codon prevention
  runTest('addCodon should prevent duplicates', () => {
    const registry = new CodonRegistry();
    
    const first = registry.addCodon('AB-12');
    assert(first.success, 'First addition should succeed');
    
    const duplicate = registry.addCodon('AB-12');
    assert(!duplicate.success, 'Duplicate addition should fail');
    assert(duplicate.error.includes('already exists'), 'Should indicate duplicate error');
  });

  // Test 8: Codon retrieval
  runTest('getCodon should retrieve existing codons', () => {
    const registry = new CodonRegistry();
    
    registry.addCodon('AB-12', { type: 'test' });
    
    const retrieved = registry.getCodon('AB-12');
    assert(retrieved, 'Should retrieve existing codon');
    assertEquals(retrieved.id, 'AB-12', 'Should have correct ID');
    assertEquals(retrieved.metadata.type, 'test', 'Should preserve metadata');
    assertEquals(retrieved.accessCount, 1, 'Should track access count');
  });

  // Test 9: Pattern-based lookup
  runTest('findCodonsByPattern should find matching codons', () => {
    const registry = new CodonRegistry();
    
    registry.addCodon('AB-12');
    registry.addCodon('AB-34');
    registry.addCodon('CD-12');
    registry.addCodon('CD-56');
    
    const abCodons = registry.findCodonsByPattern(/^AB-/);
    assertEquals(abCodons.length, 2, 'Should find 2 AB- codons');
    
    const twelveEnding = registry.findCodonsByPattern(/-12$/);
    assertEquals(twelveEnding.length, 2, 'Should find 2 codons ending in -12');
  });

  // Test 10: Detailed validation feedback
  runTest('validateCodonWithDetails should provide detailed feedback', () => {
    const registry = new CodonRegistry();
    
    const result = registry.validateCodonWithDetails('ab-12');
    assert(!result.isValid, 'Should be invalid');
    assert(result.error.includes('uppercase'), 'Should mention uppercase requirement');
    assert(result.expectedFormat, 'Should provide expected format');
    
    const validResult = registry.validateCodonWithDetails('AB-12');
    assert(validResult.isValid, 'Should be valid');
    assertEquals(validResult.prefix, 'AB', 'Should parse prefix');
    assertEquals(validResult.suffix, '12', 'Should parse suffix');
  });

  // Test 11: Statistics tracking
  runTest('Registry should track statistics correctly', () => {
    const registry = new CodonRegistry();
    
    // Perform various operations
    registry.isValidCodon('AB-12'); // valid
    registry.isValidCodon('invalid'); // invalid
    registry.addCodon('AB-12');
    registry.addCodon('CD-34');
    
    const stats = registry.getStats();
    
    assert(stats.validationAttempts > 0, 'Should track validation attempts');
    assert(stats.successfulValidations > 0, 'Should track successful validations');
    assert(stats.failedValidations > 0, 'Should track failed validations');
    assertEquals(stats.registeredCodons, 2, 'Should track registered codons');
    assert(stats.validationSuccessRate, 'Should calculate success rate');
  });

  // Test 12: Registry operations
  runTest('Registry operations should work correctly', () => {
    const registry = new CodonRegistry();
    
    registry.addCodon('AB-12');
    registry.addCodon('CD-34');
    
    const allCodons = registry.listCodons();
    assertEquals(allCodons.length, 2, 'Should list all codons');
    
    const removed = registry.removeCodon('AB-12');
    assert(removed, 'Should successfully remove codon');
    
    const afterRemoval = registry.listCodons();
    assertEquals(afterRemoval.length, 1, 'Should have one codon after removal');
    
    registry.clearRegistry();
    const afterClear = registry.listCodons();
    assertEquals(afterClear.length, 0, 'Should be empty after clear');
  });

  // Test 13: Edge cases for detailed validation
  runTest('Detailed validation should handle edge cases', () => {
    const registry = new CodonRegistry();
    
    // Test various invalid formats
    // Test various invalid formats with specific error expectations
    // Note: suffix length check is included for defensive programming but isn't 
    // reachable with current 5-character constraint
    const testCases = [
      { input: '', errorContains: 'length' },
      { input: 'A', errorContains: 'length' },
      { input: 'ABCDE', errorContains: 'hyphen' },
      { input: 'A-123', errorContains: 'prefix length' }, // prefix='A' (1 char)
      { input: 'A1-12', errorContains: 'uppercase letters' },
      { input: 'AB-1a', errorContains: 'digits' }
    ];
    
    testCases.forEach(testCase => {
      const result = registry.validateCodonWithDetails(testCase.input);
      assert(!result.isValid, `${testCase.input} should be invalid`);
      assert(result.error.toLowerCase().includes(testCase.errorContains.toLowerCase()), 
        `Error for ${testCase.input} should contain "${testCase.errorContains}"`);
    });
  });

  // Test 14: Access tracking
  runTest('Registry should track codon access', () => {
    const registry = new CodonRegistry();
    
    registry.addCodon('AB-12');
    
    const first = registry.getCodon('AB-12');
    assertEquals(first.accessCount, 1, 'First access should set count to 1');
    assert(first.lastAccessedAt, 'Should set last access time');
    
    const second = registry.getCodon('AB-12');
    assertEquals(second.accessCount, 2, 'Second access should increment count');
  });

  // Test 15: Comprehensive regex fix verification
  runTest('Comprehensive verification of regex fix', () => {
    const registry = new CodonRegistry();
    
    // All digits 00-99 should work
    for (let i = 0; i < 100; i++) {
      const suffix = i.toString().padStart(2, '0');
      const codon = `AB-${suffix}`;
      assert(registry.isValidCodon(codon), `${codon} should be valid`);
    }
    
    // All letter combinations should work
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const samplePairs = ['AA', 'ZZ', 'AB', 'XY', 'MN'];
    
    samplePairs.forEach(pair => {
      const codon = `${pair}-12`;
      assert(registry.isValidCodon(codon), `${codon} should be valid`);
    });
  });

  console.log(`\n🏁 Test Results:`);
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📊 Total:  ${testsPassed + testsFailed}`);
  
  if (testsFailed === 0) {
    console.log(`\n🎉 All tests passed! The codon registry is working correctly.`);
    console.log(`✅ Critical bug fix verified: isValidCodon now uses \\d instead of literal 'd'`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the implementation.`);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };