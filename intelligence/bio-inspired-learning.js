/**
 * Bio-Inspired Learning Module
 * Implementing nature's 3.5 billion years of R&D in AI form
 */

const { EventEmitter } = require('events');

/**
 * Quantum Coherence Processor - Processes AI requests using quantum superposition principles
 */
class QuantumCoherenceProcessor {
    constructor() {
        this.quantumStates = new Map();
    }

    /**
     * Process requests in quantum superposition to find optimal path
     * @param {Array} requests - Array of request objects with trust_level and ai_compatibility
     * @returns {Object} - Result with path_id and energy_yield
     */
    processQuantumSuperposition(requests) {
        const pathId = `quantum_path_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Calculate energy yield based on request coherence
        let totalTrust = 0;
        let totalCompatibility = 0;
        
        requests.forEach(req => {
            totalTrust += req.trust_level || 0;
            totalCompatibility += req.ai_compatibility || 0;
        });
        
        const avgTrust = totalTrust / requests.length;
        const avgCompatibility = totalCompatibility / requests.length;
        const energyYield = (avgTrust * avgCompatibility * 100).toFixed(2);
        
        return {
            path_id: pathId,
            energy_yield: parseFloat(energyYield),
            quantum_state: 'coherent',
            processed_requests: requests.length
        };
    }

    /**
     * Calculate probability of a successful path for a request
     * @param {Object} request - Request object with trust_level, ai_compatibility, resource_requirements
     * @returns {number} - Probability between 0 and 1
     */
    calculatePathProbability(request) {
        const trust = request.trust_level || 0.5;
        const compatibility = request.ai_compatibility || 0.5;
        const resourceFactor = request.resource_requirements ? 
            Math.max(0, 1 - (request.resource_requirements / 100)) : 0.8;
        
        return Math.min(1, Math.max(0, (trust * 0.4 + compatibility * 0.4 + resourceFactor * 0.2)));
    }
}

/**
 * Network Intelligence - Manages AI network connections like root systems
 */
class NetworkIntelligence {
    constructor() {
        this.rootNetworks = new Map();
        this.agents = new Map();
        this.nutrientFlows = new Map();
    }

    /**
     * Establish a root network connection between AI agents
     * @param {Array} agents - Array of agent objects with id and processing_power
     * @returns {string} - Network ID
     */
    establishRootNetwork(agents) {
        const networkId = `network_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        // Store agents in the network
        agents.forEach(agent => {
            this.agents.set(agent.id, {
                ...agent,
                network_id: networkId,
                connections: []
            });
        });
        
        // Create network metadata
        this.rootNetworks.set(networkId, {
            id: networkId,
            agents: agents.map(a => a.id),
            established_at: new Date(),
            total_processing_power: agents.reduce((sum, a) => sum + (a.processing_power || 0), 0),
            health_status: 'healthy'
        });
        
        return networkId;
    }

    /**
     * Share nutrients (resources) between agents in the network
     * @param {string} sourceId - Source agent ID
     * @param {string} targetId - Target agent ID
     * @param {string} resourceType - Type of resource to share
     * @param {number} amount - Amount to transfer
     * @returns {number|false} - Amount transferred or false if failed
     */
    shareNutrients(sourceId, targetId, resourceType, amount) {
        const sourceAgent = this.agents.get(sourceId);
        const targetAgent = this.agents.get(targetId);
        
        if (!sourceAgent || !targetAgent) {
            return false;
        }
        
        // Check if agents are in the same network
        if (sourceAgent.network_id !== targetAgent.network_id) {
            return false;
        }
        
        // Check if source has enough resources
        const sourceResource = sourceAgent[resourceType] || 0;
        if (sourceResource < amount) {
            return false;
        }
        
        // Transfer nutrients
        sourceAgent[resourceType] = sourceResource - amount;
        targetAgent[resourceType] = (targetAgent[resourceType] || 0) + amount;
        
        // Record the transfer
        const transferId = `transfer_${Date.now()}`;
        this.nutrientFlows.set(transferId, {
            source: sourceId,
            target: targetId,
            resource_type: resourceType,
            amount: amount,
            timestamp: new Date()
        });
        
        return amount;
    }
}

