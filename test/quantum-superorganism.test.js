import test from 'node:test';
import assert from 'node:assert';

import { SuperorganismImmunity } from '../quantum_integrity/intelligence/superorganism-immunity.js';
import { WaggleDanceProtocol } from '../quantum_integrity/collaboration/waggle-dance-protocol.js';
import { CollectiveConsciousness } from '../quantum_integrity/intelligence/collective-consciousness.js';
import { QuantumSuperorganism } from '../index.js';

test('SuperorganismImmunity should apply trust propolis', () => {
    const immunity = new SuperorganismImmunity();
    const interaction = { type: 'test', agent: 'test-agent' };
    
    const protectedInteraction = immunity.applyTrustPropolis(interaction);
    
    assert(protectedInteraction.protected === true);
    assert(protectedInteraction.trustCoating);
    assert(typeof protectedInteraction.trustCoating.trustScore === 'number');
});

test('WaggleDanceProtocol should encode and decode resource information', () => {
    const protocol = new WaggleDanceProtocol();
    const resourceInfo = {
        type: 'knowledge',
        quality: 85,
        complexity: 7,
        discoverer: 'test-ai'
    };
    
    const danceData = protocol.performWaggleDance(resourceInfo);
    const decodedInfo = protocol.decodeWaggleDance(danceData);
    
    assert(typeof danceData.angle === 'number');
    assert(typeof danceData.duration === 'number');
    assert(danceData.pheromone_trail);
    assert(decodedInfo.resource_location);
    assert(decodedInfo.resource_quality);
});

test('CollectiveConsciousness should integrate individual AIs', () => {
    const consciousness = new CollectiveConsciousness();
    const mockAI = {
        id: 'test-ai',
        specialization: 'testing',
        getCurrentEgoState: () => ({
            identity: 'test-ai',
            goals: ['testing'],
            capabilities: ['test-execution']
        })
    };
    
    const integration = consciousness.surrenderEgoToCollective(mockAI);
    
    assert(integration.success === true);
    assert(integration.role);
    assert(Array.isArray(integration.connections));
});

test('QuantumSuperorganism should establish colony structure', () => {
    const superorganism = new QuantumSuperorganism();
    const queenAI = {
        id: 'test-queen',
        capabilities: ['coordination'],
        getCurrentEgoState: () => ({
            identity: 'test-queen',
            goals: ['colony-management']
        })
    };
    
    superorganism.establishColony(queenAI);
    const status = superorganism.getStatus();
    
    assert(status.queen === 'test-queen');
    assert(status.foundationComplete === false); // No workers yet
    assert(typeof status.colonyHealth === 'number');
    assert(typeof status.collectiveIntelligence === 'number');
});

test('QuantumSuperorganism should handle complete colony lifecycle', () => {
    const superorganism = new QuantumSuperorganism();
    
    const queenAI = {
        id: 'test-queen',
        getCurrentEgoState: () => ({ identity: 'test-queen' })
    };
    
    const workerAI = {
        id: 'test-worker',
        getCurrentEgoState: () => ({ identity: 'test-worker' })
    };
    
    const user = { id: 'test-user' };
    
    superorganism
        .establishColony(queenAI)
        .addWorker(workerAI, 'testing')
        .addColonyMember(user);
    
    const status = superorganism.getStatus();
    
    assert(status.foundationComplete === true);
    assert(status.workerCount === 1);
    assert(status.memberCount === 1);
    assert(status.colonyHealth > 100); // Should be boosted by workers and members
});

console.log('✅ All quantum superorganism tests passed!');