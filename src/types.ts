/**
 * Codon Interpreter Kernel - Core Types and Interfaces
 * 
 * This module defines the foundational types for the symbolic execution system.
 * Codons represent symbolic actions that can be interpreted and executed by agents.
 */

// --- Core Types ---
export type SymbolicAction = {
  type: string;
  action: string;
  [key: string]: any;
};

export type CodonRegistry = Record<string, SymbolicAction>;

// --- Registry Interface ---
export interface ICodonRegistry {
  register(codon: string, action: SymbolicAction): void;
  get(codon: string): SymbolicAction | undefined;
  getAll(): CodonRegistry;
}

// --- Agent Module Interface ---
export interface IAgentModule {
  getType(): string;
  execute(action: SymbolicAction): Promise<void> | void;
  canHandle(action: SymbolicAction): boolean;
}

// --- Flow Engine Interface ---
export interface IFlowEngine {
  registerAgent(type: string, handler: (action: SymbolicAction) => void): void;
  routeCodon(codon: string): void;
  routeAction(action: SymbolicAction): void;
}