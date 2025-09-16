/**
 * Basic functionality tests for Living Histories system
 */

const ExperienceContainer = require('../living-histories/containers/experience-container');
const EmotionalParser = require('../living-histories/parsers/emotional-parser');
const ContextCapture = require('../living-histories/parsers/context-capture');

function runBasicTests() {
    console.log('🧪 Running Living Histories Basic Tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    function test(name, testFn) {
        try {
            testFn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.log(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }
    
    // Test 1: Container Creation
    test('Container Creation', () => {
        const container = new ExperienceContainer();
        if (!container.id || !container.entries) {
            throw new Error('Container not properly initialized');
        }
        if (container.entries.size === 0) {
            throw new Error('Container should have creation log entry');
        }
    });
    
    // Test 2: Experience Logging
    test('Experience Logging', () => {
        const container = new ExperienceContainer();
        const entryId = container.logExperience({
            action: 'test_action',
            actor: {
                type: 'human',
                identifier: 'test_user'
            },
            primaryGoal: 'Test the logging system',
            context: 'Running unit tests',
            reasoning: 'Testing basic functionality',
            goalAchieved: true,
            efficiency: 0.8,
            quality: 0.9,
            userSatisfaction: 0.85
        });
        
        if (!entryId) {
            throw new Error('Experience logging should return entry ID');
        }
        
        const entry = container.getExperience(entryId);
        if (!entry || entry.actionMetadata.action !== 'test_action') {
            throw new Error('Logged experience not retrievable or incorrect');
        }
    });
    
    // Test 3: Emotional Parser
    test('Emotional Parser', () => {
        const parser = new EmotionalParser();
        const behaviorData = {
            attempts: 3,
            keystroke_speed: 150,
            help_requests: 1
        };
        
        const emotions = parser.parse(behaviorData);
        if (!emotions.emotional_state || !emotions.confidence_markers) {
            throw new Error('Emotional parser should return emotional state and confidence markers');
        }
    });
    
    // Test 4: Context Capture
    test('Context Capture', () => {
        const contextCapture = new ContextCapture();
        const context = contextCapture.capture();
        
        if (!context.timestamp || !context.system || !context.network) {
            throw new Error('Context capture should include timestamp, system, and network data');
        }
    });
    
    // Test 5: Insights Generation
    test('Insights Generation', () => {
        const container = new ExperienceContainer();
        
        // Add a few test experiences
        for (let i = 0; i < 3; i++) {
            container.logExperience({
                action: `test_action_${i}`,
                actor: {
                    type: 'human',
                    identifier: 'test_user'
                },
                primaryGoal: `Test goal ${i}`,
                context: 'Testing insights',
                reasoning: 'Test reasoning',
                goalAchieved: i % 2 === 0, // Alternate success/failure
                efficiency: 0.7 + i * 0.1,
                quality: 0.8,
                userSatisfaction: 0.75,
                behaviorData: {
                    attempts: i + 1,
                    emotional_state: ['focused', 'frustrated', 'satisfied'][i]
                }
            });
        }
        
        const insights = container.generateInsights();
        if (!insights.total_experiences || !insights.emotional_patterns) {
            throw new Error('Insights should include experience count and emotional patterns');
        }
        
        if (insights.total_experiences < 4) { // 3 test + 1 creation
            throw new Error(`Expected at least 4 experiences, got ${insights.total_experiences}`);
        }
    });
    
    // Test 6: Schema Validation (basic)
    test('Schema Structure Validation', () => {
        const container = new ExperienceContainer();
        const entryId = container.logExperience({
            action: 'schema_test',
            actor: {
                type: 'human',
                identifier: 'test_user'
            },
            primaryGoal: 'Test schema compliance',
            context: 'Schema validation test',
            reasoning: 'Ensure all required fields are present',
            goalAchieved: true,
            efficiency: 0.8,
            quality: 0.9,
            userSatisfaction: 0.85
        });
        
        const entry = container.getExperience(entryId);
        
        // Check required top-level fields
        const requiredFields = [
            'id', 'timestamp', 'actionMetadata', 'intentSnapshot',
            'environmentalContext', 'emotionalCues', 'decisionRationale',
            'outcomeReflection'
        ];
        
        for (const field of requiredFields) {
            if (!entry[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        // Check nested required fields
        if (!entry.actionMetadata.action || !entry.actionMetadata.actor) {
            throw new Error('Missing required actionMetadata fields');
        }
        
        if (!entry.intentSnapshot.primary_goal) {
            throw new Error('Missing required intentSnapshot.primary_goal');
        }
        
        if (!entry.outcomeReflection.success_metrics) {
            throw new Error('Missing required outcomeReflection.success_metrics');
        }
    });
    
    // Test 7: Experience Filtering
    test('Experience Filtering', () => {
        const container = new ExperienceContainer();
        
        // Add experiences with different tags
        container.logExperience({
            action: 'tagged_action_1',
            actor: { type: 'human', identifier: 'user1' },
            primaryGoal: 'Test filtering',
            context: 'Filter test',
            reasoning: 'Testing tag filtering',
            goalAchieved: true,
            efficiency: 0.8,
            quality: 0.9,
            userSatisfaction: 0.85,
            tags: ['test', 'filtering']
        });
        
        container.logExperience({
            action: 'tagged_action_2',
            actor: { type: 'human', identifier: 'user2' },
            primaryGoal: 'Test filtering 2',
            context: 'Filter test 2',
            reasoning: 'Testing actor filtering',
            goalAchieved: true,
            efficiency: 0.8,
            quality: 0.9,
            userSatisfaction: 0.85,
            tags: ['test', 'different']
        });
        
        // Test tag filtering
        const tagFiltered = container.getExperiences({ tags: ['filtering'] });
        if (tagFiltered.length !== 1) {
            throw new Error(`Expected 1 experience with 'filtering' tag, got ${tagFiltered.length}`);
        }
        
        // Test actor filtering
        const actorFiltered = container.getExperiences({ actor: 'user1' });
        if (actorFiltered.length !== 1) {
            throw new Error(`Expected 1 experience for 'user1', got ${actorFiltered.length}`);
        }
    });
    
    // Test 8: Export Functionality
    test('Export Functionality', () => {
        const container = new ExperienceContainer();
        
        container.logExperience({
            action: 'export_test',
            actor: { type: 'human', identifier: 'test_user' },
            primaryGoal: 'Test export functionality',
            context: 'Export test',
            reasoning: 'Testing data export',
            goalAchieved: true,
            efficiency: 0.8,
            quality: 0.9,
            userSatisfaction: 0.85
        });
        
        const exported = container.export();
        
        if (!exported.id || !exported.entries || !exported.insights) {
            throw new Error('Export should include id, entries, and insights');
        }
        
        if (!Array.isArray(exported.entries) || exported.entries.length < 2) {
            throw new Error('Export should include array of entries');
        }
        
        if (!exported.metadata || !exported.metadata.export_timestamp) {
            throw new Error('Export should include metadata with timestamp');
        }
    });
    
    // Summary
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! Living Histories system is working correctly.');
        return true;
    } else {
        console.log('\n⚠️  Some tests failed. Please check the implementation.');
        return false;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runBasicTests();
}

module.exports = { runBasicTests };