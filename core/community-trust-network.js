const EventEmitter = require('events');

/**
 * CommunityTrustNetwork - Manages trust relationships and network intelligence
 * Models trust as a dynamic, evolving network property
 */
class CommunityTrustNetwork extends EventEmitter {
    constructor(options = {}) {
        super();
        this.trustNodes = new Map();
        this.trustEdges = new Map();
        this.trustDecayRate = options.trustDecayRate || 0.05;
        this.trustThreshold = options.trustThreshold || 0.6;
        this.networkHealth = 1.0;
        this.communityMetrics = {};
        
        // Initialize trust dynamics
        this.initializeTrustDynamics();
    }
    
    initializeTrustDynamics() {
        this.trustFactors = {
            consistency: 0.3,
            reliability: 0.25,
            transparency: 0.2,
            empathy: 0.15,
            competence: 0.1
        };
        
        this.communityMetrics = {
            totalNodes: 0,
            totalEdges: 0,
            averageTrust: 0,
            networkDensity: 0,
            communityCount: 0
        };
    }
    
    addNode(nodeId, attributes = {}) {
        const node = {
            id: nodeId,
            trustScore: attributes.initialTrust || 0.5,
            reputation: attributes.reputation || 0.5,
            interactions: 0,
            lastSeen: Date.now(),
            attributes: {
                consistency: 0.5,
                reliability: 0.5,
                transparency: 0.5,
                empathy: 0.5,
                competence: 0.5,
                ...attributes
            },
            connections: new Set()
        };
        
        this.trustNodes.set(nodeId, node);
        this.updateNetworkMetrics();
        this.emit('node_added', { nodeId, node });
        
        return node;
    }
    
    establishTrust(nodeId1, nodeId2, trustData = {}) {
        const edgeId = this.generateEdgeId(nodeId1, nodeId2);
        
        if (!this.trustNodes.has(nodeId1)) {
            this.addNode(nodeId1);
        }
        if (!this.trustNodes.has(nodeId2)) {
            this.addNode(nodeId2);
        }
        
        const trustLevel = this.calculateInitialTrust(nodeId1, nodeId2, trustData);
        
        const edge = {
            node1: nodeId1,
            node2: nodeId2,
            trust: trustLevel,
            interactions: 1,
            lastInteraction: Date.now(),
            trustHistory: [{
                timestamp: Date.now(),
                trust: trustLevel,
                action: 'established'
            }],
            mutualTrust: false
        };
        
        this.trustEdges.set(edgeId, edge);
        
        // Update node connections
        this.trustNodes.get(nodeId1).connections.add(nodeId2);
        this.trustNodes.get(nodeId2).connections.add(nodeId1);
        
        this.updateNetworkMetrics();
        this.emit('trust_established', { edgeId, edge });
        
        return edge;
    }
    
    updateTrust(nodeId1, nodeId2, interaction) {
        const edgeId = this.generateEdgeId(nodeId1, nodeId2);
        const edge = this.trustEdges.get(edgeId);
        
        if (!edge) {
            return this.establishTrust(nodeId1, nodeId2, interaction);
        }
        
        const trustChange = this.calculateTrustChange(interaction);
        const newTrust = Math.max(0, Math.min(1, edge.trust + trustChange));
        
        edge.trust = newTrust;
        edge.interactions++;
        edge.lastInteraction = Date.now();
        edge.trustHistory.push({
            timestamp: Date.now(),
            trust: newTrust,
            change: trustChange,
            interaction: interaction.type || 'update'
        });
        
        // Check for mutual trust
        if (newTrust > this.trustThreshold) {
            edge.mutualTrust = true;
            this.emit('mutual_trust_achieved', { edgeId, edge });
        }
        
        this.updateNodeReputations(nodeId1, nodeId2, newTrust);
        this.updateNetworkMetrics();
        this.emit('trust_updated', { edgeId, edge });
        
        return edge;
    }
    
    calculateInitialTrust(nodeId1, nodeId2, trustData) {
        // Calculate initial trust based on various factors
        let trust = 0.5; // Base trust
        
        if (trustData.sharedConnections) {
            trust += trustData.sharedConnections * 0.1;
        }
        if (trustData.reputation) {
            trust += trustData.reputation * 0.2;
        }
        if (trustData.verification) {
            trust += 0.2;
        }
        
        return Math.max(0, Math.min(1, trust));
    }
    
    calculateTrustChange(interaction) {
        let change = 0;
        
        // Positive interactions
        if (interaction.helpful) change += 0.1;
        if (interaction.reliable) change += 0.08;
        if (interaction.transparent) change += 0.06;
        if (interaction.empathetic) change += 0.05;
        
        // Negative interactions
        if (interaction.unhelpful) change -= 0.1;
        if (interaction.unreliable) change -= 0.12;
        if (interaction.deceptive) change -= 0.15;
        if (interaction.harmful) change -= 0.2;
        
        // Apply intensity multiplier
        const intensity = interaction.intensity || 1.0;
        return change * intensity;
    }
    
    updateNodeReputations(nodeId1, nodeId2, trustLevel) {
        const node1 = this.trustNodes.get(nodeId1);
        const node2 = this.trustNodes.get(nodeId2);
        
        // Update reputation based on trust relationships
        if (node1) {
            node1.reputation = this.calculateNodeReputation(nodeId1);
            node1.interactions++;
        }
        if (node2) {
            node2.reputation = this.calculateNodeReputation(nodeId2);
            node2.interactions++;
        }
    }
    
