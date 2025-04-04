import { FlowBuilder } from "./flow_builder";
import { WorkflowsList } from "./flow_left_panel";
import { InsertRowComp } from "./flow_right";





function WorkFlowPage() {
    return (
        <div style={{display:"flex", "flexDirection":"row", width:"95vw"}}>
                <div className="w-2/12 bg-white p-4 h-screen">
                <WorkflowsList />
                </div>
                <div className="w-7/12 h-screen bg-background scrollable-div">
                        <FlowBuilder />
                </div>
                <div className="w-3/12 bg-white h-screen scrollable-div">
                    <InsertRowComp />
                    {/* <DynamicConfigForm blockConfig={blocksRequirements.insert_row} globalData={["table1", "table2"]} blockData={{}}/> */}
                </div>
        </div>
    );
}

export {WorkFlowPage};