import React, { useState } from 'react';

const CandidatePortal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const interviewSteps = [
    {
      title: 'Welcome to Your AI Interview',
      content: 'PersonalityAssessment',
      description: 'Our AI conductor will analyze your responses to understand your unique strengths and working style.'
    },
    {
      title: 'Personality & Communication Style',
      content: 'CommunicationAssessment',
      description: 'Help us understand how you prefer to communicate and collaborate.'
    },
    {
      title: 'Team Dynamics & Preferences',
      content: 'TeamAssessment', 
      description: 'Tell us about your ideal working environment and team dynamics.'
    },
    {
      title: 'Your Results & Recommendations',
      content: 'Results',
      description: 'Discover your compatibility profile and personalized recommendations.'
    }
  ];

  const sampleQuestions = {
    PersonalityAssessment: [
      "Tell me about a time when you had to adapt quickly to changing circumstances. How did you handle it?",
      "Describe your ideal work environment. What factors help you be most productive?",
      "How do you approach learning new skills or technologies?"
    ],
    CommunicationAssessment: [
      "How do you prefer to receive feedback from colleagues or managers?",
      "Describe a situation where you had to explain complex information to someone unfamiliar with the topic.",
      "How do you handle disagreements or conflicts in a team setting?"
    ],
    TeamAssessment: [
      "What role do you naturally take in group projects or team settings?",
      "Tell me about your most successful team collaboration. What made it work well?",
      "How do you balance independent work with collaborative efforts?"
    ]
  };

  const StepIndicator = ({ steps, currentStep }) => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            index <= currentStep 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const QuestionSection = ({ questions, category }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState('');

    const handleAnswerSubmit = () => {
      setResponses(prev => ({
        ...prev,
        [`${category}_${currentQuestion}`]: {
          question: questions[currentQuestion],
          answer: answer
        }
      }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
      } else {
        setCurrentStep(currentStep + 1);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="text-sm text-blue-600">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {questions[currentQuestion]}
          </h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Share your thoughts here... Be specific and provide examples when possible."
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleAnswerSubmit}
            disabled={!answer.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Section' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  };

  const ResultsView = () => (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Your AI Analysis is Complete!
        </h3>
        <p className="text-gray-600">
          Based on your responses, here's your personalized profile and recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">Personality Profile</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Openness</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Conscientiousness</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between">
              <span>Extraversion</span>
              <span className="font-medium">65%</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Top Strengths</h4>
          <ul className="space-y-1">
            <li>• Leadership potential</li>
            <li>• Creative problem-solving</li>
            <li>• Strong communication</li>
            <li>• Adaptability</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-purple-800 mb-3">Working Style</h4>
          <p className="text-sm">
            You thrive in collaborative environments with opportunities for creative input. 
            Your communication style is direct yet empathetic, making you excellent for 
            cross-functional team projects.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-orange-800 mb-3">Team Compatibility</h4>
          <div className="text-2xl font-bold text-orange-600 mb-2">87%</div>
          <p className="text-sm">
            High compatibility with cross-functional teams. Recommended for leadership 
            roles and mentoring positions.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 mr-4">
          Download Report
        </button>
        <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50">
          Start Application
        </button>
      </div>
    </div>
  );

  const currentStepData = interviewSteps[currentStep];

  return (
    <div className="candidate-portal">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-2">Candidate Portal</h1>
          <p className="text-blue-100">
            Discover your unique strengths and find your perfect team fit
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <StepIndicator steps={interviewSteps} currentStep={currentStep} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          {currentStep < 3 && (
            <QuestionSection 
              questions={sampleQuestions[currentStepData.content]}
              category={currentStepData.content}
            />
          )}

          {currentStep === 3 && <ResultsView />}
        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;