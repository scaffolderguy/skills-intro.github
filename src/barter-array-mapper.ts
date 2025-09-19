/**
 * Barter Array Mapper Module
 * 
 * Visualizes and maps token flow through the symbolic system.
 * Connects to donation routing and energy distribution systems.
 */

import { SymbolicAction } from './types';

export interface TokenFlow {
  from: string;
  to: string;
  amount: number;
  tokenType: string;
  timestamp: Date;
  codon?: string;
  metadata?: Record<string, any>;
}

export interface FlowNode {
  id: string;
  type: 'source' | 'sink' | 'processor';
  balance: Record<string, number>; // tokenType -> amount
  connections: string[];
}

export class BarterArrayMapper {
  private flows: TokenFlow[];
  private nodes: Map<string, FlowNode>;
  private flowHistory: TokenFlow[];

  constructor() {
    this.flows = [];
    this.nodes = new Map();
    this.flowHistory = [];
    this.initializeDefaultNodes();
  }

  private initializeDefaultNodes(): void {
    // Create default nodes for common flow patterns
    this.createNode('energy-source', 'source');
    this.createNode('narrative-processor', 'processor');
    this.createNode('biodata-sink', 'sink');
    this.createNode('donation-router', 'processor');
  }

  /**
   * Create a new flow node
   */
  createNode(id: string, type: FlowNode['type']): void {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, {
        id,
        type,
        balance: {},
        connections: []
      });
      console.log(`🗺️  Barter Mapper: Created node ${id} of type ${type}`);
    }
  }

  /**
   * Connect two nodes
   */
  connectNodes(fromId: string, toId: string): void {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);

    if (fromNode && toNode) {
      if (!fromNode.connections.includes(toId)) {
        fromNode.connections.push(toId);
      }
      console.log(`🗺️  Barter Mapper: Connected ${fromId} -> ${toId}`);
    }
  }

  /**
   * Record a token flow between nodes
   */
  recordFlow(from: string, to: string, amount: number, tokenType: string, codon?: string, metadata?: Record<string, any>): void {
    const flow: TokenFlow = {
      from,
      to,
      amount,
      tokenType,
      timestamp: new Date(),
      codon,
      metadata: metadata || {}
    };

    this.flows.push(flow);
    this.flowHistory.push({ ...flow });

    // Update node balances
    this.updateNodeBalance(from, tokenType, -amount);
    this.updateNodeBalance(to, tokenType, amount);

    console.log(`🗺️  Barter Mapper: Recorded flow of ${amount} ${tokenType} from ${from} to ${to}`);
  }

  /**
   * Process a symbolic action and create appropriate flows
   */
  processAction(action: SymbolicAction, codon?: string): void {
    switch (action.type) {
      case 'energy':
        this.handleEnergyFlow(action, codon);
        break;
      case 'narrative':
        this.handleNarrativeFlow(action, codon);
        break;
      case 'biodata':
        this.handleBiodataFlow(action, codon);
        break;
      case 'barter':
        this.handleBarterFlow(action, codon);
        break;
    }
  }

  private handleEnergyFlow(action: SymbolicAction, codon?: string): void {
    if (action.action === 'distributeFlow') {
      const amount = action.amount || 10;
      this.recordFlow('energy-source', 'donation-router', amount, 'energy', codon);
    }
  }

  private handleNarrativeFlow(action: SymbolicAction, codon?: string): void {
    if (action.action === 'activateMemory') {
      const amount = action.memoryUnits || 5;
      this.recordFlow('narrative-processor', 'biodata-sink', amount, 'memory', codon);
    }
  }

  private handleBiodataFlow(action: SymbolicAction, codon?: string): void {
    if (action.action === 'initiateHealing') {
      const amount = action.healingPoints || 8;
      this.recordFlow('biodata-sink', 'energy-source', amount, 'vitality', codon);
    }
  }

  private handleBarterFlow(action: SymbolicAction, codon?: string): void {
    if (action.action === 'mapTokenFlow') {
      // Create visualization of current token flows
      this.generateFlowVisualization();
    }
  }

  private updateNodeBalance(nodeId: string, tokenType: string, amount: number): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.balance[tokenType] = (node.balance[tokenType] || 0) + amount;
    }
  }

  /**
   * Get current flow state
   */
  getFlowState(): { nodes: FlowNode[], flows: TokenFlow[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      flows: [...this.flows]
    };
  }

  /**
   * Generate a visualization of token flows
   */
  generateFlowVisualization(): string {
    const visualization = [];
    visualization.push('🗺️  Token Flow Visualization:');
    visualization.push('');

    // Show nodes and their balances
    for (const node of this.nodes.values()) {
      const balanceStr = Object.entries(node.balance)
        .map(([type, amount]) => `${type}:${amount}`)
        .join(', ') || 'empty';
      visualization.push(`  [${node.id}] (${node.type}) - Balance: {${balanceStr}}`);
    }

    visualization.push('');
    visualization.push('Recent Flows:');
    
    // Show recent flows
    const recentFlows = this.flows.slice(-5);
    for (const flow of recentFlows) {
      visualization.push(`  ${flow.from} --[${flow.amount} ${flow.tokenType}]--> ${flow.to} ${flow.codon ? `(${flow.codon})` : ''}`);
    }

    const result = visualization.join('\n');
    console.log(result);
    return result;
  }

  /**
   * Get flow statistics
   */
  getFlowStatistics(): Record<string, any> {
    const totalFlows = this.flows.length;
    const tokenTypes = [...new Set(this.flows.map(f => f.tokenType))];
    const totalVolumeByToken = this.flows.reduce((acc, flow) => {
      acc[flow.tokenType] = (acc[flow.tokenType] || 0) + flow.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFlows,
      tokenTypes,
      totalVolumeByToken,
      activeNodes: this.nodes.size,
      lastFlowTime: this.flows[this.flows.length - 1]?.timestamp
    };
  }

  /**
   * Clear all flows and reset nodes
   */
  clear(): void {
    this.flows = [];
    this.flowHistory = [];
    for (const node of this.nodes.values()) {
      node.balance = {};
    }
    console.log('🗺️  Barter Mapper: Cleared all flows and reset node balances');
  }
}