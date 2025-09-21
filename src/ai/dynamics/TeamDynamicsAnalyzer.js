const OpenAI = require('openai');

class TeamDynamicsAnalyzer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Team Dynamics Dashboard - Visualizes team personality profiles
   * Highlights strengths, weaknesses, and potential gaps
   * Allows managers to see how new candidates might fit into existing team dynamics
   */
  async analyzeTeam(teamId) {
    try {
      const teamMembers = await this.getTeamMembers(teamId);
      const teamProfile = await this.generateTeamProfile(teamMembers);
      const dynamics = await this.analyzeDynamics(teamProfile);
      
      return {
        teamId,
        teamProfile,
        dynamics,
        recommendations: await this.generateRecommendations(dynamics),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Team dynamics analysis failed:', error);
      throw new Error(`Team dynamics analysis failed: ${error.message}`);
    }
  }

  async generateTeamProfile(teamMembers) {
    const profiles = teamMembers.map(member => member.personalityProfile || {});
    
    return {
      size: teamMembers.length,
      averageScores: this.calculateAverageScores(profiles),
      diversityIndex: this.calculateDiversityIndex(profiles),
      communicationMatrix: this.buildCommunicationMatrix(teamMembers),
      strengthsDistribution: this.analyzeStrengthsDistribution(teamMembers),
      skillsGaps: this.identifySkillsGaps(teamMembers),
      collaborationPatterns: this.analyzeCollaborationPatterns(teamMembers)
    };
  }

  calculateAverageScores(profiles) {
    if (!profiles.length) return {};

    const averages = {
      bigFive: {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
      },
      emotionalIntelligence: {
        selfAwareness: 0,
        selfRegulation: 0,
        empathy: 0,
        socialSkills: 0,
        motivation: 0,
        overallScore: 0
      },
      compatibilityScore: 0,
      leadershipPotential: 0
    };

    profiles.forEach(profile => {
      if (profile.personality?.big_five_scores) {
        Object.keys(averages.bigFive).forEach(trait => {
          averages.bigFive[trait] += profile.personality.big_five_scores[trait] || 0;
        });
      }
      
      if (profile.emotional_iq) {
        Object.keys(averages.emotionalIntelligence).forEach(trait => {
          const key = trait.replace(/([A-Z])/g, '_$1').toLowerCase();
          averages.emotionalIntelligence[trait] += profile.emotional_iq[key] || 0;
        });
      }
      
      averages.compatibilityScore += profile.compatibility_score || 0;
      averages.leadershipPotential += profile.team_dynamics?.leadership_potential || 0;
    });

    // Calculate averages
    Object.keys(averages.bigFive).forEach(trait => {
      averages.bigFive[trait] = Math.round(averages.bigFive[trait] / profiles.length);
    });

    Object.keys(averages.emotionalIntelligence).forEach(trait => {
      averages.emotionalIntelligence[trait] = Math.round(averages.emotionalIntelligence[trait] / profiles.length);
    });

    averages.compatibilityScore = Math.round(averages.compatibilityScore / profiles.length);
    averages.leadershipPotential = Math.round(averages.leadershipPotential / profiles.length);

    return averages;
  }

  calculateDiversityIndex(profiles) {
    if (!profiles.length) return 0;

    // Calculate diversity based on personality trait variance
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    let totalVariance = 0;

    traits.forEach(trait => {
      const values = profiles.map(p => p.personality?.big_five_scores?.[trait] || 50);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
      totalVariance += variance;
    });

    // Normalize to 0-100 scale
    return Math.min(100, Math.round((totalVariance / traits.length) / 10));
  }

  buildCommunicationMatrix(teamMembers) {
    const styles = {};
    const preferences = {};

    teamMembers.forEach(member => {
      const comm = member.personalityProfile?.communication || {};
      styles[comm.style || 'collaborative'] = (styles[comm.style || 'collaborative'] || 0) + 1;
      preferences[comm.preference || 'written'] = (preferences[comm.preference || 'written'] || 0) + 1;
    });

    return {
      communicationStyles: styles,
      preferences: preferences,
      potential_conflicts: this.identifyCommuncationConflicts(styles),
      synergies: this.identifyCommuncationSynergies(styles)
    };
  }

  identifyCommuncationConflicts(styles) {
    const conflicts = [];
    if (styles.direct && styles.gentle) {
      conflicts.push("Direct and gentle communicators may clash - consider communication style training");
    }
    if (styles.analytical > styles.expressive * 2) {
      conflicts.push("Heavy analytical bias may suppress creative expression");
    }
    return conflicts;
  }

  identifyCommuncationSynergies(styles) {
    const synergies = [];
    if (styles.collaborative && styles.expressive) {
      synergies.push("Collaborative and expressive styles create strong brainstorming potential");
    }
    if (styles.analytical && styles.direct) {
      synergies.push("Analytical and direct styles enable efficient problem-solving");
    }
    return synergies;
  }

  analyzeStrengthsDistribution(teamMembers) {
    const strengthsCount = {};
    const allStrengths = [];

    teamMembers.forEach(member => {
      const strengths = member.personalityProfile?.strengths || [];
      strengths.forEach(strength => {
        strengthsCount[strength] = (strengthsCount[strength] || 0) + 1;
        allStrengths.push(strength);
      });
    });

    return {
      distribution: strengthsCount,
      mostCommon: Object.keys(strengthsCount).sort((a, b) => strengthsCount[b] - strengthsCount[a]).slice(0, 5),
      coverage: Object.keys(strengthsCount).length,
      redundancy: this.calculateRedundancy(strengthsCount, teamMembers.length)
    };
  }

  calculateRedundancy(strengthsCount, teamSize) {
    const totalStrengths = Object.values(strengthsCount).reduce((a, b) => a + b, 0);
    const uniqueStrengths = Object.keys(strengthsCount).length;
    return Math.round(((totalStrengths - uniqueStrengths) / totalStrengths) * 100);
  }

  identifySkillsGaps(teamMembers) {
    const essentialSkills = [
      'leadership', 'technical expertise', 'creativity', 'communication',
      'problem-solving', 'project management', 'analytical thinking',
      'emotional intelligence', 'adaptability', 'mentoring'
    ];

    const presentSkills = new Set();
    teamMembers.forEach(member => {
      const strengths = member.personalityProfile?.strengths || [];
      strengths.forEach(skill => presentSkills.add(skill.toLowerCase()));
    });

    return essentialSkills.filter(skill => !presentSkills.has(skill.toLowerCase()));
  }

  analyzeCollaborationPatterns(teamMembers) {
    const patterns = {
      preferences: {},
      workingStyles: {},
      decisionMaking: {},
      feedbackStyles: {}
    };

    teamMembers.forEach(member => {
      const dynamics = member.personalityProfile?.team_dynamics || {};
      const workingStyle = member.personalityProfile?.working_style || {};

      patterns.preferences[dynamics.collaboration_preference || 'flexible'] = 
        (patterns.preferences[dynamics.collaboration_preference || 'flexible'] || 0) + 1;
      
      patterns.decisionMaking[dynamics.decision_making || 'consensus'] = 
        (patterns.decisionMaking[dynamics.decision_making || 'consensus'] || 0) + 1;
      
      patterns.feedbackStyles[dynamics.feedback_style || 'constructive'] = 
        (patterns.feedbackStyles[dynamics.feedback_style || 'constructive'] || 0) + 1;
      
      patterns.workingStyles[workingStyle.focus_preference || 'deep_focus'] = 
        (patterns.workingStyles[workingStyle.focus_preference || 'deep_focus'] || 0) + 1;
    });

    return patterns;
  }

  async analyzeDynamics(teamProfile) {
    const prompt = `
    Analyze the following team profile and provide insights on team dynamics:
    
    Team Size: ${teamProfile.size}
    Average Scores: ${JSON.stringify(teamProfile.averageScores, null, 2)}
    Diversity Index: ${teamProfile.diversityIndex}
    Communication Matrix: ${JSON.stringify(teamProfile.communicationMatrix, null, 2)}
    Strengths Distribution: ${JSON.stringify(teamProfile.strengthsDistribution, null, 2)}
    Skills Gaps: ${JSON.stringify(teamProfile.skillsGaps, null, 2)}
    Collaboration Patterns: ${JSON.stringify(teamProfile.collaborationPatterns, null, 2)}
    
    Provide analysis in JSON format focusing on:
    - Overall team health score (0-100)
    - Key strengths and weaknesses
    - Collaboration effectiveness
    - Communication flow assessment
    - Risk factors and opportunities
    - Optimal team composition recommendations
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert team dynamics analyst specializing in organizational psychology 
            and team performance optimization. Analyze team profiles to identify strengths, weaknesses, 
            collaboration patterns, and optimization opportunities.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.parseDynamicsAnalysis(completion.choices[0].message.content);
    } catch (error) {
      console.error('AI dynamics analysis failed:', error);
      return this.getDefaultDynamicsAnalysis(teamProfile);
    }
  }

  parseDynamicsAnalysis(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found');
    } catch (error) {
      return this.getDefaultDynamicsAnalysis();
    }
  }

  getDefaultDynamicsAnalysis(teamProfile = {}) {
    return {
      teamHealthScore: 75,
      keyStrengths: ["collaboration", "adaptability", "communication"],
      keyWeaknesses: ["leadership distribution", "skill gaps", "process optimization"],
      collaborationEffectiveness: 70,
      communicationFlow: 75,
      riskFactors: ["skill redundancy", "communication style conflicts"],
      opportunities: ["cross-training", "mentorship programs", "leadership development"],
      recommendations: [
        "Consider hiring for identified skill gaps",
        "Implement communication style awareness training",
        "Establish mentorship programs for knowledge sharing"
      ]
    };
  }

  async generateRecommendations(dynamics) {
    return {
      hiring: {
        priorities: dynamics.skillsGaps || [],
        personalityBalance: this.getPersonalityBalanceRecommendations(dynamics),
        roleTypes: this.getRecommendedRoleTypes(dynamics)
      },
      development: {
        teamTraining: this.getTrainingRecommendations(dynamics),
        individualGrowth: this.getGrowthRecommendations(dynamics),
        processImprovements: this.getProcessRecommendations(dynamics)
      },
      optimization: {
        workflowAdjustments: this.getWorkflowOptimizations(dynamics),
        communicationImprovements: this.getCommunicationOptimizations(dynamics),
        collaborationEnhancements: this.getCollaborationEnhancements(dynamics)
      }
    };
  }

  getPersonalityBalanceRecommendations(dynamics) {
    const recommendations = [];
    if (dynamics.teamHealthScore < 60) {
      recommendations.push("Seek candidates with high emotional intelligence to improve team cohesion");
    }
    if (dynamics.collaborationEffectiveness < 70) {
      recommendations.push("Look for collaborative personalities to enhance team synergy");
    }
    return recommendations;
  }

  getRecommendedRoleTypes(dynamics) {
    return dynamics.skillsGaps?.map(gap => ({
      skill: gap,
      roleType: this.mapSkillToRole(gap),
      priority: this.calculatePriority(gap, dynamics)
    })) || [];
  }

  mapSkillToRole(skill) {
    const mapping = {
      'leadership': 'Team Lead / Scrum Master',
      'technical expertise': 'Senior Developer / Architect',
      'creativity': 'UX Designer / Creative Director',
      'project management': 'Project Manager',
      'analytical thinking': 'Data Analyst / Business Analyst'
    };
    return mapping[skill] || 'Specialist';
  }

  calculatePriority(skill, dynamics) {
    const criticalSkills = ['leadership', 'technical expertise', 'communication'];
    return criticalSkills.includes(skill) ? 'High' : 'Medium';
  }

  // Placeholder method - would normally fetch from database
  async getTeamMembers(teamId) {
    // This would typically query the database for team members
    // For now, return mock data
    return [
      {
        id: 1,
        name: 'Alice Johnson',
        personalityProfile: {
          personality: {
            big_five_scores: {
              openness: 85,
              conscientiousness: 78,
              extraversion: 65,
              agreeableness: 82,
              neuroticism: 35
            }
          },
          emotional_iq: {
            self_awareness: 80,
            self_regulation: 75,
            empathy: 85,
            social_skills: 90,
            motivation: 88,
            overall_score: 84
          },
          compatibility_score: 82,
          strengths: ['leadership', 'communication', 'empathy'],
          team_dynamics: {
            leadership_potential: 85,
            collaboration_preference: 'small_group',
            feedback_style: 'constructive',
            decision_making: 'consensus'
          },
          communication: {
            style: 'collaborative',
            preference: 'verbal'
          }
        }
      }
      // Additional mock team members would go here
    ];
  }

  getTrainingRecommendations(dynamics) {
    return [
      "Communication style workshop",
      "Conflict resolution training",
      "Collaborative leadership development"
    ];
  }

  getGrowthRecommendations(dynamics) {
    return [
      "Cross-functional skill development",
      "Mentorship program participation",
      "Leadership rotation opportunities"
    ];
  }

  getProcessRecommendations(dynamics) {
    return [
      "Implement regular retrospectives",
      "Establish clear communication protocols",
      "Create feedback loops for continuous improvement"
    ];
  }

  getWorkflowOptimizations(dynamics) {
    return [
      "Adjust task assignments based on personality strengths",
      "Optimize meeting schedules for energy patterns",
      "Implement flexible working arrangements"
    ];
  }

  getCommunicationOptimizations(dynamics) {
    return [
      "Use multiple communication channels",
      "Implement structured feedback sessions",
      "Create communication style guides"
    ];
  }

  getCollaborationEnhancements(dynamics) {
    return [
      "Form diverse working groups",
      "Implement pair programming/collaboration",
      "Create cross-team knowledge sharing sessions"
    ];
  }
}

module.exports = TeamDynamicsAnalyzer;