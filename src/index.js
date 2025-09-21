const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database connection (commented out until MongoDB is available)
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adaptive-collaboration', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

// AI Engine imports
const InterviewEngine = require('./ai/interview/InterviewEngine');
const TeamDynamicsAnalyzer = require('./ai/dynamics/TeamDynamicsAnalyzer');
const WorkflowManager = require('./ai/workflow/WorkflowManager');

// API Routes
const authRoutes = require('./api/auth');
const candidateRoutes = require('./api/candidates');
const teamRoutes = require('./api/teams');
const workflowRoutes = require('./api/workflows');

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/workflows', workflowRoutes);

// AI Endpoints
app.post('/api/ai/interview', async (req, res) => {
  try {
    const { candidateId, responses } = req.body;
    const engine = new InterviewEngine();
    const analysis = await engine.analyzeCandidate(candidateId, responses);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ai/team-dynamics/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const analyzer = new TeamDynamicsAnalyzer();
    const dynamics = await analyzer.analyzeTeam(teamId);
    res.json(dynamics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/assign-tasks', async (req, res) => {
  try {
    const { teamId, tasks } = req.body;
    const manager = new WorkflowManager();
    const assignments = await manager.assignTasks(teamId, tasks);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI-Powered Adaptive Collaboration Platform is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🎼 AI Conductor is orchestrating on port ${PORT}`);
  console.log(`🌟 The Adaptive Collaboration Platform is ready to harmonize teams`);
});

module.exports = app;