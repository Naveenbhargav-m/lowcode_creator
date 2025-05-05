import { useAuthCheck } from "../hooks/hooks";
import { useState } from 'react';
import { Settings, Home, Route, Workflow, Image, Type, ChevronRight, Save, ArrowLeft } from 'lucide-react';

// Dummy data
const initialSettings = {
  homePage: "/dashboard",
  routes: [
    { path: "/dashboard", component: "Dashboard" },
    { path: "/projects", component: "Projects" },
    { path: "/users", component: "Users" }
  ],
  workflows: {
    frontend: "default-frontend-init",
    backend: "default-backend-init"
  },
  appearance: {
    title: "BuildFlow Studio",
    favicon: "/favicon.ico"
  }
};

// Available components for route mapping
const availableComponents = [
  "Dashboard", "Projects", "Users", "Analytics", 
  "Settings", "Profile", "Login", "Register"
];

// Available workflow templates
const workflowTemplates = {
  frontend: ["default-frontend-init", "react-frontend-init", "vue-frontend-init", "angular-frontend-init"],
  backend: ["default-backend-init", "express-backend-init", "django-backend-init", "flask-backend-init"]
};

export function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState('general');
  const [newRoute, setNewRoute] = useState({ path: "", component: "" });
  const [savedMessage, setSavedMessage] = useState("");

  // Handle settings changes
  const updateHomePage = (value) => {
    setSettings(prev => ({ ...prev, homePage: value }));
  };

  const addRoute = () => {
    if (newRoute.path && newRoute.component) {
      setSettings(prev => ({
        ...prev,
        routes: [...prev.routes, { ...newRoute }]
      }));
      setNewRoute({ path: "", component: "" });
    }
  };

  const removeRoute = (index) => {
    setSettings(prev => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index)
    }));
  };

  const updateWorkflow = (type, value) => {
    setSettings(prev => ({
      ...prev,
      workflows: { ...prev.workflows, [type]: value }
    }));
  };

  const updateAppearance = (key, value) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving settings:", settings);
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: <Settings size={18} /> },
    { id: 'routes', label: 'Route Mapping', icon: <Route size={18} /> },
    { id: 'workflows', label: 'Init Workflows', icon: <Workflow size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Image size={18} /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Settings className="text-blue-600" />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                    activeSection === section.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <span>{section.label}</span>
                  </div>
                  <ChevronRight size={16} className={activeSection === section.id ? 'text-blue-600' : 'text-gray-400'} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{sections.find(s => s.id === activeSection)?.label}</h2>
            <button 
              onClick={saveSettings}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>

          {savedMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {savedMessage}
            </div>
          )}

          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Home Page</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={settings.homePage}
                  onChange={(e) => updateHomePage(e.target.value)}
                >
                  {settings.routes.map((route, index) => (
                    <option key={index} value={route.path}>
                      {route.path} ({route.component})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This is the first page users will see when they open your app.
                </p>
              </div>
            </div>
          )}

          {/* Route Mapping */}
          {activeSection === 'routes' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Current Routes</h3>
                
                <div className="space-y-2 mb-6">
                  {settings.routes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <span className="font-medium">{route.path}</span>
                        <span className="text-gray-500 ml-2">→ {route.component}</span>
                      </div>
                      <button 
                        onClick={() => removeRoute(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mb-4">Add New Route</h3>
                <div className="flex space-x-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Path</label>
                    <input 
                      type="text"
                      placeholder="/new-route"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newRoute.path}
                      onChange={(e) => setNewRoute({...newRoute, path: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Component</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={newRoute.component}
                      onChange={(e) => setNewRoute({...newRoute, component: e.target.value})}
                    >
                      <option value="">Select Component</option>
                      {availableComponents.map((comp, index) => (
                        <option key={index} value={comp}>{comp}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button 
                  onClick={addRoute}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                >
                  Add Route
                </button>
              </div>
            </div>
          )}

          {/* Workflows */}
          {activeSection === 'workflows' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Frontend Initialization</h3>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                  value={settings.workflows.frontend}
                  onChange={(e) => updateWorkflow('frontend', e.target.value)}
                >
                  {workflowTemplates.frontend.map((template, index) => (
                    <option key={index} value={template}>{template}</option>
                  ))}
                </select>
                
                <h3 className="text-lg font-medium mb-4">Backend Initialization</h3>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={settings.workflows.backend}
                  onChange={(e) => updateWorkflow('backend', e.target.value)}
                >
                  {workflowTemplates.backend.map((template, index) => (
                    <option key={index} value={template}>{template}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  These workflows determine how your application is initialized when deployed.
                </p>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Web Title</h3>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 mb-6"
                  value={settings.appearance.title}
                  onChange={(e) => updateAppearance('title', e.target.value)}
                  placeholder="Application Title"
                />
                
                <h3 className="text-lg font-medium mb-4">Favicon</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/api/placeholder/32/32" 
                      alt="Current favicon"
                      className="max-w-full max-h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      value={settings.appearance.favicon}
                      onChange={(e) => updateAppearance('favicon', e.target.value)}
                      placeholder="/favicon.ico"
                    />
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Upload
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  The favicon appears in browser tabs and bookmarks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}