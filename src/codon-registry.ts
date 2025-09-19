/**
 * Codon Registry - Manages codon validation and operations
 */

/**
 * Validates if a codon follows the correct format
 * @param codon - The codon string to validate
 * @returns boolean indicating if the codon is valid
 */
export function isValidCodon(codon: string): boolean {
  return /^[A-Z]{2}-d{2}$/.test(codon);
}

/**
 * Registry for storing and managing codons
 */
export class CodonRegistry {
  private codons: Set<string> = new Set();

  /**
   * Add a codon to the registry
   * @param codon - The codon to add
   * @returns boolean indicating if the codon was successfully added
   */
  addCodon(codon: string): boolean {
    if (isValidCodon(codon)) {
      this.codons.add(codon);
      return true;
    }
    return false;
  }

  /**
   * Check if a codon exists in the registry
   * @param codon - The codon to check
   * @returns boolean indicating if the codon exists
   */
  hasCodon(codon: string): boolean {
    return this.codons.has(codon);
  }

  /**
   * Get all codons in the registry
   * @returns Array of all registered codons
   */
  getAllCodons(): string[] {
    return Array.from(this.codons);
  }

  /**
   * Remove a codon from the registry
   * @param codon - The codon to remove
   * @returns boolean indicating if the codon was successfully removed
   */
  removeCodon(codon: string): boolean {
    return this.codons.delete(codon);
  }

  /**
   * Clear all codons from the registry
   */
  clear(): void {
    this.codons.clear();
  }
}