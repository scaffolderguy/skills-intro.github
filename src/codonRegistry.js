/**
 * Codon Registry System
 * Manages validation and storage of consciousness architecture codons
 */

class CodonRegistry {
  constructor() {
    this.codons = new Map();
    this.statistics = {
      totalRegistered: 0,
      validationAttempts: 0,
      validationSuccesses: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * Validates a codon format using the correct regex pattern
   * @param {string} codon - The codon to validate (format: XX-NN where X=letter, N=digit)
   * @returns {boolean} - True if codon is valid format
   */
  isValidCodon(codon) {
    this.statistics.validationAttempts++;
    
    if (typeof codon !== 'string') {
      return false;
    }

    // FIXED: Corrected regex from /^[A-Z]{2}-d{2}$/ to /^[A-Z]{2}-\d{2}$/
    // The original pattern matched literal 'd' instead of digits
    const isValid = /^[A-Z]{2}-\d{2}$/.test(codon);
    
    if (isValid) {
      this.statistics.validationSuccesses++;
    }
    
    return isValid;
  }

  /**
   * Adds a codon to the registry with enhanced validation
   * @param {string} codon - The codon identifier
   * @param {Object} metadata - Associated metadata for the codon
   * @returns {Object} - Result with success status and detailed feedback
   */
  addCodon(codon, metadata = {}) {
    const result = {
      success: false,
      codon: codon,
      message: '',
      details: {}
    };

    // Validate codon format
    if (!this.isValidCodon(codon)) {
      result.message = `Invalid codon format. Expected format: [A-Z]{2}-[0-9]{2} (e.g., AB-12)`;
      result.details.provided = codon;
      result.details.expectedPattern = '^[A-Z]{2}-\\d{2}$';
      return result;
    }

    // Check if codon already exists
    if (this.codons.has(codon)) {
      result.message = `Codon ${codon} already exists in registry`;
      result.details.existing = this.codons.get(codon);
      return result;
    }

    // Add codon to registry
    const codonData = {
      ...metadata,
      registeredAt: new Date(),
      id: codon
    };

    this.codons.set(codon, codonData);
    this.statistics.totalRegistered++;
    this.statistics.lastUpdated = new Date();

    result.success = true;
    result.message = `Successfully registered codon ${codon}`;
    result.details.data = codonData;

    return result;
  }

  /**
   * Retrieves a codon from the registry
   * @param {string} codon - The codon identifier to retrieve
   * @returns {Object|null} - The codon data or null if not found
   */
  getCodon(codon) {
    return this.codons.get(codon) || null;
  }

  /**
   * Pattern-based codon lookup with enhanced search capabilities
   * @param {string} pattern - Search pattern (supports wildcards and partial matches)
   * @returns {Array} - Array of matching codons
   */
  findCodonsByPattern(pattern) {
    const results = [];
    
    // Convert pattern to regex, supporting wildcards
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    
    for (const [codonId, codonData] of this.codons) {
      if (regex.test(codonId)) {
        results.push({
          id: codonId,
          ...codonData
        });
      }
    }
    
    return results;
  }

  /**
   * Validates multiple codons and provides detailed feedback
   * @param {Array<string>} codons - Array of codons to validate
   * @returns {Object} - Validation results with detailed feedback
   */
  validateBatch(codons) {
    const results = {
      total: codons.length,
      valid: [],
      invalid: [],
      summary: {}
    };

    codons.forEach(codon => {
      if (this.isValidCodon(codon)) {
        results.valid.push(codon);
      } else {
        results.invalid.push({
          codon: codon,
          reason: 'Invalid format - expected [A-Z]{2}-[0-9]{2}'
        });
      }
    });

    results.summary = {
      validCount: results.valid.length,
      invalidCount: results.invalid.length,
      successRate: (results.valid.length / results.total * 100).toFixed(2) + '%'
    };

    return results;
  }

  /**
   * Gets registry statistics and operational metrics
   * @returns {Object} - Current registry statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      validationSuccessRate: this.statistics.validationAttempts > 0 
        ? (this.statistics.validationSuccesses / this.statistics.validationAttempts * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  /**
   * Lists all registered codons with optional filtering
   * @param {Object} options - Filtering and sorting options
   * @returns {Array} - Array of codon entries
   */
  listCodons(options = {}) {
    let entries = Array.from(this.codons.entries()).map(([id, data]) => ({
      id,
      ...data
    }));

    // Apply filtering if provided
    if (options.filter) {
      entries = entries.filter(entry => 
        Object.keys(options.filter).every(key => 
          entry[key] === options.filter[key]
        )
      );
    }

    // Apply sorting if provided
    if (options.sortBy) {
      entries.sort((a, b) => {
        const aVal = a[options.sortBy];
        const bVal = b[options.sortBy];
        return options.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    return entries;
  }

  /**
   * Clears all codons from the registry (for testing purposes)
   */
  clear() {
    this.codons.clear();
    this.statistics = {
      totalRegistered: 0,
      validationAttempts: 0,
      validationSuccesses: 0,
      lastUpdated: new Date()
    };
  }
}

module.exports = CodonRegistry;