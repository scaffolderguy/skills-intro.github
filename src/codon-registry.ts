/**
 * Codon Registry Implementation
 * 
 * Manages the mapping between symbolic codes (codons) and their corresponding actions.
 * Acts as the central lookup system for the interpreter kernel.
 */

import { SymbolicAction, CodonRegistry, ICodonRegistry } from './types';

export class CodonRegistryImpl implements ICodonRegistry {
  private registry: CodonRegistry;

  constructor(initialRegistry?: CodonRegistry) {
    this.registry = initialRegistry || this.getDefaultRegistry();
  }

  private getDefaultRegistry(): CodonRegistry {
    return {
      "XJ-42": { type: "narrative", action: "activateMemory" },
      "ZQ-88": { type: "energy", action: "distributeFlow" },
      "LM-17": { type: "biodata", action: "initiateHealing" },
      "NK-73": { type: "ledger", action: "recordTransaction" },
      "PY-15": { type: "barter", action: "mapTokenFlow" },
      "QR-91": { type: "feedback", action: "adjustBehavior" }
    };
  }

  register(codon: string, action: SymbolicAction): void {
    this.registry[codon] = action;
  }

  get(codon: string): SymbolicAction | undefined {
    return this.registry[codon];
  }

  getAll(): CodonRegistry {
    return { ...this.registry };
  }

  // Helper method to validate codon format
  isValidCodon(codon: string): boolean {
    return /^[A-Z]{2}-\d{2}$/.test(codon);
  }

  // Get codons by type
  getCodonsByType(type: string): CodonRegistry {
    const result: CodonRegistry = {};
    for (const [codon, action] of Object.entries(this.registry)) {
      if (action.type === type) {
        result[codon] = action;
      }
    }
    return result;
  }
}