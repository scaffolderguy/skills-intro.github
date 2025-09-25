/**
 * GitHub Skills Integration Example
 * 
 * This example shows how the Living Histories system can be integrated
 * into the GitHub Skills learning experience to capture not just completion
 * events, but the complete learning journey with emotional context.
 */

const ExperienceContainer = require('../containers/experience-container');
const EmotionalParser = require('../parsers/emotional-parser');
const ContextCapture = require('../parsers/context-capture');

class GitHubSkillsLivingLogger {
    constructor() {
        this.emotionalParser = new EmotionalParser({
            sensitivity: 'high',
            learningMode: true
        });
        
        this.contextCapture = new ContextCapture({
            enabledSensors: ['system', 'network', 'temporal', 'user', 'application']
        });
        
        this.experienceContainer = new ExperienceContainer({
            emotionalParser: this.emotionalParser,
            contextCapture: this.contextCapture,
            privacyLevel: 'internal',
            retentionPolicy: 'learning_extended'
        });

        // Start monitoring context for learning insights
        this.contextCapture.startMonitoring();
    }

    /**
     * Log when a learner starts a new step in the GitHub Skills course
     */
    logStepStart(stepData) {
        const behaviorData = this.analyzeLearnerBehavior(stepData);
        
        return this.experienceContainer.logExperience({
            action: `start_step_${stepData.stepNumber}`,
            actor: {
                type: 'human',
                identifier: stepData.learner.username,
                experience_level: stepData.learner.estimatedLevel || 'beginner'
            },
            duration: 0,
            attempts: 1,
            primaryGoal: `Complete GitHub Skills step ${stepData.stepNumber}: ${stepData.stepTitle}`,
            secondaryGoals: [
                'Learn GitHub fundamentals',
                'Build confidence with version control',
                'Understand collaborative development'
            ],
            context: `Learning GitHub basics through interactive tutorial. ${stepData.description}`,
            urgencyLevel: stepData.selfPaced ? 'low' : 'medium',
            behaviorData,
            reasoning: `Starting with step ${stepData.stepNumber} based on sequential learning path`,
            alternativesConsidered: [
                {
                    option: 'Skip to advanced topics',
                    pros: ['Faster completion', 'Focus on complex concepts'],
                    cons: ['Missing foundational knowledge', 'Higher likelihood of confusion'],
                    rejection_reason: 'Structured learning path ensures solid foundation'
                }
            ],
            influencingFactors: [
                'Previous programming experience',
                'Time availability',
                'Learning style preferences'
            ],
            decisionConfidence: 0.8,
            goalAchieved: false, // Just starting
            efficiency: 0.5,
            quality: 0.5,
            userSatisfaction: stepData.initialConfidence || 0.6,
            whatWorked: [],
            whatDidntWork: [],
            lessonsLearned: [],
            recommendations: [],
            tags: ['learning', 'step_start', `step_${stepData.stepNumber}`, 'github_skills'],
            relationships: {
                parent_entries: stepData.previousStepEntryId ? [stepData.previousStepEntryId] : [],
                related_entries: []
            }
        });
    }

    /**
     * Log learner progress and struggles during a step
     */
    logStepProgress(progressData) {
        const behaviorData = this.analyzeLearnerBehavior(progressData);
        
        return this.experienceContainer.logExperience({
            action: `progress_step_${progressData.stepNumber}`,
            actor: {
                type: 'human',
                identifier: progressData.learner.username,
                experience_level: progressData.learner.estimatedLevel || 'beginner'
            },
            duration: progressData.timeSpent,
            attempts: progressData.attempts,
            primaryGoal: `Make progress on step ${progressData.stepNumber}`,
            secondaryGoals: [
                'Understand the concepts being taught',
                'Successfully execute required actions',
                'Build muscle memory for Git commands'
            ],
            context: `${progressData.progressPercentage}% through step. ${progressData.currentActivity}`,
            urgencyLevel: progressData.strugglingIndicators > 2 ? 'high' : 'medium',
            behaviorData,
            reasoning: progressData.approachReasoning || 'Following tutorial instructions step by step',
            alternativesConsidered: progressData.alternativesConsidered || [],
            influencingFactors: [
                'Tutorial clarity',
                'Interface familiarity',
                'Conceptual difficulty',
                'Environmental distractions'
            ],
            decisionConfidence: progressData.confidence || 0.6,
            goalAchieved: false, // Still in progress
            efficiency: this.calculateProgressEfficiency(progressData),
            quality: this.assessUnderstandingQuality(progressData),
            userSatisfaction: progressData.satisfactionIndicators || 0.6,
            whatWorked: progressData.whatWorked || [],
            whatDidntWork: progressData.whatDidntWork || [],
            lessonsLearned: progressData.insights || [],
            recommendations: this.generateProgressRecommendations(progressData),
            tags: ['learning', 'progress', `step_${progressData.stepNumber}`, 'github_skills'],
            relationships: {
                parent_entries: [progressData.stepStartEntryId],
                related_entries: progressData.relatedHelpEntries || []
            }
        });
    }

