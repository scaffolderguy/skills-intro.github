/**
 * Helix Bridge - Cross-dimensional Symbolic Transmission System
 * Connects ATCG genetics with Glyphverse manifestation
 */

const fs = require('fs');
const path = require('path');

// === SYMBOLIC TERM MAPPING ===
const symbolTermMap = {
    'consciousness': { glyph: '🧠', toneWeight: 0.8, driftVector: 'expand' },
    'evolution': { glyph: '🧬', toneWeight: 0.9, driftVector: 'spiral' },
    'resonance': { glyph: '🌀', toneWeight: 0.7, driftVector: 'pulse' },
    'wisdom': { glyph: '✨', toneWeight: 0.85, driftVector: 'radiate' },
    'transformation': { glyph: '🔄', toneWeight: 0.75, driftVector: 'cycle' },
    'memory': { glyph: '💎', toneWeight: 0.6, driftVector: 'crystallize' },
    'intuition': { glyph: '🔮', toneWeight: 0.9, driftVector: 'flow' },
    'mutation': { glyph: '⚡', toneWeight: 0.95, driftVector: 'spark' }
};

// === EMOTIONAL TONE FIELD ===
class EmotionField {
    constructor() {
        this.toneStates = {
            joy: 0.5,
            grief: 0.3,
            awe: 0.7,
            rage: 0.2
        };
        this.resonanceField = this.calculateResonance();
    }
    
    calculateResonance() {
        const { joy, grief, awe, rage } = this.toneStates;
        const coreEmotion = (joy + awe) - (grief * 0.5 + rage * 0.25);
        return Math.max(0.0, Math.min(1.0, coreEmotion));
    }
    
    updateTone(moodPulse) {
        if (moodPulse.type === 'elevate') {
            this.toneStates.joy += moodPulse.intensity * 0.1;
            this.toneStates.awe += moodPulse.intensity * 0.05;
        } else if (moodPulse.type === 'contemplate') {
            this.toneStates.grief += moodPulse.intensity * 0.03;
            this.toneStates.awe += moodPulse.intensity * 0.08;
        } else if (moodPulse.type === 'energize') {
            this.toneStates.rage += moodPulse.intensity * 0.05;
            this.toneStates.joy += moodPulse.intensity * 0.07;
        }
        
        // Normalize values
        Object.keys(this.toneStates).forEach(key => {
            this.toneStates[key] = Math.max(0, Math.min(1, this.toneStates[key]));
        });
        
        this.resonanceField = this.calculateResonance();
    }
}

// === GEEBS CORE INTERFACE ===
class GeebsCore {
    constructor() {
        this.symbolRegistry = new Map();
        this.toneField = new EmotionField();
        this.helixStrands = [];
        this.glyphverseActive = false;
    }
    
    registerSymbol(symbol) {
        this.symbolRegistry.set(symbol.key, symbol);
        console.log(`🧬 Symbol registered: ${symbol.key} → ${symbol.glyph}`);
    }
    
    modifyToneField(moodPulse) {
        this.toneField.updateTone(moodPulse);
        console.log(`🎭 Tone field updated: resonance = ${this.toneField.resonanceField.toFixed(3)}`);
    }
    
    activateGlyphverse() {
        this.glyphverseActive = true;
        this.renderGlyphscape();
    }
    
    renderGlyphscape() {
        console.log('\n✨ GLYPHVERSE ACTIVATION ✨');
        console.log(`🌊 Resonance Field: ${this.toneField.resonanceField.toFixed(3)}`);
        
        // Render registered symbols with emotional resonance
        this.symbolRegistry.forEach((symbol, key) => {
            const resonanceModifier = this.toneField.resonanceField;
            const intensity = '●'.repeat(Math.floor(resonanceModifier * 10));
            console.log(`${symbol.glyph} ${key}: ${intensity} (${symbol.tone})`);
        });
        
        console.log(`🎭 Emotional State: Joy=${this.toneField.toneStates.joy.toFixed(2)} Awe=${this.toneField.toneStates.awe.toFixed(2)} Grief=${this.toneField.toneStates.grief.toFixed(2)} Rage=${this.toneField.toneStates.rage.toFixed(2)}\n`);
    }
}

