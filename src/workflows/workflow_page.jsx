import { useEffect } from "preact/hooks";
import { useAuthCheck } from "../hooks/hooks";
import { FlowBuilder } from "./flow_builder";
import { WorkflowsList } from "./flow_left_panel";
import { WorkflowConfigFormPanel } from "./flow_right";




function WorkFlowPage() {
    useAuthCheck();
    
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        width: "100%", 
        height: "100vh",
        overflow: "hidden" // Prevent scrollbars at the page level
      }}>
        {/* Left panel - workflow list */}
        <div style={{ width: "20vw", backgroundColor: "white", padding: "1rem", height: "100%" }}>
          <WorkflowsList />
        </div>
        
        {/* Middle panel - flow builder */}
        <div style={{ width: "55vw", height: "100%" }} className="bg-background">
          <FlowBuilder />
        </div>
        
        {/* Right panel - configuration panel that takes remaining width */}
        <div style={{ 
          flex: 1, 
          height: "100%", 
          "width": "40vw",
          zIndex: 10, 
          position: "relative", 
          overflow: "auto",
          maxWidth: "calc(40vw)" // Ensure it doesn't grow beyond expected width
        }}>
          <WorkflowConfigFormPanel />
        </div>
      </div>
    );
  }
export {WorkFlowPage};