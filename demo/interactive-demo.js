#!/usr/bin/env node

/**
 * Interactive Demo of Living Histories System
 * 
 * This demo shows how the Living Histories system captures rich experiential
 * data during a GitHub Skills learning journey.
 */

const { GitHubSkillsLivingLogger } = require('../living-histories/examples/github-skills-integration');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runInteractiveDemo() {
    console.log('🎭 Living Histories Interactive Demo');
    console.log('=====================================\n');
    
    console.log('👋 Welcome to the Living Histories system demonstration!');
    console.log('This demo simulates a learner\'s journey through GitHub Skills,');
    console.log('showing how we capture not just events, but complete experiences.\n');
    
    // Initialize the system
    console.log('🏗️  Initializing Living Histories system...');
    const logger = new GitHubSkillsLivingLogger();
    await delay(1000);
    console.log('✅ System initialized with emotional parsing and context capture\n');
    
    // Simulate a learning journey
    console.log('📚 Simulating Learning Journey: "Introduction to GitHub"\n');
    
    // Step 1: Starting with confidence but some uncertainty
    console.log('🌟 Step 1: Create a Branch');
    console.log('   Learner: new_developer_sarah (beginner level)');
    console.log('   Initial state: Curious but slightly uncertain\n');
    
    const step1StartId = logger.logStepStart({
        stepNumber: 1,
        stepTitle: "Create a branch",
        description: "Learn how to create a new branch in your repository",
        learner: {
            username: "new_developer_sarah",
            estimatedLevel: "beginner"
        },
        selfPaced: true,
        initialConfidence: 0.6
    });
    
    await delay(2000);
    console.log('📝 Logged: Step start with contextual data and emotional baseline');
    
    // Simulate some struggle and progress
    console.log('\n🔄 Progress: Encountering some challenges...');
    console.log('   - Attempting git branch command');
    console.log('   - Confusion about branch naming conventions');
    console.log('   - Looking up documentation\n');
    
    const progressId = logger.logStepProgress({
        stepNumber: 1,
        learner: {
            username: "new_developer_sarah",
            estimatedLevel: "beginner"
        },
        timeSpent: 180000, // 3 minutes
        attempts: 3,
        progressPercentage: 40,
        currentActivity: "Trying to understand git branch command syntax",
        strugglingIndicators: 2,
        confidence: 0.4, // Confidence dropped
        stepStartEntryId: step1StartId,
        whatWorked: ["Documentation was helpful"],
        whatDidntWork: ["Command syntax was confusing initially", "Unclear about naming conventions"],
        insights: [
            {
                lesson: "Git commands follow consistent patterns",
                applicability: "general",
                confidence: 0.7
            }
        ],
        // Behavioral data for emotional analysis
        typingSpeed: 45, // Slower typing indicates hesitation
        corrections: 8, // Several corrections made
        helpRequests: 1, // Looked up help once
        pauseVariance: 3000, // Irregular pauses indicate thinking/confusion
        errorCount: 2
    });
    
    await delay(1500);
    console.log('📊 Logged: Progress with emotional cues showing mild frustration but persistence');
    
    // Help seeking moment
    console.log('\n🆘 Seeking Help: Student reaches out for clarification');
    console.log('   - Used GitHub documentation');
    console.log('   - Found clear examples');
    console.log('   - Understanding improved\n');
    
    const helpId = logger.logHelpSeeking({
        stepNumber: 1,
        learner: {
            username: "new_developer_sarah",
            estimatedLevel: "beginner"
        },
        timeBeforeSeekingHelp: 120000, // 2 minutes of struggle
        attemptsBeforeHelp: 3,
        stuckPoint: "Understanding git branch -b flag and naming conventions",
        helpSource: "GitHub documentation and examples",
        helpResolved: true,
        understandingImproved: true,
        helpSatisfaction: 0.85,
        effectiveHelpAspects: [
            "Clear visual examples",
            "Step-by-step breakdown",
            "Explanation of naming conventions"
        ],
        helpLearnings: [
            {
                lesson: "The -b flag creates and switches to new branch in one command",
                applicability: "specific",
                confidence: 0.9
            },
            {
                lesson: "Branch names should be descriptive and follow team conventions",
                applicability: "general", 
                confidence: 0.8
            }
        ],
        relatedProgressEntries: [progressId]
    });
    
    await delay(1500);
    console.log('💡 Logged: Help-seeking with resolution and learning insights');
    
    // Successful completion
    console.log('\n🎉 Success: Completing the step with newfound confidence');
    console.log('   - Successfully created feature branch');
    console.log('   - Understanding of git branching improved');
    console.log('   - Confidence restored and growing\n');
    
    const completionId = logger.logStepCompletion({
        stepNumber: 1,
        learner: {
            username: "new_developer_sarah",
            estimatedLevel: "beginner"
        },
        totalTimeSpent: 420000, // 7 minutes total
        totalAttempts: 5,
        completionSatisfaction: 0.9,
        finalConfidence: 0.85, // Much higher than initial
        successFactors: [
            "Clear documentation and examples",
            "Step-by-step instructions",
            "Visual feedback from command line",
            "Helpful error messages"
        ],
        challengePoints: [
            "Initial confusion about command syntax",
            "Uncertainty about naming conventions",
            "Took time to understand the -b flag"
        ],
        keyLearnings: [
            {
                lesson: "Git branch -b creates and switches to new branch efficiently",
                applicability: "specific",
                confidence: 0.95
            },
            {
                lesson: "Good branch names improve project organization and collaboration",
                applicability: "general",
                confidence: 0.85
            },
            {
                lesson: "When stuck, documentation and examples are valuable resources",
                applicability: "universal",
                confidence: 0.9
            }
        ],
        progressEntryIds: [progressId],
        relatedEntries: [helpId],
        canExplainConcepts: true,
        appliedLearning: true,
        understandingDepth: 0.8,
        // Behavioral indicators of success
        workflowConsistent: true,
        completionRate: 1.0,
        showingPersistence: true
    });
    
    await delay(1500);
    console.log('🏆 Logged: Successful completion with comprehensive reflection and learning capture');
    
    // Generate insights
    console.log('\n🧠 Generating Learning Insights...');
    await delay(2000);
    
    const insights = logger.generateLearningInsights("new_developer_sarah");
    
    console.log('\n📈 Learning Analytics Results:');
    console.log('================================');
    console.log(`📊 Total Experiences Captured: ${insights.total_experiences}`);
    console.log(`🎯 Steps Completed: ${insights.learning_specific.steps_completed}`);
    console.log(`💭 Most Common Emotional State: ${insights.emotional_patterns.most_common}`);
    console.log(`📈 Emotional Trend: ${insights.emotional_patterns.trend}`);
    console.log(`🎓 Total Lessons Learned: ${insights.learning_specific.total_lessons}`);
    console.log(`⚡ Learning Efficiency Trend: ${insights.learning_specific.learning_efficiency_trend.trend}`);
    
    if (insights.common_challenges && insights.common_challenges.length > 0) {
        console.log('\n🎯 Common Challenges Identified:');
        insights.common_challenges.forEach((challenge, index) => {
            console.log(`   ${index + 1}. ${challenge.challenge} (occurred ${challenge.frequency} times)`);
        });
    }
    
    if (insights.success_factors && insights.success_factors.length > 0) {
        console.log('\n🌟 Success Factors Identified:');
        insights.success_factors.forEach((factor, index) => {
            console.log(`   ${index + 1}. ${factor.factor} (contributed to ${factor.frequency} successes)`);
        });
    }
    
    // Show emotional journey
    console.log('\n💝 Emotional Learning Journey:');
    console.log('==============================');
    const emotionalJourney = insights.learning_specific.emotional_learning_journey;
    if (emotionalJourney && emotionalJourney.emotional_timeline) {
        emotionalJourney.emotional_timeline.forEach((entry, index) => {
            const time = new Date(entry.timestamp).toLocaleTimeString();
            console.log(`   ${index + 1}. [${time}] ${entry.emotional_state} (confidence: ${entry.confidence_level})`);
        });
    }
    
    // Export complete history
    console.log('\n📦 Exporting Complete Learning History...');
    await delay(1500);
    
    const history = logger.exportLearnerHistory("new_developer_sarah");
    
    console.log('\n📜 Living History Narrative:');
    console.log('============================');
    if (history.emotional_narrative && history.emotional_narrative.length > 0) {
        history.emotional_narrative.forEach(entry => {
            console.log(`🕐 Step ${entry.step}: ${entry.narrative}`);
            if (entry.key_learnings && entry.key_learnings.length > 0) {
                entry.key_learnings.forEach(learning => {
                    console.log(`   💡 "${learning}"`);
                });
            }
        });
    }
    
    console.log('\n🎯 Key System Capabilities Demonstrated:');
    console.log('=========================================');
    console.log('✅ Emotional state detection and tracking');
    console.log('✅ Contextual data capture (system, network, temporal)');
    console.log('✅ Intent and goal tracking');
    console.log('✅ Decision rationale recording');
    console.log('✅ Learning outcome assessment');
    console.log('✅ Pattern recognition and insights');
    console.log('✅ Personalized recommendations');
    console.log('✅ Comprehensive experience export');
    
    console.log('\n🌟 What Makes This Special:');
    console.log('===========================');
    console.log('🧠 Captures WHY decisions were made, not just WHAT happened');
    console.log('💭 Records emotional context and personal growth');
    console.log('🎯 Tracks learning effectiveness and identifies improvement areas');
    console.log('🔮 Enables predictive insights for better learning experiences');
    console.log('📚 Creates rich institutional memory that grows smarter over time');
    
    console.log('\n🚀 This is Living History - memory that understands, learns, and grows!');
    console.log('\n✨ Demo completed successfully! The system captured a complete');
    console.log('   learning journey with emotional depth and contextual richness.');
    
    // Show sample data structure
    console.log('\n📋 Sample Log Entry Structure (truncated):');
    console.log('==========================================');
    const sampleEntry = logger.experienceContainer.getExperience(completionId);
    if (sampleEntry) {
        console.log(JSON.stringify({
            id: sampleEntry.id,
            timestamp: sampleEntry.timestamp,
            action: sampleEntry.actionMetadata.action,
            emotional_state: sampleEntry.emotionalCues.emotional_state,
            confidence_level: sampleEntry.emotionalCues.confidence_markers.level,
            primary_goal: sampleEntry.intentSnapshot.primary_goal,
            lessons_learned_count: sampleEntry.outcomeReflection.lessons_learned.length,
            success_achieved: sampleEntry.outcomeReflection.success_metrics.goal_achieved,
            recommendations_count: sampleEntry.outcomeReflection.recommendations.length
        }, null, 2));
    }
    
    console.log('\n🎉 Thank you for exploring Living Histories!');
    console.log('💡 This system transforms simple logging into rich experiential memory.');
}

// Run the demo
if (require.main === module) {
    runInteractiveDemo().catch(error => {
        console.error('💥 Demo error:', error);
        process.exit(1);
    });
}

module.exports = { runInteractiveDemo };