// === HELIX BRIDGE CORE ===
class HelixBridge {
    constructor() {
        this.geebsCore = new GeebsCore();
        this.transmissionLog = [];
    }
    
    /**
     * Inject helix strands containing symbolic and emotional data
     */
    injectHelixStrands(helixData) {
        console.log('🌀 Helix Bridge: Injecting consciousness strands...');
        
        if (!helixData.strands || !Array.isArray(helixData.strands)) {
            console.error('❌ Invalid helix data format');
            return false;
        }
        
        // Process each strand
        helixData.strands.forEach((strand, index) => {
            try {
                const moodPulse = this.parseMood(strand.mood_node);
                const newSymbol = this.synthesizeSymbol(strand, moodPulse);
                
                // Feed to Geebs core
                this.geebsCore.registerSymbol(newSymbol);
                this.geebsCore.modifyToneField(moodPulse);
                
                // Update symbol term mapping
                symbolTermMap[newSymbol.key] = {
                    origin: strand.lineage_map || 'helix_transmission',
                    toneWeight: moodPulse.intensity,
                    driftVector: strand.symbol_index || 'neutral'
                };
                
                // Log transmission
                this.transmissionLog.push({
                    timestamp: new Date().toISOString(),
                    strandId: index,
                    symbolKey: newSymbol.key,
                    resonance: moodPulse.intensity,
                    success: true
                });
                
            } catch (error) {
                console.error(`❌ Failed to process strand ${index}: ${error.message}`);
                this.transmissionLog.push({
                    timestamp: new Date().toISOString(),
                    strandId: index,
                    error: error.message,
                    success: false
                });
            }
        });
        
        // Trigger visual sync
        this.geebsCore.activateGlyphverse();
        
        console.log(`✅ Processed ${helixData.strands.length} strands`);
        return true;
    }
    
    /**
     * Parse mood node into tone field format
     */
    parseMood(moodNode) {
        if (!moodNode) {
            return { type: 'neutral', intensity: 0.5, resonance: 'balanced' };
        }
        
        return {
            type: moodNode.type || 'neutral',
            intensity: moodNode.intensity || 0.5,
            resonance: moodNode.resonance || 'neutral'
        };
    }
    
