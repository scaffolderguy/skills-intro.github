import React, { useState } from 'react';

const ManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for demonstration
  const organizationData = {
    totalTeams: 12,
    totalEmployees: 94,
    openPositions: 7,
    averageTeamHealth: 85,
    teams: [
      { id: 1, name: 'Product Development', health: 87, members: 8, projects: 3 },
      { id: 2, name: 'Marketing', health: 92, members: 6, projects: 2 },
      { id: 3, name: 'Engineering', health: 78, members: 12, projects: 4 },
      { id: 4, name: 'Design', health: 89, members: 5, projects: 2 }
    ],
    candidates: [
      { id: 1, name: 'Sarah Chen', role: 'Frontend Developer', compatibility: 89, stage: 'Interview' },
      { id: 2, name: 'Mike Rodriguez', role: 'UX Designer', compatibility: 94, stage: 'Assessment' },
      { id: 3, name: 'Lisa Wang', role: 'Data Scientist', compatibility: 76, stage: 'Review' },
    ]
  };

  const sections = [
    { id: 'overview', label: 'Organization Overview', icon: '🏢' },
    { id: 'hiring', label: 'AI Hiring Pipeline', icon: '🎯' },
    { id: 'analytics', label: 'Team Analytics', icon: '📊' },
    { id: 'optimization', label: 'Optimization', icon: '⚡' }
  ];

  const OverviewSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-3xl font-bold text-gray-900">{organizationData.totalTeams}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-3xl font-bold text-gray-900">{organizationData.totalEmployees}</p>
            </div>
            <div className="text-3xl">👤</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-3xl font-bold text-gray-900">{organizationData.openPositions}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Team Health</p>
              <p className="text-3xl font-bold text-gray-900">{organizationData.averageTeamHealth}%</p>
            </div>
            <div className="text-3xl">❤️</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Team Performance Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {organizationData.teams.map(team => (
              <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {team.name.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{team.name}</h4>
                    <p className="text-sm text-gray-600">{team.members} members • {team.projects} projects</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{team.health}%</div>
                    <div className="text-xs text-gray-500">Health Score</div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        team.health >= 85 ? 'bg-green-500' :
                        team.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${team.health}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const HiringSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">AI-Powered Hiring Pipeline</h3>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              New Position
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">AI Interviews</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Final Reviews</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Top Candidates</h4>
            {organizationData.candidates.map(candidate => (
              <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">{candidate.name}</h5>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      candidate.compatibility >= 90 ? 'text-green-600' :
                      candidate.compatibility >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {candidate.compatibility}%
                    </div>
                    <div className="text-xs text-gray-500">Compatibility</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    candidate.stage === 'Interview' ? 'bg-blue-100 text-blue-800' :
                    candidate.stage === 'Assessment' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {candidate.stage}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">AI Interview Insights</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Personality Fit</span>
              <span className="font-medium">87% avg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Technical Skills</span>
              <span className="font-medium">82% avg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cultural Match</span>
              <span className="font-medium">91% avg</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Hiring Recommendations</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Sarah Chen shows excellent leadership potential</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">ℹ️</span>
              <span>Consider Mike Rodriguez for Design team lead role</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-500 mt-1">⚠️</span>
              <span>Lisa Wang may need additional communication support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const AnalyticsSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Productivity Trends</h4>
          <div className="text-3xl font-bold text-green-600 mb-2">↗️ +18%</div>
          <p className="text-gray-600 text-sm">Organization-wide productivity increase</p>
          <div className="mt-4 text-xs text-gray-500">Compared to last quarter</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Employee Satisfaction</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">4.7/5</div>
          <p className="text-gray-600 text-sm">Average satisfaction score</p>
          <div className="mt-4 text-xs text-green-600">↗️ +0.3 from last survey</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Retention Rate</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">96%</div>
          <p className="text-gray-600 text-sm">12-month retention rate</p>
          <div className="mt-4 text-xs text-green-600">↗️ +4% improvement</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Cross-Team Collaboration Matrix</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">High Collaboration</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Product ↔ Engineering</span>
                  <span className="text-sm font-medium text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Design ↔ Marketing</span>
                  <span className="text-sm font-medium text-green-600">91%</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Improvement Opportunities</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">Engineering ↔ Marketing</span>
                  <span className="text-sm font-medium text-yellow-600">67%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">Product ↔ Design</span>
                  <span className="text-sm font-medium text-yellow-600">72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OptimizationSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">AI Optimization Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Immediate Actions</h4>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-red-400 bg-red-50">
                  <h5 className="font-medium text-red-800">High Priority</h5>
                  <p className="text-sm text-red-700">Engineering team showing signs of burnout - redistribute workload</p>
                  <button className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Take Action
                  </button>
                </div>
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                  <h5 className="font-medium text-yellow-800">Medium Priority</h5>
                  <p className="text-sm text-yellow-700">Cross-train Design team members in user research methods</p>
                  <button className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                    Schedule
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Strategic Improvements</h4>
              <div className="space-y-3">
                <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
                  <h5 className="font-medium text-blue-800">Team Structure</h5>
                  <p className="text-sm text-blue-700">Consider creating a dedicated DevOps role to improve deployment efficiency</p>
                </div>
                <div className="p-4 border-l-4 border-green-400 bg-green-50">
                  <h5 className="font-medium text-green-800">Skill Development</h5>
                  <p className="text-sm text-green-700">Implement AI/ML training program to future-proof technical skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Workflow Efficiency</h4>
          <div className="text-2xl font-bold text-blue-600 mb-2">87%</div>
          <p className="text-gray-600 text-sm">Current efficiency score</p>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Potential improvement: +13%</p>
            <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Optimize Now
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Resource Allocation</h4>
          <div className="text-2xl font-bold text-green-600 mb-2">Good</div>
          <p className="text-gray-600 text-sm">Overall allocation health</p>
          <div className="mt-4">
            <p className="text-xs text-gray-500">2 teams need rebalancing</p>
            <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Rebalance
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-4">Collaboration Score</h4>
          <div className="text-2xl font-bold text-purple-600 mb-2">91%</div>
          <p className="text-gray-600 text-sm">Inter-team collaboration</p>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Excellent cross-team synergy</p>
            <button className="mt-2 text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
              Maintain
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'hiring': return <HiringSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'optimization': return <OptimizationSection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-purple-100">
            AI-powered insights for organizational optimization and team management
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {renderSectionContent()}
      </div>
    </div>
  );
};

export default ManagerDashboard;