/**
 * Emotional Parser - Advanced system for detecting emotional cues from user behavior
 * 
 * This parser analyzes various behavioral signals to infer emotional states,
 * confidence levels, and stress indicators during user interactions.
 */

class EmotionalParser {
    constructor(config = {}) {
        this.sensitivity = config.sensitivity || 'medium';
        this.learningMode = config.learningMode || false;
        this.personalizedModels = new Map();
        this.globalPatterns = this.initializeGlobalPatterns();
    }

    /**
     * Initialize global emotional patterns based on research
     */
    initializeGlobalPatterns() {
        return {
            frustration_indicators: {
                rapid_input: { threshold: 5, weight: 0.3 },
                repeated_actions: { threshold: 3, weight: 0.4 },
                backspace_frequency: { threshold: 0.2, weight: 0.25 },
                help_seeking: { threshold: 1, weight: 0.5 },
                abandonment_signals: { threshold: 1, weight: 0.6 },
                error_accumulation: { threshold: 2, weight: 0.35 }
            },
            confidence_indicators: {
                steady_progression: { threshold: 0.7, weight: 0.4 },
                decision_speed: { threshold: 2000, weight: 0.3 },
                exploration_depth: { threshold: 3, weight: 0.2 },
                help_avoidance: { threshold: 0.1, weight: 0.25 },
                task_completion: { threshold: 0.8, weight: 0.5 }
            },
            stress_indicators: {
                time_pressure: { threshold: 0.8, weight: 0.3 },
                multitasking: { threshold: 2, weight: 0.2 },
                interruption_frequency: { threshold: 3, weight: 0.25 },
                perfectionism_signs: { threshold: 0.6, weight: 0.2 }
            }
        };
    }

    /**
     * Parse emotional cues from comprehensive behavior data
     */
    parse(behaviorData, existingCues = {}) {
        const userId = behaviorData.userId || 'anonymous';
        const personalModel = this.personalizedModels.get(userId);
        
        const emotionalCues = {
            frustration_signals: this.detectFrustrationSignals(behaviorData, personalModel),
            confidence_markers: this.assessConfidenceLevel(behaviorData, personalModel),
            emotional_state: this.determineEmotionalState(behaviorData, personalModel),
            stress_indicators: this.identifyStressIndicators(behaviorData, personalModel),
            engagement_level: this.measureEngagementLevel(behaviorData),
            cognitive_load: this.estimateCognitiveLoad(behaviorData),
            flow_state_indicators: this.detectFlowState(behaviorData)
        };

        // Update personalized model if in learning mode
        if (this.learningMode && behaviorData.feedback) {
            this.updatePersonalizedModel(userId, behaviorData, emotionalCues);
        }

        return emotionalCues;
    }

    /**
     * Detect frustration signals from user behavior
     */
    detectFrustrationSignals(behaviorData, personalModel = null) {
        const signals = [];
        const patterns = personalModel?.frustration || this.globalPatterns.frustration_indicators;

        // Repeated attempts on same action
        if (behaviorData.attempts > patterns.repeated_actions.threshold) {
            signals.push('repeated_attempts');
        }

        // Rapid keystrokes or clicks
        const avgInputSpeed = behaviorData.input_events ? 
            behaviorData.input_events.length / (behaviorData.duration / 1000) : 0;
        if (avgInputSpeed > patterns.rapid_input.threshold) {
            signals.push('rapid_keystrokes');
        }

        // High backspace/undo frequency
        const backspaceRatio = behaviorData.backspace_count / 
            (behaviorData.total_characters || 1);
        if (backspaceRatio > patterns.backspace_frequency.threshold) {
            signals.push('backspacing');
        }

        // Help seeking behavior
        if (behaviorData.help_requests > patterns.help_seeking.threshold) {
            signals.push('help_seeking');
        }

        // Abandonment signs (incomplete actions, tab switching)
        if (behaviorData.incomplete_actions > patterns.abandonment_signals.threshold) {
            signals.push('abandonment_signs');
        }

        // Error accumulation
        if (behaviorData.error_count > patterns.error_accumulation.threshold) {
            signals.push('error_accumulation');
        }

        // Advanced frustration indicators
        if (behaviorData.mouse_movement_erratic) {
            signals.push('erratic_cursor_movement');
        }

        if (behaviorData.pause_duration_variance > 2000) {
            signals.push('irregular_pacing');
        }

        return signals;
    }

