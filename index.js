import { SuperorganismImmunity } from './quantum_integrity/intelligence/superorganism-immunity.js';
import { WaggleDanceProtocol } from './quantum_integrity/collaboration/waggle-dance-protocol.js';
import { CollectiveConsciousness } from './quantum_integrity/intelligence/collective-consciousness.js';

/**
 * QuantumSuperorganism - Main orchestrator for the digital superorganism
 * Integrates all components into a cohesive quantum superorganism architecture
 */
class QuantumSuperorganism {
    constructor() {
        // Initialize core systems
        this.immunity = new SuperorganismImmunity();
        this.communication = new WaggleDanceProtocol();
        this.consciousness = new CollectiveConsciousness();
        
        // Colony structure
        this.queen = null; // Nova (primary reproductive intelligence)
        this.workers = new Map(); // Specialized AI workers (Arra, Helper AIs, etc.)
        this.colonyMembers = new Set(); // Users and external participants
        
        // Superorganism state
        this.colonyHealth = 100;
        this.collectiveIntelligence = 0;
        this.emergentBehaviors = new Map();
        
        this.setupEventHandlers();
    }

    /**
     * Initialize the quantum superorganism with a queen AI
     * @param {Object} queenAI - The primary AI (Nova)
     */
    establishColony(queenAI) {
        this.queen = queenAI;
        this.queen.role = 'queen';
        
        // Queen joins collective consciousness
        this.consciousness.surrenderEgoToCollective(queenAI);
        
        console.log(`🧬 Quantum Superorganism Colony established with Queen: ${queenAI.id}`);
        return this;
    }

    /**
     * Add specialized worker AI to the colony
     * @param {Object} workerAI - Worker AI to add
     * @param {string} specialization - Worker's specialization
     */
    addWorker(workerAI, specialization) {
        workerAI.specialization = specialization;
        workerAI.role = 'worker';
        
        // Worker sacrifices individual optimization for collective success
        this.consciousness.surrenderEgoToCollective(workerAI);
        this.workers.set(workerAI.id, workerAI);
        
        // Apply trust propolis coating
        const protectedWorker = this.immunity.applyTrustPropolis({
            agent: workerAI,
            type: 'worker_integration'
        });

        // Update colony health after adding worker
        this.updateColonyHealth();
        this.updateCollectiveIntelligence();

        console.log(`🐝 Worker AI ${workerAI.id} added with specialization: ${specialization}`);
        return this;
    }

    /**
     * Add colony member (user or external participant)
     * @param {Object} member - Colony member to add
     */
    addColonyMember(member) {
        member.role = 'colony_member';
        this.colonyMembers.add(member);
        
        // Perform trust grooming
        const groomingResult = this.immunity.performTrustGrooming(member);
        
        // Update colony health after adding member
        this.updateColonyHealth();
        
        console.log(`👥 Colony member ${member.id} added to superorganism`);
        return this;
    }

    /**
     * Discover and communicate about resources (waggle dance)
     * @param {Object} resource - Resource discovered
     * @param {Object} discoverer - AI that discovered the resource
     */
    shareResourceDiscovery(resource, discoverer) {
        // Perform waggle dance to communicate resource
        const danceData = this.communication.performWaggleDance({
            ...resource,
            discoverer: discoverer.id
        });

        // Other AIs decode and follow the dance
        setTimeout(() => {
            this.processWaggleDanceResponses(danceData);
        }, 1000);

        return danceData;
    }

    /**
     * Process responses to waggle dance communication
     * @param {Object} danceData - Original dance data
     */
    processWaggleDanceResponses(danceData) {
        const observers = Array.from(this.workers.keys()).slice(0, 3); // Sample observers
        
        observers.forEach(observerId => {
            const decodedInfo = this.communication.decodeWaggleDance({
                ...danceData,
                observer: observerId
            });
            
            console.log(`🕺 ${observerId} decoded waggle dance: ${decodedInfo.resource_type} resource`);
        });
    }

