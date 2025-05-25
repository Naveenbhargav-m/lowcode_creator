
import DynamicIcon from '../components/custom/dynamic_icon';
import { activeTab} from './screen_state';
import { variableKeys , newVariableKey , addVariable, LoadSignals } from '../states/global_state';
import { useEffect } from 'preact/hooks';

const TabComponent = () => {

  const setActiveTab = (tabName) => {
    activeTab.value = tabName;
  };

  // Inline styles for floating, rounded tabs
  const tabStyle = (isActive) => ({
    padding: '5px 8px',
    margin:'0px 5px',
    cursor: 'pointer',
    borderRadius: '20px',
    backgroundColor: isActive ? '#000000' : '#ffffff',
    color: isActive ? '#ffffff' : '#000000',
    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      {/* Render each tab */}
      {[
        { name: 'Screen', Icon: "laptop-minimal" },
        { name: 'Template', Icon: "layout-template" },
        { name: 'GlobalVars', Icon: "braces" },
        {name:"Themes", Icon:"palette"}
      ].map(({ name, Icon }) => (
        <div
          key={name}
          style={tabStyle(activeTab.value === name)}
          onClick={() => setActiveTab(name)}
        >
          <DynamicIcon name={Icon} size={20}/>
          {name}
        </div>
      ))}
    </div>
  );
};



const DesktopMockup = ({ children }) => {
  return (
      <div
        className="flex flex-col justify-center items-center h-5/6 border border-4 border-black rounded-lg m-2 overflow-hidden"
        style={{"width":"100%"}}
      >
        <div className="h-full w-full overflow-auto scrollbar-hide">
          {children}
        </div>
        
      </div>
    );
};


import React from 'react';
import { RotateCw, AlertCircle, CheckCircle2, Clock, ChevronDown } from 'lucide-react';

const SyncButton = ({ title, onClick, disabled, variant = 'primary', size = 'md', children }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md focus:ring-blue-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
    >
      {children || title}
    </button>
  );
};

function ModernSyncControls({
  // Sync mode and state
  syncMode,
  setSyncMode,
  isSyncing,
  isLoading,
  
  // Screen data
  activeScreen,
  screenNamesList = [],
  
  // Counts and status
  unsavedCount = 0,
  activeScreenHasChanges = false,
  canSyncActive = false,
  canSyncAll = false,
  
  // Event handlers
  handleSync,
  
  // Error handling
  apiError,
  onDismissError,
  
  showProgressBar = true,
  compact = false,
  className = "",
  
  ...props
}) {
  const activeScreenData = screenNamesList?.find(s => s.id === activeScreen);
  
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`} {...props}>
      {/* Main Controls */}
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left Section - Mode & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Sync Mode Selector */}
            <div className="relative">
              <select
                value={syncMode}
                onChange={(e) => setSyncMode?.(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="active">Active Screen</option>
                <option value="all">All Unsaved ({unsavedCount})</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Badges */}
            {!compact && (
              <div className="flex items-center gap-2">
                {unsavedCount > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-medium border border-amber-200">
                    <Clock className="w-3 h-3" />
                    {unsavedCount} unsaved
                  </div>
                )}
                
                {activeScreen && activeScreenData && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    activeScreenHasChanges 
                      ? 'bg-orange-50 text-orange-800 border-orange-200'
                      : 'bg-green-50 text-green-800 border-green-200'
                  }`}>
                    {activeScreenHasChanges ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    <span className="truncate max-w-24 sm:max-w-32">
                      {activeScreenData.name || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            <SyncButton
            title={"sync"}
              onClick={handleSync}
              disabled={
                isSyncing || 
                isLoading || 
                (syncMode === "active" && !canSyncActive) ||
                (syncMode === "all" && !canSyncAll)
              }
              variant="primary"
              size="md"
            >
              <RotateCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing 
                ? "Syncing..." 
                : syncMode === "active" 
                  ? "Sync Active" 
                  : `Sync All (${unsavedCount})`
              }
            </SyncButton>

          </div>
        </div>

        {/* Compact Mobile Status */}
        {compact && (unsavedCount > 0 || (activeScreen && activeScreenData)) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              {unsavedCount > 0 && (
                <span className="text-amber-600">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {unsavedCount} unsaved
                </span>
              )}
              {activeScreen && activeScreenData && (
                <span className={activeScreenHasChanges ? 'text-orange-600' : 'text-green-600'}>
                  {activeScreenHasChanges ? (
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  )}
                  Active: {activeScreenData.name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="mx-4 mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Sync Error</p>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
            {onDismissError && (
              <button
                onClick={onDismissError}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <div className="w-4 h-4 flex items-center justify-center">×</div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar (when syncing) */}
      {isSyncing && showProgressBar && (
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}



export {TabComponent, DesktopMockup, ModernSyncControls};