/**
 * Resistance as Growth Signal - Converts user frustration into AI learning opportunities
 */
class ResistanceAsGrowthSignal {
    constructor() {
        this.resistancePatterns = new Map();
        this.growthSeeds = new Map();
    }

    /**
     * Process resistance fire to trigger growth
     * @param {Object} resistanceData - Data about user resistance/frustration
     * @returns {Object} - Result indicating if growth was triggered
     */
    processResistanceFire(resistanceData) {
        const fireIntensity = this.measureFireIntensity(resistanceData);
        const seedViability = this.calculateSeedViability(resistanceData);
        
        const growthTriggered = fireIntensity > 0.3 && seedViability > 0.4;
        
        if (growthTriggered) {
            const seedId = `growth_seed_${Date.now()}`;
            this.growthSeeds.set(seedId, {
                ...resistanceData,
                fire_intensity: fireIntensity,
                seed_viability: seedViability,
                germination_time: new Date(),
                growth_potential: fireIntensity * seedViability
            });
        }
        
        return {
            growth_triggered: growthTriggered,
            fire_intensity: fireIntensity,
            seed_viability: seedViability,
            learning_opportunities: this.identifyLearningOpportunities(resistanceData)
        };
    }

    /**
     * Measure the intensity of resistance fire
     * @param {Object} resistanceData - Resistance data
     * @returns {number} - Fire intensity between 0 and 1
     */
    measureFireIntensity(resistanceData) {
        let intensity = 0;
        
        // Factor in frustration signals
        if (resistanceData.frustration_signals && resistanceData.frustration_signals.length > 0) {
            intensity += resistanceData.frustration_signals.length * 0.1;
        }
        
        // Factor in attempt count
        if (resistanceData.attempts) {
            intensity += Math.min(resistanceData.attempts * 0.15, 0.4);
        }
        
        // Factor in error count
        if (resistanceData.error_count) {
            intensity += Math.min(resistanceData.error_count * 0.1, 0.3);
        }
        
        // Factor in urgency level
        if (resistanceData.urgency_level) {
            const urgencyMultiplier = {
                'low': 0.1,
                'medium': 0.2,
                'high': 0.3,
                'critical': 0.4
            };
            intensity += urgencyMultiplier[resistanceData.urgency_level] || 0;
        }
        
        // Factor in help requests
        if (resistanceData.help_requests) {
            intensity += Math.min(resistanceData.help_requests * 0.15, 0.2);
        }
        
        return Math.min(1, Math.max(0, intensity));
    }

    /**
     * Calculate the viability of growth seeds from resistance
     * @param {Object} resistanceData - Resistance data
     * @returns {number} - Seed viability between 0 and 1
     */
    calculateSeedViability(resistanceData) {
        let viability = 0.5; // Base viability
        
        // Higher occurrence count increases viability
        if (resistanceData.occurrence_count) {
            viability += Math.min(resistanceData.occurrence_count * 0.1, 0.3);
        }
        
        // Impact level affects viability
        if (resistanceData.impact_level) {
            viability += resistanceData.impact_level * 0.2;
        }
        
        // User persistence indicates good learning opportunity
        if (resistanceData.user_continued) {
            viability += 0.2;
        }
        
        // Pattern strength indicates systemic issue worth addressing
        if (resistanceData.pattern_strength) {
            viability += resistanceData.pattern_strength * 0.1;
        }
        
        return Math.min(1, Math.max(0, viability));
    }