    /**
     * Log when a learner completes a step
     */
    logStepCompletion(completionData) {
        const behaviorData = this.analyzeLearnerBehavior(completionData);
        
        return this.experienceContainer.logExperience({
            action: `complete_step_${completionData.stepNumber}`,
            actor: {
                type: 'human',
                identifier: completionData.learner.username,
                experience_level: completionData.learner.estimatedLevel || 'beginner'
            },
            duration: completionData.totalTimeSpent,
            attempts: completionData.totalAttempts,
            primaryGoal: `Successfully complete step ${completionData.stepNumber}`,
            secondaryGoals: completionData.secondaryGoalsAchieved || [],
            context: `Completed GitHub Skills step ${completionData.stepNumber}. ${completionData.completionNotes}`,
            urgencyLevel: 'low', // Completion reduces urgency
            behaviorData,
            reasoning: completionData.finalApproach || 'Successfully followed tutorial to completion',
            alternativesConsidered: completionData.alternativesConsidered || [],
            influencingFactors: [
                'Tutorial effectiveness',
                'Personal persistence',
                'Help resources used',
                'Community support'
            ],
            decisionConfidence: completionData.finalConfidence || 0.8,
            goalAchieved: true,
            efficiency: this.calculateCompletionEfficiency(completionData),
            quality: this.assessCompletionQuality(completionData),
            userSatisfaction: completionData.completionSatisfaction || 0.8,
            whatWorked: completionData.successFactors || [],
            whatDidntWork: completionData.challengePoints || [],
            lessonsLearned: completionData.keyLearnings || [],
            recommendations: this.generateCompletionRecommendations(completionData),
            tags: ['learning', 'completion', `step_${completionData.stepNumber}`, 'github_skills', 'success'],
            relationships: {
                parent_entries: completionData.progressEntryIds || [],
                related_entries: completionData.relatedEntries || []
            }
        });
    }

    /**
     * Log when a learner seeks help or gets stuck
     */
    logHelpSeeking(helpData) {
        const behaviorData = this.analyzeLearnerBehavior(helpData);
        
        return this.experienceContainer.logExperience({
            action: 'seek_help',
            actor: {
                type: 'human',
                identifier: helpData.learner.username,
                experience_level: helpData.learner.estimatedLevel || 'beginner'
            },
            duration: helpData.timeBeforeSeekingHelp,
            attempts: helpData.attemptsBeforeHelp,
            primaryGoal: 'Get unstuck and understand how to proceed',
            secondaryGoals: [
                'Learn from the help provided',
                'Avoid similar issues in the future',
                'Maintain learning momentum'
            ],
            context: `Stuck on: ${helpData.stuckPoint}. Help source: ${helpData.helpSource}`,
            urgencyLevel: 'high',
            behaviorData,
            reasoning: `Tried ${helpData.attemptsBeforeHelp} times independently before seeking help`,
            alternativesConsidered: [
                {
                    option: 'Continue trying independently',
                    pros: ['Build problem-solving skills', 'Deeper understanding through struggle'],
                    cons: ['Time consuming', 'Risk of frustration', 'Might develop bad habits'],
                    rejection_reason: 'Reached frustration threshold'
                }
            ],
            influencingFactors: [
                'Frustration level',
                'Time constraints',
                'Help availability',
                'Learning style preferences'
            ],
            decisionConfidence: 0.9, // High confidence in seeking help
            goalAchieved: helpData.helpResolved || false,
            efficiency: helpData.helpResolved ? 0.8 : 0.3,
            quality: helpData.understandingImproved ? 0.8 : 0.4,
            userSatisfaction: helpData.helpSatisfaction || 0.6,
            whatWorked: helpData.effectiveHelpAspects || [],
            whatDidntWork: helpData.confusingAspects || [],
            lessonsLearned: helpData.helpLearnings || [],
            recommendations: this.generateHelpRecommendations(helpData),
            tags: ['learning', 'help_seeking', 'support', `step_${helpData.stepNumber}`, 'github_skills'],
            relationships: {
                parent_entries: helpData.relatedProgressEntries || [],
                related_entries: []
            }
        });
    }

