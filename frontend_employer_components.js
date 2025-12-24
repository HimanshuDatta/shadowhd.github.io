// frontend/src/components/Employer/EmployerDashboard.jsx
import React, { useState } from 'react';
import { Home, Bot, Users, BarChart, Settings, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../App';
import EmployerOverview from './EmployerOverview';
import AgentsManagement from './AgentsManagement';

export default function EmployerDashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'agents', icon: Bot, label: 'AI Agents' },
    { id: 'trainees', icon: Users, label: 'Trainees' },
    { id: 'analytics', icon: BarChart, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-gray-900">{user.company_name || user.company}</h2>
              <p className="text-sm text-gray-600">{user.name}</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition ${
                currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && <EmployerOverview />}
          {currentView === 'agents' && <AgentsManagement />}
          {currentView === 'trainees' && <PlaceholderView title="Trainees Overview" />}
          {currentView === 'analytics' && <PlaceholderView title="Analytics & Insights" />}
          {currentView === 'settings' && <PlaceholderView title="Settings" />}
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">This feature is coming soon...</p>
      </div>
    </div>
  );
}