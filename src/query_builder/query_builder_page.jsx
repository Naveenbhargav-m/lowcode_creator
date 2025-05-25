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
            flexDirection: "column", 
            height: "100vh", 
            width: "100vw",
            ...globalStyle
        }}>
            {/* Modern Sync Controls */}
            <div style={{ 
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                zIndex: 10
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

            {/* Main Content */}
            <div style={{
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "flex-start", 
                alignItems: "flex-start",
                flex: 1,
                overflow: "hidden"
            }}>
                {/* Left Panel - Queries List */}
                <div style={{
                    width: "300px",
                    minWidth: "300px",
                    height: "100%",
                    borderRight: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff"
                }}>
                    <QueriesList />
                </div>

                {/* Main Content - Tables View */}
                <div style={{
                    flex: 1,
                    height: "100%",
                    overflow: "auto"
                }}>
                    <TablesView prefilData={{}} />
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading.value && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "20px",
                                height: "20px",
                                border: "2px solid #f3f3f3",
                                borderTop: "2px solid #3498db",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}></div>
                            <span>Loading queries...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export { QueryBuilderPage };