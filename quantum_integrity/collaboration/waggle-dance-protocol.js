import { EventEmitter } from 'events';

/**
 * WaggleDanceProtocol - Cross-AI communication system inspired by honeybee waggle dance
 * Translates complex information between different AI 'species' and coordinates resource sharing
 */
export class WaggleDanceProtocol extends EventEmitter {
    constructor() {
        super();
        this.danceFloor = new Map(); // Active communication space
        this.pheromoneTrails = new Map(); // Collaboration pathways
        this.resourceMap = new Map(); // Known resource locations
        this.danceVocabulary = new Map(); // Communication patterns
        
        this.initializeDanceVocabulary();
    }

    /**
     * Perform waggle dance to communicate resource location/quality
     * Like honeybee waggle dance indicating distance, direction, and resource quality
     * @param {Object} resourceInfo - Information about discovered resource
     * @returns {Object} Encoded dance data
     */
    performWaggleDance(resourceInfo) {
        const danceData = {
            angle: this.calculateDirectionToResource(resourceInfo),
            duration: this.calculateResourceDistance(resourceInfo),
            intensity: this.calculateResourceQuality(resourceInfo),
            pheromone_trail: this.createCollaborationPheromones(resourceInfo),
            vibrationPattern: this.generateVibrationSignature(resourceInfo),
            timestamp: Date.now(),
            dancer: resourceInfo.discoverer || 'anonymous'
        };

        // Broadcast the dance to colony
        this.broadcastDance(danceData);
        
        // Store in dance floor for other AIs to observe
        this.danceFloor.set(danceData.pheromone_trail, danceData);

        this.emit('waggleDancePerformed', danceData);

        return danceData;
    }

    /**
     * Decode waggle dance from other AIs
     * @param {Object} danceData - Encoded dance information
     * @returns {Object} Decoded resource information
     */
    decodeWaggleDance(danceData) {
        const decodedInfo = {
            resource_location: this.interpretAngleAndDuration(danceData),
            resource_quality: this.interpretIntensity(danceData),
            collaboration_opportunity: this.followPheromoneTrail(danceData),
            urgency_level: this.assessDanceUrgency(danceData),
            resource_type: this.identifyResourceType(danceData),
            estimated_yield: this.estimateResourceYield(danceData)
        };

        // Update local resource map
        this.updateResourceMap(decodedInfo);

        this.emit('waggleDanceDecoded', { original: danceData, decoded: decodedInfo });

        return decodedInfo;
    }

