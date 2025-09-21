const OpenAI = require('openai');

class WorkflowManager {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Task and Workflow Management - AI-driven task assignment
   * Based on team member strengths, availability, and current workload
   * Tracks progress and provides nudges or reminders to keep projects on track
   */
  async assignTasks(teamId, tasks) {
    try {
      const teamMembers = await this.getTeamMembers(teamId);
      const assignments = await this.optimizeTaskAssignment(teamMembers, tasks);
      const workflow = this.createWorkflowPlan(assignments);
      
      return {
        teamId,
        assignments,
        workflow,
        estimatedCompletion: this.calculateCompletionTime(assignments),
        riskAssessment: this.assessRisks(assignments),
        recommendations: this.generateWorkflowRecommendations(assignments),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Task assignment failed:', error);
      throw new Error(`Task assignment failed: ${error.message}`);
    }
  }

  async optimizeTaskAssignment(teamMembers, tasks) {
    const assignments = [];
    
    for (const task of tasks) {
      const bestMatch = await this.findBestMemberForTask(teamMembers, task);
      assignments.push({
        taskId: task.id,
        task: task,
        assignedTo: bestMatch.member,
        compatibilityScore: bestMatch.score,
        reasoning: bestMatch.reasoning,
        estimatedHours: this.estimateTaskHours(task, bestMatch.member),
        priority: task.priority || 'medium',
        dependencies: task.dependencies || [],
        suggestedCollaborators: this.suggestCollaborators(teamMembers, task, bestMatch.member)
      });
    }

    return this.balanceWorkload(assignments, teamMembers);
  }

  async findBestMemberForTask(teamMembers, task) {
    const candidates = teamMembers.map(member => ({
      member,
      score: this.calculateTaskCompatibility(member, task),
      reasoning: this.generateAssignmentReasoning(member, task)
    }));

    // Sort by compatibility score
    candidates.sort((a, b) => b.score - a.score);
    
    // Consider workload balance
    const balancedCandidate = this.considerWorkloadBalance(candidates);
    
    return balancedCandidate;
  }

  calculateTaskCompatibility(member, task) {
    let score = 0;
    const profile = member.personalityProfile || {};
    const strengths = profile.strengths || [];
    const workingStyle = profile.working_style || {};
    
    // Skill match (40% of score)
    const skillMatch = this.calculateSkillMatch(strengths, task.requiredSkills || []);
    score += skillMatch * 0.4;
    
    // Personality fit (30% of score)
    const personalityFit = this.calculatePersonalityFit(profile, task);
    score += personalityFit * 0.3;
    
    // Availability (20% of score)
    const availability = this.calculateAvailability(member, task);
    score += availability * 0.2;
    
    // Interest level (10% of score)
    const interest = this.calculateInterest(member, task);
    score += interest * 0.1;
    
    return Math.round(score);
  }

  calculateSkillMatch(memberSkills, requiredSkills) {
    if (!requiredSkills.length) return 80; // Default for tasks without specific requirements
    
    const matches = requiredSkills.filter(skill => 
      memberSkills.some(memberSkill => 
        memberSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(memberSkill.toLowerCase())
      )
    );
    
    return (matches.length / requiredSkills.length) * 100;
  }

  calculatePersonalityFit(profile, task) {
    const taskType = task.type || 'general';
    const personality = profile.personality?.big_five_scores || {};
    
    const fitScores = {
      creative: () => personality.openness * 0.6 + personality.extraversion * 0.4,
      analytical: () => personality.conscientiousness * 0.7 + personality.openness * 0.3,
      leadership: () => personality.extraversion * 0.5 + personality.conscientiousness * 0.3 + (100 - personality.neuroticism) * 0.2,
      collaborative: () => personality.agreeableness * 0.6 + personality.extraversion * 0.4,
      independent: () => personality.conscientiousness * 0.6 + (100 - personality.extraversion) * 0.4,
      general: () => (personality.conscientiousness + personality.agreeableness + personality.openness) / 3
    };

    return fitScores[taskType] ? fitScores[taskType]() : fitScores.general();
  }

  calculateAvailability(member, task) {
    const currentWorkload = member.currentWorkload || 40; // hours per week
    const capacity = member.weeklyCapacity || 40;
    const availableHours = capacity - currentWorkload;
    const requiredHours = task.estimatedHours || 8;
    
    if (availableHours >= requiredHours) return 100;
    if (availableHours <= 0) return 0;
    
    return (availableHours / requiredHours) * 100;
  }

  calculateInterest(member, task) {
    const interests = member.interests || [];
    const taskTags = task.tags || [];
    
    if (!taskTags.length) return 70; // Default interest level
    
    const matchingInterests = taskTags.filter(tag => 
      interests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    return matchingInterests.length > 0 ? 90 : 50;
  }

  generateAssignmentReasoning(member, task) {
    const profile = member.personalityProfile || {};
    const strengths = profile.strengths || [];
    const matchingStrengths = strengths.filter(strength => 
      task.requiredSkills?.some(skill => 
        skill.toLowerCase().includes(strength.toLowerCase()) ||
        strength.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const reasons = [];
    
    if (matchingStrengths.length > 0) {
      reasons.push(`Strong skill match: ${matchingStrengths.join(', ')}`);
    }
    
    if (profile.personality?.big_five_scores) {
      const personality = profile.personality.big_five_scores;
      if (task.type === 'creative' && personality.openness > 70) {
        reasons.push('High openness ideal for creative tasks');
      }
      if (task.type === 'analytical' && personality.conscientiousness > 70) {
        reasons.push('High conscientiousness perfect for analytical work');
      }
      if (task.complexity === 'high' && personality.conscientiousness > 75) {
        reasons.push('High conscientiousness handles complex tasks well');
      }
    }
    
    if (member.currentWorkload < member.weeklyCapacity * 0.8) {
      reasons.push('Good availability for task completion');
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'General compatibility based on profile';
  }

  suggestCollaborators(teamMembers, task, assignedMember) {
    if (!task.collaborative) return [];
    
    const collaborators = teamMembers
      .filter(member => member.id !== assignedMember.id)
      .map(member => ({
        member,
        synergy: this.calculateSynergy(assignedMember, member, task)
      }))
      .sort((a, b) => b.synergy - a.synergy)
      .slice(0, 2) // Top 2 collaborators
      .filter(collab => collab.synergy > 60);
    
    return collaborators.map(c => ({
      member: c.member,
      synergyScore: c.synergy,
      role: this.suggestCollaborationRole(c.member, task)
    }));
  }

  calculateSynergy(member1, member2, task) {
    const profile1 = member1.personalityProfile || {};
    const profile2 = member2.personalityProfile || {};
    
    // Complementary strengths
    const strengths1 = new Set(profile1.strengths || []);
    const strengths2 = new Set(profile2.strengths || []);
    const complementary = [...strengths2].filter(s => !strengths1.has(s));
    const complementaryScore = complementary.length * 10;
    
    // Communication compatibility
    const comm1 = profile1.communication || {};
    const comm2 = profile2.communication || {};
    const commScore = comm1.style === comm2.style ? 20 : 10;
    
    // Personality balance
    const personality1 = profile1.personality?.big_five_scores || {};
    const personality2 = profile2.personality?.big_five_scores || {};
    const balanceScore = this.calculatePersonalityBalance(personality1, personality2);
    
    return Math.min(100, complementaryScore + commScore + balanceScore);
  }

  calculatePersonalityBalance(p1, p2) {
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    let balance = 0;
    
    traits.forEach(trait => {
      const diff = Math.abs((p1[trait] || 50) - (p2[trait] || 50));
      // Moderate differences (20-40) are good for balance
      if (diff >= 20 && diff <= 40) balance += 10;
      else if (diff < 20) balance += 5; // Too similar
      // Large differences (>40) get no bonus
    });
    
    return balance;
  }

  suggestCollaborationRole(member, task) {
    const strengths = member.personalityProfile?.strengths || [];
    const personality = member.personalityProfile?.personality?.big_five_scores || {};
    
    if (strengths.includes('leadership') || personality.extraversion > 70) {
      return 'Coordination and Communication';
    }
    if (strengths.includes('creativity') || personality.openness > 70) {
      return 'Creative Input and Innovation';
    }
    if (strengths.includes('analytical thinking') || personality.conscientiousness > 70) {
      return 'Quality Assurance and Analysis';
    }
    
    return 'Support and Review';
  }

  balanceWorkload(assignments, teamMembers) {
    const workloadMap = new Map();
    
    // Initialize workload map
    teamMembers.forEach(member => {
      workloadMap.set(member.id, member.currentWorkload || 0);
    });
    
    // Add assignment hours to workload
    assignments.forEach(assignment => {
      const currentLoad = workloadMap.get(assignment.assignedTo.id) || 0;
      workloadMap.set(assignment.assignedTo.id, currentLoad + assignment.estimatedHours);
    });
    
    // Check for overloaded members and suggest redistributions
    const balancedAssignments = [...assignments];
    const overloadedMembers = [];
    
    for (const [memberId, workload] of workloadMap.entries()) {
      const member = teamMembers.find(m => m.id === memberId);
      if (member && workload > (member.weeklyCapacity || 40)) {
        overloadedMembers.push({ member, overload: workload - member.weeklyCapacity });
      }
    }
    
    // If there are overloaded members, try to redistribute
    if (overloadedMembers.length > 0) {
      balancedAssignments.forEach(assignment => {
        if (overloadedMembers.some(om => om.member.id === assignment.assignedTo.id)) {
          assignment.workloadWarning = true;
          assignment.redistributionSuggestions = this.suggestRedistribution(assignment, teamMembers, workloadMap);
        }
      });
    }
    
    return balancedAssignments;
  }

  suggestRedistribution(assignment, teamMembers, workloadMap) {
    const alternatives = teamMembers
      .filter(member => member.id !== assignment.assignedTo.id)
      .filter(member => (workloadMap.get(member.id) || 0) + assignment.estimatedHours <= (member.weeklyCapacity || 40))
      .map(member => ({
        member,
        score: this.calculateTaskCompatibility(member, assignment.task),
        currentWorkload: workloadMap.get(member.id) || 0
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    return alternatives;
  }

  createWorkflowPlan(assignments) {
    const timeline = this.buildTimeline(assignments);
    const dependencies = this.resolveDependencies(assignments);
    const milestones = this.identifyMilestones(assignments);
    const criticalPath = this.calculateCriticalPath(assignments);
    
    return {
      timeline,
      dependencies,
      milestones,
      criticalPath,
      parallelTasks: this.identifyParallelTasks(assignments),
      bottlenecks: this.identifyBottlenecks(assignments),
      bufferTime: this.calculateBufferTime(assignments)
    };
  }

  buildTimeline(assignments) {
    const sortedAssignments = [...assignments].sort((a, b) => {
      // Sort by priority and dependencies
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by dependency count
      return (a.dependencies?.length || 0) - (b.dependencies?.length || 0);
    });
    
    const timeline = [];
    let currentWeek = 1;
    
    sortedAssignments.forEach(assignment => {
      const startWeek = this.calculateStartWeek(assignment, timeline);
      const endWeek = startWeek + Math.ceil(assignment.estimatedHours / 40) - 1;
      
      timeline.push({
        taskId: assignment.taskId,
        assignedTo: assignment.assignedTo.name,
        startWeek,
        endWeek,
        duration: endWeek - startWeek + 1,
        priority: assignment.priority
      });
    });
    
    return timeline.sort((a, b) => a.startWeek - b.startWeek);
  }

  calculateStartWeek(assignment, timeline) {
    let startWeek = 1;
    
    // Check dependencies
    if (assignment.dependencies?.length > 0) {
      assignment.dependencies.forEach(depId => {
        const depTask = timeline.find(t => t.taskId === depId);
        if (depTask) {
          startWeek = Math.max(startWeek, depTask.endWeek + 1);
        }
      });
    }
    
    return startWeek;
  }

  resolveDependencies(assignments) {
    const dependencyMap = new Map();
    
    assignments.forEach(assignment => {
      dependencyMap.set(assignment.taskId, assignment.dependencies || []);
    });
    
    return Object.fromEntries(dependencyMap);
  }

  identifyMilestones(assignments) {
    const milestones = [];
    
    // High priority tasks are milestones
    assignments.filter(a => a.priority === 'high').forEach(assignment => {
      milestones.push({
        taskId: assignment.taskId,
        title: assignment.task.title,
        type: 'priority',
        importance: 'high'
      });
    });
    
    // Tasks with many dependencies are milestones
    const dependencyCounts = new Map();
    assignments.forEach(assignment => {
      assignment.dependencies?.forEach(depId => {
        dependencyCounts.set(depId, (dependencyCounts.get(depId) || 0) + 1);
      });
    });
    
    dependencyCounts.forEach((count, taskId) => {
      if (count >= 2) {
        const assignment = assignments.find(a => a.taskId === taskId);
        if (assignment) {
          milestones.push({
            taskId,
            title: assignment.task.title,
            type: 'dependency',
            importance: 'medium',
            dependents: count
          });
        }
      }
    });
    
    return milestones;
  }

  calculateCriticalPath(assignments) {
    // Simplified critical path calculation
    const taskDurations = new Map();
    const dependencies = new Map();
    
    assignments.forEach(assignment => {
      taskDurations.set(assignment.taskId, Math.ceil(assignment.estimatedHours / 8)); // days
      dependencies.set(assignment.taskId, assignment.dependencies || []);
    });
    
    return this.findLongestPath(taskDurations, dependencies);
  }

  findLongestPath(durations, dependencies) {
    const visited = new Set();
    const path = [];
    let maxDuration = 0;
    
    const dfs = (taskId, currentPath, currentDuration) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const taskDuration = durations.get(taskId) || 0;
      const newDuration = currentDuration + taskDuration;
      const newPath = [...currentPath, taskId];
      
      if (newDuration > maxDuration) {
        maxDuration = newDuration;
        path.splice(0, path.length, ...newPath);
      }
      
      const deps = dependencies.get(taskId) || [];
      deps.forEach(depId => {
        dfs(depId, newPath, newDuration);
      });
      
      visited.delete(taskId);
    };
    
    durations.forEach((duration, taskId) => {
      dfs(taskId, [], 0);
    });
    
    return {
      path,
      duration: maxDuration,
      tasks: path.length
    };
  }

  identifyParallelTasks(assignments) {
    const parallel = [];
    const processed = new Set();
    
    assignments.forEach(assignment => {
      if (processed.has(assignment.taskId)) return;
      
      const parallelGroup = assignments.filter(other => 
        other.taskId !== assignment.taskId &&
        !processed.has(other.taskId) &&
        this.canRunInParallel(assignment, other, assignments)
      );
      
      if (parallelGroup.length > 0) {
        const group = [assignment, ...parallelGroup];
        parallel.push(group.map(a => a.taskId));
        group.forEach(a => processed.add(a.taskId));
      }
    });
    
    return parallel;
  }

  canRunInParallel(task1, task2, allAssignments) {
    // Different assignees
    if (task1.assignedTo.id === task2.assignedTo.id) return false;
    
    // No dependency relationship
    const deps1 = task1.dependencies || [];
    const deps2 = task2.dependencies || [];
    
    if (deps1.includes(task2.taskId) || deps2.includes(task1.taskId)) return false;
    
    // No resource conflicts (simplified check)
    return true;
  }

  identifyBottlenecks(assignments) {
    const memberWorkload = new Map();
    
    assignments.forEach(assignment => {
      const memberId = assignment.assignedTo.id;
      const currentLoad = memberWorkload.get(memberId) || 0;
      memberWorkload.set(memberId, currentLoad + assignment.estimatedHours);
    });
    
    return Array.from(memberWorkload.entries())
      .filter(([memberId, workload]) => workload > 35) // Threshold for bottleneck
      .map(([memberId, workload]) => {
        const member = assignments.find(a => a.assignedTo.id === memberId)?.assignedTo;
        return {
          member: member?.name || memberId,
          workload,
          capacity: member?.weeklyCapacity || 40,
          overload: workload - (member?.weeklyCapacity || 40)
        };
      });
  }

  calculateBufferTime(assignments) {
    const totalEstimated = assignments.reduce((sum, a) => sum + a.estimatedHours, 0);
    const bufferPercentage = 0.2; // 20% buffer
    return Math.ceil(totalEstimated * bufferPercentage);
  }

  estimateTaskHours(task, member) {
    let baseHours = task.estimatedHours || 8;
    const profile = member.personalityProfile || {};
    const strengths = profile.strengths || [];
    
    // Adjust based on skill match
    const skillMatch = this.calculateSkillMatch(strengths, task.requiredSkills || []);
    if (skillMatch > 80) baseHours *= 0.8; // 20% faster
    else if (skillMatch < 50) baseHours *= 1.3; // 30% slower
    
    // Adjust based on complexity
    const complexityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.4,
      very_high: 1.8
    };
    
    baseHours *= complexityMultiplier[task.complexity || 'medium'];
    
    return Math.ceil(baseHours);
  }

  calculateCompletionTime(assignments) {
    if (!assignments.length) return new Date();
    
    const maxEndWeek = Math.max(...assignments.map(a => {
      const startWeek = 1; // Simplified
      return startWeek + Math.ceil(a.estimatedHours / 40);
    }));
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (maxEndWeek * 7));
    
    return completionDate;
  }

  assessRisks(assignments) {
    const risks = [];
    
    // Check for overloaded team members
    const workloadRisks = assignments
      .filter(a => a.workloadWarning)
      .map(a => ({
        type: 'workload',
        severity: 'high',
        description: `${a.assignedTo.name} may be overloaded`,
        impact: 'Potential delays and quality issues'
      }));
    
    risks.push(...workloadRisks);
    
    // Check for skill mismatches
    const skillRisks = assignments
      .filter(a => a.compatibilityScore < 60)
      .map(a => ({
        type: 'skill_mismatch',
        severity: 'medium',
        description: `Low compatibility score for ${a.task.title}`,
        impact: 'May require additional support or training'
      }));
    
    risks.push(...skillRisks);
    
    // Check for dependency chains
    const longChains = this.findLongDependencyChains(assignments);
    if (longChains.length > 5) {
      risks.push({
        type: 'dependency_chain',
        severity: 'medium',
        description: 'Long dependency chain detected',
        impact: 'Any delay could cascade through multiple tasks'
      });
    }
    
    return risks;
  }

  findLongDependencyChains(assignments) {
    // Simplified dependency chain detection
    const chains = [];
    assignments.forEach(assignment => {
      if (assignment.dependencies?.length > 0) {
        chains.push(assignment.dependencies.length);
      }
    });
    return chains;
  }

  generateWorkflowRecommendations(assignments) {
    const recommendations = [];
    
    // Workload balancing
    const overloaded = assignments.filter(a => a.workloadWarning);
    if (overloaded.length > 0) {
      recommendations.push({
        category: 'workload',
        priority: 'high',
        recommendation: 'Consider redistributing tasks or extending timeline',
        details: `${overloaded.length} team members may be overloaded`
      });
    }
    
    // Skill development
    const lowCompatibility = assignments.filter(a => a.compatibilityScore < 70);
    if (lowCompatibility.length > 0) {
      recommendations.push({
        category: 'skill_development',
        priority: 'medium',
        recommendation: 'Provide additional training or pair programming support',
        details: `${lowCompatibility.length} tasks have low compatibility scores`
      });
    }
    
    // Collaboration opportunities
    const collaborativeTasks = assignments.filter(a => a.suggestedCollaborators?.length > 0);
    if (collaborativeTasks.length > 0) {
      recommendations.push({
        category: 'collaboration',
        priority: 'low',
        recommendation: 'Leverage suggested collaborations for knowledge sharing',
        details: `${collaborativeTasks.length} tasks have beneficial collaboration opportunities`
      });
    }
    
    return recommendations;
  }

  // Placeholder method - would normally fetch from database
  async getTeamMembers(teamId) {
    // Mock data for demonstration
    return [
      {
        id: 1,
        name: 'Alice Johnson',
        currentWorkload: 32,
        weeklyCapacity: 40,
        interests: ['frontend', 'user experience', 'design'],
        personalityProfile: {
          strengths: ['leadership', 'communication', 'creativity'],
          personality: {
            big_five_scores: {
              openness: 85,
              conscientiousness: 78,
              extraversion: 65,
              agreeableness: 82,
              neuroticism: 35
            }
          },
          communication: {
            style: 'collaborative',
            preference: 'verbal'
          },
          working_style: {
            focus_preference: 'collaborative_energy',
            energy_peaks: ['morning', 'afternoon']
          }
        }
      },
      {
        id: 2,
        name: 'Bob Smith',
        currentWorkload: 28,
        weeklyCapacity: 40,
        interests: ['backend', 'databases', 'architecture'],
        personalityProfile: {
          strengths: ['technical expertise', 'analytical thinking', 'problem-solving'],
          personality: {
            big_five_scores: {
              openness: 72,
              conscientiousness: 88,
              extraversion: 45,
              agreeableness: 75,
              neuroticism: 42
            }
          },
          communication: {
            style: 'analytical',
            preference: 'written'
          },
          working_style: {
            focus_preference: 'deep_focus',
            energy_peaks: ['morning']
          }
        }
      }
    ];
  }
}

module.exports = WorkflowManager;