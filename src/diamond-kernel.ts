/**
 * Diamond Kernel - Main Integration Point
 * 
 * The central orchestration system that combines all symbolic execution modules
 * into a cohesive agent ecosystem embedded directly in code.
 */

import { SymbolicAction } from './types';
import { FlowEngine } from './flow-engine';
import { GlyphicLedger } from './glyphic-ledger';
import { BarterArrayMapper } from './barter-array-mapper';
import { FeedbackPulse } from './feedback-pulse';
import { interpretCodon, getCodonRegistry } from './interpreter';

export class DiamondKernel {
  private flowEngine: FlowEngine;
  private ledger: GlyphicLedger;
  private barterMapper: BarterArrayMapper;
  private feedback: FeedbackPulse;
  private isInitialized: boolean;

  constructor(enableLogging: boolean = true) {
    this.flowEngine = new FlowEngine(enableLogging);
    this.ledger = new GlyphicLedger();
    this.barterMapper = new BarterArrayMapper();
    this.feedback = new FeedbackPulse();
    this.isInitialized = false;
  }

  /**
   * Initialize the kernel with default agents and integrations
   */
  initialize(): void {
    if (this.isInitialized) return;

    this.setupDefaultAgents();
    this.setupMiddleware();
    this.createDefaultFlowConnections();
    
    this.isInitialized = true;
    console.log('💎 Diamond Kernel: Initialized with all subsystems active');
  }

  private setupDefaultAgents(): void {
    // Narrative Agent
    this.flowEngine.registerAgent('narrative', (action) => {
      const startTime = Date.now();
      const txnId = this.ledger.recordTransaction(action, action.codon);
      
      try {
        console.log('🧠 Narrative Agent: Activating memory patterns...');
        // Simulate memory activation
        setTimeout(() => {
          this.ledger.updateStatus(txnId, 'completed', { memoryUnits: 5 });
          const executionTime = Date.now() - startTime;
          this.feedback.recordMetric(action, executionTime, true);
        }, 100);
        
        this.barterMapper.processAction(action, action.codon);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.ledger.updateStatus(txnId, 'failed', { error: errorMessage });
        const executionTime = Date.now() - startTime;
        this.feedback.recordMetric(action, executionTime, false);
      }
    });

    // Energy Agent
    this.flowEngine.registerAgent('energy', (action) => {
      const startTime = Date.now();
      const txnId = this.ledger.recordTransaction(action, action.codon);
      
      try {
        console.log('⚡ Energy Agent: Distributing flow through network...');
        const params = this.feedback.getBehaviorParameters('energy');
        const flowAmount = (action.amount || 10) * (params?.efficiency || 1.0);
        
        this.barterMapper.processAction({ ...action, amount: flowAmount }, action.codon);
        
        setTimeout(() => {
          this.ledger.updateStatus(txnId, 'completed', { flowAmount });
          const executionTime = Date.now() - startTime;
          this.feedback.recordMetric(action, executionTime, true);
        }, 150);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.ledger.updateStatus(txnId, 'failed', { error: errorMessage });
        const executionTime = Date.now() - startTime;
        this.feedback.recordMetric(action, executionTime, false);
      }
    });

    // Biodata Agent
    this.flowEngine.registerAgent('biodata', (action) => {
      const startTime = Date.now();
      const txnId = this.ledger.recordTransaction(action, action.codon);
      
      try {
        console.log('🌱 Biodata Agent: Initiating healing protocols...');
        const params = this.feedback.getBehaviorParameters('biodata');
        const healingPower = (action.healingPoints || 8) * (params?.healingIntensity || 1.0);
        
        this.barterMapper.processAction({ ...action, healingPoints: healingPower }, action.codon);
        
        setTimeout(() => {
          this.ledger.updateStatus(txnId, 'completed', { healingPower });
          const executionTime = Date.now() - startTime;
          this.feedback.recordMetric(action, executionTime, true);
        }, 200);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.ledger.updateStatus(txnId, 'failed', { error: errorMessage });
        const executionTime = Date.now() - startTime;
        this.feedback.recordMetric(action, executionTime, false);
      }
    });

    // Ledger Agent (for self-management)
    this.flowEngine.registerAgent('ledger', (action) => {
      console.log('📊 Ledger Agent: Processing ledger operations...');
      if (action.action === 'recordTransaction') {
        // This is handled automatically by other agents
        console.log('📊 Ledger: Transaction recording is integrated into all operations');
      }
    });

    // Barter Agent
    this.flowEngine.registerAgent('barter', (action) => {
      console.log('🗺️  Barter Agent: Managing token flows...');
      if (action.action === 'mapTokenFlow') {
        this.barterMapper.generateFlowVisualization();
      }
    });

    // Feedback Agent
    this.flowEngine.registerAgent('feedback', (action) => {
      console.log('🔄 Feedback Agent: Adjusting system behavior...');
      if (action.action === 'adjustBehavior') {
        const stats = this.feedback.getFeedbackStatistics();
        console.log('🔄 Current system performance:', stats);
      }
    });
  }

