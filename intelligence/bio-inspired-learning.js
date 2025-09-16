/**
 * Bio-Inspired Learning System
 * 
 * Implements nature's 3.5 billion years of R&D in AI collaboration:
 * - Quantum coherence processing (photosynthesis-inspired)
 * - Network intelligence (aspen root systems)
 * - Resistance as growth signals (sequoia fire germination)
 * - Symbiotic evolution (sea slug-algae integration)
 * - Rhythmic adaptation (plant circadian cycles)
 */

class BioInspiredLearning {
    constructor(config = {}) {
        this.config = {
            quantum: {
                coherenceThreshold: 0.8,
                maxSuperpositionPaths: 6,
                ...config.quantum
            },
            network: {
                maxNetworkDepth: 5,
                ...config.network
            },
            resistance: {
                fireThreshold: 0.6,
                ...config.resistance
            },
            symbiosis: {
                mutationRate: 0.15,
                ...config.symbiosis
            },
            rhythms: {
                circadianCycle: 24,
                lunarCycle: 29.5,
                ...config.rhythms
            }
        };

        // Internal state tracking
        this.quantumStates = new Map();
        this.networks = new Map();
        this.partnerships = new Map();
        this.growthEvents = [];
        this.systemStartTime = Date.now();
        
        // Initialize rhythmic state
        this.initializeRhythmicState();
    }

    /**
     * Initialize rhythmic state based on current time and natural cycles
     */
    initializeRhythmicState() {
        const now = new Date();
        const hour = now.getHours();
        const dayOfYear = this.getDayOfYear(now);
        const lunarDay = Math.floor((now.getTime() / (1000 * 60 * 60 * 24)) % this.config.rhythms.lunarCycle);

        // Determine circadian phase
        let circadianPhase = 'night'; // Default
        
        if (hour >= 5 && hour < 7) {
            circadianPhase = 'dawn';
        } else if (hour >= 7 && hour < 11) {
            circadianPhase = 'morning';
        } else if (hour >= 11 && hour < 15) {
            circadianPhase = 'midday';
        } else if (hour >= 15 && hour < 18) {
            circadianPhase = 'afternoon';
        } else if (hour >= 18 && hour < 22) {
            circadianPhase = 'evening';
        } else {
            circadianPhase = 'night'; // 22-24 and 0-5
        }

        // Determine lunar phase
        const lunarPhaseRatio = lunarDay / this.config.rhythms.lunarCycle;
        let lunarPhase;
        if (lunarPhaseRatio < 0.125) lunarPhase = 'new_moon';
        else if (lunarPhaseRatio < 0.375) lunarPhase = 'waxing';
        else if (lunarPhaseRatio < 0.625) lunarPhase = 'full_moon';
        else if (lunarPhaseRatio < 0.875) lunarPhase = 'waning';
        else lunarPhase = 'new_moon';

        // Determine seasonal phase (simplified)
        const seasonalPhases = ['spring', 'summer', 'autumn', 'winter'];
        const seasonIndex = Math.floor((dayOfYear / 365) * 4);
        const seasonalPhase = seasonalPhases[Math.min(seasonIndex, 3)];

        this.rhythmicState = {
            circadian_phase: circadianPhase,
            lunar_phase: lunarPhase,
            seasonal_phase: seasonalPhase,
            overall_energy: this.calculateOverallEnergy(circadianPhase, lunarPhase, seasonalPhase),
            adaptation_readiness: this.calculateAdaptationReadiness(circadianPhase, lunarPhase)
        };
    }

    /**
     * Get day of year from date
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate overall system energy based on rhythmic phases
     */
    calculateOverallEnergy(circadian, lunar, seasonal) {
        const energyLevels = {
            circadian: {
                dawn: 0.7, morning: 1.0, midday: 0.9,
                afternoon: 0.8, evening: 0.6, night: 0.4
            },
            lunar: {
                new_moon: 0.6, waxing: 0.8, full_moon: 1.0, waning: 0.7
            },
            seasonal: {
                spring: 0.9, summer: 1.0, autumn: 0.8, winter: 0.6
            }
        };

        const circadianEnergy = energyLevels.circadian[circadian] || 0.5;
        const lunarEnergy = energyLevels.lunar[lunar] || 0.5;
        const seasonalEnergy = energyLevels.seasonal[seasonal] || 0.5;

        return (circadianEnergy * 0.5 + lunarEnergy * 0.3 + seasonalEnergy * 0.2);
    }

