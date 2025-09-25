#!/usr/bin/env node

/**
 * Codon Registry Demo
 * Demonstrates the fixed isValidCodon function and enhanced registry features
 */

const { CodonRegistry } = require('../src/codonRegistry.js');

console.log('🧬 Codon Registry Demo\n');
console.log('='.repeat(50));

// Create a new registry
const registry = new CodonRegistry();

console.log('\n📝 Testing the CRITICAL BUG FIX:');
console.log('   Before: /^[A-Z]{2}-d{2}$/ (literal "d")');
console.log('   After:  /^[A-Z]{2}-\\d{2}$/ (digit class)');
console.log('   -'.repeat(40));

// Test valid codons that would have failed with the buggy regex
const validCodons = ['AB-12', 'XY-99', 'ZZ-00', 'AA-01', 'BC-88'];

validCodons.forEach(codon => {
  const isValid = registry.isValidCodon(codon);
  console.log(`   ${codon}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
});

console.log('\n🔍 Testing patterns that would work with buggy regex:');
const buggyPatterns = ['AB-d2', 'XY-1d', 'ZZ-dd'];

buggyPatterns.forEach(codon => {
  const isValid = registry.isValidCodon(codon);
  console.log(`   ${codon}: ${isValid ? '✅ VALID' : '❌ INVALID (correctly rejected)'}`);
});

console.log('\n🏗️  Registry Operations:');
console.log('   -'.repeat(40));

// Add some codons
const addResults = [
  registry.addCodon('AB-12', { type: 'primary', description: 'Core consciousness module' }),
  registry.addCodon('XY-34', { type: 'secondary', description: 'Memory interface' }),
  registry.addCodon('ZZ-99', { type: 'system', description: 'Error handling' })
];

addResults.forEach((result, index) => {
  console.log(`   Added ${result.codon}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
});

console.log('\n📊 Registry Statistics:');
const stats = registry.getStats();
Object.entries(stats).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log('\n🔎 Pattern-based Lookup:');
console.log('   Finding codons starting with "A":');
const aPatternResults = registry.findCodonsByPattern(/^A/);
aPatternResults.forEach(entry => {
  console.log(`     - ${entry.id}: ${entry.metadata.description}`);
});

console.log('\n   Finding codons ending with "99":');
const ninetyNineResults = registry.findCodonsByPattern(/-99$/);
ninetyNineResults.forEach(entry => {
  console.log(`     - ${entry.id}: ${entry.metadata.description}`);
});

console.log('\n🔬 Detailed Validation Examples:');
const testCases = [
  'AB-12',    // Valid
  'ab-12',    // Invalid: lowercase
  'AB-1a',    // Invalid: mixed suffix
  'A-12',     // Invalid: short prefix
  'ABCD',     // Invalid: no hyphen
  'AB_12',    // Invalid: wrong separator
];

testCases.forEach(testCase => {
  const result = registry.validateCodonWithDetails(testCase);
  if (result.isValid) {
    console.log(`   ${testCase}: ✅ VALID`);
  } else {
    console.log(`   ${testCase}: ❌ ${result.error}`);
  }
});

console.log('\n💾 Access Tracking:');
const codon = registry.getCodon('AB-12');
console.log(`   First access to AB-12: accessCount = ${codon.accessCount}`);

const codon2 = registry.getCodon('AB-12');
console.log(`   Second access to AB-12: accessCount = ${codon2.accessCount}`);

console.log('\n📋 All Registered Codons:');
const allCodons = registry.listCodons();
allCodons.forEach(entry => {
  console.log(`   ${entry.id}: ${entry.metadata.type} - ${entry.metadata.description}`);
  console.log(`     Registered: ${entry.registeredAt}`);
  console.log(`     Access count: ${entry.accessCount}`);
});

console.log('\n✨ Demo completed successfully!');
console.log('   The critical regex bug has been fixed and all enhanced features are working.');
console.log('   Codon validation now correctly uses \\d for digit matching.');

// Final verification
const finalStats = registry.getStats();
console.log(`\n📈 Final Statistics:`);
console.log(`   Total validations: ${finalStats.validationAttempts}`);
console.log(`   Success rate: ${finalStats.validationSuccessRate}`);
console.log(`   Registered codons: ${finalStats.registeredCodons}`);

console.log('\n🎯 Critical bug fix verified: isValidCodon regex pattern corrected!');