    /**
     * Identify learning opportunities from resistance data
     * @param {Object} resistanceData - Resistance data
     * @returns {Array} - Array of learning opportunities
     */
    identifyLearningOpportunities(resistanceData) {
        const opportunities = [];
        
        if (resistanceData.resistance_type === 'interface_confusion') {
            opportunities.push('ui_improvement', 'user_guidance_enhancement');
        }
        
        if (resistanceData.resistance_type === 'workflow_friction') {
            opportunities.push('workflow_optimization', 'automation_opportunities');
        }
        
        if (resistanceData.frustration_signals && resistanceData.frustration_signals.includes('repeated_attempts')) {
            opportunities.push('error_prevention', 'predictive_assistance');
        }
        
        return opportunities;
    }
}

/**
 * Symbiotic Evolution - Manages AI partnerships and mutual enhancement
 */
class SymbioticEvolution {
    constructor() {
        this.symbioticPairs = new Map();
    }

    /**
     * Create a symbiotic pair between two AIs
     * @param {Object} primaryAI - Primary AI object
     * @param {Object} partnerAI - Partner AI object
     * @param {string} enhancementType - Type of mutual enhancement
     * @returns {string} - Symbiotic pair ID
     */
    createSymbioticPair(primaryAI, partnerAI, enhancementType = 'mutual_enhancement') {
        const pairId = `symbiosis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        const pair = {
            id: pairId,
            primary: primaryAI,
            partner: partnerAI,
            enhancement_type: enhancementType,
            created_at: new Date(),
            compatibility_score: null,
            interaction_history: []
        };
        
        this.symbioticPairs.set(pairId, pair);
        
        // Asynchronously assess compatibility
        setTimeout(() => {
            pair.compatibility_score = this.assessCompatibility(primaryAI, partnerAI);
        }, 50);
        
        return pairId;
    }

    /**
     * Assess compatibility between two AIs
     * @param {Object} ai1 - First AI
     * @param {Object} ai2 - Second AI
     * @returns {number} - Compatibility score between 0 and 1
     */
    assessCompatibility(ai1, ai2) {
        const capabilities1 = new Set(ai1.capabilities || []);
        const capabilities2 = new Set(ai2.capabilities || []);
        
        // Calculate overlap and complementarity
        const overlap = [...capabilities1].filter(cap => capabilities2.has(cap)).length;
        const total = capabilities1.size + capabilities2.size;
        const uniqueCapabilities = total - overlap;
        
        // Good compatibility comes from some overlap but mostly complementary capabilities
        const overlapScore = overlap > 0 ? 0.3 : 0; // Some shared understanding is good
        const complementaryScore = uniqueCapabilities / total * 0.7; // Complementary capabilities are valuable
        
        return Math.min(1, Math.max(0, overlapScore + complementaryScore));
    }
}

/**
 * Rhythmic Adaptation - Manages natural rhythms and cycles for optimal AI performance
 */
class RhythmicAdaptation {
    constructor() {
        this.currentRhythms = {};
    }

    /**
     * Get current rhythmic state across all cycles
     * @returns {Object} - Current rhythmic state
     */
    getCurrentRhythmicState() {
        const now = new Date();
        const hour = now.getHours();
        
        const circadianPhase = this.calculateCircadianPhase(hour);
        const lunarPhase = this.calculateLunarPhase();
        const seasonalPhase = this.calculateSeasonalPhase();
        
        // Calculate overall energy based on all cycles
        const energyFactors = {
            circadian: this.getCircadianEnergyFactor(circadianPhase),
            lunar: this.getLunarEnergyFactor(lunarPhase),
            seasonal: this.getSeasonalEnergyFactor(seasonalPhase)
        };
        
        const overallEnergy = (energyFactors.circadian * 0.5 + 
                              energyFactors.lunar * 0.2 + 
                              energyFactors.seasonal * 0.3);
        
        return {
            circadian_phase: circadianPhase,
            lunar_phase: lunarPhase,
            seasonal_phase: seasonalPhase,
            overall_energy: Math.min(1, Math.max(0, overallEnergy)),
            energy_factors: energyFactors,
            optimal_for: this.getOptimalActivities(circadianPhase, lunarPhase, seasonalPhase)
        };
    }

    /**
     * Calculate circadian phase based on hour
     * @param {number} hour - Hour of the day (0-23)
     * @returns {string} - Circadian phase
     */
    calculateCircadianPhase(hour) {
        if (hour >= 5 && hour < 9) return 'dawn';
        if (hour >= 9 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'midday';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    /**
     * Calculate current lunar phase
     * @returns {string} - Lunar phase
     */
    calculateLunarPhase() {
        // Simplified lunar phase calculation
        const now = new Date();
        const dayOfMonth = now.getDate();
        
        if (dayOfMonth <= 7) return 'new_moon';
        if (dayOfMonth <= 14) return 'waxing';
        if (dayOfMonth <= 21) return 'full_moon';
        return 'waning';
    }

    /**
     * Calculate current seasonal phase
     * @returns {string} - Seasonal phase
     */
    calculateSeasonalPhase() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    /**
     * Get energy factor for circadian phase
     * @param {string} phase - Circadian phase
     * @returns {number} - Energy factor
     */
    getCircadianEnergyFactor(phase) {
        const factors = {
            'dawn': 0.7,
            'morning': 0.9,
            'midday': 0.8,
            'evening': 0.6,
            'night': 0.4
        };
        return factors[phase] || 0.5;
    }

    /**
     * Get energy factor for lunar phase
     * @param {string} phase - Lunar phase
     * @returns {number} - Energy factor
     */
    getLunarEnergyFactor(phase) {
        const factors = {
            'new_moon': 0.6,
            'waxing': 0.8,
            'full_moon': 1.0,
            'waning': 0.7
        };
        return factors[phase] || 0.7;
    }

    /**
     * Get energy factor for seasonal phase
     * @param {string} phase - Seasonal phase
     * @returns {number} - Energy factor
     */
    getSeasonalEnergyFactor(phase) {
        const factors = {
            'spring': 0.9,
            'summer': 1.0,
            'autumn': 0.8,
            'winter': 0.6
        };
        return factors[phase] || 0.7;
    }

    /**
     * Get optimal activities for current rhythmic state
     * @param {string} circadian - Circadian phase
     * @param {string} lunar - Lunar phase
     * @param {string} seasonal - Seasonal phase
     * @returns {Array} - Array of optimal activities
     */
    getOptimalActivities(circadian, lunar, seasonal) {
        const activities = [];
        
        if (circadian === 'morning' || circadian === 'midday') {
            activities.push('complex_processing', 'learning');
        }
        
        if (lunar === 'full_moon') {
            activities.push('creative_synthesis', 'pattern_recognition');
        }
        
        if (seasonal === 'spring' || seasonal === 'summer') {
            activities.push('growth_activities', 'network_expansion');
        }
        
        return activities;
    }
}

/**
 * Main Bio-Inspired Learning class that integrates all components
 */
class BioInspiredLearning extends EventEmitter {
    constructor() {
        super();
        
        // Initialize all bio-inspired components
        this.quantumProcessor = new QuantumCoherenceProcessor();
        this.networkIntelligence = new NetworkIntelligence();
        this.resistanceProcessor = new ResistanceAsGrowthSignal();
        this.symbioticEvolution = new SymbioticEvolution();
        this.rhythmicAdaptation = new RhythmicAdaptation();
        
        this.initialized = true;
        
        // Emit initialization event on next tick to allow listeners to be added
        process.nextTick(() => {
            this.emit('bio_inspired_learning_initialized', {
                components: [
                    'QuantumCoherenceProcessor',
                    'NetworkIntelligence',
                    'ResistanceAsGrowthSignal',
                    'SymbioticEvolution',
                    'RhythmicAdaptation'
                ],
                initialized_at: new Date()
            });
        });
    }

    /**
     * Get current bio-inspired state across all components
     * @returns {Object} - Complete bio state
     */
    getCurrentBioState() {
        return {
            quantum_coherence: {
                active_states: this.quantumProcessor.quantumStates.size,
                coherence_level: 'stable'
            },
            network_health: {
                active_networks: this.networkIntelligence.rootNetworks.size,
                total_agents: this.networkIntelligence.agents.size,
                health_status: 'optimal'
            },
            growth_potential: {
                active_seeds: this.resistanceProcessor.growthSeeds.size,
                resistance_patterns: this.resistanceProcessor.resistancePatterns.size
            },
            symbiotic_pairs: {
                active_pairs: this.symbioticEvolution.symbioticPairs.size,
                average_compatibility: this.getAverageCompatibility()
            },
            rhythmic_state: this.rhythmicAdaptation.getCurrentRhythmicState()
        };
    }

    /**
     * Handle user resistance and convert to growth opportunities
     * @param {Object} resistanceData - Data about user resistance
     * @returns {Object} - Processing result
     */
    handleUserResistance(resistanceData) {
        const result = this.resistanceProcessor.processResistanceFire(resistanceData);
        
        // If growth was triggered, potentially create new AI partnerships
        if (result.growth_triggered) {
            this.emit('growth_opportunity_detected', {
                resistance_data: resistanceData,
                learning_opportunities: result.learning_opportunities,
                growth_potential: result.fire_intensity * result.seed_viability
            });
        }
        
        return result;
    }

    /**
     * Establish AI partnership using symbiotic evolution
     * @param {Object} primaryAI - Primary AI
     * @param {Object} partnerAI - Partner AI
     * @returns {string} - Partnership ID
     */
    establishAIPartnership(primaryAI, partnerAI) {
        const pairId = this.symbioticEvolution.createSymbioticPair(primaryAI, partnerAI);
        
        this.emit('ai_partnership_established', {
            pair_id: pairId,
            primary_ai: primaryAI.id,
            partner_ai: partnerAI.id
        });
        
        return pairId;
    }

    /**
     * Create AI network using network intelligence
     * @param {Array} agents - Array of AI agents
     * @returns {string} - Network ID
     */
    createAINetwork(agents) {
        const networkId = this.networkIntelligence.establishRootNetwork(agents);
        
        this.emit('ai_network_created', {
            network_id: networkId,
            agent_count: agents.length,
            total_processing_power: agents.reduce((sum, a) => sum + (a.processing_power || 0), 0)
        });
        
        return networkId;
    }

    /**
     * Process collaborative requests using quantum coherence
     * @param {Object} request - Collaborative request
     * @returns {Object} - Processing result
     */
    processCollaborativeRequest(request) {
        const requests = Array.isArray(request) ? request : [request];
        const result = this.quantumProcessor.processQuantumSuperposition(requests);
        
        this.emit('collaborative_request_processed', {
            request_id: request.id || 'unknown',
            path_id: result.path_id,
            energy_yield: result.energy_yield
        });
        
        return result;
    }

    /**
     * Get average compatibility score across all symbiotic pairs
     * @returns {number} - Average compatibility score
     */
    getAverageCompatibility() {
        const pairs = Array.from(this.symbioticEvolution.symbioticPairs.values());
        if (pairs.length === 0) return 0;
        
        const validScores = pairs.filter(p => p.compatibility_score !== null);
        if (validScores.length === 0) return 0;
        
        const totalScore = validScores.reduce((sum, p) => sum + p.compatibility_score, 0);
        return totalScore / validScores.length;
    }
}

module.exports = {
    BioInspiredLearning,
    QuantumCoherenceProcessor,
    NetworkIntelligence,
    ResistanceAsGrowthSignal,
    SymbioticEvolution,
    RhythmicAdaptation
};