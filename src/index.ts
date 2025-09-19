/**
 * Main Export Module
 * 
 * Provides easy access to all components of the Codon Interpreter Kernel system.
 */

// Core types and interfaces
export * from './types';

// Core components
export { interpretCodon, interpretCodons, getCodonRegistry, isKnownCodon } from './interpreter';
export { CodonRegistryImpl } from './codon-registry';
export { FlowEngine } from './flow-engine';

// Supporting modules
export { GlyphicLedger } from './glyphic-ledger';
export { BarterArrayMapper } from './barter-array-mapper';
export { FeedbackPulse } from './feedback-pulse';

// Main kernel
export { DiamondKernel } from './diamond-kernel';

// Convenience function for quick setup
import { DiamondKernel } from './diamond-kernel';
export function createKernel(enableLogging: boolean = true) {
  const kernel = new DiamondKernel(enableLogging);
  kernel.initialize();
  return kernel;
}