    /**
     * Assess confidence level from behavioral patterns
     */
    assessConfidenceLevel(behaviorData, personalModel = null) {
        const patterns = personalModel?.confidence || this.globalPatterns.confidence_indicators;
        let confidenceScore = 0.5; // Start neutral
        const indicators = [];

        // Steady progression without backtracking
        if (behaviorData.progress_linearity > patterns.steady_progression.threshold) {
            confidenceScore += 0.2;
            indicators.push('steady_progress');
        }

        // Quick decision making
        const avgDecisionTime = behaviorData.average_decision_time || 5000;
        if (avgDecisionTime < patterns.decision_speed.threshold) {
            confidenceScore += 0.15;
            indicators.push('quick_decision_making');
        }

        // Exploratory behavior (shows comfort with interface)
        if (behaviorData.unique_actions_explored > patterns.exploration_depth.threshold) {
            confidenceScore += 0.1;
            indicators.push('exploration_behavior');
        }

        // Low help-seeking
        const helpSeekingRatio = behaviorData.help_requests / 
            (behaviorData.total_actions || 1);
        if (helpSeekingRatio < patterns.help_avoidance.threshold) {
            confidenceScore += 0.1;
            indicators.push('help_avoidance');
        }

        // Task completion rate
        if (behaviorData.task_completion_rate > patterns.task_completion.threshold) {
            confidenceScore += 0.15;
            indicators.push('high_completion_rate');
        }

        // Advanced confidence indicators
        if (behaviorData.consistent_workflow) {
            confidenceScore += 0.1;
            indicators.push('consistent_workflow');
        }

        if (behaviorData.advanced_features_used > 2) {
            confidenceScore += 0.1;
            indicators.push('advanced_feature_usage');
        }

        // Normalize confidence score
        confidenceScore = Math.max(0, Math.min(1, confidenceScore));

        const confidenceLevel = this.mapScoreToLevel(confidenceScore);

        return {
            level: confidenceLevel,
            score: confidenceScore,
            indicators
        };
    }

    /**
     * Map numeric confidence score to categorical level
     */
    mapScoreToLevel(score) {
        if (score >= 0.8) return 'very_high';
        if (score >= 0.65) return 'high';
        if (score >= 0.35) return 'medium';
        if (score >= 0.2) return 'low';
        return 'very_low';
    }

    /**
     * Determine overall emotional state
     */
    determineEmotionalState(behaviorData, personalModel = null) {
        const frustrationSignals = this.detectFrustrationSignals(behaviorData, personalModel).length;
        const confidenceLevel = this.assessConfidenceLevel(behaviorData, personalModel);
        const engagementLevel = this.measureEngagementLevel(behaviorData);

        // Decision tree for emotional state
        if (frustrationSignals >= 3) {
            return behaviorData.giving_up_signals ? 'overwhelmed' : 'frustrated';
        }

        if (confidenceLevel.score >= 0.7 && engagementLevel >= 0.7) {
            return behaviorData.flow_indicators ? 'excited' : 'focused';
        }

        if (confidenceLevel.score <= 0.3) {
            return behaviorData.seeking_clarification ? 'confused' : 'uncertain';
        }

        if (engagementLevel >= 0.8) {
            return 'curious';
        }

        if (behaviorData.persistence_indicators) {
            return 'determined';
        }

        if (behaviorData.goal_achieved) {
            return 'satisfied';
        }

        return 'focused';
    }

