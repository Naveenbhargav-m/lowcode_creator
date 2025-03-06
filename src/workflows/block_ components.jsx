import { NodeResizer } from "@xyflow/react";
import DynamicIcon from "../components/custom/dynamic_icon";


export function InsertRow({data, isConnectable}) {
    let name = "Insert Row";
    let icon = "database";
    let  style={"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"};

    return (
        <div style={style}>
            <div style={{padding:"20px"}}><DynamicIcon name={icon} size={20}/></div>
            {name}
        </div>
    );
}

export function UpdateRow({data, isConnectable}) {
    let name = "Update Row";
    let icon = "database";
    let  style={"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"};

    return (
        <div style={style}>
            <div style={{padding:"20px"}}><DynamicIcon name={icon} size={20}/></div>
            {name}
        </div>
    );
}

export function Condition({data, isConnectable}) {
    let name = "condition";
    let icon = "parentheses";
    let  style={"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"};

    return (
        <div style={style}>
            <div style={{padding:"20px"}}><DynamicIcon name={icon} size={20}/></div>
            {name}
        </div>
    );
}

export function Start({data, isConnectable}) {
    let name = "condition";
    let icon = "parentheses";
    let  style={"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"};

    return (
        <div style={style}>
            <NodeResizer />
            <div style={{padding:"20px"}}><DynamicIcon name={icon} size={20}/></div>
            {name}
        </div>
    );
}

export function End({data, isConnectable}) {
    let name = "condition";
    let icon = "parentheses";
    let  style={"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"18px", borderRadius:"20px"};

    return (
        <div style={style}>
            <NodeResizer />
            <div style={{padding:"20px"}}><DynamicIcon name={icon} size={20}/></div>
            {name}
        </div>
    );
}