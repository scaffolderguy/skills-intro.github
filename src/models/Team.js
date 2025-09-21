const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: String,
  current_workload: { type: Number, default: 0, min: 0 }, // hours per week
  weekly_capacity: { type: Number, default: 40, min: 1, max: 60 },
  availability_status: {
    type: String,
    enum: ['available', 'busy', 'partially_available', 'unavailable'],
    default: 'available'
  },
  personalityProfile: {
    // Reuse the same structure as Candidate
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
    strengths: [String],
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
  skills: [String],
  interests: [String],
  performance_metrics: {
    productivity_score: { type: Number, min: 0, max: 100 },
    collaboration_score: { type: Number, min: 0, max: 100 },
    quality_score: { type: Number, min: 0, max: 100 },
    adaptability_score: { type: Number, min: 0, max: 100 },
    last_updated: { type: Date, default: Date.now }
  },
  feedback_received: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
    content: String,
    category: String,
    rating: { type: Number, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now }
  }],
  joined_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  department: String,
  team_type: {
    type: String,
    enum: ['permanent', 'project', 'temporary', 'cross_functional'],
    default: 'permanent'
  },
  members: [teamMemberSchema],
  team_lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  },
  facilitators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  team_dynamics: {
    health_score: { type: Number, min: 0, max: 100 },
    collaboration_effectiveness: { type: Number, min: 0, max: 100 },
    communication_flow: { type: Number, min: 0, max: 100 },
    diversity_index: { type: Number, min: 0, max: 100 },
    last_analyzed: { type: Date, default: Date.now },
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  goals: [{
    title: String,
    description: String,
    target_date: Date,
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
      default: 'not_started'
    },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  }],
  meetings: [{
    title: String,
    date: Date,
    duration: Number, // minutes
    participants: [String], // member names or IDs
    agenda: String,
    notes: String
  }],
  communication_preferences: {
    primary_channel: {
      type: String,
      enum: ['slack', 'teams', 'email', 'in_person', 'video_call'],
      default: 'slack'
    },
    meeting_frequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi_weekly', 'monthly', 'ad_hoc'],
      default: 'weekly'
    },
    feedback_frequency: {
      type: String,
      enum: ['continuous', 'weekly', 'bi_weekly', 'monthly', 'quarterly'],
      default: 'weekly'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'archived'],
    default: 'active'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
teamSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

teamMemberSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Indexes for efficient queries
teamSchema.index({ name: 1 });
teamSchema.index({ department: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ 'team_dynamics.health_score': -1 });

module.exports = mongoose.model('Team', teamSchema);