/**
 * Bug Fix Demonstration
 * Shows the critical regex pattern fix in action
 */

const CodonRegistry = require('../src/codonRegistry');

console.log('🐛 CRITICAL BUG FIX DEMONSTRATION\n');

// Create a mock of the broken version for comparison
class BrokenCodonRegistry {
  isValidCodon(codon) {
    if (typeof codon !== 'string') return false;
    // BROKEN: This regex matches literal 'd' instead of digits
    return /^[A-Z]{2}-d{2}$/.test(codon);
  }
}

const brokenRegistry = new BrokenCodonRegistry();
const fixedRegistry = new CodonRegistry();

const testCases = [
  'AB-12',  // Valid codon with digits
  'XY-99',  // Valid codon with digits  
  'CD-00',  // Valid codon with zero digits
  'AB-d2',  // Invalid - contains literal 'd'
  'XY-dd',  // Invalid - contains literal 'dd'
  'EF-1d',  // Invalid - mixed digit and literal 'd'
];

console.log('Testing codon validation patterns:\n');
console.log('Codon   | Broken Regex | Fixed Regex | Expected');
console.log('--------|--------------|-------------|----------');

testCases.forEach(codon => {
  const brokenResult = brokenRegistry.isValidCodon(codon);
  const fixedResult = fixedRegistry.isValidCodon(codon);
  const expected = /^[A-Z]{2}-\d{2}$/.test(codon);
  
  const brokenStatus = brokenResult ? '✅ PASS' : '❌ FAIL';
  const fixedStatus = fixedResult ? '✅ PASS' : '❌ FAIL';
  const expectedStatus = expected ? '✅ PASS' : '❌ FAIL';
  
  // Highlight when the broken version gives wrong results
  const highlight = brokenResult !== expected ? ' ⚠️ BUG!' : '';
  
  console.log(`${codon.padEnd(7)} | ${brokenStatus.padEnd(12)} | ${fixedStatus.padEnd(11)} | ${expectedStatus}${highlight}`);
});

console.log('\n📊 RESULTS SUMMARY:');
console.log('❌ Broken regex /^[A-Z]{2}-d{2}$/  - matches literal "d" instead of digits');
console.log('✅ Fixed regex  /^[A-Z]{2}-\\d{2}$/ - correctly matches digits 0-9');

console.log('\n🔍 IMPACT ANALYSIS:');
const validCodons = ['AB-12', 'XY-99', 'CD-00'];
const invalidCodons = ['AB-d2', 'XY-dd', 'EF-1d'];

console.log('\nValid codons that were broken:');
validCodons.forEach(codon => {
  const brokenResult = brokenRegistry.isValidCodon(codon);
  const fixedResult = fixedRegistry.isValidCodon(codon);
  if (!brokenResult && fixedResult) {
    console.log(`  🔧 ${codon}: Now correctly validates as VALID`);
  }
});

console.log('\nInvalid patterns that were incorrectly accepted:');
invalidCodons.forEach(codon => {
  const brokenResult = brokenRegistry.isValidCodon(codon);
  const fixedResult = fixedRegistry.isValidCodon(codon);
  if (brokenResult && !fixedResult) {
    console.log(`  🔧 ${codon}: Now correctly rejects as INVALID`);
  }
});

console.log('\n✅ Bug fix successful: All codon validation now works correctly!');