/**
 * Feedback Pulse Module
 * 
 * Adjusts agent behavior based on execution metrics and outcomes.
 * Syncs with simulation metrics to create adaptive behavior loops.
 */

import { SymbolicAction } from './types';

export interface FeedbackMetric {
  id: string;
  timestamp: Date;
  actionType: string;
  action: string;
  executionTime: number;
  success: boolean;
  metadata?: Record<string, any>;
}

export interface BehaviorAdjustment {
  actionType: string;
  parameter: string;
  oldValue: any;
  newValue: any;
  reason: string;
  timestamp: Date;
}

export class FeedbackPulse {
  private metrics: FeedbackMetric[];
  private adjustments: BehaviorAdjustment[];
  private behaviorParameters: Map<string, Record<string, any>>;
  private nextMetricId: number;

  constructor() {
    this.metrics = [];
    this.adjustments = [];
    this.behaviorParameters = new Map();
    this.nextMetricId = 1;
    this.initializeDefaultParameters();
  }

  private initializeDefaultParameters(): void {
    // Default behavior parameters for different agent types
    this.behaviorParameters.set('energy', {
      distributionRate: 1.0,
      maxFlow: 100,
      efficiency: 0.8
    });

    this.behaviorParameters.set('narrative', {
      memoryActivationThreshold: 0.5,
      contextDepth: 3,
      retentionRate: 0.9
    });

    this.behaviorParameters.set('biodata', {
      healingIntensity: 1.0,
      regenerationRate: 0.7,
      stabilityFactor: 0.85
    });
  }

  /**
   * Record execution metrics for feedback analysis
   */
  recordMetric(action: SymbolicAction, executionTime: number, success: boolean, metadata?: Record<string, any>): string {
    const id = "METRIC-" + (this.nextMetricId++).toString().padStart(6, '0');
    
    const metric: FeedbackMetric = {
      id,
      timestamp: new Date(),
      actionType: action.type,
      action: action.action,
      executionTime,
      success,
      metadata: metadata || {}
    };

    this.metrics.push(metric);
    
    // Trigger adaptive adjustment if needed
    this.analyzeAndAdjust(metric);
    
    const statusText = success ? 'SUCCESS' : 'FAILURE';
    console.log("🔄 Feedback: Recorded metric " + id + " for " + action.type + ":" + action.action + " (" + statusText + ")");
    return id;
  }

  /**
   * Analyze metrics and make behavior adjustments
   */
  private analyzeAndAdjust(latestMetric: FeedbackMetric): void {
    const recentMetrics = this.getRecentMetrics(latestMetric.actionType, 5);
    
    if (recentMetrics.length >= 3) {
      const successRate = recentMetrics.filter(m => m.success).length / recentMetrics.length;
      const avgExecutionTime = recentMetrics.reduce((sum, m) => sum + m.executionTime, 0) / recentMetrics.length;
      
      this.adjustBasedOnSuccessRate(latestMetric.actionType, successRate);
      this.adjustBasedOnPerformance(latestMetric.actionType, avgExecutionTime);
    }
  }

  private adjustBasedOnSuccessRate(actionType: string, successRate: number): void {
    const parameters = this.behaviorParameters.get(actionType);
    if (!parameters) return;

    if (successRate < 0.6) {
      // Low success rate - be more conservative
      this.adjustParameter(actionType, 'efficiency', parameters.efficiency * 0.9, 'Low success rate detected');
    } else if (successRate > 0.9) {
      // High success rate - can be more aggressive
      this.adjustParameter(actionType, 'efficiency', Math.min(parameters.efficiency * 1.1, 1.0), 'High success rate detected');
    }
  }

  private adjustBasedOnPerformance(actionType: string, avgExecutionTime: number): void {
    const parameters = this.behaviorParameters.get(actionType);
    if (!parameters) return;

    if (avgExecutionTime > 1000) { // Over 1 second
      // Slow performance - reduce complexity
      switch (actionType) {
        case 'narrative':
          this.adjustParameter(actionType, 'contextDepth', Math.max(parameters.contextDepth - 1, 1), 'Performance optimization');
          break;
        case 'energy':
          this.adjustParameter(actionType, 'maxFlow', Math.max(parameters.maxFlow * 0.8, 10), 'Performance optimization');
          break;
      }
    }
  }

