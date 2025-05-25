// query_builder_page.jsx
import { useEffect, useState } from "preact/hooks";
import { TablesView } from "./components";
import { QueriesList } from "./queries_left_list";
import { 
  LoadQueries,
  SyncActiveQuery,
  SyncAllUnsavedQueries,
  unsavedQueries,
  isLoading,
  apiError,
  activeQuery,
  HasUnsavedChanges,
  queryNamesList
} from "./query_signal";
import { globalStyle } from "../styles/globalStyle";
import { useAuthCheck } from "../hooks/hooks";
import { ModernSyncControls } from "../screen_builder/screen_components";

function QueryBuilderPage() {
    useAuthCheck();
    
    const [syncMode, setSyncMode] = useState("active"); // "active" or "all"
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        LoadQueries();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            if (syncMode === "active") {
                await SyncActiveQuery();
            } else {
                await SyncAllUnsavedQueries();
            }
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDismissError = () => {
        // You might want to implement a way to clear the error in your state
        console.log("Error dismissed");
    };

    const unsavedCount = unsavedQueries.value.size;
    const activeQueryHasChanges = activeQuery.value && HasUnsavedChanges(activeQuery.value);
    const canSyncActive = activeQuery.value && activeQueryHasChanges;
    const canSyncAll = unsavedCount > 0;

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
            overflow: "hidden", // Prevent scrollbars on main container
            ...globalStyle
        }}>
            {/* Left Panel - Full height from top */}
            <div style={{
                width: "300px",
                minWidth: "300px",
                height: "100vh",
                borderRight: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
                zIndex: 10,
                overflow: "hidden"
            }}>
                <QueriesList />
            </div>

            {/* Right Panel - Contains sync controls and main content */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width:"50vw",
                overflow: "hidden",
                minWidth: 0 // Important: allows flex item to shrink below content size
            }}>
                {/* Sync Controls Bar */}
                <div style={{
                    flexShrink: 0, // Prevent shrinking
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                    width:"75vw",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", // Subtle shadow
                    zIndex: 5
                }}>
                    <ModernSyncControls
                        onDismissError={handleDismissError}
                        syncMode={syncMode}
                        setSyncMode={setSyncMode}
                        isSyncing={isSyncing}
                        isLoading={isLoading?.value}
                        activeScreen={activeQuery.value}
                        screenNamesList={queryNamesList.value}
                        unsavedCount={unsavedCount}
                        activeScreenHasChanges={activeQueryHasChanges}
                        canSyncActive={canSyncActive}
                        canSyncAll={canSyncAll}
                        handleSync={handleSync}
                        apiError={apiError?.value}
                        showLegacySync={true}
                        showProgressBar={true}
                        compact={true}
                    />
                </div>

                {/* Main Content Area - Tables View */}
                <div style={{
                    overflow: "auto",
                    backgroundColor: "#f8fafc", // Light background for better contrast
                }}>
                    <TablesView prefilData={{}} />
                </div>
            </div>

            {/* Enhanced Loading Overlay */}
            {isLoading.value && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    backdropFilter: "blur(2px)" // Modern blur effect
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "32px 40px",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                        maxWidth: "300px",
                        textAlign: "center"
                    }}>
                        <div style={{ 
                            display: "flex", 
                            flexDirection: "column",
                            alignItems: "center", 
                            gap: "16px" 
                        }}>
                            {/* Enhanced Loading Spinner */}
                            <div style={{
                                width: "32px",
                                height: "32px",
                                border: "3px solid #e5e7eb",
                                borderTop: "3px solid #3b82f6",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}></div>
                            <div>
                                <div style={{ 
                                    fontSize: "16px", 
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    marginBottom: "4px"
                                }}>
                                    Loading Queries
                                </div>
                                <div style={{ 
                                    fontSize: "14px", 
                                    color: "#6b7280" 
                                }}>
                                    Please wait...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animation for spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export { QueryBuilderPage };