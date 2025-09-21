import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/candidate', label: 'Candidate Portal', icon: '👤' },
    { path: '/team', label: 'Team Dashboard', icon: '👥' },
    { path: '/manager', label: 'Manager Dashboard', icon: '📊' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎼</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Conductor</h1>
              <p className="text-xs text-gray-600">Adaptive Collaboration Platform</p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <span className="text-xl">🔔</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <span className="text-sm text-gray-700">User</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;