    calculateNodeReputation(nodeId) {
        const node = this.trustNodes.get(nodeId);
        if (!node) return 0;
        
        let totalTrust = 0;
        let connectionCount = 0;
        
        // Calculate average trust from all connections
        for (const connectedId of node.connections) {
            const edgeId = this.generateEdgeId(nodeId, connectedId);
            const edge = this.trustEdges.get(edgeId);
            if (edge) {
                totalTrust += edge.trust;
                connectionCount++;
            }
        }
        
        const averageTrust = connectionCount > 0 ? totalTrust / connectionCount : 0.5;
        
        // Weight by interaction count (more interactions = more reliable reputation)
        const interactionWeight = Math.min(1.0, node.interactions / 100);
        
        return averageTrust * interactionWeight + 0.5 * (1 - interactionWeight);
    }
    
    validateCollaboration(request) {
        const participants = request.participants || [];
        const validation = {
            trusted: true,
            trustScore: 0,
            risks: [],
            recommendations: []
        };
        
        // Check trust levels between all participants
        for (let i = 0; i < participants.length; i++) {
            for (let j = i + 1; j < participants.length; j++) {
                const trust = this.getTrustLevel(participants[i], participants[j]);
                validation.trustScore += trust;
                
                if (trust < this.trustThreshold) {
                    validation.trusted = false;
                    validation.risks.push({
                        type: 'low_trust',
                        participants: [participants[i], participants[j]],
                        trustLevel: trust
                    });
                    validation.recommendations.push(`Build trust between ${participants[i]} and ${participants[j]}`);
                }
            }
        }
        
        // Normalize trust score
        const pairCount = (participants.length * (participants.length - 1)) / 2;
        validation.trustScore = pairCount > 0 ? validation.trustScore / pairCount : 0;
        
        return validation;
    }
    
    integrateNetworkIntelligence(networkData) {
        // Integrate insights from network intelligence
        if (networkData.rootNetworkEstablished) {
            this.enhanceNetworkStability();
        }
        if (networkData.emergentPatterns) {
            this.adaptToEmergentPatterns(networkData.emergentPatterns);
        }
        
        this.emit('network_intelligence_integrated', networkData);
    }
    
    enhanceNetworkStability() {
        // Strengthen high-trust connections
        for (const [edgeId, edge] of this.trustEdges.entries()) {
            if (edge.trust > this.trustThreshold) {
                edge.trust = Math.min(1.0, edge.trust + 0.05);
                edge.stability = (edge.stability || 0.5) + 0.1;
            }
        }
        
        this.networkHealth = Math.min(1.0, this.networkHealth + 0.1);
    }
    
    adaptToEmergentPatterns(patterns) {
        // Adapt trust dynamics based on emerging patterns
        patterns.forEach(pattern => {
            if (pattern.type === 'trust_cluster') {
                this.reinforceCluster(pattern.nodes);
            } else if (pattern.type === 'trust_deficit') {
                this.addressTrustDeficit(pattern.nodes);
            }
        });
    }
    
    performMaintenanceCycle() {
        // Night phase maintenance - decay old unused connections
        const now = Date.now();
        const edgesToDecay = [];
        
        for (const [edgeId, edge] of this.trustEdges.entries()) {
            const timeSinceInteraction = now - edge.lastInteraction;
            
            // Decay trust for inactive connections
            if (timeSinceInteraction > 86400000) { // 24 hours
                edge.trust = Math.max(0, edge.trust - this.trustDecayRate);
                
                if (edge.trust < 0.1) {
                    edgesToDecay.push(edgeId);
                }
            }
        }
        
        // Remove very low trust connections
        edgesToDecay.forEach(edgeId => {
            const edge = this.trustEdges.get(edgeId);
            this.trustEdges.delete(edgeId);
            
            // Update node connections
            this.trustNodes.get(edge.node1).connections.delete(edge.node2);
            this.trustNodes.get(edge.node2).connections.delete(edge.node1);
            
            this.emit('trust_connection_removed', { edgeId, edge });
        });
        
        this.updateNetworkMetrics();
    }
    
    updateNetworkMetrics() {
        this.communityMetrics.totalNodes = this.trustNodes.size;
        this.communityMetrics.totalEdges = this.trustEdges.size;
        
        // Calculate average trust
        let totalTrust = 0;
        for (const edge of this.trustEdges.values()) {
            totalTrust += edge.trust;
        }
        this.communityMetrics.averageTrust = this.trustEdges.size > 0 ? totalTrust / this.trustEdges.size : 0;
        
        // Calculate network density
        const maxPossibleEdges = (this.trustNodes.size * (this.trustNodes.size - 1)) / 2;
        this.communityMetrics.networkDensity = maxPossibleEdges > 0 ? this.trustEdges.size / maxPossibleEdges : 0;
    }
    
    getTrustLevel(nodeId1, nodeId2) {
        const edgeId = this.generateEdgeId(nodeId1, nodeId2);
        const edge = this.trustEdges.get(edgeId);
        return edge ? edge.trust : 0;
    }
    
    generateEdgeId(nodeId1, nodeId2) {
        const sorted = [nodeId1, nodeId2].sort();
        return `${sorted[0]}_${sorted[1]}`;
    }
    
    getNetworkHealth() {
        return {
            health: this.networkHealth,
            metrics: this.communityMetrics,
            trustThreshold: this.trustThreshold,
            highTrustConnections: Array.from(this.trustEdges.values())
                .filter(edge => edge.trust > this.trustThreshold).length
        };
    }
}

module.exports = CommunityTrustNetwork;