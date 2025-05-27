// ThemeEditor.jsx
import { useState, useEffect } from "preact/hooks";
import { 
  ActiveTheme,
  themes,
  UpdateThemePart,
  SetDefaultTheme,
  SyncActiveTheme,
  SyncAllUnsavedThemes,
  HasUnsavedChanges,
  unsavedThemes,
  isLoading,
  apiError,
  themeNameAndIDSList,
  LoadThemes
} from "./themes_state";
import { ModernSyncControls } from "../screen_builder/screen_components";
import { ThemesList } from "./theme_left";

function ThemeEditor() {
  const [activeTab, setActiveTab] = useState("light"); // "light" or "dark"
  const [syncMode, setSyncMode] = useState("active");
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Local state for theme editing
  const [lightThemeJson, setLightThemeJson] = useState("");
  const [darkThemeJson, setDarkThemeJson] = useState("");
  const [themeName, setThemeName] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Get current active theme data
  const activeThemeData = ActiveTheme.value ? themes[ActiveTheme.value] : null;
  
  // Sync controls data
  const unsavedCount = unsavedThemes.value.size;
  const activeThemeHasChanges = ActiveTheme.value ? HasUnsavedChanges(ActiveTheme.value) : false;
  const canSyncActive = ActiveTheme.value && activeThemeHasChanges;
  const canSyncAll = unsavedCount > 0;

  // Load theme data when active theme changes
  useEffect(() => {
    if (activeThemeData) {
      setThemeName(activeThemeData.theme_name || activeThemeData.name || "");
      setIsDefault(activeThemeData.is_default || false);
      
      // Load light theme
      const lightTheme = activeThemeData.light || activeThemeData.light_theme || {};
      setLightThemeJson(JSON.stringify(lightTheme, null, 2));
      
      // Load dark theme
      const darkTheme = activeThemeData.dark || activeThemeData.dark_theme || {};
      setDarkThemeJson(JSON.stringify(darkTheme, null, 2));
    } else {
      // Clear form when no theme selected
      setThemeName("");
      setIsDefault(false);
      setLightThemeJson("{}");
      setDarkThemeJson("{}");
    }
  }, [ActiveTheme.value, activeThemeData]);

  useEffect((
    () => {
        LoadThemes();
    }
  ),[]);

  // Handle theme name change
  const handleThemeNameChange = (newName) => {
    setThemeName(newName);
    if (ActiveTheme.value) {
      UpdateThemePart('theme_name', newName);
    }
  };

  // Handle JSON changes
  const handleJsonChange = (type, jsonString) => {
    if (type === "light") {
      setLightThemeJson(jsonString);
    } else {
      setDarkThemeJson(jsonString);
    }

    // Try to parse and update theme
    try {
      const parsedJson = JSON.parse(jsonString);
      if (ActiveTheme.value) {
        UpdateThemePart(type, parsedJson);
        // Also update the _theme version for API compatibility
        UpdateThemePart(`${type}_theme`, parsedJson);
      }
    } catch (e) {
      // Invalid JSON - don't update theme data yet
      console.warn("Invalid JSON:", e.message);
    }
  };

  // Handle default theme toggle
  const handleSetDefault = async () => {
    if (!ActiveTheme.value) return;
    
    try {
      await SetDefaultTheme(ActiveTheme.value);
      setIsDefault(true);
    } catch (error) {
      console.error("Failed to set default theme:", error);
    }
  };

  // Handle sync operations
  const handleSync = async () => {
    if (!ActiveTheme.value && syncMode === "active") return;
    
    setIsSyncing(true);
    try {
      if (syncMode === "active") {
        await SyncActiveTheme();
      } else {
        await SyncAllUnsavedThemes();
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Validate JSON
  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const lightJsonValid = isValidJson(lightThemeJson);
  const darkJsonValid = isValidJson(darkThemeJson);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      backgroundColor: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Left Sidebar - Theme List */}
      <div style={{
        width: "320px",
        backgroundColor: "white",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          padding: "24px 20px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            margin: "0 0 4px 0",
            color: "#1e293b"
          }}>
            Themes
          </h2>
          <p style={{
            fontSize: "14px",
            color: "#64748b",
            margin: 0
          }}>
            Choose a theme to edit
          </p>
        </div>
        
        <div style={{
          flex: 1,
          overflow: "auto",
          padding: "16px"
        }}>
          <ThemesList />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {!ActiveTheme.value ? (
          <div style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#64748b",
            gap: "12px"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px"
            }}>
              🎨
            </div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "600",
              margin: 0,
              color: "#334155"
            }}>
              Select a Theme to Edit
            </h3>
            <p style={{
              fontSize: "16px",
              margin: 0,
              textAlign: "center",
              maxWidth: "400px"
            }}>
              Choose a theme from the sidebar to start customizing its appearance and settings.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              {/* Sync Controls */}
              <div style={{
                backgroundColor: "white",
                borderBottom: "1px solid #e2e8f0",
                padding: "20px 32px"
              }}>
                <ModernSyncControls
                  onDismissError={() => {}}
                  syncMode={syncMode}
                  setSyncMode={setSyncMode}
                  isSyncing={isSyncing}
                  isLoading={isLoading?.value}
                  activeScreen={ActiveTheme.value}
                  screenNamesList={themeNameAndIDSList.value}
                  unsavedCount={unsavedCount}
                  activeScreenHasChanges={activeThemeHasChanges}
                  canSyncActive={canSyncActive}
                  canSyncAll={canSyncAll}
                  handleSync={handleSync}
                  apiError={apiError?.value}
                  showLegacySync={true}
                  showProgressBar={true}
                  compact={false}
                />
              </div>

              {/* Theme Settings */}
              <div style={{
                backgroundColor: "white",
                borderBottom: "1px solid #e2e8f0",
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                flexDirection:"row-reverse",
                gap: "16px"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight:"30px",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={handleSetDefault}
                    disabled={isLoading.value}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer"
                    }}
                  />
                  Default Theme
                </label>
              </div>


              {/* Theme Editor */}
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: "24px 32px",
                backgroundColor: "#f8fafc",
                overflow: "hidden"
              }}>
                {/* Theme Tabs */}
                <div style={{
                  display: "flex",
                  gap: "4px",
                  backgroundColor: "#f1f5f9",
                  padding: "4px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)"
                }}>
                  <button
                    onClick={() => setActiveTab("light")}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      backgroundColor: activeTab === "light" ? "white" : "transparent",
                      color: activeTab === "light" ? "#1e293b" : "#64748b",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: activeTab === "light" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    ☀️ Light Theme
                    {!lightJsonValid && (
                      <span style={{
                        color: "#dc2626",
                        fontSize: "14px"
                      }}>
                        ⚠️
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("dark")}
                    style={{
                      flex: 1,
                      padding: "14px 24px",
                      backgroundColor: activeTab === "dark" ? "white" : "transparent",
                      color: activeTab === "dark" ? "#1e293b" : "#64748b",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: activeTab === "dark" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    🌙 Dark Theme
                    {!darkJsonValid && (
                      <span style={{
                        color: "#dc2626",
                        fontSize: "14px"
                      }}>
                        ⚠️
                      </span>
                    )}
                  </button>
                </div>

                {/* Editor Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px"
                }}>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: 0,
                    color: "#1e293b"
                  }}>
                    {activeTab === "light" ? "Light" : "Dark"} Theme Configuration
                  </h3>
                  
                  {/* JSON Validation Status */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>
                    {(activeTab === "light" ? lightJsonValid : darkJsonValid) ? (
                      <span style={{ 
                        color: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        ✓ Valid JSON
                      </span>
                    ) : (
                      <span style={{ 
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        ⚠️ Invalid JSON
                      </span>
                    )}
                  </div>
                </div>

                {/* JSON Editor */}
                <div style={{ 
                  flex: 1, 
                  position: "relative",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: `2px solid ${
                    (activeTab === "light" ? lightJsonValid : darkJsonValid) 
                      ? "#e2e8f0" 
                      : "#fca5a5"
                  }`,
                  overflow: "hidden",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}>
                  <textarea
                    value={activeTab === "light" ? lightThemeJson : darkThemeJson}
                    // @ts-ignore
                    onInput={(e) => handleJsonChange(activeTab, e.target.value)}
                    placeholder={`Enter ${activeTab} theme configuration as JSON...`}
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "20px",
                      border: "none",
                      fontSize: "14px",
                      fontFamily: "'JetBrains Mono', 'Fira Code', Monaco, 'Courier New', monospace",
                      resize: "none",
                      backgroundColor: activeTab === "dark" ? "#1e293b" : "white",
                      color: activeTab === "dark" ? "#f1f5f9" : "#1e293b",
                      lineHeight: "1.6",
                      outline: "none",
                      tabSize: 2
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                backgroundColor: "white",
                borderTop: "1px solid #e2e8f0",
                padding: "20px 32px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <button
                  onClick={() => {
                    if (activeTab === "light") {
                      setLightThemeJson(JSON.stringify({}, null, 2));
                      handleJsonChange("light", "{}");
                    } else {
                      setDarkThemeJson(JSON.stringify({}, null, 2));
                      handleJsonChange("dark", "{}");
                    }
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    // @ts-ignore
                    e.target.style.backgroundColor = "#475569";
                    // @ts-ignore
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    // @ts-ignore
                    e.target.style.backgroundColor = "#64748b";
                    // @ts-ignore
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Clear {activeTab === "light" ? "Light" : "Dark"} Theme
                </button>
                
                <button
                  onClick={() => {
                    const formatted = JSON.stringify(
                      JSON.parse(activeTab === "light" ? lightThemeJson : darkThemeJson), 
                      null, 
                      2
                    );
                    if (activeTab === "light") {
                      setLightThemeJson(formatted);
                    } else {
                      setDarkThemeJson(formatted);
                    }
                  }}
                  disabled={!(activeTab === "light" ? lightJsonValid : darkJsonValid)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: (activeTab === "light" ? lightJsonValid : darkJsonValid) 
                      ? "#3b82f6" : "#cbd5e1",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: (activeTab === "light" ? lightJsonValid : darkJsonValid) 
                      ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab === "light" ? lightJsonValid : darkJsonValid) {
                        // @ts-ignore
                      e.target.style.backgroundColor = "#2563eb";
                      // @ts-ignore
                      e.target.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab === "light" ? lightJsonValid : darkJsonValid) {
                      // @ts-ignore
                      e.target.style.backgroundColor = "#3b82f6";
                      // @ts-ignore
                      e.target.style.transform = "translateY(0)";
                    }
                  }}
                >
                  Format JSON
                </button>

                <div style={{ flex: 1 }} />
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "14px",
                  color: "#64748b"
                }}>
                  <span>Theme ID:</span>
                  <code style={{
                    backgroundColor: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#334155"
                  }}>
                    {ActiveTheme.value}
                  </code>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { ThemeEditor };