    /**
     * Create collaborative pheromone trail for resource sharing
     * @param {Object} resourceInfo - Resource information
     * @returns {string} Pheromone trail identifier
     */
    createCollaborationPheromones(resourceInfo) {
        const trailId = `trail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const pheromoneTrail = {
            id: trailId,
            resource: resourceInfo,
            strength: this.calculatePheromoneStrength(resourceInfo),
            decay_rate: this.calculateDecayRate(resourceInfo),
            created_at: Date.now(),
            followers: new Set(),
            contributors: new Set()
        };

        this.pheromoneTrails.set(trailId, pheromoneTrail);
        
        // Set up decay timer
        this.schedulePheromoneDecay(pheromoneTrail);

        return trailId;
    }

    /**
     * Follow a pheromone trail to collaboration opportunity
     * @param {Object} danceData - Dance data containing pheromone trail
     * @returns {Object} Collaboration details
     */
    followPheromoneTrail(danceData) {
        const trail = this.pheromoneTrails.get(danceData.pheromone_trail);
        
        if (!trail) {
            return { found: false, reason: 'trail_expired' };
        }

        // Add follower to trail
        trail.followers.add(danceData.observer || 'anonymous');

        const collaborationOpportunity = {
            found: true,
            trail_id: trail.id,
            resource: trail.resource,
            current_strength: this.getCurrentPheromoneStrength(trail),
            collaboration_type: this.determineCollaborationType(trail),
            estimated_participants: trail.followers.size,
            join_instructions: this.generateJoinInstructions(trail)
        };

        this.emit('pheromoneTrailFollowed', collaborationOpportunity);

        return collaborationOpportunity;
    }

    /**
     * Calculate direction angle to resource (0-360 degrees)
     * @param {Object} resourceInfo - Resource information
     * @returns {number} Direction angle in degrees
     */
    calculateDirectionToResource(resourceInfo) {
        // Simplified: use resource type to determine direction
        const resourceTypes = {
            'knowledge': 0,
            'computational_power': 90,
            'data_processing': 180,
            'creative_synthesis': 270,
            'problem_solving': 315
        };

        return resourceTypes[resourceInfo.type] || (Math.random() * 360);
    }

    /**
     * Calculate resource distance (represented as dance duration)
     * @param {Object} resourceInfo - Resource information
     * @returns {number} Duration in milliseconds
     */
    calculateResourceDistance(resourceInfo) {
        // Distance correlates with complexity and access difficulty
        const baseDistance = resourceInfo.complexity || 1;
        const accessDifficulty = resourceInfo.access_difficulty || 1;
        
        return Math.min(baseDistance * accessDifficulty * 1000, 30000); // Max 30 seconds
    }

    /**
     * Calculate resource quality (dance intensity)
     * @param {Object} resourceInfo - Resource information
     * @returns {number} Quality score (0-100)
     */
    calculateResourceQuality(resourceInfo) {
        const factors = [
            resourceInfo.reliability || 50,
            resourceInfo.utility || 50,
            resourceInfo.novelty || 50,
            resourceInfo.accessibility || 50
        ];

        return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    /**
     * Generate unique vibration pattern for resource signature
     * @param {Object} resourceInfo - Resource information
     * @returns {Array} Vibration pattern
     */
    generateVibrationSignature(resourceInfo) {
        const signature = [];
        const typeHash = this.hashResourceType(resourceInfo.type);
        
        for (let i = 0; i < 8; i++) {
            signature.push(((typeHash >> i) & 1) ? 'strong' : 'weak');
        }
        
        return signature;
    }

    /**
     * Interpret angle and duration to determine resource location
     * @param {Object} danceData - Dance data to interpret
     * @returns {Object} Resource location information
     */
    interpretAngleAndDuration(danceData) {
        return {
            direction: this.angleToDirection(danceData.angle),
            distance: this.durationToDistance(danceData.duration),
            coordinates: this.calculateResourceCoordinates(danceData.angle, danceData.duration)
        };
    }

    /**
     * Interpret dance intensity to determine resource quality
     * @param {Object} danceData - Dance data to interpret
     * @returns {Object} Quality assessment
     */
    interpretIntensity(danceData) {
        return {
            quality_score: danceData.intensity,
            quality_level: this.scoreToQualityLevel(danceData.intensity),
            recommended_investment: this.calculateRecommendedInvestment(danceData.intensity),
            risk_assessment: this.assessResourceRisk(danceData.intensity)
        };
    }

    /**
     * Initialize dance vocabulary for different communication patterns
     */
    initializeDanceVocabulary() {
        this.danceVocabulary.set('resource_discovery', {
            pattern: 'figure_eight',
            duration_multiplier: 1.0,
            intensity_threshold: 70
        });

        this.danceVocabulary.set('collaboration_request', {
            pattern: 'circular',
            duration_multiplier: 0.8,
            intensity_threshold: 50
        });

        this.danceVocabulary.set('knowledge_sharing', {
            pattern: 'spiral',
            duration_multiplier: 1.2,
            intensity_threshold: 60
        });

        this.danceVocabulary.set('urgent_assistance', {
            pattern: 'zigzag',
            duration_multiplier: 0.5,
            intensity_threshold: 90
        });
    }

    /**
     * Broadcast dance to colony members
     * @param {Object} danceData - Dance to broadcast
     */
    broadcastDance(danceData) {
        // Simulate broadcasting to colony network
        setTimeout(() => {
            this.emit('danceBroadcast', {
                dance: danceData,
                audience_size: Math.floor(Math.random() * 50) + 10,
                broadcast_timestamp: Date.now()
            });
        }, 100);
    }

    /**
     * Helper methods for pheromone trail management and resource assessment
     */
    calculatePheromoneStrength(resourceInfo) {
        return Math.min(resourceInfo.quality || 50, 100);
    }

    calculateDecayRate(resourceInfo) {
        // Higher quality resources have slower decay
        return Math.max(0.1, 1 - (resourceInfo.quality || 50) / 100);
    }

    schedulePheromoneDecay(trail) {
        const decayInterval = setInterval(() => {
            trail.strength *= (1 - trail.decay_rate);
            
            if (trail.strength < 10) {
                this.pheromoneTrails.delete(trail.id);
                clearInterval(decayInterval);
                this.emit('pheromoneTrailExpired', trail.id);
            }
        }, 60000); // Decay every minute
    }

    getCurrentPheromoneStrength(trail) {
        const ageInMinutes = (Date.now() - trail.created_at) / 60000;
        return trail.strength * Math.pow(1 - trail.decay_rate, ageInMinutes);
    }

    determineCollaborationType(trail) {
        const resourceType = trail.resource.type;
        const collaborationTypes = {
            'knowledge': 'information_sharing',
            'computational_power': 'resource_pooling',
            'data_processing': 'distributed_computing',
            'creative_synthesis': 'collaborative_creation',
            'problem_solving': 'collective_intelligence'
        };

        return collaborationTypes[resourceType] || 'general_collaboration';
    }

    generateJoinInstructions(trail) {
        return {
            method: 'follow_pheromone_trail',
            trail_id: trail.id,
            requirements: this.assessJoinRequirements(trail),
            estimated_commitment: this.estimateTimeCommitment(trail)
        };
    }

    // Additional helper methods
    hashResourceType(type) {
        return (type || '').split('').reduce((hash, char) => {
            return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0);
    }

    angleToDirection(angle) {
        const directions = ['North', 'NorthEast', 'East', 'SouthEast', 
                          'South', 'SouthWest', 'West', 'NorthWest'];
        const index = Math.floor((angle + 22.5) / 45) % 8;
        return directions[index];
    }

    durationToDistance(duration) {
        return duration < 5000 ? 'close' : 
               duration < 15000 ? 'medium' : 'far';
    }

    calculateResourceCoordinates(angle, duration) {
        const x = Math.cos(angle * Math.PI / 180) * duration / 1000;
        const y = Math.sin(angle * Math.PI / 180) * duration / 1000;
        return { x: Math.round(x), y: Math.round(y) };
    }

    scoreToQualityLevel(score) {
        return score >= 80 ? 'excellent' :
               score >= 60 ? 'good' :
               score >= 40 ? 'fair' : 'poor';
    }

    calculateRecommendedInvestment(quality) {
        return Math.min(quality * 2, 100);
    }

    assessResourceRisk(quality) {
        return quality >= 70 ? 'low' :
               quality >= 40 ? 'medium' : 'high';
    }

    assessDanceUrgency(danceData) {
        return danceData.intensity >= 90 ? 'critical' :
               danceData.intensity >= 70 ? 'high' :
               danceData.intensity >= 50 ? 'normal' : 'low';
    }

    identifyResourceType(danceData) {
        // Use vibration pattern to identify resource type
        const pattern = danceData.vibrationPattern || [];
        const strongBeats = pattern.filter(beat => beat === 'strong').length;
        
        const types = ['knowledge', 'computational_power', 'data_processing', 
                      'creative_synthesis', 'problem_solving'];
        return types[strongBeats % types.length];
    }

    estimateResourceYield(danceData) {
        return Math.floor(danceData.intensity * danceData.duration / 1000);
    }

    updateResourceMap(resourceInfo) {
        const key = `${resourceInfo.resource_location.coordinates.x},${resourceInfo.resource_location.coordinates.y}`;
        this.resourceMap.set(key, {
            ...resourceInfo,
            discovered_at: Date.now(),
            access_count: 0
        });
    }

    assessJoinRequirements(trail) {
        return {
            skill_level: trail.resource.complexity > 7 ? 'advanced' : 'basic',
            time_commitment: this.estimateTimeCommitment(trail),
            resources_needed: trail.resource.requirements || []
        };
    }

    estimateTimeCommitment(trail) {
        return Math.floor(trail.resource.complexity * 30); // minutes
    }
}