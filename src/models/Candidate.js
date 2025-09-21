const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'evaluated', 'hired', 'rejected'],
    default: 'applied'
  },
  personalityProfile: {
    personality: {
      big_five_scores: {
        openness: { type: Number, min: 0, max: 100 },
        conscientiousness: { type: Number, min: 0, max: 100 },
        extraversion: { type: Number, min: 0, max: 100 },
        agreeableness: { type: Number, min: 0, max: 100 },
        neuroticism: { type: Number, min: 0, max: 100 }
      },
      dominant_traits: [String]
    },
    communication: {
      style: {
        type: String,
        enum: ['direct', 'collaborative', 'analytical', 'expressive']
      },
      preference: {
        type: String,
        enum: ['verbal', 'written', 'visual', 'kinesthetic']
      },
      conflict_resolution: {
        type: String,
        enum: ['competing', 'accommodating', 'avoiding', 'compromising', 'collaborating']
      }
    },
    emotional_iq: {
      self_awareness: { type: Number, min: 0, max: 100 },
      self_regulation: { type: Number, min: 0, max: 100 },
      empathy: { type: Number, min: 0, max: 100 },
      social_skills: { type: Number, min: 0, max: 100 },
      motivation: { type: Number, min: 0, max: 100 },
      overall_score: { type: Number, min: 0, max: 100 }
    },
    compatibility_score: { type: Number, min: 0, max: 100 },
    team_dynamics: {
      leadership_potential: { type: Number, min: 0, max: 100 },
      collaboration_preference: {
        type: String,
        enum: ['solo', 'small_group', 'large_team', 'flexible']
      },
      feedback_style: {
        type: String,
        enum: ['direct', 'gentle', 'constructive', 'frequent']
      },
      decision_making: {
        type: String,
        enum: ['autonomous', 'consensus', 'hierarchical', 'data_driven']
      }
    },
    strengths: [String],
    development_areas: [String],
    recommended_role: String,
    working_style: {
      energy_peaks: [{
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night']
      }],
      focus_preference: {
        type: String,
        enum: ['deep_focus', 'frequent_breaks', 'collaborative_energy']
      },
      environment_preference: {
        type: String,
        enum: ['quiet', 'buzzing', 'flexible', 'remote']
      }
    }
  },
  interviewResponses: [{
    question: String,
    answer: String,
    timestamp: { type: Date, default: Date.now }
  }],
  skills: [String],
  interests: [String],
  availability: {
    hours_per_week: { type: Number, min: 1, max: 60 },
    preferred_schedule: [String],
    start_date: Date
  },
  feedback: [{
    source: String, // 'ai', 'interviewer', 'peer'
    content: String,
    category: String, // 'strength', 'improvement', 'recommendation'
    timestamp: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

candidateSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Index for efficient queries
candidateSchema.index({ email: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ 'personalityProfile.compatibility_score': -1 });

module.exports = mongoose.model('Candidate', candidateSchema);