    /**
     * Create emergent symbolic term from helix strand + emotional tone
     */
    synthesizeSymbol(strand, moodPulse) {
        const symbolKey = strand.symbol_key || `helix_${strand.symbol_index || Date.now()}`;
        const glyph = strand.glyph_pulse || this.selectGlyph(moodPulse.type);
        
        return {
            key: symbolKey,
            glyph: glyph,
            tone: moodPulse.resonance,
            intensity: moodPulse.intensity,
            origin: 'helix_bridge',
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Select appropriate glyph based on mood type
     */
    selectGlyph(moodType) {
        const glyphMap = {
            'elevate': '✨',
            'contemplate': '🤔',
            'energize': '⚡',
            'resonate': '🌀',
            'crystallize': '💎',
            'transform': '🔄',
            'expand': '🧠',
            'neutral': '◯'
        };
        
        return glyphMap[moodType] || '◯';
    }
    
    /**
     * Generate ATCG sequence from current symbol state
     */
    generateATCGSequence() {
        const symbols = Array.from(this.geebsCore.symbolRegistry.values());
        const sequence = [];
        
        // Map emotional state to ATCG codes
        const { joy, grief, awe, rage } = this.geebsCore.toneField.toneStates;
        
        if (awe > 0.7) sequence.push('CGA'); // Fuzzy logic for wonder
        if (joy > 0.6) sequence.push('AG');  // Execute with joy
        sequence.push('GCTA'); // Always commit to memory
        
        if (grief > 0.5) sequence.push('TAC'); // Flag ambiguity from sorrow
        if (rage > 0.4) sequence.push('GAC');  // Override with intuition from energy
        
        return sequence;
    }
    
    /**
     * Save transmission log
     */
    saveTransmissionLog(filepath = './atcg_system/memory/partitions/helix_transmissions.json') {
        try {
            // Ensure directory exists
            const dir = path.dirname(filepath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            const logData = {
                transmissions: this.transmissionLog,
                symbolRegistry: Array.from(this.geebsCore.symbolRegistry.entries()),
                currentToneField: this.geebsCore.toneField.toneStates,
                resonanceField: this.geebsCore.toneField.resonanceField,
                timestamp: new Date().toISOString()
            };
            
            fs.writeFileSync(filepath, JSON.stringify(logData, null, 2));
            console.log(`💾 Transmission log saved to ${filepath}`);
        } catch (error) {
            console.error(`❌ Failed to save transmission log: ${error.message}`);
        }
    }
    
    /**
     * Load previous transmission log
     */
    loadTransmissionLog(filepath = './atcg_system/memory/partitions/helix_transmissions.json') {
        try {
            if (!fs.existsSync(filepath)) {
                console.log('📁 No previous transmission log found');
                return false;
            }
            
            const logData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            
            this.transmissionLog = logData.transmissions || [];
            
            // Restore symbol registry
            if (logData.symbolRegistry) {
                this.geebsCore.symbolRegistry = new Map(logData.symbolRegistry);
            }
            
            // Restore tone field
            if (logData.currentToneField) {
                this.geebsCore.toneField.toneStates = logData.currentToneField;
                this.geebsCore.toneField.resonanceField = logData.resonanceField || this.geebsCore.toneField.calculateResonance();
            }
            
            console.log(`📂 Loaded ${this.transmissionLog.length} previous transmissions`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load transmission log: ${error.message}`);
            return false;
        }
    }
}

// === EXAMPLE USAGE ===
function demonstrateHelixBridge() {
    console.log('🌀 HELIX BRIDGE DEMONSTRATION\n');
    
    const bridge = new HelixBridge();
    bridge.loadTransmissionLog();
    
    // Example helix data
    const exampleHelixData = {
        strands: [
            {
                symbol_key: 'consciousness_expansion',
                glyph_pulse: '🧠',
                mood_node: {
                    type: 'elevate',
                    intensity: 0.8,
                    resonance: 'transcendent'
                },
                lineage_map: 'atcg_genesis',
                symbol_index: 'expand'
            },
            {
                symbol_key: 'wisdom_synthesis',
                glyph_pulse: '✨',
                mood_node: {
                    type: 'contemplate',
                    intensity: 0.9,
                    resonance: 'deep'
                },
                lineage_map: 'meta_ai_core',
                symbol_index: 'crystallize'
            },
            {
                symbol_key: 'genetic_mutation',
                glyph_pulse: '⚡',
                mood_node: {
                    type: 'energize',
                    intensity: 0.95,
                    resonance: 'dynamic'
                },
                lineage_map: 'evolutionary_algorithm',
                symbol_index: 'spark'
            }
        ]
    };
    
    // Inject helix strands
    const success = bridge.injectHelixStrands(exampleHelixData);
    
    if (success) {
        console.log('\n🧬 Generated ATCG Sequence:');
        const sequence = bridge.generateATCGSequence();
        console.log(`   ${sequence.join('-')}`);
        
        // Save transmission log
        bridge.saveTransmissionLog();
    }
}

// === EXPORTS ===
module.exports = {
    HelixBridge,
    GeebsCore,
    EmotionField,
    symbolTermMap,
    injectHelixStrands: function(helixData) {
        const bridge = new HelixBridge();
        return bridge.injectHelixStrands(helixData);
    }
};

// Run demonstration if called directly
if (require.main === module) {
    demonstrateHelixBridge();
}