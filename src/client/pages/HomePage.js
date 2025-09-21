import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6 rounded-lg mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            🎼 AI as the Conductor, Humans as the Ensemble
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Experience adaptive, intelligent collaboration where AI maintains continuity 
            while humans contribute at their peak performance. Whether it's 3 hours from 
            a busy parent, 5 from a student, or a weekly sprint from a retired expert—
            everyone contributes when they're at their best.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      <div className="features-section grid md:grid-cols-3 gap-8 mb-16">
        <div className="feature-card bg-white p-8 rounded-lg shadow-lg border">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Interview Engine</h3>
          <p className="text-gray-600 leading-relaxed">
            Conducts personalized interviews, analyzes personality traits, communication styles, 
            and emotional intelligence to generate compatibility scores and team dynamics profiles.
          </p>
        </div>
        
        <div className="feature-card bg-white p-8 rounded-lg shadow-lg border">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Team Dynamics Dashboard</h3>
          <p className="text-gray-600 leading-relaxed">
            Visualizes team personality profiles, highlighting strengths, weaknesses, and potential gaps. 
            See how new candidates might fit into existing team dynamics.
          </p>
        </div>
        
        <div className="feature-card bg-white p-8 rounded-lg shadow-lg border">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Workflow Management</h3>
          <p className="text-gray-600 leading-relaxed">
            AI-driven task assignment based on team member strengths, availability, and workload. 
            Tracks progress and provides intelligent nudges to keep projects flowing.
          </p>
        </div>
      </div>

      <div className="collaboration-section bg-gray-50 py-16 px-8 rounded-lg mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🔄 The Fluid Collaboration Framework
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Roles & Responsibilities</h3>
              <div className="space-y-4">
                <div className="role-item">
                  <h4 className="text-lg font-semibold text-purple-600 mb-2">🎭 Muses (Team Members)</h4>
                  <p className="text-gray-600">Contribute based on strengths and availability, engaging in projects that align with personal and professional goals.</p>
                </div>
                <div className="role-item">
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">🤖 AI Conductor</h4>
                  <p className="text-gray-600">Manages workflows, ensures continuity, monitors well-being, and adjusts workloads as necessary.</p>
                </div>
                <div className="role-item">
                  <h4 className="text-lg font-semibold text-green-600 mb-2">👥 Team Facilitators</h4>
                  <p className="text-gray-600">Human leaders who guide teams, ensure cultural alignment, and foster communication between AI and members.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Collaboration Practices</h3>
              <div className="space-y-4">
                <div className="practice-item">
                  <h4 className="text-lg font-semibold text-orange-600 mb-2">⏰ Fluid Scheduling</h4>
                  <p className="text-gray-600">Dynamic team composition based on preferred working hours and energy levels, optimized by AI.</p>
                </div>
                <div className="practice-item">
                  <h4 className="text-lg font-semibold text-teal-600 mb-2">🔄 Continuous Feedback</h4>
                  <p className="text-gray-600">AI-facilitated check-ins gathering insights on team dynamics and individual experiences for constant improvement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="benefits-section text-center mb-16">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">💡 What This Enables</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="benefit">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Enhanced Talent Utilization</h3>
            <p className="text-gray-600">Leverage a broader talent pool by focusing on personality fit and strengths rather than traditional constraints.</p>
          </div>
          <div className="benefit">
            <div className="text-3xl mb-4">😊</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Increased Satisfaction</h3>
            <p className="text-gray-600">Employees feel valued and understood, leading to higher job satisfaction and lower turnover rates.</p>
          </div>
          <div className="benefit">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Agile Work Environment</h3>
            <p className="text-gray-600">Quick adjustments based on team needs, project demands, and individual circumstances create responsive culture.</p>
          </div>
        </div>
      </div>

      <div className="cta-section bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Team Collaboration?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join the revolution where productivity becomes a shared rhythm, AI is supportive, and people are truly empowered.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition">
            Get Started Today
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;