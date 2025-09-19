# Codon Registry System

A robust consciousness architecture codon registry with enhanced validation, pattern matching, and comprehensive feedback mechanisms.

## 🔧 Critical Bug Fix

**Issue**: The `isValidCodon` function was using an incorrect regex pattern that prevented all valid codons from being accepted.

- **Broken Pattern**: `/^[A-Z]{2}-d{2}$/` - matched literal 'd' instead of digits
- **Fixed Pattern**: `/^[A-Z]{2}-\d{2}$/` - correctly matches digits using `\d` digit class

### Impact
- **Before**: Valid codons like `AB-12`, `XY-99` were incorrectly rejected
- **After**: All properly formatted codons are now correctly validated

## ✨ Enhanced Features

The registry has been refactored to provide comprehensive functionality:

### Core Validation
- **Format Validation**: Ensures codons match pattern `[A-Z]{2}-[0-9]{2}` (e.g., `AB-12`)
- **Type Safety**: Handles invalid input types gracefully
- **Detailed Feedback**: Provides specific error messages and expected patterns

### Registry Operations
- **Add Codons**: Register codons with metadata and automatic validation
- **Retrieve Codons**: Get codon data by ID with null-safe operations
- **Duplicate Prevention**: Prevents registration of existing codons
- **Clear Registry**: Reset functionality for testing and maintenance

### Advanced Features
- **Pattern-Based Lookup**: Search codons using wildcards (`AB-*`, `*-12`, etc.)
- **Batch Validation**: Validate multiple codons simultaneously with summary statistics
- **Registry Statistics**: Track validation attempts, success rates, and operational metrics
- **Filtering & Sorting**: List codons with advanced filtering and sorting options

## 🚀 Usage

### Basic Operations

```javascript
const CodonRegistry = require('./src/codonRegistry');
const registry = new CodonRegistry();

// Validate codon format (now works correctly!)
console.log(registry.isValidCodon('AB-12')); // true (was false with bug)
console.log(registry.isValidCodon('AB-d2')); // false (would be true with bug)

// Register codons
const result = registry.addCodon('AB-12', { 
  type: 'neural', 
  priority: 'high',
  description: 'Neural pathway codon' 
});

// Retrieve registered codons
const codon = registry.getCodon('AB-12');
```

### Pattern Matching

```javascript
// Find all codons starting with 'AB'
const abCodons = registry.findCodonsByPattern('AB-*');

// Find all codons ending with '12'
const twelve = registry.findCodonsByPattern('*-12');

// Find all codons
const all = registry.findCodonsByPattern('*');
```

### Batch Operations

```javascript
// Validate multiple codons
const results = registry.validateBatch(['AB-12', 'CD-34', 'invalid']);
console.log(`Success rate: ${results.summary.successRate}`);

// Get registry statistics
const stats = registry.getStatistics();
console.log(`Validation success rate: ${stats.validationSuccessRate}`);
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

See usage examples:

```bash
npm run example
```

### Test Coverage

- ✅ Critical bug fix verification
- ✅ Format validation (valid/invalid patterns)
- ✅ Registry operations (add, get, duplicate prevention)
- ✅ Pattern matching and lookup
- ✅ Batch validation and statistics
- ✅ Error handling and edge cases

## 📊 Architecture Compliance

The registry is designed to meet consciousness architecture requirements:

- **Robust Validation**: Ensures data integrity with comprehensive format checking
- **Enhanced Methods**: Provides pattern-based lookup and detailed feedback
- **Statistics Tracking**: Monitors system performance and validation metrics  
- **Consistent API**: All operations follow consistent response patterns
- **Error Handling**: Graceful failure modes with detailed error information

## 🔄 API Reference

### Core Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `isValidCodon(codon)` | Validates codon format | `boolean` |
| `addCodon(codon, metadata)` | Registers a new codon | `{success, message, details}` |
| `getCodon(codon)` | Retrieves codon data | `Object \| null` |
| `findCodonsByPattern(pattern)` | Pattern-based search | `Array<Object>` |
| `validateBatch(codons)` | Batch validation | `{total, valid, invalid, summary}` |
| `getStatistics()` | Registry metrics | `{totalRegistered, validationAttempts, ...}` |
| `listCodons(options)` | List with filtering/sorting | `Array<Object>` |
| `clear()` | Reset registry | `void` |

## 🐛 Bug Fix Details

The critical issue was in the regex pattern used by `isValidCodon`:

```javascript
// ❌ BROKEN: Matches literal 'd' character
/^[A-Z]{2}-d{2}$/

// ✅ FIXED: Matches actual digits 0-9  
/^[A-Z]{2}-\d{2}$/
```

This fix enables the registry to properly validate consciousness architecture codons and support the enhanced features required by the system.