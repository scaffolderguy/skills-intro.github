# AI-Powered Adaptive Hiring and Collaboration Platform

## Development Setup Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (>=16.0.0)
- npm (>=8.0.0)  
- MongoDB (>=4.4)
- Redis (optional, for caching)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd skills-intro.github
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health

### Architecture Overview

```
├── src/
│   ├── ai/                    # AI Engine Components
│   │   ├── interview/         # AI Interview Engine
│   │   ├── dynamics/          # Team Dynamics Analysis
│   │   └── workflow/          # Task & Workflow Management
│   ├── api/                   # REST API Endpoints
│   ├── models/               # Database Models
│   └── index.js              # Main Application Entry
├── docs/                     # Documentation
└── tests/                    # Test Files
```

### Core Components

#### 1. AI Interview Engine (`src/ai/interview/`)
- Conducts personalized candidate interviews
- Analyzes personality traits and communication styles
- Generates compatibility scores

#### 2. Team Dynamics Analyzer (`src/ai/dynamics/`)
- Visualizes team personality profiles
- Identifies strengths, weaknesses, and gaps
- Provides team optimization recommendations

#### 3. Workflow Manager (`src/ai/workflow/`)
- AI-driven task assignment based on strengths and availability
- Tracks progress and identifies bottlenecks
- Optimizes workflows for maximum efficiency

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

#### Candidates
- `GET /api/candidates` - List candidates
- `POST /api/candidates` - Create candidate
- `POST /api/candidates/:id/interview` - Conduct AI interview
- `GET /api/candidates/:id/interview-questions` - Get interview questions

#### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id/dynamics` - Analyze team dynamics
- `GET /api/teams/:id/performance` - Get performance metrics

#### Workflows
- `POST /api/workflows/assign-tasks` - AI task assignment
- `GET /api/workflows/recommendations/:teamId` - Get recommendations
- `GET /api/workflows/analytics/:teamId` - Get analytics

### Database Models

#### Candidate Model
```javascript
{
  name: String,
  email: String,
  personalityProfile: {
    personality: { big_five_scores: {...} },
    communication: {...},
    emotional_iq: {...}
  },
  interviewResponses: [...],
  status: 'applied' | 'interviewing' | 'evaluated' | 'hired'
}
```

#### Team Model
```javascript
{
  name: String,
  members: [TeamMemberSchema],
  team_dynamics: {
    health_score: Number,
    collaboration_effectiveness: Number,
    recommendations: [String]
  }
}
```

### Development Workflow

1. **Make Changes** - Edit files in `src/`
2. **Test Locally** - `npm run dev`
3. **Run Tests** - `npm test` (when tests are implemented)
4. **Build** - `npm run build`
5. **Deploy** - `npm start`

### Configuration

Key environment variables:
- `OPENAI_API_KEY` - Required for AI functionality
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Authentication secret
- `PORT` - Server port (default: 3000)

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --testNamePattern="InterviewEngine"
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Deployment

#### Production Setup
```bash
# Build the application
npm run build

# Start production server
npm start
```

#### Docker Deployment (Optional)
```bash
# Build Docker image
docker build -t ai-collaboration-platform .

# Run container
docker run -p 3000:3000 --env-file .env ai-collaboration-platform
```

### Troubleshooting

#### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **OpenAI API Errors**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API quota and billing

3. **Port Already in Use**
   - Change `PORT` in `.env`
   - Or stop the process using the port

### Performance Optimization

- Enable Redis caching for frequently accessed data
- Use database indexing for faster queries
- Implement API rate limiting
- Use clustering for production deployments

### Security Considerations

- Never commit `.env` files with sensitive data
- Use strong JWT secrets in production
- Implement proper input validation
- Use HTTPS in production
- Regularly update dependencies

### Monitoring and Logging

- Application logs are written to `logs/application.log`
- Monitor API response times and error rates
- Set up alerts for system health metrics
- Use application performance monitoring (APM) tools

### Support

For questions and support:
- Check the documentation in `/docs`
- Review existing issues and discussions
- Submit new issues for bugs or feature requests