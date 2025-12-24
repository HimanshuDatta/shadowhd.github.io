// frontend/src/components/Employer/AgentsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Bot, X, Upload, FileText } from 'lucide-react';
import { useAuth } from '../../App';

export default function AgentsManagement() {
  const { API_URL, token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/agents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (agentData) => {
    try {
      const response = await fetch(`${API_URL}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agentData)
      });

      if (response.ok) {
        await fetchAgents();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Agents Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.role}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                agent.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {agent.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Trainees</span>
                <span className="font-medium text-gray-900">{agent.trainees || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium text-gray-900">{Math.floor(Math.random() * 20 + 70)}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedAgent(agent)}
                className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition font-medium"
              >
                Configure
              </button>
              <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
                View Data
              </button>
            </div>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No AI Agents Yet</h3>
          <p className="text-gray-600 mb-6">Create your first AI agent to start onboarding employees</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Create First Agent
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateAgentModal 
          onClose={() => setShowCreateModal(false)} 
          onSave={handleCreateAgent}
        />
      )}

      {selectedAgent && (
        <ConfigureAgentModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}

function CreateAgentModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({ name: '', role: '', active: true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New AI Agent</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Engineering AI Coach"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Category</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a role</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="Design">Design</option>
              <option value="Customer Success">Customer Success</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-gray-700">Activate immediately</label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfigureAgentModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('knowledge');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Configure {agent.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          {['knowledge', 'simulations', 'curriculum'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">Upload Knowledge Base</p>
              <p className="text-sm text-gray-600 mb-4">PDFs, docs, wikis, process documents</p>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                Choose Files
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Uploaded Documents (3)</h3>
              {['Company Handbook.pdf', 'PM Process Guide.pdf', 'Stakeholder Map.xlsx'].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'simulations' && (
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-indigo-300 rounded-lg p-6 text-indigo-600 hover:bg-indigo-50 transition">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create New Simulation</span>
            </button>

            <div className="space-y-3">
              {['Stakeholder Crisis Management', 'Budget Planning Exercise', 'Sprint Planning Simulation'].map((sim, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{sim}</h4>
                      <p className="text-sm text-gray-600">Difficulty: {['Beginner', 'Intermediate', 'Advanced'][idx]}</p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-medium text-indigo-900 mb-2">Learning Path</h3>
              <p className="text-sm text-indigo-700">Define the sequence of modules and milestones</p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Week 1: Company & Team Introduction', modules: 5 },
                { title: 'Week 2: Core Processes & Tools', modules: 7 },
                { title: 'Week 3: Advanced Skills & Simulations', modules: 8 }
              ].map((week, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{week.title}</h4>
                    <span className="text-sm text-gray-600">{week.modules} modules</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700">Edit Modules</button>
                    <button className="text-sm text-gray-600 hover:text-gray-700">Reorder</button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:bg-gray-50">
              <Plus className="w-5 h-5" />
              Add Learning Module
            </button>
          </div>
        )}
      </div>
    </div>
  );
}