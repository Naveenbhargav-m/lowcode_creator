import { FlowBuilder } from "./flow_builder";
import { WorkflowsList } from "./flow_left_panel";
import { FlowBuilderDrawer } from "./flow_right";





function WorkFlowPage() {
    return (
        <div style={{display:"contents"}}>
            <div className="min-h-screen h-screen w-full bg-white flex">
                <div className="w-2/12 bg-white p-4 h-screen">
                <WorkflowsList />
                </div>
                <div className="w-9/12 h-screen bg-background scrollable-div">
                        <FlowBuilder />
                </div>
                <div className="w-3/12 bg-white h-screen scrollable-div">
                    <FlowBuilderDrawer />
                </div>
            </div>
        </div>
    );
}

export {WorkFlowPage};