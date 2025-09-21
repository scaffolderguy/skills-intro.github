import React, { useState } from 'react';

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock team data
  const teamData = {
    name: 'Product Development Team',
    memberCount: 8,
    healthScore: 87,
    currentProjects: 3,
    completedTasks: 47,
    members: [
      { id: 1, name: 'Alice Johnson', role: 'Team Lead', workload: 85, availability: 'Busy' },
      { id: 2, name: 'Bob Smith', role: 'Senior Developer', workload: 70, availability: 'Available' },
      { id: 3, name: 'Carol Lee', role: 'UX Designer', workload: 60, availability: 'Available' },
      { id: 4, name: 'David Kim', role: 'QA Engineer', workload: 90, availability: 'Overloaded' },
      { id: 5, name: 'Emma Wilson', role: 'Product Manager', workload: 75, availability: 'Available' },
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Team Overview', icon: '📊' },
    { id: 'dynamics', label: 'Team Dynamics', icon: '🔄' },
    { id: 'workload', label: 'Workload Balance', icon: '⚖️' },
    { id: 'performance', label: 'Performance', icon: '📈' }
  ];

  const OverviewTab = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Team Health</h3>
          <span className="text-2xl">💚</span>
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">{teamData.healthScore}%</div>
        <p className="text-gray-600 text-sm">
          Excellent team cohesion and collaboration effectiveness
        </p>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${teamData.healthScore}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Projects</h3>
          <span className="text-2xl">🚀</span>
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">{teamData.currentProjects}</div>
        <p className="text-gray-600 text-sm">Projects in active development</p>
        <div className="mt-4 flex space-x-2">
          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Mobile App</div>
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Dashboard</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Tasks Completed</h3>
          <span className="text-2xl">✅</span>
        </div>
        <div className="text-3xl font-bold text-purple-600 mb-2">{teamData.completedTasks}</div>
        <p className="text-gray-600 text-sm">This month</p>
        <div className="mt-4 text-sm text-green-600">
          ↗️ 15% increase from last month
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamData.members.map(member => (
            <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {member.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{member.name}</div>
                <div className="text-sm text-gray-600">{member.role}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                member.availability === 'Available' ? 'bg-green-100 text-green-800' :
                member.availability === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {member.availability}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DynamicsTab = () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Communication Styles</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Collaborative</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-sm text-gray-500">60%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Direct</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
              <span className="text-sm text-gray-500">25%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Analytical</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
              <span className="text-sm text-gray-500">15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Strengths</h3>
        <div className="flex flex-wrap gap-2">
          {['Leadership', 'Creativity', 'Technical Skills', 'Problem Solving', 'Communication', 'Adaptability'].map(strength => (
            <span key={strength} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {strength}
            </span>
          ))}
        </div>
        <h4 className="text-md font-medium text-gray-800 mt-6 mb-3">Recommendations</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Consider cross-training in data analysis</li>
          <li>• Implement pair programming sessions</li>
          <li>• Schedule regular retrospectives</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaboration Patterns</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-3">
            The team shows strong collaborative tendencies with effective cross-functional communication. 
            High emotional intelligence scores indicate good conflict resolution capabilities.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">82%</div>
              <div className="text-gray-600">Collaboration Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">75%</div>
              <div className="text-gray-600">Innovation Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">90%</div>
              <div className="text-gray-600">Trust Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkloadTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Workload Distribution</h3>
        <div className="space-y-4">
          {teamData.members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {member.name[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.role}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      member.workload > 85 ? 'bg-red-500' :
                      member.workload > 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(member.workload, 100)}%` }}
                  />
                </div>
                <div className="text-sm font-medium w-12 text-right">
                  {member.workload}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Workload Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Utilization</span>
              <span className="font-medium">76%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overloaded Members</span>
              <span className="font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Capacity</span>
              <span className="font-medium text-green-600">80 hours/week</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-500 mt-1">⚠️</span>
              <span>David Kim is overloaded - consider redistributing QA tasks</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">💡</span>
              <span>Carol Lee has capacity for additional design work</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">🔄</span>
              <span>Consider cross-training to increase team flexibility</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Productivity Trend</h3>
        <div className="text-3xl font-bold text-green-600 mb-2">↗️ +12%</div>
        <p className="text-gray-600 text-sm">Compared to last month</p>
        <div className="mt-4 bg-green-50 p-3 rounded">
          <p className="text-green-800 text-sm">Team productivity is trending upward with consistent delivery improvements.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Score</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
        <p className="text-gray-600 text-sm">Average quality rating</p>
        <div className="mt-4 bg-blue-50 p-3 rounded">
          <p className="text-blue-800 text-sm">Consistently high quality deliverables with minimal rework required.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Satisfaction</h3>
        <div className="text-3xl font-bold text-purple-600 mb-2">4.6/5</div>
        <p className="text-gray-600 text-sm">Team happiness score</p>
        <div className="mt-4 bg-purple-50 p-3 rounded">
          <p className="text-purple-800 text-sm">High team morale with positive feedback on collaboration and support.</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'dynamics': return <DynamicsTab />;
      case 'workload': return <WorkloadTab />;
      case 'performance': return <PerformanceTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="team-dashboard">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{teamData.name}</h1>
              <p className="text-green-100">
                {teamData.memberCount} Members • {teamData.currentProjects} Active Projects
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{teamData.healthScore}%</div>
              <div className="text-sm text-green-100">Team Health</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default TeamDashboard;