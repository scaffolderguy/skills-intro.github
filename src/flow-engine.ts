/**
 * Flow Engine Implementation
 * 
 * The central routing system that connects codons to agent modules.
 * Provides pluggable architecture for different types of symbolic agents.
 */

import { SymbolicAction, IFlowEngine } from './types';
import { interpretCodon } from './interpreter';

export class FlowEngine implements IFlowEngine {
  private agentModules: Record<string, (action: SymbolicAction) => void>;
  private middlewares: ((action: SymbolicAction, next: () => void) => void)[];
  private isLoggingEnabled: boolean;

  constructor(enableLogging: boolean = true) {
    this.agentModules = {};
    this.middlewares = [];
    this.isLoggingEnabled = enableLogging;
  }

  /**
   * Register an agent handler for a specific type
   */
  registerAgent(type: string, handler: (action: SymbolicAction) => void): void {
    this.agentModules[type] = handler;
    if (this.isLoggingEnabled) {
      console.log(`🔧 Registered agent for type: ${type}`);
    }
  }

  /**
   * Add middleware to process actions before routing
   */
  addMiddleware(middleware: (action: SymbolicAction, next: () => void) => void): void {
    this.middlewares.push(middleware);
  }

  /**
   * Route a codon through interpretation and then to appropriate agent
   */
  routeCodon(codon: string): void {
    const action = interpretCodon(codon);
    this.routeAction(action);
  }

  /**
   * Route a symbolic action directly to appropriate agent
   */
  routeAction(action: SymbolicAction): void {
    this.executeWithMiddleware(action, 0);
  }

  private executeWithMiddleware(action: SymbolicAction, middlewareIndex: number): void {
    if (middlewareIndex < this.middlewares.length) {
      // Execute middleware
      this.middlewares[middlewareIndex](action, () => {
        this.executeWithMiddleware(action, middlewareIndex + 1);
      });
    } else {
      // Execute the actual routing
      this.executeRouting(action);
    }
  }

  private executeRouting(action: SymbolicAction): void {
    const handler = this.agentModules[action.type];
    
    if (handler) {
      if (this.isLoggingEnabled) {
        console.log(`🚀 Routing ${action.type} action: ${action.action}`);
      }
      try {
        handler(action);
      } catch (error) {
        this.handleError(action, error);
      }
    } else {
      this.defaultHandler(action);
    }
  }

  private defaultHandler(action: SymbolicAction): void {
    if (this.isLoggingEnabled) {
      console.log(`⚠️  No agent for type "${action.type}". Action:`, action);
    }
  }

  private handleError(action: SymbolicAction, error: any): void {
    console.error(`❌ Error executing action ${action.type}:${action.action}:`, error);
  }

  /**
   * Get all registered agent types
   */
  getRegisteredTypes(): string[] {
    return Object.keys(this.agentModules);
  }

  /**
   * Check if an agent is registered for a specific type
   */
  hasAgent(type: string): boolean {
    return type in this.agentModules;
  }

  /**
   * Enable or disable logging
   */
  setLogging(enabled: boolean): void {
    this.isLoggingEnabled = enabled;
  }
}