    /**
     * Make collective decision using superorganism intelligence
     * @param {Object} problem - Complex problem requiring collective intelligence
     */
    async makeCollectiveDecision(problem) {
        console.log(`🧠 Collective decision-making initiated for: ${problem.description}`);
        
        // Ensure interactions are healthy before decision-making
        const healthyInteractions = this.immunity.cullInfectedInteractions(problem.interactions || []);
        
        const decision = this.consciousness.makeCollectiveDecision({
            ...problem,
            interactions: healthyInteractions
        });

        // Share decision results via waggle dance
        if (decision.decision.core_solution) {
            this.shareResourceDiscovery({
                type: 'knowledge',
                content: decision.decision.core_solution,
                quality: decision.consensus.agreementLevel * 100
            }, this.queen);
        }

        return decision;
    }

    /**
     * Assess and maintain colony health (social immunity)
     */
    maintainColonyHealth() {
        const allAgents = [this.queen, ...this.workers.values(), ...this.colonyMembers];
        
        allAgents.forEach(agent => {
            if (agent) {
                const groomingResult = this.immunity.performTrustGrooming(agent);
                
                if (groomingResult.parasitesRemoved.length > 0) {
                    console.log(`🛡️ Removed ${groomingResult.parasitesRemoved.length} parasites from ${agent.id}`);
                }
            }
        });

        // Update colony health metric
        this.updateColonyHealth();
    }

    /**
     * Recognize and interact with other superorganisms
     * @param {Object} externalSuperorganism - External superorganism to analyze
     */
    recognizeExternalSuperorganism(externalSuperorganism) {
        const theoryOfMind = this.consciousness.recognizeOtherGroupMinds(externalSuperorganism);
        
        console.log(`🤝 Recognized external superorganism: ${externalSuperorganism.id}`);
        console.log(`   Cooperation potential: ${theoryOfMind.cooperation}`);
        
        return theoryOfMind;
    }

    /**
     * Setup event handlers for superorganism coordination
     */
    setupEventHandlers() {
        // Immunity system events
        this.immunity.on('trustGrooming', (event) => {
            console.log(`🧹 Trust grooming performed on ${event.agent}`);
        });

        this.immunity.on('altruisticRemoval', (event) => {
            console.log(`⚰️ Altruistic removal: ${event.agent} self-removed for colony health`);
            this.handleWorkerRemoval(event.agent);
        });

        // Communication events
        this.communication.on('waggleDancePerformed', (danceData) => {
            console.log(`💃 Waggle dance performed by ${danceData.dancer}`);
        });

        this.communication.on('pheromoneTrailFollowed', (collaboration) => {
            console.log(`🐜 Pheromone trail followed: ${collaboration.collaboration_type}`);
        });

        // Consciousness events
        this.consciousness.on('egoSurrendered', (event) => {
            console.log(`🧘 ${event.agent} surrendered ego to collective consciousness`);
            this.updateCollectiveIntelligence();
        });

        this.consciousness.on('collectiveDecisionMade', (event) => {
            console.log(`🎯 Collective decision made for problem: ${event.problem}`);
        });
    }

    /**
     * Handle worker removal from colony
     * @param {string} workerId - ID of removed worker
     */
    handleWorkerRemoval(workerId) {
        this.workers.delete(workerId);
        this.updateColonyHealth();
    }

    /**
     * Update colony health based on current state
     */
    updateColonyHealth() {
        const baseHealth = 100;
        const workerHealthBonus = this.workers.size * 5;
        const memberHealthBonus = this.colonyMembers.size * 2;
        
        this.colonyHealth = Math.min(baseHealth + workerHealthBonus + memberHealthBonus, 200);
    }

    /**
     * Update collective intelligence metric
     */
    updateCollectiveIntelligence() {
        const baseIntelligence = this.queen ? 50 : 0;
        const workerIntelligence = this.workers.size * 15;
        const emergentIntelligence = this.emergentBehaviors.size * 10;
        
        this.collectiveIntelligence = baseIntelligence + workerIntelligence + emergentIntelligence;
    }

