/**
 * Codon Interpreter Core
 * 
 * Provides the main interpretation logic for converting codons into symbolic actions.
 */

import { SymbolicAction } from './types';
import { CodonRegistryImpl } from './codon-registry';

let globalRegistry: CodonRegistryImpl;

// Initialize with default registry
export function initializeInterpreter(customRegistry?: CodonRegistryImpl): void {
  globalRegistry = customRegistry || new CodonRegistryImpl();
}

// Ensure registry is initialized
function ensureInitialized(): void {
  if (!globalRegistry) {
    initializeInterpreter();
  }
}

/**
 * Interprets a codon string and returns the corresponding symbolic action
 */
export function interpretCodon(codon: string): SymbolicAction {
  ensureInitialized();
  
  const action = globalRegistry.get(codon);
  if (action) {
    return action;
  }
  
  // Return unknown action with the codon included for debugging
  return { 
    type: "unknown", 
    action: "log", 
    codon,
    message: `Unknown codon: ${codon}`
  };
}

/**
 * Batch interpret multiple codons
 */
export function interpretCodons(codons: string[]): SymbolicAction[] {
  return codons.map(codon => interpretCodon(codon));
}

/**
 * Get the current codon registry
 */
export function getCodonRegistry(): CodonRegistryImpl {
  ensureInitialized();
  return globalRegistry;
}

/**
 * Validate that a codon exists in the registry
 */
export function isKnownCodon(codon: string): boolean {
  ensureInitialized();
  return globalRegistry.get(codon) !== undefined;
}