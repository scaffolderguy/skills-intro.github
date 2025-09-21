const OpenAI = require('openai');

class InterviewEngine {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * AI Interview Engine - Conducts personalized interviews for candidates
   * Analyzes personality traits, communication styles, and emotional intelligence
   * Generates compatibility scores and team dynamics profiles
   */
  async analyzeCandidate(candidateId, responses) {
    try {
      const prompt = this.buildAnalysisPrompt(responses);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert AI interviewer specializing in personality assessment, 
            communication style analysis, and team dynamics evaluation. You conduct thorough 
            psychological assessments to determine candidate fit for adaptive collaboration environments.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const analysis = this.parseAnalysis(completion.choices[0].message.content);
      
      return {
        candidateId,
        personalityProfile: analysis.personality,
        communicationStyle: analysis.communication,
        emotionalIntelligence: analysis.emotional_iq,
        compatibilityScore: analysis.compatibility_score,
        teamDynamicsProfile: analysis.team_dynamics,
        strengths: analysis.strengths,
        developmentAreas: analysis.development_areas,
        recommendedRole: analysis.recommended_role,
        workingStylePreferences: analysis.working_style,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Interview analysis failed:', error);
      throw new Error(`Interview analysis failed: ${error.message}`);
    }
  }

  buildAnalysisPrompt(responses) {
    return `
    Analyze the following candidate interview responses and provide a comprehensive assessment:
    
    ${responses.map((response, index) => `
    Question ${index + 1}: ${response.question}
    Answer: ${response.answer}
    `).join('\n')}
    
    Please provide analysis in the following JSON format:
    {
      "personality": {
        "big_five_scores": {
          "openness": 0-100,
          "conscientiousness": 0-100,
          "extraversion": 0-100,
          "agreeableness": 0-100,
          "neuroticism": 0-100
        },
        "dominant_traits": ["trait1", "trait2", "trait3"]
      },
      "communication": {
        "style": "direct|collaborative|analytical|expressive",
        "preference": "verbal|written|visual|kinesthetic",
        "conflict_resolution": "competing|accommodating|avoiding|compromising|collaborating"
      },
      "emotional_iq": {
        "self_awareness": 0-100,
        "self_regulation": 0-100,
        "empathy": 0-100,
        "social_skills": 0-100,
        "motivation": 0-100,
        "overall_score": 0-100
      },
      "compatibility_score": 0-100,
      "team_dynamics": {
        "leadership_potential": 0-100,
        "collaboration_preference": "solo|small_group|large_team|flexible",
        "feedback_style": "direct|gentle|constructive|frequent",
        "decision_making": "autonomous|consensus|hierarchical|data_driven"
      },
      "strengths": ["strength1", "strength2", "strength3"],
      "development_areas": ["area1", "area2", "area3"],
      "recommended_role": "string",
      "working_style": {
        "energy_peaks": ["morning", "afternoon", "evening"],
        "focus_preference": "deep_focus|frequent_breaks|collaborative_energy",
        "environment_preference": "quiet|buzzing|flexible|remote"
      }
    }
    `;
  }

  parseAnalysis(content) {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Failed to parse analysis:', error);
      // Return default structure if parsing fails
      return this.getDefaultAnalysis();
    }
  }

  getDefaultAnalysis() {
    return {
      personality: {
        big_five_scores: {
          openness: 50,
          conscientiousness: 50,
          extraversion: 50,
          agreeableness: 50,
          neuroticism: 50
        },
        dominant_traits: ["adaptable", "curious", "collaborative"]
      },
      communication: {
        style: "collaborative",
        preference: "written",
        conflict_resolution: "compromising"
      },
      emotional_iq: {
        self_awareness: 70,
        self_regulation: 70,
        empathy: 70,
        social_skills: 70,
        motivation: 70,
        overall_score: 70
      },
      compatibility_score: 75,
      team_dynamics: {
        leadership_potential: 60,
        collaboration_preference: "flexible",
        feedback_style: "constructive",
        decision_making: "consensus"
      },
      strengths: ["adaptability", "communication", "problem-solving"],
      development_areas: ["time management", "technical skills", "leadership"],
      recommended_role: "Team Collaborator",
      working_style: {
        energy_peaks: ["morning", "afternoon"],
        focus_preference: "deep_focus",
        environment_preference: "flexible"
      }
    };
  }

  /**
   * Generate interview questions based on role requirements
   */
  generateInterviewQuestions(roleType, difficulty = 'intermediate') {
    const baseQuestions = [
      "Tell me about a time when you had to adapt quickly to changing circumstances.",
      "How do you prefer to receive feedback, and how do you handle constructive criticism?",
      "Describe your ideal work environment and team structure.",
      "What motivates you most in your work, and how do you maintain that motivation?",
      "Tell me about a challenging project where you had to collaborate with diverse team members."
    ];

    const roleSpecificQuestions = {
      technical: [
        "How do you approach learning new technologies or frameworks?",
        "Describe your process for debugging complex technical issues.",
        "How do you balance perfectionism with meeting deadlines?"
      ],
      creative: [
        "How do you handle creative blocks or periods of low inspiration?",
        "Describe how you incorporate feedback into your creative process.",
        "How do you balance creative vision with practical constraints?"
      ],
      leadership: [
        "How do you motivate team members who have different working styles?",
        "Describe a time when you had to make a difficult decision with limited information.",
        "How do you handle conflicts between team members?"
      ]
    };

    return {
      base: baseQuestions,
      roleSpecific: roleSpecificQuestions[roleType] || [],
      adaptiveQuestions: this.generateAdaptiveQuestions(difficulty)
    };
  }

  generateAdaptiveQuestions(difficulty) {
    const questions = {
      beginner: [
        "What interests you most about this type of work?",
        "How do you typically organize your daily tasks?"
      ],
      intermediate: [
        "Describe a time when you had to learn something completely new for a project.",
        "How do you prioritize competing demands on your time?"
      ],
      advanced: [
        "How would you design a system to improve team collaboration in a remote environment?",
        "What strategies do you use to maintain team morale during challenging periods?"
      ]
    };

    return questions[difficulty] || questions.intermediate;
  }
}

module.exports = InterviewEngine;