  private adjustParameter(actionType: string, parameter: string, newValue: any, reason: string): void {
    const parameters = this.behaviorParameters.get(actionType);
    if (!parameters) return;

    const oldValue = parameters[parameter];
    if (oldValue !== newValue) {
      parameters[parameter] = newValue;
      
      const adjustment: BehaviorAdjustment = {
        actionType,
        parameter,
        oldValue,
        newValue,
        reason,
        timestamp: new Date()
      };
      
      this.adjustments.push(adjustment);
      console.log("🔄 Feedback: Adjusted " + actionType + "." + parameter + " from " + oldValue + " to " + newValue + " (" + reason + ")");
    }
  }

  /**
   * Get behavior parameters for an action type
   */
  getBehaviorParameters(actionType: string): Record<string, any> | undefined {
    const parameters = this.behaviorParameters.get(actionType);
    return parameters ? { ...parameters } : undefined;
  }

  /**
   * Manually override a behavior parameter
   */
  overrideBehaviorParameter(actionType: string, parameter: string, value: any): void {
    const parameters = this.behaviorParameters.get(actionType);
    if (parameters) {
      const oldValue = parameters[parameter];
      parameters[parameter] = value;
      
      const adjustment: BehaviorAdjustment = {
        actionType,
        parameter,
        oldValue,
        newValue: value,
        reason: 'Manual override',
        timestamp: new Date()
      };
      
      this.adjustments.push(adjustment);
      console.log("🔄 Feedback: Manual override " + actionType + "." + parameter + " = " + value);
    }
  }

  /**
   * Get recent metrics for analysis
   */
  private getRecentMetrics(actionType: string, count: number): FeedbackMetric[] {
    return this.metrics
      .filter(m => m.actionType === actionType)
      .slice(-count);
  }

  /**
   * Get feedback statistics
   */
  getFeedbackStatistics(): Record<string, any> {
    const totalMetrics = this.metrics.length;
    const totalAdjustments = this.adjustments.length;
    
    const successRateByType = this.calculateSuccessRateByType();
    const avgExecutionTimeByType = this.calculateAvgExecutionTimeByType();
    
    return {
      totalMetrics,
      totalAdjustments,
      successRateByType,
      avgExecutionTimeByType,
      recentAdjustments: this.adjustments.slice(-5)
    };
  }

  private calculateSuccessRateByType(): Record<string, number> {
    const result: Record<string, number> = {};
    const typeGroups = this.groupMetricsByType();
    
    for (const [type, metrics] of typeGroups.entries()) {
      const successCount = metrics.filter(m => m.success).length;
      result[type] = metrics.length > 0 ? successCount / metrics.length : 0;
    }
    
    return result;
  }

  private calculateAvgExecutionTimeByType(): Record<string, number> {
    const result: Record<string, number> = {};
    const typeGroups = this.groupMetricsByType();
    
    for (const [type, metrics] of typeGroups.entries()) {
      const totalTime = metrics.reduce((sum, m) => sum + m.executionTime, 0);
      result[type] = metrics.length > 0 ? totalTime / metrics.length : 0;
    }
    
    return result;
  }

  private groupMetricsByType(): Map<string, FeedbackMetric[]> {
    const groups = new Map<string, FeedbackMetric[]>();
    
    for (const metric of this.metrics) {
      if (!groups.has(metric.actionType)) {
        groups.set(metric.actionType, []);
      }
      groups.get(metric.actionType)!.push(metric);
    }
    
    return groups;
  }

  /**
   * Clear all metrics and adjustments
   */
  clear(): void {
    this.metrics = [];
    this.adjustments = [];
    this.nextMetricId = 1;
    this.initializeDefaultParameters();
    console.log('🔄 Feedback: Cleared all metrics and reset parameters');
  }
}