const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const InterviewEngine = require('../ai/interview/InterviewEngine');

// GET /api/candidates - List all candidates
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const candidates = await Candidate.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Candidate.countDocuments(query);
    
    res.json({
      candidates,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/candidates/:id - Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/candidates - Create new candidate
router.post('/', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/candidates/:id - Update candidate
router.put('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/candidates/:id/interview - Conduct AI interview
router.post('/:id/interview', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const { responses } = req.body;
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Interview responses are required' });
    }

    const engine = new InterviewEngine();
    const analysis = await engine.analyzeCandidate(req.params.id, responses);

    // Update candidate with analysis and responses
    candidate.personalityProfile = analysis;
    candidate.interviewResponses = responses.map(r => ({
      question: r.question,
      answer: r.answer,
      timestamp: new Date()
    }));
    candidate.status = 'evaluated';

    await candidate.save();

    res.json({
      candidate,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/candidates/:id/interview-questions - Get interview questions
router.get('/:id/interview-questions', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const { roleType = 'general', difficulty = 'intermediate' } = req.query;
    const engine = new InterviewEngine();
    const questions = engine.generateInterviewQuestions(roleType, difficulty);

    res.json({
      candidateId: req.params.id,
      roleType,
      difficulty,
      questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/candidates/:id/feedback - Add feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const { source, content, category } = req.body;
    if (!source || !content || !category) {
      return res.status(400).json({ 
        error: 'Source, content, and category are required for feedback' 
      });
    }

    candidate.feedback.push({
      source,
      content,
      category,
      timestamp: new Date()
    });

    await candidate.save();
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/candidates/:id/compatibility/:teamId - Check team compatibility
router.get('/:id/compatibility/:teamId', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (!candidate.personalityProfile) {
      return res.status(400).json({ 
        error: 'Candidate must complete interview assessment first' 
      });
    }

    // This would integrate with TeamDynamicsAnalyzer
    // For now, return mock compatibility data
    const compatibility = {
      candidateId: req.params.id,
      teamId: req.params.teamId,
      overallCompatibility: candidate.personalityProfile.compatibility_score || 75,
      strengthMatches: candidate.personalityProfile.strengths || [],
      communicationFit: 'Good',
      workingStyleFit: 'Excellent',
      recommendations: [
        'Strong leadership potential would complement team structure',
        'Communication style aligns well with team preferences',
        'Consider for mentorship role given experience level'
      ]
    };

    res.json(compatibility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;