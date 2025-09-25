/**
 * Experience Container - Core system for managing living histories
 * 
 * This container doesn't just store events - it captures complete experiences
 * with emotional context, decision rationale, and learning outcomes.
 */

class ExperienceContainer {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.entries = new Map();
        this.relationships = new Map();
        this.emotionalParser = config.emotionalParser;
        this.contextCapture = config.contextCapture;
        this.retentionPolicy = config.retentionPolicy || 'default';
        this.privacyLevel = config.privacyLevel || 'internal';
        
        // Initialize with creation log
        this.logCreation();
    }

    /**
     * Generate a unique identifier for the container
     */
    generateId() {
        return 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Log the creation of this container
     */
    logCreation() {
        const creationEntry = {
            id: this.generateEntryId(),
            timestamp: new Date().toISOString(),
            actionMetadata: {
                action: 'container_creation',
                actor: {
                    type: 'system',
                    identifier: 'living-histories-system',
                    experience_level: 'expert'
                },
                duration: 0,
                attempts: 1
            },
            intentSnapshot: {
                primary_goal: 'Initialize experience container for capturing living histories',
                context: 'System initialization for emotional and contextual logging',
                urgency_level: 'low'
            },
            environmentalContext: this.captureEnvironmentalContext(),
            emotionalCues: {
                emotional_state: 'focused',
                confidence_markers: {
                    level: 'high',
                    indicators: ['deliberate_actions']
                }
            },
            decisionRationale: {
                reasoning: 'Creating new container to begin capturing user experiences',
                alternatives_considered: [],
                confidence_in_decision: 1.0
            },
            outcomeReflection: {
                success_metrics: {
                    goal_achieved: true,
                    efficiency: 1.0,
                    quality: 1.0,
                    user_satisfaction: 1.0
                },
                what_worked: ['Clean initialization process'],
                what_didnt_work: [],
                lessons_learned: [{
                    lesson: 'Container creation should be quick and efficient',
                    applicability: 'general',
                    confidence: 0.9
                }],
                recommendations: ['Maintain simple initialization patterns']
            },
            metadata: {
                version: '1.0.0',
                tags: ['initialization', 'system'],
                privacy_level: this.privacyLevel
            }
        };

        this.entries.set(creationEntry.id, creationEntry);
    }

    /**
     * Generate a unique identifier for log entries
     */
    generateEntryId() {
        return 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Capture current environmental context
     */
    captureEnvironmentalContext() {
        const context = {
            system_state: {
                // In a real implementation, these would be actual measurements
                cpu_usage: Math.random() * 100,
                memory_usage: Math.random() * 100,
                active_processes: Math.floor(Math.random() * 200) + 50
            },
            network_conditions: {
                connection_type: 'wifi',
                latency: Math.random() * 100 + 10,
                bandwidth: Math.random() * 1000 + 100
            },
            external_variables: {
                time_of_day: new Date().toTimeString().split(' ')[0],
                day_of_week: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
                concurrent_users: Math.floor(Math.random() * 50) + 1,
                system_load: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
            }
        };

        // If context capture system is available, use it
        if (this.contextCapture) {
            return this.contextCapture.capture(context);
        }

        return context;
    }

    /**
     * Parse emotional cues from user behavior
     */
    parseEmotionalCues(behaviorData = {}) {
        const cues = {
            frustration_signals: [],
            confidence_markers: {
                level: 'medium',
                indicators: []
            },
            emotional_state: 'focused',
            stress_indicators: []
        };

        // Basic emotional parsing logic
        if (behaviorData.attempts > 3) {
            cues.frustration_signals.push('repeated_attempts');
            cues.emotional_state = 'frustrated';
        }

        if (behaviorData.keystroke_speed > 200) {
            cues.frustration_signals.push('rapid_keystrokes');
        }

        if (behaviorData.backspace_count > 10) {
            cues.frustration_signals.push('backspacing');
        }

        if (behaviorData.help_requests > 0) {
            cues.frustration_signals.push('help_seeking');
        }

        // Confidence indicators
        if (behaviorData.steady_progress) {
            cues.confidence_markers.indicators.push('steady_progress');
            cues.confidence_markers.level = 'high';
        }

        if (behaviorData.quick_decisions) {
            cues.confidence_markers.indicators.push('quick_decision_making');
        }

        // Use emotional parser if available
        if (this.emotionalParser) {
            return this.emotionalParser.parse(behaviorData, cues);
        }

        return cues;
    }

    /**
     * Log a new experience with full contextual information
     */
    logExperience({
        action,
        actor,
        duration = 0,
        attempts = 1,
        primaryGoal,
        secondaryGoals = [],
        context,
        urgencyLevel = 'medium',
        behaviorData = {},
        reasoning,
        alternativesConsidered = [],
        influencingFactors = [],
        decisionConfidence = 0.7,
        goalAchieved = false,
        efficiency = 0.5,
        quality = 0.5,
        userSatisfaction = 0.5,
        whatWorked = [],
        whatDidntWork = [],
        lessonsLearned = [],
        recommendations = [],
        tags = [],
        relationships = {}
    }) {
        const entryId = this.generateEntryId();
        const timestamp = new Date().toISOString();

        const entry = {
            id: entryId,
            timestamp,
            actionMetadata: {
                action,
                actor: {
                    type: actor.type || 'human',
                    identifier: actor.identifier || 'unknown',
                    experience_level: actor.experience_level || 'intermediate'
                },
                duration,
                attempts
            },
            intentSnapshot: {
                primary_goal: primaryGoal,
                secondary_goals: secondaryGoals,
                context,
                urgency_level: urgencyLevel
            },
            environmentalContext: this.captureEnvironmentalContext(),
            emotionalCues: this.parseEmotionalCues(behaviorData),
            decisionRationale: {
                reasoning,
                alternatives_considered: alternativesConsidered,
                influencing_factors: influencingFactors,
                confidence_in_decision: decisionConfidence
            },
            outcomeReflection: {
                success_metrics: {
                    goal_achieved: goalAchieved,
                    efficiency,
                    quality,
                    user_satisfaction: userSatisfaction
                },
                what_worked: whatWorked,
                what_didnt_work: whatDidntWork,
                lessons_learned: lessonsLearned.map(lesson => ({
                    lesson: typeof lesson === 'string' ? lesson : lesson.lesson,
                    applicability: lesson.applicability || 'specific',
                    confidence: lesson.confidence || 0.7
                })),
                recommendations,
                emotional_impact: {
                    immediate: this.assessImmediateEmotionalImpact(goalAchieved, userSatisfaction),
                    long_term: this.assessLongTermEmotionalImpact(lessonsLearned, efficiency)
                }
            },
            relationships: {
                parent_entries: relationships.parent_entries || [],
                related_entries: relationships.related_entries || [],
                subsequent_entries: []
            },
            metadata: {
                version: '1.0.0',
                tags: ['experience', ...tags],
                privacy_level: this.privacyLevel,
                retention_policy: this.retentionPolicy
            }
        };

        // Store the entry
        this.entries.set(entryId, entry);

        // Update relationships
        this.updateRelationships(entryId, relationships);

        return entryId;
    }

    /**
     * Assess immediate emotional impact based on outcome
     */
    assessImmediateEmotionalImpact(goalAchieved, userSatisfaction) {
        if (goalAchieved && userSatisfaction > 0.8) {
            return 'satisfied';
        } else if (goalAchieved && userSatisfaction > 0.6) {
            return 'content';
        } else if (!goalAchieved && userSatisfaction < 0.3) {
            return 'frustrated';
        } else {
            return 'neutral';
        }
    }

    /**
     * Assess long-term emotional impact based on learning
     */
    assessLongTermEmotionalImpact(lessonsLearned, efficiency) {
        if (lessonsLearned.length > 0 && efficiency > 0.7) {
            return 'growth-oriented';
        } else if (lessonsLearned.length > 0) {
            return 'learning-focused';
        } else if (efficiency < 0.3) {
            return 'potentially-discouraged';
        } else {
            return 'stable';
        }
    }

    /**
     * Update relationships between entries
     */
    updateRelationships(entryId, relationships) {
        if (relationships.parent_entries) {
            relationships.parent_entries.forEach(parentId => {
                if (this.entries.has(parentId)) {
                    const parent = this.entries.get(parentId);
                    if (!parent.relationships.subsequent_entries.includes(entryId)) {
                        parent.relationships.subsequent_entries.push(entryId);
                    }
                }
            });
        }

        if (relationships.related_entries) {
            relationships.related_entries.forEach(relatedId => {
                if (!this.relationships.has(relatedId)) {
                    this.relationships.set(relatedId, new Set());
                }
                this.relationships.get(relatedId).add(entryId);
                
                if (!this.relationships.has(entryId)) {
                    this.relationships.set(entryId, new Set());
                }
                this.relationships.get(entryId).add(relatedId);
            });
        }
    }

    /**
     * Retrieve an experience entry by ID
     */
    getExperience(entryId) {
        return this.entries.get(entryId);
    }

    /**
     * Get all experiences with optional filtering
     */
    getExperiences(filter = {}) {
        let experiences = Array.from(this.entries.values());

        if (filter.tags) {
            experiences = experiences.filter(exp => 
                filter.tags.some(tag => exp.metadata.tags.includes(tag))
            );
        }

        if (filter.actor) {
            experiences = experiences.filter(exp => 
                exp.actionMetadata.actor.identifier === filter.actor
            );
        }

        if (filter.dateRange) {
            const { start, end } = filter.dateRange;
            experiences = experiences.filter(exp => {
                const timestamp = new Date(exp.timestamp);
                return timestamp >= start && timestamp <= end;
            });
        }

        if (filter.emotionalState) {
            experiences = experiences.filter(exp => 
                exp.emotionalCues.emotional_state === filter.emotionalState
            );
        }

        return experiences;
    }

    /**
     * Get learning insights from accumulated experiences
     */
    generateInsights() {
        const experiences = Array.from(this.entries.values());
        const insights = {
            total_experiences: experiences.length,
            emotional_patterns: this.analyzeEmotionalPatterns(experiences),
            learning_trends: this.analyzeLearningTrends(experiences),
            efficiency_metrics: this.analyzeEfficiencyMetrics(experiences),
            common_challenges: this.identifyCommonChallenges(experiences),
            success_factors: this.identifySuccessFactors(experiences)
        };

        return insights;
    }

    /**
     * Analyze emotional patterns across experiences
     */
    analyzeEmotionalPatterns(experiences) {
        const emotions = {};
        experiences.forEach(exp => {
            const emotion = exp.emotionalCues.emotional_state;
            emotions[emotion] = (emotions[emotion] || 0) + 1;
        });

        return {
            distribution: emotions,
            most_common: Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b, 'neutral'),
            trend: this.calculateEmotionalTrend(experiences)
        };
    }

    /**
     * Calculate emotional trend over time
     */
    calculateEmotionalTrend(experiences) {
        const emotionalValues = {
            'frustrated': -2,
            'confused': -1,
            'overwhelmed': -2,
            'neutral': 0,
            'focused': 1,
            'curious': 1,
            'excited': 2,
            'satisfied': 2,
            'determined': 1
        };

        const recentExperiences = experiences
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, Math.min(10, experiences.length));

        const avgRecent = recentExperiences.reduce((sum, exp) => 
            sum + (emotionalValues[exp.emotionalCues.emotional_state] || 0), 0
        ) / recentExperiences.length;

        if (avgRecent > 0.5) return 'improving';
        if (avgRecent < -0.5) return 'declining';
        return 'stable';
    }

    /**
     * Analyze learning trends
     */
    analyzeLearningTrends(experiences) {
        const learningData = experiences.map(exp => ({
            timestamp: exp.timestamp,
            lessons_count: exp.outcomeReflection.lessons_learned.length,
            efficiency: exp.outcomeReflection.success_metrics.efficiency
        }));

        return {
            total_lessons: learningData.reduce((sum, data) => sum + data.lessons_count, 0),
            avg_lessons_per_experience: learningData.reduce((sum, data) => sum + data.lessons_count, 0) / learningData.length,
            efficiency_trend: this.calculateEfficiencyTrend(learningData)
        };
    }

    /**
     * Calculate efficiency trend over time
     */
    calculateEfficiencyTrend(learningData) {
        if (learningData.length < 2) return 'insufficient_data';

        const recent = learningData.slice(-5);
        const earlier = learningData.slice(0, -5);

        if (earlier.length === 0) return 'insufficient_data';

        const recentAvg = recent.reduce((sum, data) => sum + data.efficiency, 0) / recent.length;
        const earlierAvg = earlier.reduce((sum, data) => sum + data.efficiency, 0) / earlier.length;

        const improvement = recentAvg - earlierAvg;
        
        if (improvement > 0.1) return 'improving';
        if (improvement < -0.1) return 'declining';
        return 'stable';
    }

    /**
     * Analyze efficiency metrics
     */
    analyzeEfficiencyMetrics(experiences) {
        const metrics = experiences.map(exp => exp.outcomeReflection.success_metrics);
        
        return {
            avg_efficiency: metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length,
            avg_quality: metrics.reduce((sum, m) => sum + m.quality, 0) / metrics.length,
            avg_satisfaction: metrics.reduce((sum, m) => sum + m.user_satisfaction, 0) / metrics.length,
            success_rate: metrics.filter(m => m.goal_achieved).length / metrics.length
        };
    }

    /**
     * Identify common challenges
     */
    identifyCommonChallenges(experiences) {
        const challenges = {};
        experiences.forEach(exp => {
            exp.outcomeReflection.what_didnt_work.forEach(challenge => {
                challenges[challenge] = (challenges[challenge] || 0) + 1;
            });
        });

        return Object.entries(challenges)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([challenge, count]) => ({ challenge, frequency: count }));
    }

    /**
     * Identify success factors
     */
    identifySuccessFactors(experiences) {
        const factors = {};
        experiences
            .filter(exp => exp.outcomeReflection.success_metrics.goal_achieved)
            .forEach(exp => {
                exp.outcomeReflection.what_worked.forEach(factor => {
                    factors[factor] = (factors[factor] || 0) + 1;
                });
            });

        return Object.entries(factors)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([factor, count]) => ({ factor, frequency: count }));
    }

    /**
     * Export container data for analysis or backup
     */
    export() {
        return {
            id: this.id,
            created: this.entries.get(Array.from(this.entries.keys())[0])?.timestamp,
            entries: Array.from(this.entries.values()),
            relationships: Object.fromEntries(
                Array.from(this.relationships.entries()).map(([k, v]) => [k, Array.from(v)])
            ),
            insights: this.generateInsights(),
            metadata: {
                privacy_level: this.privacyLevel,
                retention_policy: this.retentionPolicy,
                export_timestamp: new Date().toISOString()
            }
        };
    }
}

module.exports = ExperienceContainer;