    /**
     * Analyze learner behavior patterns to extract emotional cues
     */
    analyzeLearnerBehavior(data) {
        return {
            userId: data.learner.username,
            attempts: data.attempts || 1,
            keystroke_speed: data.typingSpeed || 0,
            backspace_count: data.corrections || 0,
            total_characters: data.totalInput || 0,
            help_requests: data.helpRequests || 0,
            duration: data.timeSpent || 0,
            error_count: data.errors || 0,
            mouse_movement_erratic: data.cursorPatterns === 'erratic',
            pause_duration_variance: data.pauseVariance || 0,
            progress_linearity: data.progressSmoothness || 0.7,
            average_decision_time: data.decisionTime || 3000,
            unique_actions_explored: data.explorationCount || 1,
            task_completion_rate: data.completionRate || 0.5,
            consistent_workflow: data.workflowConsistent || false,
            advanced_features_used: data.advancedFeatures || 0,
            giving_up_signals: data.abandonmentSigns || false,
            seeking_clarification: data.seekingHelp || false,
            flow_indicators: data.inFlow || false,
            persistence_indicators: data.showingPersistence || false,
            goal_achieved: data.goalAchieved || false,
            feedback: data.selfReportedEmotion // For learning mode
        };
    }

    /**
     * Calculate efficiency of progress
     */
    calculateProgressEfficiency(progressData) {
        const expectedTime = progressData.expectedTimeForProgress || 300000; // 5 minutes default
        const actualTime = progressData.timeSpent;
        const efficiency = Math.max(0.1, Math.min(1.0, expectedTime / actualTime));
        return efficiency;
    }

    /**
     * Assess quality of understanding
     */
    assessUnderstandingQuality(progressData) {
        let quality = 0.5;
        
        if (progressData.conceptualQuestions > 0) quality += 0.2;
        if (progressData.connecting_concepts) quality += 0.2;
        if (progressData.errors < 2) quality += 0.1;
        if (progressData.explaining_to_others) quality += 0.2;
        
        return Math.min(1.0, quality);
    }

    /**
     * Calculate completion efficiency
     */
    calculateCompletionEfficiency(completionData) {
        const expectedTime = completionData.expectedCompletionTime || 1800000; // 30 minutes
        const actualTime = completionData.totalTimeSpent;
        const baseEfficiency = Math.max(0.1, Math.min(1.0, expectedTime / actualTime));
        
        // Adjust for quality - high quality learning can justify longer time
        const qualityAdjustment = completionData.understandingDepth > 0.8 ? 0.1 : 0;
        
        return Math.min(1.0, baseEfficiency + qualityAdjustment);
    }

    /**
     * Assess completion quality
     */
    assessCompletionQuality(completionData) {
        let quality = 0.6; // Base quality for completion
        
        if (completionData.canExplainConcepts) quality += 0.2;
        if (completionData.appliedLearning) quality += 0.1;
        if (completionData.helpedOthers) quality += 0.1;
        if (completionData.connectedToPriorKnowledge) quality += 0.1;
        
        return Math.min(1.0, quality);
    }

    /**
     * Generate progress-specific recommendations
     */
    generateProgressRecommendations(progressData) {
        const recommendations = [];
        
        if (progressData.strugglingIndicators > 2) {
            recommendations.push('Consider breaking down the current task into smaller steps');
            recommendations.push('Review the prerequisite concepts before continuing');
        }
        
        if (progressData.timeSpent > progressData.expectedTimeForProgress * 2) {
            recommendations.push('Take a short break to avoid cognitive overload');
            recommendations.push('Seek help if stuck for more than 15 minutes');
        }
        
        if (progressData.errors > 3) {
            recommendations.push('Slow down and double-check each step');
            recommendations.push('Review common mistakes section in documentation');
        }
        
        return recommendations;
    }

