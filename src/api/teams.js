const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const TeamDynamicsAnalyzer = require('../ai/dynamics/TeamDynamicsAnalyzer');

// GET /api/teams - List all teams
router.get('/', async (req, res) => {
  try {
    const { department, status = 'active', page = 1, limit = 10 } = req.query;
    const query = { status };
    if (department) query.department = department;
    
    const teams = await Team.find(query)
      .populate('team_lead', 'name email')
      .populate('facilitators', 'name email')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Team.countDocuments(query);
    
    res.json({
      teams,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id - Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('team_lead', 'name email role')
      .populate('facilitators', 'name email role');
      
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/teams - Create new team
router.post('/', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/teams/:id - Update team
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/teams/:id/dynamics - Analyze team dynamics
router.get('/:id/dynamics', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const analyzer = new TeamDynamicsAnalyzer();
    const dynamics = await analyzer.analyzeTeam(req.params.id);

    // Update team with latest dynamics analysis
    team.team_dynamics = {
      health_score: dynamics.dynamics.teamHealthScore,
      collaboration_effectiveness: dynamics.dynamics.collaborationEffectiveness,
      communication_flow: dynamics.dynamics.communicationFlow,
      diversity_index: dynamics.teamProfile.diversityIndex,
      last_analyzed: new Date(),
      strengths: dynamics.dynamics.keyStrengths,
      weaknesses: dynamics.dynamics.keyWeaknesses,
      recommendations: dynamics.recommendations.development.teamTraining
    };

    await team.save();

    res.json({
      team: {
        id: team._id,
        name: team.name,
        memberCount: team.members.length
      },
      dynamics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/teams/:id/members - Add team member
router.post('/:id/members', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const memberData = req.body;
    
    // Check if member already exists
    const existingMember = team.members.find(m => m.email === memberData.email);
    if (existingMember) {
      return res.status(400).json({ error: 'Member already exists in team' });
    }

    team.members.push(memberData);
    await team.save();

    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/teams/:id/members/:memberId - Update team member
router.put('/:id/members/:memberId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.id(req.params.memberId);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    Object.assign(member, req.body);
    await team.save();

    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/teams/:id/members/:memberId - Remove team member
router.delete('/:id/members/:memberId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    team.members.id(req.params.memberId).remove();
    await team.save();

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/teams/:id/feedback - Add team feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const { memberFromId, memberToId, content, category, rating } = req.body;
    
    const memberTo = team.members.id(memberToId);
    if (!memberTo) {
      return res.status(404).json({ error: 'Target team member not found' });
    }

    memberTo.feedback_received.push({
      from: memberFromId,
      content,
      category,
      rating,
      timestamp: new Date()
    });

    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id/performance - Get team performance metrics
router.get('/:id/performance', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Calculate aggregated performance metrics
    const memberMetrics = team.members
      .filter(m => m.performance_metrics)
      .map(m => m.performance_metrics);

    if (memberMetrics.length === 0) {
      return res.json({
        teamId: req.params.id,
        message: 'No performance metrics available',
        memberCount: team.members.length
      });
    }

    const aggregated = {
      teamId: req.params.id,
      teamName: team.name,
      memberCount: team.members.length,
      averageMetrics: {
        productivity_score: Math.round(
          memberMetrics.reduce((sum, m) => sum + (m.productivity_score || 0), 0) / memberMetrics.length
        ),
        collaboration_score: Math.round(
          memberMetrics.reduce((sum, m) => sum + (m.collaboration_score || 0), 0) / memberMetrics.length
        ),
        quality_score: Math.round(
          memberMetrics.reduce((sum, m) => sum + (m.quality_score || 0), 0) / memberMetrics.length
        ),
        adaptability_score: Math.round(
          memberMetrics.reduce((sum, m) => sum + (m.adaptability_score || 0), 0) / memberMetrics.length
        )
      },
      topPerformers: team.members
        .filter(m => m.performance_metrics && m.performance_metrics.productivity_score > 80)
        .map(m => ({ name: m.name, productivity: m.performance_metrics.productivity_score }))
        .sort((a, b) => b.productivity - a.productivity)
        .slice(0, 3),
      improvementAreas: []
    };

    // Identify improvement areas
    if (aggregated.averageMetrics.collaboration_score < 70) {
      aggregated.improvementAreas.push('Team collaboration needs improvement');
    }
    if (aggregated.averageMetrics.quality_score < 75) {
      aggregated.improvementAreas.push('Quality metrics below target');
    }
    if (aggregated.averageMetrics.adaptability_score < 65) {
      aggregated.improvementAreas.push('Team adaptability could be enhanced');
    }

    res.json(aggregated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id/workload - Get team workload distribution
router.get('/:id/workload', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const workloadData = team.members.map(member => ({
      id: member._id,
      name: member.name,
      role: member.role,
      currentWorkload: member.current_workload || 0,
      weeklyCapacity: member.weekly_capacity || 40,
      utilizationRate: Math.round(((member.current_workload || 0) / (member.weekly_capacity || 40)) * 100),
      availabilityStatus: member.availability_status,
      availableHours: Math.max(0, (member.weekly_capacity || 40) - (member.current_workload || 0))
    }));

    const summary = {
      teamId: req.params.id,
      teamName: team.name,
      totalMembers: workloadData.length,
      averageUtilization: Math.round(
        workloadData.reduce((sum, m) => sum + m.utilizationRate, 0) / workloadData.length
      ),
      overloadedMembers: workloadData.filter(m => m.utilizationRate > 100).length,
      underutilizedMembers: workloadData.filter(m => m.utilizationRate < 60).length,
      totalAvailableHours: workloadData.reduce((sum, m) => sum + m.availableHours, 0)
    };

    res.json({
      summary,
      members: workloadData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/teams/:id - Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;