    /**
     * Identify stress indicators
     */
    identifyStressIndicators(behaviorData, personalModel = null) {
        const indicators = [];
        const patterns = personalModel?.stress || this.globalPatterns.stress_indicators;

        // Time pressure indicators
        if (behaviorData.time_pressure_ratio > patterns.time_pressure.threshold) {
            indicators.push('time_pressure');
        }

        // Multitasking behavior
        if (behaviorData.concurrent_tasks > patterns.multitasking.threshold) {
            indicators.push('multitasking_overload');
        }

        // Interruption frequency
        if (behaviorData.interruptions > patterns.interruption_frequency.threshold) {
            indicators.push('frequent_interruptions');
        }

        // Perfectionism signs (excessive revision)
        const revisionRatio = behaviorData.revision_count / (behaviorData.total_actions || 1);
        if (revisionRatio > patterns.perfectionism_signs.threshold) {
            indicators.push('perfectionism_stress');
        }

        // Advanced stress indicators
        if (behaviorData.context_switching_frequency > 5) {
            indicators.push('cognitive_switching_stress');
        }

        if (behaviorData.deadline_proximity && behaviorData.deadline_proximity < 0.2) {
            indicators.push('deadline_stress');
        }

        return indicators;
    }

    /**
     * Measure engagement level
     */
    measureEngagementLevel(behaviorData) {
        let engagementScore = 0.5;

        // Session duration relative to task complexity
        const expectedDuration = behaviorData.task_complexity * 1000; // ms
        const actualDuration = behaviorData.duration;
        const durationRatio = actualDuration / expectedDuration;

        if (durationRatio > 0.8 && durationRatio < 1.5) {
            engagementScore += 0.2; // Appropriate time spent
        }

        // Activity consistency
        if (behaviorData.activity_variance < 0.3) {
            engagementScore += 0.15; // Consistent engagement
        }

        // Feature exploration
        if (behaviorData.features_explored > 3) {
            engagementScore += 0.1; // Active exploration
        }

        // Content interaction depth
        if (behaviorData.interaction_depth > 2) {
            engagementScore += 0.15; // Deep interaction
        }

        return Math.max(0, Math.min(1, engagementScore));
    }

    /**
     * Estimate cognitive load
     */
    estimateCognitiveLoad(behaviorData) {
        let cognitiveLoad = 0.5;

        // Task switching frequency
        cognitiveLoad += Math.min(0.3, behaviorData.task_switches * 0.05);

        // Information processing indicators
        if (behaviorData.reading_time_variance > 2000) {
            cognitiveLoad += 0.1; // Inconsistent processing speed
        }

        // Error recovery complexity
        cognitiveLoad += Math.min(0.2, behaviorData.error_recovery_steps * 0.02);

        // Simultaneous task management
        cognitiveLoad += Math.min(0.2, behaviorData.concurrent_workflows * 0.1);

        return Math.max(0, Math.min(1, cognitiveLoad));
    }

    /**
     * Detect flow state indicators
     */
    detectFlowState(behaviorData) {
        const indicators = {
            present: false,
            strength: 0,
            characteristics: []
        };

        // Flow characteristics
        if (behaviorData.time_distortion && behaviorData.session_duration > behaviorData.perceived_duration * 1.2) {
            indicators.characteristics.push('time_distortion');
            indicators.strength += 0.2;
        }

        if (behaviorData.interruption_resistance > 0.8) {
            indicators.characteristics.push('deep_focus');
            indicators.strength += 0.2;
        }

        if (behaviorData.challenge_skill_balance > 0.7 && behaviorData.challenge_skill_balance < 1.3) {
            indicators.characteristics.push('optimal_challenge');
            indicators.strength += 0.2;
        }

        if (behaviorData.self_consciousness_markers < 0.2) {
            indicators.characteristics.push('reduced_self_awareness');
            indicators.strength += 0.15;
        }

        if (behaviorData.intrinsic_motivation_signals > 0.7) {
            indicators.characteristics.push('intrinsic_motivation');
            indicators.strength += 0.15;
        }

        indicators.present = indicators.strength > 0.4;
        indicators.strength = Math.min(1, indicators.strength);

        return indicators;
    }

