import { NodeResizer } from "@xyflow/react";
import DynamicIcon from "../components/custom/dynamic_icon";


import { Handle, Position } from '@xyflow/react';

export function InsertRow({ data }) {
    let name = "Insert Row";
    let icon = "database";
    let style = {
        display: "flex",
        height: "inherit",
        width: "inherit",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "black",
        fontSize: "0.8em",
        margin: "10px 0px",
        padding: "10px 10px",
        borderRadius: "20px"
    };
    return (
        <div>
            <NodeResizer isVisible={true} />
            {data.handles?.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type={handle.type} // or "target" based on your logic
                    position={handle.position} // Ensure positions are valid
                    isConnectable={true}
                />
            ))}
            <div style={style}>
                <div style={{ padding: "0 4px" }}>
                    <DynamicIcon name={icon} size={20} />
                </div>
                {name}
            </div>
        </div>
    );
}


export function UpdateRow({data, isConnectable}) {
    let name = "Update Row";
    let icon = "database";
    let  style={"display":"flex", height:"inherit", width:"inherit", alignItems:"center",justifyContent:"center", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"10 10px", borderRadius:"20px"};

    return (
        <div>
        <NodeResizer isVisible={true} />
        {data.handles?.map((handle) => (
            <Handle
                key={handle.id}
                id={handle.id}
                type={handle.type} // or "target" based on your logic
                position={handle.position} // Ensure positions are valid
                isConnectable={true}
            />
        ))}
        <div style={style}>
            <div style={{ padding: "0 4px" }}>
                <DynamicIcon name={icon} size={20} />
            </div>
            {name}
        </div>
    </div>
    );
}

export function Condition({data, isConnectable}) {
    let name = "condition";
    let icon = "parentheses";
    let  style={"display":"flex", height:"inherit", width:"inherit", alignItems:"center",justifyContent:"center", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"10 10px", borderRadius:"20px"};

    return (
        <div>
        <NodeResizer isVisible={true} />
        {data.handles?.map((handle) => (
            <Handle
                key={handle.id}
                id={handle.id}
                type={handle.type} // or "target" based on your logic
                position={handle.position} // Ensure positions are valid
                isConnectable={true}
            />
        ))}
        <div style={style}>
            <div style={{ padding: "0 4px" }}>
                <DynamicIcon name={icon} size={20} />
            </div>
            {name}
        </div>
    </div>
    );
}

export function Start({data, isConnectable}) {
    let name = "Start";
    let icon = "network";
    let  style={"display":"flex", height:"inherit", width:"inherit", alignItems:"center",justifyContent:"center", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"10 10px", borderRadius:"20px"};

    return (
        <div>
        <NodeResizer isVisible={true} />
        {data.handles?.map((handle) => (
            <Handle
                key={handle.id}
                id={handle.id}
                type={handle.type} // or "target" based on your logic
                position={handle.position} // Ensure positions are valid
                isConnectable={ true}
            />
        ))}
        <div style={style}>
            <div style={{ padding: "0 4px" }}>
                <DynamicIcon name={icon} size={20} />
            </div>
            {name}
        </div>
    </div>
    );
}

export function End({data}) {
    let name = "End";
    let icon = "circle-dot";
    let  style={"display":"flex", height:"inherit", width:"inherit", alignItems:"center",justifyContent:"center", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 0px", padding:"10 10px", borderRadius:"20px"};

    return (
        <div>
            <NodeResizer isVisible={true} />
            {data.handles?.map((handle) => (
                <Handle
                    key={handle.id}
                    id={handle.id}
                    type={handle.type} // or "target" based on your logic
                    position={handle.position} // Ensure positions are valid
                    isConnectable={true}
                />
            ))}
            <div style={style}>
                <div style={{ padding: "0 4px" }}>
                    <DynamicIcon name={icon} size={20} />
                </div>
                {name}
            </div>
        </div>
    );
}