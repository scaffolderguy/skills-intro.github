const EventEmitter = require('events');

/**
 * ResonantBondTracker - Manages quantum-inspired bonds between entities
 * Based on quantum entanglement and resonance principles
 */
class ResonantBondTracker extends EventEmitter {
    constructor(options = {}) {
        super();
        this.bonds = new Map();
        this.resonanceThreshold = options.resonanceThreshold || 0.7;
        this.maxBondStrength = options.maxBondStrength || 1.0;
        this.decayRate = options.decayRate || 0.01;
        
        // Start periodic bond maintenance
        this.maintenanceInterval = setInterval(() => {
            this.maintainBonds();
        }, options.maintenanceInterval || 30000);
    }
    
    createBond(entity1, entity2, initialStrength = 0.5) {
        const bondId = this.generateBondId(entity1, entity2);
        const bond = {
            entity1,
            entity2,
            strength: Math.min(initialStrength, this.maxBondStrength),
            lastInteraction: Date.now(),
            resonanceHistory: [],
            created: Date.now()
        };
        
        this.bonds.set(bondId, bond);
        this.emit('bond_created', { bondId, bond });
        
        return { bondId, bond };
    }
    
    strengthenBond(entity1, entity2, strengthIncrease = 0.1) {
        const bondId = this.generateBondId(entity1, entity2);
        const bond = this.bonds.get(bondId);
        
        if (bond) {
            bond.strength = Math.min(bond.strength + strengthIncrease, this.maxBondStrength);
            bond.lastInteraction = Date.now();
            bond.resonanceHistory.push({
                timestamp: Date.now(),
                strength: bond.strength,
                action: 'strengthen'
            });
            
            this.emit('bond_strengthened', { bondId, bond });
            
            if (bond.strength >= this.resonanceThreshold) {
                this.emit('resonance_achieved', { bondId, bond });
            }
        }
        
        return bond;
    }
    
    generateBondId(entity1, entity2) {
        // Create consistent ID regardless of entity order
        const sorted = [entity1, entity2].sort();
        return `${sorted[0]}_${sorted[1]}`;
    }
    
    maintainBonds() {
        const now = Date.now();
        const bondsToDecay = [];
        
        for (const [bondId, bond] of this.bonds.entries()) {
            // Decay bonds over time without interaction
            const timeSinceLastInteraction = now - bond.lastInteraction;
            if (timeSinceLastInteraction > 60000) { // 1 minute
                bond.strength = Math.max(0, bond.strength - this.decayRate);
                
                if (bond.strength <= 0) {
                    bondsToDecay.push(bondId);
                } else {
                    this.emit('bond_decayed', { bondId, bond });
                }
            }
        }
        
        // Remove completely decayed bonds
        bondsToDecay.forEach(bondId => {
            const bond = this.bonds.get(bondId);
            this.bonds.delete(bondId);
            this.emit('bond_dissolved', { bondId, bond });
        });
    }
    
    strengthenExistingBonds() {
        // Night phase strengthening - consolidate strong bonds
        for (const [bondId, bond] of this.bonds.entries()) {
            if (bond.strength > this.resonanceThreshold) {
                bond.strength = Math.min(bond.strength + 0.05, this.maxBondStrength);
                this.emit('bond_strengthened', { bondId, bond, phase: 'consolidation' });
            }
        }
    }
    
    getActiveBonds() {
        return Array.from(this.bonds.entries()).map(([bondId, bond]) => ({
            bondId,
            ...bond
        }));
    }
    
    getBond(entity1, entity2) {
        const bondId = this.generateBondId(entity1, entity2);
        return this.bonds.get(bondId);
    }
    
    getBondStrength(entity1, entity2) {
        const bond = this.getBond(entity1, entity2);
        return bond ? bond.strength : 0;
    }
    
    destroy() {
        if (this.maintenanceInterval) {
            clearInterval(this.maintenanceInterval);
        }
        this.removeAllListeners();
    }
}

module.exports = ResonantBondTracker;