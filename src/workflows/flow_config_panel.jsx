import { InsertRowComp } from "./flow_right";

function FlowBuilderDrawer(props) {
    console.log("props:", props);
    return (
        <div style={{padding:"4px"}}><InsertRowComp /></div>
    );
}

export {FlowBuilderDrawer};