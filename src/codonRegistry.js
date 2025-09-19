/**
 * Codon Registry Module
 * Provides robust codon management with validation, lookup, and statistics
 * 
 * Supports consciousness architecture requirements with enhanced validation
 * and detailed feedback mechanisms.
 */

class CodonRegistry {
  constructor() {
    this.codons = new Map();
    this.stats = {
      totalRegistered: 0,
      validationAttempts: 0,
      successfulValidations: 0,
      failedValidations: 0
    };
  }

  /**
   * Validates codon format using the correct regex pattern
   * Fixed: Changed from /^[A-Z]{2}-d{2}$/ to /^[A-Z]{2}-\d{2}$/
   * @param {string} codon - The codon string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  isValidCodon(codon) {
    this.stats.validationAttempts++;
    
    if (typeof codon !== 'string') {
      this.stats.failedValidations++;
      return false;
    }
    
    // CRITICAL FIX: Using \d instead of literal 'd' for digit matching
    const pattern = /^[A-Z]{2}-\d{2}$/;
    const isValid = pattern.test(codon);
    
    if (isValid) {
      this.stats.successfulValidations++;
    } else {
      this.stats.failedValidations++;
    }
    
    return isValid;
  }

  /**
   * Adds a codon to the registry with metadata
   * @param {string} codon - The codon identifier
   * @param {Object} metadata - Additional codon information
   * @returns {Object} - Operation result with success status and details
   */
  addCodon(codon, metadata = {}) {
    const validationResult = this.validateCodonWithDetails(codon);
    
    if (!validationResult.isValid) {
      return {
        success: false,
        error: validationResult.error,
        codon: codon
      };
    }

    if (this.codons.has(codon)) {
      return {
        success: false,
        error: 'Codon already exists in registry',
        codon: codon,
        existing: this.codons.get(codon)
      };
    }

    const codonEntry = {
      id: codon,
      metadata: metadata,
      registeredAt: new Date().toISOString(),
      accessCount: 0
    };

    this.codons.set(codon, codonEntry);
    this.stats.totalRegistered++;

    return {
      success: true,
      codon: codon,
      entry: codonEntry
    };
  }

  /**
   * Retrieves a codon from the registry
   * @param {string} codon - The codon identifier
   * @returns {Object|null} - Codon entry or null if not found
   */
  getCodon(codon) {
    if (!this.isValidCodon(codon)) {
      return null;
    }

    const entry = this.codons.get(codon);
    if (entry) {
      entry.accessCount++;
      entry.lastAccessedAt = new Date().toISOString();
    }
    
    return entry || null;
  }

  /**
   * Pattern-based codon lookup
   * @param {string} pattern - Regex pattern or string pattern
   * @returns {Array} - Array of matching codon entries
   */
  findCodonsByPattern(pattern) {
    const results = [];
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);

    for (const [codonId, entry] of this.codons) {
      if (regex.test(codonId)) {
        results.push(entry);
      }
    }

    return results;
  }

  /**
   * Enhanced validation with detailed feedback
   * @param {string} codon - The codon to validate
   * @returns {Object} - Detailed validation result
   */
  validateCodonWithDetails(codon) {
    if (typeof codon !== 'string') {
      return {
        isValid: false,
        error: 'Codon must be a string',
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    if (codon.length !== 5) {
      return {
        isValid: false,
        error: `Invalid length: expected 5 characters, got ${codon.length}`,
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    if (!codon.includes('-')) {
      return {
        isValid: false,
        error: 'Missing hyphen separator',
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    const parts = codon.split('-');
    if (parts.length !== 2) {
      return {
        isValid: false,
        error: 'Multiple hyphens found or invalid format',
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    const [prefix, suffix] = parts;
    
    if (prefix.length !== 2) {
      return {
        isValid: false,
        error: `Invalid prefix length: expected 2 characters, got ${prefix.length}`,
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    if (!/^[A-Z]{2}$/.test(prefix)) {
      return {
        isValid: false,
        error: 'Prefix must contain only uppercase letters',
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    if (suffix.length !== 2) {
      return {
        isValid: false,
        error: `Invalid suffix length: expected 2 digits, got ${suffix.length}`,
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    if (!/^\d{2}$/.test(suffix)) {
      return {
        isValid: false,
        error: 'Suffix must contain only digits',
        expectedFormat: 'XX-NN (two uppercase letters, hyphen, two digits)'
      };
    }

    return {
      isValid: true,
      codon: codon,
      prefix: prefix,
      suffix: suffix
    };
  }

  /**
   * Get registry statistics
   * @returns {Object} - Current registry statistics
   */
  getStats() {
    return {
      ...this.stats,
      registeredCodons: this.codons.size,
      validationSuccessRate: this.stats.validationAttempts > 0 
        ? (this.stats.successfulValidations / this.stats.validationAttempts * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * List all registered codons
   * @returns {Array} - Array of all codon entries
   */
  listCodons() {
    return Array.from(this.codons.values());
  }

  /**
   * Remove a codon from the registry
   * @param {string} codon - The codon identifier to remove
   * @returns {boolean} - True if removed, false if not found
   */
  removeCodon(codon) {
    if (this.codons.has(codon)) {
      this.codons.delete(codon);
      this.stats.totalRegistered--;
      return true;
    }
    return false;
  }

  /**
   * Clear all codons from the registry
   */
  clearRegistry() {
    this.codons.clear();
    this.stats.totalRegistered = 0;
  }
}

// Export for both CommonJS and ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CodonRegistry };
} else if (typeof window !== 'undefined') {
  window.CodonRegistry = CodonRegistry;
}

// For direct usage
const createCodonRegistry = () => new CodonRegistry();

if (typeof module !== 'undefined' && module.exports) {
  module.exports.createCodonRegistry = createCodonRegistry;
} else if (typeof window !== 'undefined') {
  window.createCodonRegistry = createCodonRegistry;
}