    /**
     * Generate completion-specific recommendations
     */
    generateCompletionRecommendations(completionData) {
        const recommendations = [];
        
        if (completionData.completionSatisfaction > 0.8) {
            recommendations.push('Consider helping other learners who might be struggling');
            recommendations.push('Explore additional advanced topics related to this step');
        }
        
        if (completionData.totalAttempts > 5) {
            recommendations.push('Review the challenging parts to reinforce learning');
            recommendations.push('Practice similar tasks to build confidence');
        }
        
        recommendations.push('Reflect on key learnings before moving to the next step');
        
        return recommendations;
    }

    /**
     * Generate help-seeking specific recommendations
     */
    generateHelpRecommendations(helpData) {
        const recommendations = [];
        
        if (helpData.helpResolved) {
            recommendations.push('Practice the solution to reinforce understanding');
            recommendations.push('Document this solution for future reference');
        } else {
            recommendations.push('Try a different help source or approach');
            recommendations.push('Break down the problem into smaller parts');
        }
        
        recommendations.push('Share your learning with others to solidify understanding');
        
        return recommendations;
    }

    /**
     * Generate learning journey insights
     */
    generateLearningInsights(learnerUsername) {
        const learnerExperiences = this.experienceContainer.getExperiences({
            actor: learnerUsername
        });

        const insights = this.experienceContainer.generateInsights();
        
        return {
            ...insights,
            learning_specific: {
                steps_completed: learnerExperiences.filter(exp => 
                    exp.actionMetadata.action.startsWith('complete_step')
                ).length,
                help_seeking_patterns: this.analyzeHelpSeekingPatterns(learnerExperiences),
                learning_efficiency_trend: this.analyzeLearningEfficiency(learnerExperiences),
                conceptual_growth: this.analyzeConceptualGrowth(learnerExperiences),
                emotional_learning_journey: this.analyzeEmotionalJourney(learnerExperiences)
            }
        };
    }

    /**
     * Analyze help-seeking patterns
     */
    analyzeHelpSeekingPatterns(experiences) {
        const helpEntries = experiences.filter(exp => exp.actionMetadata.action === 'seek_help');
        
        if (helpEntries.length === 0) {
            return {
                frequency: 0,
                average_time_before_help: 0,
                most_common_stuck_points: [],
                help_effectiveness: 0
            };
        }
        
        return {
            frequency: helpEntries.length,
            average_time_before_help: helpEntries.reduce((sum, entry) => 
                sum + entry.actionMetadata.duration, 0) / helpEntries.length,
            most_common_stuck_points: this.identifyCommonStuckPoints(helpEntries),
            help_effectiveness: helpEntries.filter(entry => 
                entry.outcomeReflection.success_metrics.goal_achieved
            ).length / helpEntries.length
        };
    }

