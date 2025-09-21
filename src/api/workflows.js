const express = require('express');
const router = express.Router();
const WorkflowManager = require('../ai/workflow/WorkflowManager');

// POST /api/workflows/assign-tasks - AI-powered task assignment
router.post('/assign-tasks', async (req, res) => {
  try {
    const { teamId, tasks } = req.body;
    
    if (!teamId || !tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ 
        error: 'Team ID and tasks array are required' 
      });
    }

    const manager = new WorkflowManager();
    const assignments = await manager.assignTasks(teamId, tasks);
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/workflows/recommendations/:teamId - Get workflow recommendations
router.get('/recommendations/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    
    // Mock workflow recommendations
    const recommendations = {
      teamId,
      workloadBalance: {
        status: 'good',
        message: 'Team workload is well distributed',
        suggestions: []
      },
      skillUtilization: {
        status: 'needs_improvement',
        message: 'Some skills are underutilized',
        suggestions: [
          'Consider cross-training in data analysis',
          'Leverage design skills for user experience improvements'
        ]
      },
      collaborationOpportunities: {
        status: 'excellent',
        message: 'Multiple collaboration opportunities identified',
        suggestions: [
          'Pair junior developers with senior mentors',
          'Create cross-functional project teams',
          'Schedule regular knowledge sharing sessions'
        ]
      },
      processImprovements: {
        status: 'good',
        message: 'Current processes are working well',
        suggestions: [
          'Implement automated progress tracking',
          'Add retrospective meetings',
          'Create feedback loops for continuous improvement'
        ]
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/workflows/optimize - Optimize existing workflow
router.post('/optimize', async (req, res) => {
  try {
    const { teamId, currentWorkflow } = req.body;
    
    if (!teamId || !currentWorkflow) {
      return res.status(400).json({ 
        error: 'Team ID and current workflow are required' 
      });
    }

    // Mock workflow optimization
    const optimization = {
      teamId,
      originalWorkflow: currentWorkflow,
      optimizedWorkflow: {
        ...currentWorkflow,
        estimatedImprovement: '15% faster completion',
        changes: [
          'Reordered tasks based on dependencies',
          'Optimized team member assignments',
          'Identified parallel execution opportunities'
        ]
      },
      benefits: {
        timeReduction: 15, // percentage
        productivityIncrease: 12,
        teamSatisfaction: 8
      },
      implementation: {
        effort: 'low',
        timeline: '1-2 weeks',
        riskLevel: 'minimal'
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(optimization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/workflows/analytics/:teamId - Get workflow analytics
router.get('/analytics/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { period = '30d' } = req.query;
    
    // Mock workflow analytics
    const analytics = {
      teamId,
      period,
      metrics: {
        tasksCompleted: 47,
        averageCompletionTime: 5.2, // days
        onTimeDelivery: 89, // percentage
        teamProductivity: 76, // score out of 100
        collaborationIndex: 82, // score out of 100
        burndownRate: 1.1, // tasks per day
        qualityScore: 87 // percentage
      },
      trends: {
        productivity: { direction: 'up', change: 8 },
        collaboration: { direction: 'stable', change: 0 },
        quality: { direction: 'up', change: 5 },
        delivery: { direction: 'down', change: -3 }
      },
      topPerformers: [
        { name: 'Alice Johnson', tasksCompleted: 12, avgQuality: 94 },
        { name: 'Bob Smith', tasksCompleted: 10, avgQuality: 91 }
      ],
      bottlenecks: [
        'Code review process taking longer than expected',
        'Dependency on external team causing delays'
      ],
      recommendations: [
        'Consider adding more reviewers to speed up code reviews',
        'Establish better communication channels with external teams',
        'Implement automated testing to improve quality'
      ],
      timestamp: new Date().toISOString()
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/workflows/feedback - Submit workflow feedback
router.post('/feedback', async (req, res) => {
  try {
    const { teamId, userId, workflowId, feedback } = req.body;
    
    if (!teamId || !userId || !feedback) {
      return res.status(400).json({ 
        error: 'Team ID, user ID, and feedback are required' 
      });
    }

    // Mock feedback storage
    const feedbackRecord = {
      id: Date.now(),
      teamId,
      userId,
      workflowId,
      feedback: {
        rating: feedback.rating,
        comments: feedback.comments,
        suggestions: feedback.suggestions,
        categories: feedback.categories || []
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: feedbackRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/workflows/templates - Get workflow templates
router.get('/templates', async (req, res) => {
  try {
    const { category, complexity } = req.query;
    
    const templates = [
      {
        id: 'agile-sprint',
        name: 'Agile Sprint Workflow',
        category: 'software_development',
        complexity: 'medium',
        description: 'Standard 2-week agile sprint with planning, development, and retrospective phases',
        phases: [
          'Sprint Planning',
          'Daily Standups',
          'Development',
          'Code Review',
          'Testing',
          'Sprint Review',
          'Retrospective'
        ],
        estimatedDuration: '2 weeks',
        teamSize: '5-8 members'
      },
      {
        id: 'design-thinking',
        name: 'Design Thinking Process',
        category: 'creative',
        complexity: 'high',
        description: 'Human-centered design process for innovation and problem-solving',
        phases: [
          'Empathize',
          'Define',
          'Ideate',
          'Prototype',
          'Test'
        ],
        estimatedDuration: '4-6 weeks',
        teamSize: '4-6 members'
      },
      {
        id: 'product-launch',
        name: 'Product Launch Campaign',
        category: 'marketing',
        complexity: 'high',
        description: 'Comprehensive product launch workflow with marketing, PR, and sales coordination',
        phases: [
          'Market Research',
          'Strategy Development',
          'Content Creation',
          'Campaign Execution',
          'Performance Analysis'
        ],
        estimatedDuration: '8-12 weeks',
        teamSize: '6-10 members'
      }
    ];
    
    let filteredTemplates = templates;
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === category);
    }
    
    if (complexity) {
      filteredTemplates = filteredTemplates.filter(t => t.complexity === complexity);
    }
    
    res.json({
      templates: filteredTemplates,
      categories: ['software_development', 'creative', 'marketing', 'operations'],
      complexityLevels: ['low', 'medium', 'high']
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;