    /**
     * Update personalized emotional model based on feedback
     */
    updatePersonalizedModel(userId, behaviorData, emotionalCues) {
        if (!this.personalizedModels.has(userId)) {
            this.personalizedModels.set(userId, {
                frustration: { ...this.globalPatterns.frustration_indicators },
                confidence: { ...this.globalPatterns.confidence_indicators },
                stress: { ...this.globalPatterns.stress_indicators },
                learning_history: []
            });
        }

        const model = this.personalizedModels.get(userId);
        
        // Add learning sample
        model.learning_history.push({
            timestamp: new Date().toISOString(),
            behavior: behaviorData,
            predicted_emotion: emotionalCues.emotional_state,
            actual_feedback: behaviorData.feedback,
            accuracy: this.calculatePredictionAccuracy(emotionalCues.emotional_state, behaviorData.feedback)
        });

        // Adjust thresholds based on feedback accuracy
        this.adjustPersonalizedThresholds(model, behaviorData.feedback, emotionalCues);

        // Keep only recent learning history (last 100 samples)
        if (model.learning_history.length > 100) {
            model.learning_history = model.learning_history.slice(-100);
        }
    }

    /**
     * Calculate prediction accuracy
     */
    calculatePredictionAccuracy(predicted, actual) {
        const emotionalDistance = {
            'frustrated': { 'frustrated': 1.0, 'overwhelmed': 0.8, 'confused': 0.6, 'focused': 0.2 },
            'focused': { 'focused': 1.0, 'determined': 0.8, 'curious': 0.7, 'satisfied': 0.6 },
            'excited': { 'excited': 1.0, 'satisfied': 0.8, 'curious': 0.7, 'focused': 0.5 },
            'confused': { 'confused': 1.0, 'frustrated': 0.6, 'uncertain': 0.8, 'focused': 0.3 }
        };

        return emotionalDistance[predicted]?.[actual] || 0.1;
    }

    /**
     * Adjust personalized thresholds based on feedback
     */
    adjustPersonalizedThresholds(model, actualFeedback, predictedCues) {
        const learningRate = 0.1;
        
        // If prediction was wrong, adjust thresholds
        if (actualFeedback !== predictedCues.emotional_state) {
            // This is a simplified adjustment - in practice, this would be more sophisticated
            Object.keys(model.frustration).forEach(key => {
                if (actualFeedback === 'frustrated' && predictedCues.emotional_state !== 'frustrated') {
                    model.frustration[key].threshold *= (1 - learningRate);
                } else if (actualFeedback !== 'frustrated' && predictedCues.emotional_state === 'frustrated') {
                    model.frustration[key].threshold *= (1 + learningRate);
                }
            });
        }
    }

    /**
     * Get emotional insights for a user
     */
    getEmotionalInsights(userId) {
        const model = this.personalizedModels.get(userId);
        if (!model || model.learning_history.length === 0) {
            return { message: 'Insufficient data for insights' };
        }

        const history = model.learning_history;
        const recentHistory = history.slice(-20);

        return {
            total_interactions: history.length,
            average_accuracy: history.reduce((sum, entry) => sum + entry.accuracy, 0) / history.length,
            emotional_patterns: this.analyzeEmotionalPatterns(recentHistory),
            improvement_suggestions: this.generateImprovementSuggestions(recentHistory),
            personalization_confidence: this.calculatePersonalizationConfidence(model)
        };
    }

    /**
     * Calculate personalization confidence
     */
    calculatePersonalizationConfidence(model) {
        const history = model.learning_history;
        if (history.length < 10) return 'low';
        
        const recentAccuracy = history.slice(-10).reduce((sum, entry) => sum + entry.accuracy, 0) / 10;
        
        if (recentAccuracy > 0.8) return 'high';
        if (recentAccuracy > 0.6) return 'medium';
        return 'low';
    }

    /**
     * Generate improvement suggestions
     */
    generateImprovementSuggestions(recentHistory) {
        const suggestions = [];
        
        const frustrationCount = recentHistory.filter(entry => 
            entry.predicted_emotion === 'frustrated' || entry.actual_feedback === 'frustrated'
        ).length;

        if (frustrationCount > recentHistory.length * 0.3) {
            suggestions.push('Consider breaking down complex tasks into smaller steps');
            suggestions.push('Provide more contextual help during challenging operations');
        }

        const confusionCount = recentHistory.filter(entry => 
            entry.predicted_emotion === 'confused' || entry.actual_feedback === 'confused'
        ).length;

        if (confusionCount > recentHistory.length * 0.2) {
            suggestions.push('Improve clarity of instructions and feedback');
            suggestions.push('Add visual cues to guide user attention');
        }

        return suggestions;
    }
}

module.exports = EmotionalParser;