    /**
     * Identify common points where learners get stuck
     */
    identifyCommonStuckPoints(helpEntries) {
        const stuckPoints = {};
        helpEntries.forEach(entry => {
            const context = entry.intentSnapshot.context;
            if (context) {
                // Extract key phrases that indicate stuck points
                const stuckPoint = this.extractStuckPoint(context);
                if (stuckPoint) {
                    stuckPoints[stuckPoint] = (stuckPoints[stuckPoint] || 0) + 1;
                }
            }
        });

        return Object.entries(stuckPoints)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([point, count]) => ({ stuck_point: point, frequency: count }));
    }

    /**
     * Extract stuck point from context string
     */
    extractStuckPoint(context) {
        // Simple pattern matching for common stuck points
        const patterns = [
            { pattern: /git.*command.*syntax/i, point: 'Git command syntax' },
            { pattern: /branch.*naming/i, point: 'Branch naming conventions' },
            { pattern: /merge.*conflict/i, point: 'Merge conflicts' },
            { pattern: /commit.*message/i, point: 'Commit messages' },
            { pattern: /pull.*request/i, point: 'Pull request process' },
            { pattern: /remote.*origin/i, point: 'Remote repository setup' }
        ];

        for (const { pattern, point } of patterns) {
            if (pattern.test(context)) {
                return point;
            }
        }

        // If no pattern matches, return a generic description
        if (context.length > 0) {
            return context.substring(0, 50) + (context.length > 50 ? '...' : '');
        }

        return 'Unknown issue';
    }

    /**
     * Analyze learning efficiency over time
     */
    analyzeLearningEfficiency(experiences) {
        const completionEntries = experiences
            .filter(exp => exp.actionMetadata.action.startsWith('complete_step'))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (completionEntries.length < 2) return 'insufficient_data';

        const earlyEfficiency = completionEntries.slice(0, 3)
            .reduce((sum, entry) => sum + entry.outcomeReflection.success_metrics.efficiency, 0) / 3;
        
        const recentEfficiency = completionEntries.slice(-3)
            .reduce((sum, entry) => sum + entry.outcomeReflection.success_metrics.efficiency, 0) / 3;

        const improvement = recentEfficiency - earlyEfficiency;
        
        return {
            trend: improvement > 0.1 ? 'improving' : improvement < -0.1 ? 'declining' : 'stable',
            improvement_rate: improvement,
            current_efficiency: recentEfficiency
        };
    }

    /**
     * Analyze conceptual growth
     */
    analyzeConceptualGrowth(experiences) {
        const learnings = [];
        experiences.forEach(exp => {
            exp.outcomeReflection.lessons_learned.forEach(lesson => {
                learnings.push({
                    lesson: lesson.lesson,
                    timestamp: exp.timestamp,
                    applicability: lesson.applicability,
                    confidence: lesson.confidence
                });
            });
        });

        return {
            total_lessons: learnings.length,
            conceptual_connections: learnings.filter(l => l.applicability === 'general').length,
            recent_insights: learnings.slice(-5),
            learning_acceleration: this.calculateLearningAcceleration(learnings)
        };
    }

    /**
     * Analyze emotional journey through learning
     */
    analyzeEmotionalJourney(experiences) {
        const emotionalTimeline = experiences.map(exp => ({
            timestamp: exp.timestamp,
            emotional_state: exp.emotionalCues.emotional_state,
            confidence_level: exp.emotionalCues.confidence_markers.level,
            frustration_signals: exp.emotionalCues.frustration_signals.length
        }));

        return {
            emotional_timeline: emotionalTimeline,
            growth_moments: this.identifyGrowthMoments(emotionalTimeline),
            resilience_indicators: this.assessResilience(emotionalTimeline),
            confidence_progression: this.analyzeConfidenceProgression(emotionalTimeline)
        };
    }

    /**
     * Export learner's complete living history
     */
    exportLearnerHistory(learnerUsername) {
        const learnerExperiences = this.experienceContainer.getExperiences({
            actor: learnerUsername
        });

        return {
            learner: learnerUsername,
            total_experiences: learnerExperiences.length,
            learning_period: {
                start: learnerExperiences[0]?.timestamp,
                end: learnerExperiences[learnerExperiences.length - 1]?.timestamp
            },
            experiences: learnerExperiences,
            insights: this.generateLearningInsights(learnerUsername),
            emotional_narrative: this.generateEmotionalNarrative(learnerExperiences),
            export_timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate an emotional narrative of the learning journey
     */
    generateEmotionalNarrative(experiences) {
        const narrative = [];
        
        experiences.forEach((exp, index) => {
            const emotion = exp.emotionalCues.emotional_state;
            const confidence = exp.emotionalCues.confidence_markers.level;
            const action = exp.actionMetadata.action;
            
            let narrativeEntry = '';
            
            if (action.startsWith('start_step')) {
                narrativeEntry = `Began with ${emotion} energy and ${confidence} confidence`;
            } else if (action.startsWith('progress_step')) {
                narrativeEntry = `Progressing with ${emotion} determination, confidence ${confidence}`;
            } else if (action.startsWith('complete_step')) {
                narrativeEntry = `Completed feeling ${emotion} with ${confidence} confidence`;
            } else if (action === 'seek_help') {
                narrativeEntry = `Sought help while feeling ${emotion}`;
            }
            
            if (exp.outcomeReflection.lessons_learned.length > 0) {
                narrativeEntry += ` - gained ${exp.outcomeReflection.lessons_learned.length} new insights`;
            }
            
            narrative.push({
                timestamp: exp.timestamp,
                step: index + 1,
                narrative: narrativeEntry,
                emotional_state: emotion,
                confidence_level: confidence,
                key_learnings: exp.outcomeReflection.lessons_learned.map(l => l.lesson)
            });
        });
        
        return narrative;
    }

    /**
     * Calculate learning acceleration based on lessons learned over time
     */
    calculateLearningAcceleration(learnings) {
        if (learnings.length < 5) return 'insufficient_data';

        const timeWindows = [];
        const windowSize = Math.max(3, Math.floor(learnings.length / 3));
        
        for (let i = 0; i < learnings.length; i += windowSize) {
            const window = learnings.slice(i, i + windowSize);
            if (window.length >= 2) {
                timeWindows.push({
                    start: new Date(window[0].timestamp),
                    end: new Date(window[window.length - 1].timestamp),
                    count: window.length,
                    quality: window.reduce((sum, l) => sum + l.confidence, 0) / window.length
                });
            }
        }

        if (timeWindows.length < 2) return 'insufficient_data';

        const early = timeWindows[0];
        const recent = timeWindows[timeWindows.length - 1];

        const earlyRate = early.count / ((early.end - early.start) / (1000 * 60 * 60)); // per hour
        const recentRate = recent.count / ((recent.end - recent.start) / (1000 * 60 * 60)); // per hour

        const acceleration = recentRate - earlyRate;

        if (acceleration > 0.1) return 'accelerating';
        if (acceleration < -0.1) return 'decelerating';
        return 'steady';
    }

    /**
     * Identify growth moments in emotional timeline
     */
    identifyGrowthMoments(emotionalTimeline) {
        const growthMoments = [];
        
        for (let i = 1; i < emotionalTimeline.length; i++) {
            const prev = emotionalTimeline[i - 1];
            const curr = emotionalTimeline[i];
            
            // Look for confidence improvements
            const confidenceImprovement = this.compareConfidenceLevels(prev.confidence_level, curr.confidence_level);
            
            // Look for emotional state improvements
            const emotionalImprovement = this.compareEmotionalStates(prev.emotional_state, curr.emotional_state);
            
            if (confidenceImprovement > 0 || emotionalImprovement > 0) {
                growthMoments.push({
                    timestamp: curr.timestamp,
                    type: confidenceImprovement > 0 ? 'confidence_boost' : 'emotional_improvement',
                    description: `Moved from ${prev.emotional_state} (${prev.confidence_level}) to ${curr.emotional_state} (${curr.confidence_level})`,
                    improvement_score: Math.max(confidenceImprovement, emotionalImprovement)
                });
            }
        }
        
        return growthMoments;
    }

    /**
     * Compare confidence levels numerically
     */
    compareConfidenceLevels(prev, curr) {
        const levels = { 'very_low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very_high': 5 };
        return (levels[curr] || 3) - (levels[prev] || 3);
    }

    /**
     * Compare emotional states for improvement
     */
    compareEmotionalStates(prev, curr) {
        const positiveStates = { 'satisfied': 5, 'excited': 4, 'focused': 3, 'curious': 3, 'determined': 3 };
        const negativeStates = { 'frustrated': -2, 'confused': -1, 'overwhelmed': -3 };
        
        const prevScore = positiveStates[prev] || negativeStates[prev] || 0;
        const currScore = positiveStates[curr] || negativeStates[curr] || 0;
        
        return currScore - prevScore;
    }

    /**
     * Assess resilience based on emotional recovery patterns
     */
    assessResilience(emotionalTimeline) {
        let recoveryInstances = 0;
        let totalRecoveryTime = 0;
        
        for (let i = 2; i < emotionalTimeline.length; i++) {
            const prev2 = emotionalTimeline[i - 2];
            const prev1 = emotionalTimeline[i - 1];
            const curr = emotionalTimeline[i];
            
            // Look for pattern: negative -> negative -> positive
            if (this.isNegativeState(prev2.emotional_state) && 
                this.isNegativeState(prev1.emotional_state) && 
                this.isPositiveState(curr.emotional_state)) {
                
                recoveryInstances++;
                const recoveryTime = new Date(curr.timestamp) - new Date(prev2.timestamp);
                totalRecoveryTime += recoveryTime;
            }
        }
        
        if (recoveryInstances === 0) {
            return { level: 'unknown', average_recovery_time: 0, recovery_instances: 0 };
        }
        
        const avgRecoveryTime = totalRecoveryTime / recoveryInstances;
        const resilienceLevel = avgRecoveryTime < 300000 ? 'high' : // < 5 minutes
                              avgRecoveryTime < 900000 ? 'medium' : // < 15 minutes
                              'low';
        
        return {
            level: resilienceLevel,
            average_recovery_time: avgRecoveryTime,
            recovery_instances: recoveryInstances
        };
    }

    /**
     * Check if emotional state is negative
     */
    isNegativeState(state) {
        return ['frustrated', 'confused', 'overwhelmed'].includes(state);
    }

    /**
     * Check if emotional state is positive
     */
    isPositiveState(state) {
        return ['satisfied', 'excited', 'focused', 'curious', 'determined'].includes(state);
    }

    /**
     * Analyze confidence progression over time
     */
    analyzeConfidenceProgression(emotionalTimeline) {
        if (emotionalTimeline.length < 2) {
            return { trend: 'insufficient_data', progression_rate: 0, milestones: [] };
        }
        
        const confidenceScores = emotionalTimeline.map(entry => 
            this.mapConfidenceToScore(entry.confidence_level)
        );
        
        const startConfidence = confidenceScores[0];
        const endConfidence = confidenceScores[confidenceScores.length - 1];
        
        const overallChange = endConfidence - startConfidence;
        const trend = overallChange > 0.5 ? 'strong_growth' :
                     overallChange > 0 ? 'gradual_growth' :
                     overallChange < -0.5 ? 'declining' : 'stable';
        
        const milestones = [];
        let previousHigh = 0;
        
        confidenceScores.forEach((score, index) => {
            if (score > previousHigh && score >= 0.8) {
                milestones.push({
                    timestamp: emotionalTimeline[index].timestamp,
                    confidence_level: emotionalTimeline[index].confidence_level,
                    score: score,
                    milestone_type: 'confidence_breakthrough'
                });
                previousHigh = score;
            }
        });
        
        return {
            trend,
            progression_rate: overallChange / emotionalTimeline.length,
            starting_confidence: startConfidence,
            ending_confidence: endConfidence,
            milestones
        };
    }

    /**
     * Map confidence level to numerical score
     */
    mapConfidenceToScore(level) {
        const mapping = {
            'very_low': 0.1,
            'low': 0.3,
            'medium': 0.5,
            'high': 0.7,
            'very_high': 0.9
        };
        return mapping[level] || 0.5;
    }
}

// Example usage:
function demonstrateGitHubSkillsIntegration() {
    const logger = new GitHubSkillsLivingLogger();
    
    // Simulate a learner starting Step 1
    const stepStartId = logger.logStepStart({
        stepNumber: 1,
        stepTitle: "Create a branch",
        description: "Learn how to create a new branch in your repository",
        learner: {
            username: "new_developer_123",
            estimatedLevel: "beginner"
        },
        selfPaced: true,
        initialConfidence: 0.4
    });
    
    // Simulate progress with some struggles
    const progressId = logger.logStepProgress({
        stepNumber: 1,
        learner: {
            username: "new_developer_123",
            estimatedLevel: "beginner"
        },
        timeSpent: 25000, // 25 seconds
        attempts: 3,
        progressPercentage: 60,
        currentActivity: "Trying to understand git branch command syntax",
        strugglingIndicators: 2,
        confidence: 0.5,
        stepStartEntryId: stepStartId,
        whatWorked: ["Reading documentation helped clarify concepts"],
        whatDidntWork: ["Command syntax was confusing initially"],
        insights: ["Git commands have consistent patterns once you understand them"]
    });
    
    // Simulate successful completion
    const completionId = logger.logStepCompletion({
        stepNumber: 1,
        learner: {
            username: "new_developer_123",
            estimatedLevel: "beginner"
        },
        totalTimeSpent: 180000, // 3 minutes
        totalAttempts: 4,
        completionSatisfaction: 0.85,
        finalConfidence: 0.8,
        successFactors: ["Step-by-step instructions", "Visual feedback", "Clear examples"],
        keyLearnings: [
            "Branch names should be descriptive",
            "Git branch creates and switches in one command with -b flag",
            "Always check which branch you're on before making changes"
        ],
        progressEntryIds: [progressId],
        canExplainConcepts: true,
        understandingDepth: 0.7
    });
    
    // Generate insights
    const insights = logger.generateLearningInsights("new_developer_123");
    console.log("Learning Insights:", JSON.stringify(insights, null, 2));
    
    // Export complete history
    const history = logger.exportLearnerHistory("new_developer_123");
    console.log("Complete Learning History:", JSON.stringify(history, null, 2));
}

module.exports = { GitHubSkillsLivingLogger, demonstrateGitHubSkillsIntegration };