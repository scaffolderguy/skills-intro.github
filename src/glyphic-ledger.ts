/**
 * Glyphic Ledger Module
 * 
 * Tracks symbolic transactions and maintains a record of codon executions.
 * Embedded accounting logic for the symbolic execution system.
 */

import { SymbolicAction } from './types';

export interface LedgerEntry {
  id: string;
  timestamp: Date;
  codon?: string;
  action: SymbolicAction;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export class GlyphicLedger {
  private entries: LedgerEntry[];
  private nextId: number;

  constructor() {
    this.entries = [];
    this.nextId = 1;
  }

  /**
   * Record a symbolic transaction
   */
  recordTransaction(action: SymbolicAction, codon?: string, metadata?: Record<string, any>): string {
    const id = this.generateId();
    const entry: LedgerEntry = {
      id,
      timestamp: new Date(),
      codon,
      action: { ...action },
      status: 'pending',
      metadata: metadata || {}
    };

    this.entries.push(entry);
    console.log(`📊 Ledger: Recorded transaction ${id} for ${action.type}:${action.action}`);
    
    return id;
  }

  /**
   * Update transaction status
   */
  updateStatus(id: string, status: LedgerEntry['status'], metadata?: Record<string, any>): void {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      entry.status = status;
      if (metadata) {
        entry.metadata = { ...entry.metadata, ...metadata };
      }
      console.log(`📊 Ledger: Updated transaction ${id} status to ${status}`);
    }
  }

  /**
   * Get transaction by ID
   */
  getTransaction(id: string): LedgerEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  /**
   * Get all transactions for a specific type
   */
  getTransactionsByType(type: string): LedgerEntry[] {
    return this.entries.filter(e => e.action.type === type);
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: LedgerEntry['status']): LedgerEntry[] {
    return this.entries.filter(e => e.status === status);
  }

  /**
   * Get summary statistics
   */
  getSummary(): Record<string, any> {
    const totalTransactions = this.entries.length;
    const byType = this.entries.reduce((acc, entry) => {
      acc[entry.action.type] = (acc[entry.action.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = this.entries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTransactions,
      byType,
      byStatus,
      lastTransaction: this.entries[this.entries.length - 1]?.timestamp
    };
  }

  /**
   * Clear all transactions (for testing/reset)
   */
  clear(): void {
    this.entries = [];
    this.nextId = 1;
    console.log('📊 Ledger: Cleared all transactions');
  }

  private generateId(): string {
    return "TXN-" + (this.nextId++).toString().padStart(6, '0');
  }
}