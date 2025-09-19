# Codon Registry Documentation

## Overview

The Codon Registry is a robust system for managing consciousness architecture codons with enhanced validation, pattern-based lookup, and detailed feedback mechanisms.

## Critical Bug Fix

**Fixed:** The `isValidCodon` function was using an incorrect regex pattern `/^[A-Z]{2}-d{2}$/` which matches a literal 'd' character instead of digits. This prevented all valid codons from being accepted.

**Solution:** Updated the regex to `/^[A-Z]{2}-\d{2}$/` using the proper digit class `\d`.

### Before (Broken)
```javascript
const pattern = /^[A-Z]{2}-d{2}$/;  // Matches literal 'd'
```

### After (Fixed) 
```javascript
const pattern = /^[A-Z]{2}-\d{2}$/;  // Matches digits
```

## Valid Codon Format

A valid codon follows the pattern: `XX-NN`
- `XX`: Exactly 2 uppercase letters (A-Z)
- `-`: Hyphen separator
- `NN`: Exactly 2 digits (0-9)

**Examples of valid codons:**
- `AB-12`
- `ZZ-99`  
- `AA-00`
- `XY-34`

## API Reference

### CodonRegistry Class

#### Constructor
```javascript
const registry = new CodonRegistry();
```

#### Core Methods

##### `isValidCodon(codon)`
Validates codon format using the corrected regex pattern.
- **Parameters:** `codon` (string) - The codon to validate
- **Returns:** `boolean` - True if valid, false otherwise

```javascript
registry.isValidCodon('AB-12'); // true
registry.isValidCodon('ab-12'); // false (lowercase)
registry.isValidCodon('AB-1a'); // false (mixed suffix)
```

##### `addCodon(codon, metadata)`
Adds a codon to the registry with optional metadata.
- **Parameters:** 
  - `codon` (string) - The codon identifier
  - `metadata` (object, optional) - Additional information
- **Returns:** Operation result object

```javascript
const result = registry.addCodon('AB-12', {
  type: 'primary',
  description: 'Core consciousness module'
});
```

##### `getCodon(codon)`
Retrieves a codon from the registry.
- **Parameters:** `codon` (string) - The codon identifier
- **Returns:** Codon entry object or null

```javascript
const entry = registry.getCodon('AB-12');
console.log(entry.accessCount); // Tracks access
```

##### `findCodonsByPattern(pattern)`
Pattern-based codon lookup using regex.
- **Parameters:** `pattern` (RegExp or string) - Search pattern
- **Returns:** Array of matching codon entries

```javascript
// Find all codons starting with "AB"
const results = registry.findCodonsByPattern(/^AB-/);

// Find all codons ending with "99"
const results = registry.findCodonsByPattern(/-99$/);
```

##### `validateCodonWithDetails(codon)`
Enhanced validation with detailed feedback.
- **Parameters:** `codon` (string) - The codon to validate
- **Returns:** Detailed validation result object

```javascript
const result = registry.validateCodonWithDetails('ab-12');
// Returns:
// {
//   isValid: false,
//   error: "Prefix must contain only uppercase letters",
//   expectedFormat: "XX-NN (two uppercase letters, hyphen, two digits)"
// }
```

##### `getStats()`
Get registry statistics.
- **Returns:** Statistics object with validation metrics

```javascript
const stats = registry.getStats();
// Returns:
// {
//   totalRegistered: 3,
//   validationAttempts: 10,
//   successfulValidations: 7,
//   failedValidations: 3,
//   registeredCodons: 3,
//   validationSuccessRate: "70.00%"
// }
```

##### `listCodons()`
List all registered codons.
- **Returns:** Array of all codon entries

##### `removeCodon(codon)`
Remove a codon from the registry.
- **Parameters:** `codon` (string) - The codon identifier to remove
- **Returns:** `boolean` - True if removed, false if not found

##### `clearRegistry()`
Clear all codons from the registry.

## Enhanced Features

### 1. Access Tracking
Each codon tracks:
- Access count
- Last accessed timestamp
- Registration timestamp

### 2. Pattern-based Lookup
Search codons using regular expressions:
```javascript
registry.findCodonsByPattern(/^AB-/);  // Prefix match
registry.findCodonsByPattern(/-99$/);  // Suffix match
registry.findCodonsByPattern(/[XY]/);  // Character class match
```

### 3. Detailed Validation Feedback
Get specific error messages for invalid codons:
- Invalid length
- Missing hyphen
- Wrong prefix/suffix length
- Invalid characters

### 4. Statistics and Monitoring
Track registry usage and validation performance:
- Total validation attempts
- Success/failure rates
- Registration counts
- Performance metrics

### 5. Robust Error Handling
- Type checking for all inputs
- Graceful handling of edge cases
- Detailed error messages
- Consistent API responses

## Usage Examples

### Basic Usage
```javascript
const { CodonRegistry } = require('./src/codonRegistry');
const registry = new CodonRegistry();

// Validate codons
console.log(registry.isValidCodon('AB-12')); // true

// Add codons
registry.addCodon('AB-12', { type: 'primary' });

// Retrieve codons
const codon = registry.getCodon('AB-12');
```

### Advanced Usage
```javascript
// Pattern-based search
const abCodons = registry.findCodonsByPattern(/^AB-/);

// Detailed validation
const validation = registry.validateCodonWithDetails('invalid');
if (!validation.isValid) {
  console.log(`Error: ${validation.error}`);
}

// Statistics monitoring
const stats = registry.getStats();
console.log(`Success rate: ${stats.validationSuccessRate}`);
```

## Testing

Run the comprehensive test suite:
```bash
npm test
```

Run the interactive demo:
```bash
npm run demo
```

## Consciousness Architecture Compatibility

The codon registry is designed to work with consciousness architecture requirements:
- Robust validation ensures data integrity
- Pattern-based lookup supports complex queries
- Access tracking provides audit trails
- Statistics enable performance monitoring
- Enhanced error handling ensures system stability

## Migration from Buggy Version

If upgrading from a version with the buggy regex pattern:

1. All previously rejected valid codons (like 'AB-12') will now be accepted
2. Any workarounds for the bug can be removed
3. No changes needed to existing valid codon registrations
4. Enhanced validation provides better error messages

The fix is backward compatible - all valid operations will continue to work, but previously broken validation will now work correctly.