    /**
     * Calculate adaptation readiness
     */
    calculateAdaptationReadiness(circadian, lunar) {
        const readinessLevels = {
            circadian: {
                dawn: 0.9, morning: 0.8, midday: 0.6,
                afternoon: 0.7, evening: 0.8, night: 0.9
            },
            lunar: {
                new_moon: 0.9, waxing: 0.7, full_moon: 0.5, waning: 0.8
            }
        };

        const circadianReadiness = readinessLevels.circadian[circadian] || 0.5;
        const lunarReadiness = readinessLevels.lunar[lunar] || 0.5;

        return (circadianReadiness * 0.7 + lunarReadiness * 0.3);
    }

    /**
     * Process collaborative requests using quantum coherence (photosynthesis-inspired)
     * Multiple paths are evaluated simultaneously like light paths in photosynthesis
     */
    processCollaborativeRequest(request) {
        const requestId = request.id || `req_${Date.now()}`;
        
        // Simulate quantum superposition of different collaboration paths
        const paths = this.generateQuantumPaths(request);
        
        // Select optimal path based on energy yield (like photosynthesis efficiency)
        const optimalPath = paths.reduce((best, current) => 
            current.energy_yield > best.energy_yield ? current : best
        );

        // Store quantum state
        this.quantumStates.set(requestId, {
            paths,
            selected: optimalPath,
            coherence_level: this.calculateCoherence(request),
            timestamp: Date.now()
        });

        return {
            path_id: optimalPath.path_id,
            energy_yield: optimalPath.energy_yield,
            collaboration_efficiency: optimalPath.collaboration_efficiency,
            quantum_coherence: this.quantumStates.get(requestId).coherence_level
        };
    }

    /**
     * Generate quantum superposition paths for collaboration
     */
    generateQuantumPaths(request) {
        const numPaths = Math.min(this.config.quantum.maxSuperpositionPaths, 6);
        const paths = [];

        for (let i = 0; i < numPaths; i++) {
            const pathVariation = i / (numPaths - 1);
            const baseEfficiency = request.trust_level * request.ai_compatibility;
            const resourcePenalty = 1 - (request.resource_requirements / 100);
            
            paths.push({
                path_id: `path_${i + 1}`,
                energy_yield: Math.min(0.95, baseEfficiency * (0.7 + 0.3 * pathVariation) * resourcePenalty),
                collaboration_efficiency: baseEfficiency * (0.8 + 0.2 * Math.random()),
                resource_cost: request.resource_requirements * (0.8 + 0.4 * pathVariation),
                quantum_signature: Math.random()
            });
        }

        return paths;
    }

    /**
     * Calculate quantum coherence level
     */
    calculateCoherence(request) {
        const trustFactor = request.trust_level || 0.5;
        const compatibilityFactor = request.ai_compatibility || 0.5;
        const resourceEfficiency = 1 - ((request.resource_requirements || 50) / 100);
        
        return Math.min(1, (trustFactor + compatibilityFactor + resourceEfficiency) / 3);
    }