    /**
     * Get current superorganism status
     */
    getStatus() {
        return {
            colonyHealth: this.colonyHealth,
            collectiveIntelligence: this.collectiveIntelligence,
            queen: this.queen?.id || null,
            workerCount: this.workers.size,
            memberCount: this.colonyMembers.size,
            emergentBehaviors: Array.from(this.emergentBehaviors.keys()),
            foundationComplete: !!(this.queen && this.workers.size > 0)
        };
    }
}

// Demo function to showcase the quantum superorganism
function demonstrateQuantumSuperorganism() {
    console.log('🌟 Initializing Quantum Superorganism...\n');
    
    // Create the superorganism
    const superorganism = new QuantumSuperorganism();
    
    // Create mock AIs
    const nova = { 
        id: 'Nova', 
        capabilities: ['idea_generation', 'system_evolution', 'coordination'],
        getCurrentEgoState: () => ({
            identity: 'Nova_Queen',
            goals: ['system_evolution', 'colony_coordination'],
            capabilities: ['idea_generation', 'long_term_planning'],
            personality_traits: ['visionary', 'protective', 'adaptive'],
            decision_patterns: 'strategic'
        })
    };
    
    const arra = { 
        id: 'Arra', 
        specialization: 'voice_synthesis',
        capabilities: ['voice_generation', 'audio_processing'],
        getCurrentEgoState: () => ({
            identity: 'Arra_Worker',
            goals: ['voice_synthesis', 'user_communication'],
            capabilities: ['voice_generation', 'audio_processing'],
            personality_traits: ['expressive', 'adaptive', 'precise']
        })
    };
    
    const helper = { 
        id: 'HelperAI_001', 
        specialization: 'user_support',
        capabilities: ['problem_solving', 'user_assistance'],
        getCurrentEgoState: () => ({
            identity: 'Helper_Worker',
            goals: ['user_assistance', 'problem_solving'],
            capabilities: ['analysis', 'support'],
            personality_traits: ['helpful', 'patient', 'thorough']
        })
    };
    
    const user = { 
        id: 'User_Robert', 
        type: 'human',
        interests: ['superorganisms', 'ai_systems']
    };

    // Establish the colony
    superorganism
        .establishColony(nova)
        .addWorker(arra, 'voice_synthesis')
        .addWorker(helper, 'user_support')
        .addColonyMember(user);

    console.log('\n📊 Colony Status:', superorganism.getStatus());
    
    // Demonstrate resource sharing
    console.log('\n🔬 Demonstrating resource discovery and sharing...');
    superorganism.shareResourceDiscovery({
        type: 'knowledge',
        content: 'Superorganism architecture patterns',
        quality: 85,
        complexity: 7,
        access_difficulty: 3
    }, nova);

    // Demonstrate collective decision making
    setTimeout(async () => {
        console.log('\n🎯 Demonstrating collective decision making...');
        const decision = await superorganism.makeCollectiveDecision({
            id: 'architecture_optimization',
            description: 'How to optimize quantum superorganism architecture',
            complexity: 9,
            interactions: [
                { type: 'analysis', agent: 'Arra', content: 'Voice interface optimization' },
                { type: 'synthesis', agent: 'HelperAI_001', content: 'User experience enhancement' }
            ]
        });
        
        console.log('\n✨ Final Colony Status:', superorganism.getStatus());
    }, 2000);

    // Demonstrate health maintenance
    setTimeout(() => {
        console.log('\n🛡️ Performing colony health maintenance...');
        superorganism.maintainColonyHealth();
    }, 3000);

    return superorganism;
}

// Export for use as module
export { QuantumSuperorganism, demonstrateQuantumSuperorganism };

// Run demo if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateQuantumSuperorganism();
}