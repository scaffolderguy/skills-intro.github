/**
 * Test Suite for CodonRegistry
 * Validates the critical bug fix and enhanced functionality
 */

const CodonRegistry = require('../src/codonRegistry');

// Simple test runner
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  assertDeepEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
  }

  run() {
    console.log('🧪 Running CodonRegistry Tests\n');
    
    this.tests.forEach(({ name, testFn }) => {
      this.results.total++;
      try {
        testFn();
        console.log(`✅ ${name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.results.failed++;
      }
    });

    console.log(`\n📊 Test Results: ${this.results.passed}/${this.results.total} passed`);
    
    if (this.results.failed > 0) {
      console.log(`❌ ${this.results.failed} tests failed`);
      process.exit(1);
    } else {
      console.log('🎉 All tests passed!');
    }
  }
}

const runner = new TestRunner();

// Test the critical bug fix - isValidCodon function with correct regex
runner.test('isValidCodon - validates correct format with digits', () => {
  const registry = new CodonRegistry();
  
  // These should all be valid (the bug fix enables these to work)
  runner.assert(registry.isValidCodon('AB-12'), 'AB-12 should be valid');
  runner.assert(registry.isValidCodon('XY-99'), 'XY-99 should be valid');
  runner.assert(registry.isValidCodon('AA-00'), 'AA-00 should be valid');
  runner.assert(registry.isValidCodon('ZZ-55'), 'ZZ-55 should be valid');
});

runner.test('isValidCodon - rejects invalid formats', () => {
  const registry = new CodonRegistry();
  
  // These should all be invalid
  runner.assert(!registry.isValidCodon('AB-d2'), 'AB-d2 should be invalid (literal d)');
  runner.assert(!registry.isValidCodon('AB-dd'), 'AB-dd should be invalid (literal dd)'); 
  runner.assert(!registry.isValidCodon('ab-12'), 'ab-12 should be invalid (lowercase)');
  runner.assert(!registry.isValidCodon('A-12'), 'A-12 should be invalid (too few letters)');
  runner.assert(!registry.isValidCodon('ABC-12'), 'ABC-12 should be invalid (too many letters)');
  runner.assert(!registry.isValidCodon('AB-1'), 'AB-1 should be invalid (too few digits)');
  runner.assert(!registry.isValidCodon('AB-123'), 'AB-123 should be invalid (too many digits)');
  runner.assert(!registry.isValidCodon('AB12'), 'AB12 should be invalid (missing dash)');
  runner.assert(!registry.isValidCodon(''), 'Empty string should be invalid');
  runner.assert(!registry.isValidCodon(null), 'null should be invalid');
  runner.assert(!registry.isValidCodon(undefined), 'undefined should be invalid');
});

runner.test('addCodon - successfully adds valid codons', () => {
  const registry = new CodonRegistry();
  
  const result = registry.addCodon('AB-12', { type: 'test', description: 'Test codon' });
  
  runner.assert(result.success, 'Should successfully add valid codon');
  runner.assertEqual(result.codon, 'AB-12', 'Result should include codon ID');
  runner.assert(result.message.includes('Successfully registered'), 'Should have success message');
  runner.assert(result.details.data, 'Should include codon data in result');
});

runner.test('addCodon - rejects invalid codon formats', () => {
  const registry = new CodonRegistry();
  
  const result = registry.addCodon('AB-d2', { type: 'test' });
  
  runner.assert(!result.success, 'Should reject invalid codon format');
  runner.assert(result.message.includes('Invalid codon format'), 'Should have error message');
  runner.assertEqual(result.details.expectedPattern, '^[A-Z]{2}-\\d{2}$', 'Should provide expected pattern');
});

runner.test('addCodon - prevents duplicate registration', () => {
  const registry = new CodonRegistry();
  
  registry.addCodon('AB-12', { type: 'first' });
  const result = registry.addCodon('AB-12', { type: 'duplicate' });
  
  runner.assert(!result.success, 'Should reject duplicate codon');
  runner.assert(result.message.includes('already exists'), 'Should have duplicate error message');
});

runner.test('getCodon - retrieves registered codons', () => {
  const registry = new CodonRegistry();
  const metadata = { type: 'test', value: 42 };
  
  registry.addCodon('XY-99', metadata);
  const retrieved = registry.getCodon('XY-99');
  
  runner.assert(retrieved, 'Should retrieve registered codon');
  runner.assertEqual(retrieved.type, 'test', 'Should preserve metadata');
  runner.assertEqual(retrieved.value, 42, 'Should preserve all metadata');
  runner.assertEqual(retrieved.id, 'XY-99', 'Should include codon ID');
});

runner.test('getCodon - returns null for unregistered codons', () => {
  const registry = new CodonRegistry();
  
  const result = registry.getCodon('ZZ-99');
  
  runner.assertEqual(result, null, 'Should return null for unregistered codon');
});

runner.test('findCodonsByPattern - supports pattern matching', () => {
  const registry = new CodonRegistry();
  
  registry.addCodon('AB-12', { type: 'test1' });
  registry.addCodon('AB-34', { type: 'test2' });
  registry.addCodon('CD-56', { type: 'test3' });
  
  const abResults = registry.findCodonsByPattern('AB-*');
  const allResults = registry.findCodonsByPattern('*');
  const specificResults = registry.findCodonsByPattern('CD-56');
  
  runner.assertEqual(abResults.length, 2, 'Should find 2 AB-* matches');
  runner.assertEqual(allResults.length, 3, 'Should find all 3 with * pattern');
  runner.assertEqual(specificResults.length, 1, 'Should find exact match');
  runner.assertEqual(specificResults[0].id, 'CD-56', 'Should match correct codon');
});

runner.test('validateBatch - validates multiple codons', () => {
  const registry = new CodonRegistry();
  
  const testCodons = ['AB-12', 'CD-34', 'invalid', 'EF-56', 'AB-d2'];
  const results = registry.validateBatch(testCodons);
  
  runner.assertEqual(results.total, 5, 'Should process all 5 codons');
  runner.assertEqual(results.valid.length, 3, 'Should identify 3 valid codons');
  runner.assertEqual(results.invalid.length, 2, 'Should identify 2 invalid codons');
  runner.assert(results.valid.includes('AB-12'), 'Should include valid codon AB-12');
  runner.assert(results.valid.includes('CD-34'), 'Should include valid codon CD-34');
  runner.assert(results.valid.includes('EF-56'), 'Should include valid codon EF-56');
  runner.assertEqual(results.summary.successRate, '60.00%', 'Should calculate correct success rate');
});

runner.test('getStatistics - tracks validation metrics', () => {
  const registry = new CodonRegistry();
  
  // Perform some validations
  registry.isValidCodon('AB-12'); // valid
  registry.isValidCodon('CD-34'); // valid  
  registry.isValidCodon('invalid'); // invalid
  registry.addCodon('EF-56'); // triggers validation (valid)
  
  const stats = registry.getStatistics();
  
  runner.assertEqual(stats.validationAttempts, 4, 'Should track validation attempts');
  runner.assertEqual(stats.validationSuccesses, 3, 'Should track validation successes');
  runner.assertEqual(stats.validationSuccessRate, '75.00%', 'Should calculate success rate');
  runner.assertEqual(stats.totalRegistered, 1, 'Should track registered codons');
});

runner.test('listCodons - lists all registered codons', () => {
  const registry = new CodonRegistry();
  
  registry.addCodon('AB-12', { priority: 1, type: 'high' });
  registry.addCodon('CD-34', { priority: 2, type: 'medium' });
  registry.addCodon('EF-56', { priority: 1, type: 'high' });
  
  const allCodons = registry.listCodons();
  const filteredCodons = registry.listCodons({ 
    filter: { type: 'high' } 
  });
  
  runner.assertEqual(allCodons.length, 3, 'Should list all 3 codons');
  runner.assertEqual(filteredCodons.length, 2, 'Should filter to 2 high priority codons');
  runner.assert(filteredCodons.every(c => c.type === 'high'), 'All filtered results should be high type');
});

runner.test('clear - resets registry state', () => {
  const registry = new CodonRegistry();
  
  registry.addCodon('AB-12');
  registry.isValidCodon('test');
  
  registry.clear();
  
  const stats = registry.getStatistics();
  const codons = registry.listCodons();
  
  runner.assertEqual(stats.totalRegistered, 0, 'Should reset registered count');
  runner.assertEqual(stats.validationAttempts, 0, 'Should reset validation attempts');
  runner.assertEqual(codons.length, 0, 'Should clear all codons');
});

// Critical test: Verify the specific bug is fixed
runner.test('CRITICAL - Regex bug fix verification', () => {
  const registry = new CodonRegistry();
  
  // The original bug: /^[A-Z]{2}-d{2}$/ would match literal 'd'
  // This should fail with old regex but pass with fixed regex
  runner.assert(registry.isValidCodon('AB-12'), 'AB-12 should be valid with fixed regex');
  runner.assert(registry.isValidCodon('XY-99'), 'XY-99 should be valid with fixed regex');
  
  // This would have incorrectly passed with the buggy regex
  runner.assert(!registry.isValidCodon('AB-d2'), 'AB-d2 should be invalid (literal d)');
  runner.assert(!registry.isValidCodon('XY-dd'), 'XY-dd should be invalid (literal dd)');
  
  console.log('  🔧 Confirmed: Regex pattern /^[A-Z]{2}-\\d{2}$/ correctly validates digits, not literal "d"');
});

// Run all tests
runner.run();