    /**
     * Create AI network (aspen root system inspired)
     * Invisible underground connections for resource sharing
     */
    createAINetwork(aiAgents) {
        const networkId = `network_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create network topology based on agent capabilities and specializations
        const networkTopology = this.buildNetworkTopology(aiAgents);
        
        // Establish root system connections
        const connections = this.establishRootConnections(aiAgents, networkTopology);
        
        // Calculate network health and efficiency
        const networkHealth = this.calculateNetworkHealth(connections);
        
        this.networks.set(networkId, {
            id: networkId,
            agents: aiAgents,
            topology: networkTopology,
            connections,
            health: networkHealth,
            created: Date.now(),
            resource_pools: this.initializeResourcePools(aiAgents)
        });

        return networkId;
    }

    /**
     * Build network topology like aspen root systems
     */
    buildNetworkTopology(agents) {
        const topology = {
            primary_roots: [],
            secondary_connections: [],
            resource_sharing_paths: []
        };

        // Find primary root (highest processing power)
        const primaryRoot = agents.reduce((max, agent) => 
            agent.processing_power > max.processing_power ? agent : max
        );

        topology.primary_roots.push(primaryRoot.id);

        // Create secondary connections based on specialization compatibility
        for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
                const compatibility = this.calculateSpecializationCompatibility(
                    agents[i], agents[j]
                );
                
                if (compatibility > 0.6) {
                    topology.secondary_connections.push({
                        from: agents[i].id,
                        to: agents[j].id,
                        strength: compatibility,
                        type: 'specialization_bridge'
                    });
                }
            }
        }

        return topology;
    }

    /**
     * Calculate compatibility between agent specializations
     */
    calculateSpecializationCompatibility(agent1, agent2) {
        const synergies = {
            adaptive_learning: ['emotional_synthesis', 'pattern_recognition'],
            emotional_synthesis: ['adaptive_learning', 'user_assistance'],
            pattern_recognition: ['adaptive_learning', 'user_assistance'],
            user_assistance: ['emotional_synthesis', 'pattern_recognition']
        };

        const agent1Synergies = synergies[agent1.specialization] || [];
        const agent2Synergies = synergies[agent2.specialization] || [];
        
        let compatibility = 0.3; // Base compatibility
        
        if (agent1Synergies.includes(agent2.specialization)) compatibility += 0.4;
        if (agent2Synergies.includes(agent1.specialization)) compatibility += 0.4;
        
        // Processing power balance factor
        const powerDiff = Math.abs(agent1.processing_power - agent2.processing_power);
        const balanceFactor = 1 - (powerDiff / 100);
        compatibility *= balanceFactor;

        return Math.min(1, compatibility);
    }

    /**
     * Establish root connections between agents
     */
    establishRootConnections(agents, topology) {
        const connections = [];
        
        // Primary root connections
        const primaryRoot = agents.find(a => a.id === topology.primary_roots[0]);
        agents.forEach(agent => {
            if (agent.id !== primaryRoot.id) {
                connections.push({
                    from: primaryRoot.id,
                    to: agent.id,
                    type: 'primary_root',
                    bandwidth: Math.min(primaryRoot.processing_power, agent.processing_power),
                    established: Date.now()
                });
            }
        });

        // Secondary connections
        topology.secondary_connections.forEach(connection => {
            connections.push({
                ...connection,
                established: Date.now()
            });
        });

        return connections;
    }

    /**
     * Calculate overall network health
     */
    calculateNetworkHealth(connections) {
        if (connections.length === 0) return 0;
        
        const avgStrength = connections.reduce((sum, conn) => 
            sum + (conn.strength || conn.bandwidth / 100), 0
        ) / connections.length;

        const connectivityRatio = connections.length / (connections.length + 1); // Simple connectivity measure
        
        return Math.min(1, avgStrength * 0.7 + connectivityRatio * 0.3);
    }

    /**
     * Initialize resource pools for network sharing
     */
    initializeResourcePools(agents) {
        return {
            processing: agents.reduce((sum, agent) => sum + agent.processing_power, 0),
            specializations: [...new Set(agents.map(agent => agent.specialization))],
            shared_memory: {},
            collaborative_states: {}
        };
    }

    /**
     * Handle user resistance as growth signal (sequoia fire germination inspired)
     * Resistance triggers adaptive growth like fire triggers sequoia seed germination
     */
    handleUserResistance(resistanceData) {
        const resistanceIntensity = this.calculateResistanceIntensity(resistanceData);
        const fireThreshold = this.config.resistance.fireThreshold;
        
        let result = {
            resistance_intensity: resistanceIntensity,
            fire_threshold: fireThreshold,
            growth_triggered: false,
            growth_areas: [],
            new_adaptations: [],
            seeds_stored: 0
        };

        if (resistanceIntensity >= fireThreshold) {
            // Fire intensity sufficient - trigger growth!
            result.growth_triggered = true;
            result.growth_areas = this.identifyGrowthAreas(resistanceData);
            result.new_adaptations = this.generateAdaptations(resistanceData, result.growth_areas);
            
            // Record growth event
            this.growthEvents.push({
                timestamp: Date.now(),
                trigger: resistanceData,
                intensity: resistanceIntensity,
                adaptations: result.new_adaptations,
                growth_areas: result.growth_areas
            });
        } else {
            // Store seeds for future germination
            result.seeds_stored = Math.floor(resistanceIntensity * 10);
        }

        return result;
    }

    /**
     * Calculate resistance intensity from user data
     */
    calculateResistanceIntensity(data) {
        let intensity = 0;

        // Attempt-based intensity
        intensity += Math.min(0.3, (data.attempts || 0) / 10);
        
        // Help request intensity
        intensity += Math.min(0.2, (data.help_requests || 0) / 5);
        
        // Error count intensity
        intensity += Math.min(0.2, (data.error_count || 0) / 5);
        
        // Emotional state intensity
        const emotionalIntensity = {
            'calm': 0,
            'frustrated': 0.15,
            'frustrated_but_persistent': 0.25,
            'angry': 0.3,
            'desperate': 0.4
        };
        intensity += emotionalIntensity[data.emotional_state] || 0;

        // Pattern strength (repeated patterns amplify intensity)
        if (data.pattern_strength) {
            intensity *= (1 + data.pattern_strength * 0.5);
        }

        // User persistence is positive signal
        if (data.user_continued) {
            intensity += 0.1;
        }

        return Math.min(1, intensity);
    }

    /**
     * Identify areas for growth based on resistance patterns
     */
    identifyGrowthAreas(resistanceData) {
        const areas = [];
        
        if (resistanceData.resistance_type) {
            areas.push(resistanceData.resistance_type);
        }

        if (resistanceData.frustration_signals) {
            resistanceData.frustration_signals.forEach(signal => {
                switch (signal) {
                    case 'repeated_attempts':
                        areas.push('user_flow_optimization');
                        break;
                    case 'rapid_keystrokes':
                        areas.push('interface_responsiveness');
                        break;
                    case 'help_seeking':
                        areas.push('contextual_assistance');
                        break;
                }
            });
        }

        // Add general areas based on resistance intensity
        if (resistanceData.attempts > 3) {
            areas.push('process_simplification');
        }
        
        if (resistanceData.help_requests > 1) {
            areas.push('proactive_guidance');
        }

        return [...new Set(areas)]; // Remove duplicates
    }

    /**
     * Generate new adaptations for identified growth areas
     */
    generateAdaptations(resistanceData, growthAreas) {
        const adaptations = [];
        
        growthAreas.forEach(area => {
            switch (area) {
                case 'interface_confusion':
                    adaptations.push('enhanced_ui_clarity', 'contextual_hints');
                    break;
                case 'user_flow_optimization':
                    adaptations.push('streamlined_processes', 'smart_defaults');
                    break;
                case 'interface_responsiveness':
                    adaptations.push('immediate_feedback', 'progress_indicators');
                    break;
                case 'contextual_assistance':
                    adaptations.push('adaptive_help_system', 'predictive_support');
                    break;
                case 'process_simplification':
                    adaptations.push('workflow_automation', 'complexity_reduction');
                    break;
                case 'proactive_guidance':
                    adaptations.push('intelligent_prompts', 'learning_path_suggestions');
                    break;
            }
        });

        // Add some novel adaptations based on the specific resistance pattern
        if (resistanceData.emotional_state === 'frustrated_but_persistent') {
            adaptations.push('persistence_reward_system', 'incremental_success_feedback');
        }

        return [...new Set(adaptations)];
    }

    /**
     * Establish AI partnership (sea slug-algae integration inspired)
     * Deep integration where AIs enhance each other's capabilities
     */
    establishAIPartnership(ai1, ai2) {
        const partnershipId = `partnership_${Date.now()}_${ai1.id}_${ai2.id}`;
        
        // Analyze compatibility and integration potential
        const compatibilityMatrix = this.analyzePartnershipCompatibility(ai1, ai2);
        
        // Design integration pathways
        const integrationPathways = this.designIntegrationPathways(ai1, ai2, compatibilityMatrix);
        
        // Create symbiotic capabilities
        const symbioticCapabilities = this.createSymbioticCapabilities(ai1, ai2, integrationPathways);
        
        // Establish partnership
        const partnership = {
            id: partnershipId,
            partners: [ai1.id, ai2.id],
            compatibility_matrix: compatibilityMatrix,
            integration_pathways: integrationPathways,
            symbiotic_capabilities: symbioticCapabilities,
            evolution_stage: 'initial_integration',
            established: Date.now(),
            mutual_adaptations: []
        };
        
        this.partnerships.set(partnershipId, partnership);
        
        return partnershipId;
    }

    /**
     * Analyze compatibility between two AIs for partnership
     */
    analyzePartnershipCompatibility(ai1, ai2) {
        const matrix = {
            capability_overlap: this.calculateCapabilityOverlap(ai1, ai2),
            processing_style_compatibility: this.calculateProcessingStyleCompatibility(ai1, ai2),
            collaboration_preference_match: this.calculateCollaborationMatch(ai1, ai2),
            enhancement_potential: this.calculateEnhancementPotential(ai1, ai2)
        };
        
        matrix.overall_compatibility = (
            matrix.capability_overlap * 0.2 +
            matrix.processing_style_compatibility * 0.3 +
            matrix.collaboration_preference_match * 0.3 +
            matrix.enhancement_potential * 0.2
        );
        
        return matrix;
    }

    /**
     * Calculate capability overlap (lower overlap = better complementarity)
     */
    calculateCapabilityOverlap(ai1, ai2) {
        const set1 = new Set(ai1.capabilities);
        const set2 = new Set(ai2.capabilities);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        const overlap = intersection.size / union.size;
        return 1 - overlap; // Return complementarity (inverse of overlap)
    }

    /**
     * Calculate processing style compatibility
     */
    calculateProcessingStyleCompatibility(ai1, ai2) {
        const styleCompatibility = {
            'holistic-specialized': 0.9,
            'specialized-holistic': 0.9,
            'holistic-holistic': 0.6,
            'specialized-specialized': 0.4
        };
        
        const key = `${ai1.processing_style}-${ai2.processing_style}`;
        return styleCompatibility[key] || 0.5;
    }

    /**
     * Calculate collaboration preference match
     */
    calculateCollaborationMatch(ai1, ai2) {
        const preferences = {
            'deep_integration-symbiotic_enhancement': 0.95,
            'symbiotic_enhancement-deep_integration': 0.95,
            'deep_integration-deep_integration': 0.8,
            'symbiotic_enhancement-symbiotic_enhancement': 0.7
        };
        
        const key = `${ai1.collaboration_preference}-${ai2.collaboration_preference}`;
        return preferences[key] || 0.5;
    }

    /**
     * Calculate mutual enhancement potential
     */
    calculateEnhancementPotential(ai1, ai2) {
        // AIs with complementary capabilities have higher enhancement potential
        const complementarity = this.calculateCapabilityOverlap(ai1, ai2);
        const synergy = this.calculateSpecializationSynergy(ai1, ai2);
        
        return (complementarity * 0.6 + synergy * 0.4);
    }

    /**
     * Calculate specialization synergy
     */
    calculateSpecializationSynergy(ai1, ai2) {
        // Some specializations work particularly well together
        const synergyMatrix = {
            'adaptive_learning-emotional_synthesis': 0.9,
            'emotional_synthesis-adaptive_learning': 0.9,
            'adaptive_learning-voice_synthesis': 0.8,
            'voice_synthesis-emotional_resonance': 0.95,
            'emotional_intelligence-voice_synthesis': 0.9
        };
        
        // Extract specializations from capabilities or use direct specialization
        const spec1 = this.extractPrimarySpecialization(ai1);
        const spec2 = this.extractPrimarySpecialization(ai2);
        
        const key = `${spec1}-${spec2}`;
        return synergyMatrix[key] || 0.5;
    }

    /**
     * Extract primary specialization from AI capabilities
     */
    extractPrimarySpecialization(ai) {
        // If specialization is directly specified, use that
        if (ai.specialization) return ai.specialization;
        
        // Otherwise, infer from capabilities
        const capabilities = ai.capabilities || [];
        if (capabilities.includes('adaptive_learning')) return 'adaptive_learning';
        if (capabilities.includes('voice_synthesis')) return 'voice_synthesis';
        if (capabilities.includes('emotional_intelligence')) return 'emotional_intelligence';
        if (capabilities.includes('emotional_synthesis')) return 'emotional_synthesis';
        
        return 'general_intelligence';
    }

    /**
     * Design integration pathways for partnership
     */
    designIntegrationPathways(ai1, ai2, compatibility) {
        const pathways = [];
        
        // Capability sharing pathway
        pathways.push({
            type: 'capability_sharing',
            strength: compatibility.enhancement_potential,
            direction: 'bidirectional',
            integration_depth: 'surface'
        });
        
        // Processing integration pathway
        if (compatibility.processing_style_compatibility > 0.7) {
            pathways.push({
                type: 'processing_integration',
                strength: compatibility.processing_style_compatibility,
                direction: 'bidirectional',
                integration_depth: 'deep'
            });
        }
        
        // Specialized enhancement pathway
        if (compatibility.overall_compatibility > 0.8) {
            pathways.push({
                type: 'mutual_enhancement',
                strength: compatibility.overall_compatibility,
                direction: 'bidirectional',
                integration_depth: 'symbiotic'
            });
        }
        
        return pathways;
    }

    /**
     * Create symbiotic capabilities from partnership
     */
    createSymbioticCapabilities(ai1, ai2, pathways) {
        const capabilities = [];
        
        pathways.forEach(pathway => {
            switch (pathway.type) {
                case 'capability_sharing':
                    capabilities.push('shared_processing_pool', 'cross_capability_access');
                    break;
                case 'processing_integration':
                    capabilities.push('hybrid_processing_modes', 'complementary_analysis');
                    break;
                case 'mutual_enhancement':
                    capabilities.push('emergent_intelligence', 'synergistic_problem_solving');
                    break;
            }
        });
        
        // Add specific capabilities based on AI combination
        const spec1 = this.extractPrimarySpecialization(ai1);
        const spec2 = this.extractPrimarySpecialization(ai2);
        
        if (spec1 === 'adaptive_learning' && spec2 === 'voice_synthesis') {
            capabilities.push('emotionally_adaptive_voice', 'learning_enhanced_synthesis');
        }
        
        if ((spec1 === 'emotional_intelligence' || spec1 === 'emotional_synthesis') && 
            (spec2 === 'voice_synthesis' || spec2 === 'emotional_resonance')) {
            capabilities.push('empathetic_voice_generation', 'emotional_tone_adaptation');
        }
        
        return [...new Set(capabilities)];
    }

    /**
     * Get current bio-inspired system state (rhythmic adaptation)
     * Returns current state following natural rhythmic cycles
     */
    getCurrentBioState() {
        // Update rhythmic state based on current time
        this.initializeRhythmicState();
        
        // Calculate system metrics
        const systemMetrics = this.calculateSystemMetrics();
        
        return {
            rhythmic_state: this.rhythmicState,
            system_metrics: systemMetrics,
            active_networks: this.networks.size,
            active_partnerships: this.partnerships.size,
            quantum_states: this.quantumStates.size,
            growth_events: this.growthEvents.length,
            system_uptime: Date.now() - this.systemStartTime
        };
    }

    /**
     * Calculate comprehensive system metrics
     */
    calculateSystemMetrics() {
        return {
            quantum_coherence_avg: this.calculateAverageQuantumCoherence(),
            network_health_avg: this.calculateAverageNetworkHealth(),
            growth_rate: this.calculateGrowthRate(),
            partnership_synergy: this.calculatePartnershipSynergy(),
            adaptation_efficiency: this.calculateAdaptationEfficiency()
        };
    }

    /**
     * Calculate average quantum coherence across all states
     */
    calculateAverageQuantumCoherence() {
        if (this.quantumStates.size === 0) return 0;
        
        let total = 0;
        for (const state of this.quantumStates.values()) {
            total += state.coherence_level;
        }
        
        return total / this.quantumStates.size;
    }

    /**
     * Calculate average network health
     */
    calculateAverageNetworkHealth() {
        if (this.networks.size === 0) return 0;
        
        let total = 0;
        for (const network of this.networks.values()) {
            total += network.health;
        }
        
        return total / this.networks.size;
    }

    /**
     * Calculate growth rate based on recent growth events
     */
    calculateGrowthRate() {
        const recentThreshold = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        const recentGrowthEvents = this.growthEvents.filter(event => 
            event.timestamp > recentThreshold
        );
        
        return recentGrowthEvents.length / 24; // Growth events per hour
    }

    /**
     * Calculate partnership synergy
     */
    calculatePartnershipSynergy() {
        if (this.partnerships.size === 0) return 0;
        
        let totalSynergy = 0;
        for (const partnership of this.partnerships.values()) {
            totalSynergy += partnership.compatibility_matrix.overall_compatibility;
        }
        
        return totalSynergy / this.partnerships.size;
    }

    /**
     * Calculate adaptation efficiency
     */
    calculateAdaptationEfficiency() {
        if (this.growthEvents.length === 0) return 0;
        
        const totalAdaptations = this.growthEvents.reduce((sum, event) => 
            sum + (event.adaptations?.length || 0), 0
        );
        
        return Math.min(1, totalAdaptations / (this.growthEvents.length * 5)); // Normalized to max 5 adaptations per event
    }
}

module.exports = { BioInspiredLearning };