  private setupMiddleware(): void {
    // Add logging middleware
    this.flowEngine.addMiddleware((action, next) => {
      console.log(`💎 Kernel: Processing ${action.type}:${action.action}${action.codon ? ` (${action.codon})` : ''}`);
      next();
    });

    // Add performance tracking middleware
    this.flowEngine.addMiddleware((action, next) => {
      const startTime = Date.now();
      next();
      const executionTime = Date.now() - startTime;
      console.log(`💎 Kernel: Action completed in ${executionTime}ms`);
    });
  }

  private createDefaultFlowConnections(): void {
    // Set up token flow connections
    this.barterMapper.connectNodes('energy-source', 'narrative-processor');
    this.barterMapper.connectNodes('narrative-processor', 'biodata-sink');
    this.barterMapper.connectNodes('biodata-sink', 'donation-router');
    this.barterMapper.connectNodes('donation-router', 'energy-source');
  }

  /**
   * Execute a codon through the entire kernel system
   */
  executeCodon(codon: string): void {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    console.log(`💎 Kernel: Executing codon ${codon}`);
    const action = interpretCodon(codon);
    action.codon = codon; // Attach codon for tracking
    
    this.flowEngine.routeAction(action);
  }

  /**
   * Execute multiple codons in sequence
   */
  executeCodons(codons: string[]): void {
    console.log(`💎 Kernel: Executing sequence of ${codons.length} codons`);
    codons.forEach(codon => this.executeCodon(codon));
  }

  /**
   * Execute a symbolic action directly
   */
  executeAction(action: SymbolicAction): void {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    this.flowEngine.routeAction(action);
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus(): Record<string, any> {
    return {
      kernel: {
        initialized: this.isInitialized,
        registeredAgents: this.flowEngine.getRegisteredTypes()
      },
      ledger: this.ledger.getSummary(),
      barterMapper: this.barterMapper.getFlowStatistics(),
      feedback: this.feedback.getFeedbackStatistics(),
      codonRegistry: {
        totalCodons: Object.keys(getCodonRegistry().getAll()).length,
        availableCodons: Object.keys(getCodonRegistry().getAll())
      }
    };
  }

  /**
   * Generate a comprehensive system visualization
   */
  generateSystemVisualization(): string {
    const lines = [];
    lines.push('💎 DIAMOND KERNEL SYSTEM STATUS');
    lines.push('================================');
    lines.push('');
    
    // Show registered agents
    lines.push('🔧 Active Agents:');
    this.flowEngine.getRegisteredTypes().forEach(type => {
      lines.push(`  • ${type}`);
    });
    lines.push('');
    
    // Show ledger summary
    const ledgerSummary = this.ledger.getSummary();
    lines.push('📊 Transaction Summary:');
    lines.push(`  Total: ${ledgerSummary.totalTransactions}`);
    Object.entries(ledgerSummary.byType).forEach(([type, count]) => {
      lines.push(`  ${type}: ${count}`);
    });
    lines.push('');
    
    // Show flow visualization
    lines.push(this.barterMapper.generateFlowVisualization());
    lines.push('');
    
    // Show feedback stats
    const feedbackStats = this.feedback.getFeedbackStatistics();
    lines.push('🔄 Performance Metrics:');
    lines.push(`  Total Metrics: ${feedbackStats.totalMetrics}`);
    lines.push(`  Adjustments Made: ${feedbackStats.totalAdjustments}`);
    lines.push('');
    
    const result = lines.join('\n');
    console.log(result);
    return result;
  }

  /**
   * Reset the entire kernel system
   */
  reset(): void {
    this.ledger.clear();
    this.barterMapper.clear();
    this.feedback.clear();
    console.log('💎 Kernel: System reset completed');
  }

  // Getter methods for accessing subsystems
  getFlowEngine(): FlowEngine { return this.flowEngine; }
  getLedger(): GlyphicLedger { return this.ledger; }
  getBarterMapper(): BarterArrayMapper { return this.barterMapper; }
  getFeedback(): FeedbackPulse { return this.feedback; }
  getCodonRegistry() { return getCodonRegistry(); }
}