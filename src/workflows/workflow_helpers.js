import { blockFormRequirements, blocksRequirements } from "./blocks_requirements";
import { activeWorkFlow, activeworkFlowBlock, workflowsData } from "./workflow_state";



function GetWorkflowFormConfig(activeworkflow, activeblock) {
    console.log("active workflow, active block:",activeworkflow, activeblock);
    let response = {};
    let flowdata = workflowsData.value;
    let id = activeworkflow["id"] || "";
    let blockID = activeblock["id"] || "";
    let currentWorkflowData = flowdata[id] || {};
    let currentBlockData = currentWorkflowData[blockID] || {};
    console.log("current workflow and block data:",currentWorkflowData, currentBlockData);
    response["data"] = currentBlockData;
    let blockType = activeblock["type"];
    let requirements = blocksRequirements[blockType];
    let formRequirements = blockFormRequirements[blockType]; 
    response["config"] = requirements;
    response["form_requirements"] = formRequirements;
    return response;
}




/**
 * Generate workflow schema from React Flow configuration
 * 
 * @param {Object} reactFlowConfig - The configuration from React Flow
 * @param {string} reactFlowConfig.id - Flow ID
 * @param {string} reactFlowConfig.name - Flow name
 * @param {Array} reactFlowConfig.nodes - Array of node objects
 * @param {Array} reactFlowConfig.edges - Array of edge objects
 * @param {Object} reactFlowConfig.flow_data - Configuration data for nodes
 * @returns {Object} The workflow schema for backend processing
 */
function generateWorkflowSchema(reactFlowConfig) {
    // Initialize the output schema
    const schema = {
      name: reactFlowConfig.name,
      blocks: {},
    };
  
    // Create a map to store connections (source node ID -> target node IDs)
    const connections = {};
    
    // Process edges to build connections
    reactFlowConfig.edges.forEach(edge => {
      if (!connections[edge.source]) {
        connections[edge.source] = [];
      }
      connections[edge.source].push(edge.target);
    });
    
    // Find start and end blocks
    let startNodeId = null;
    let endNodeId = null;
    
    reactFlowConfig.nodes.forEach(node => {
      if (node.type === "start") {
        startNodeId = node.id;
      } else if (node.type === "end") {
        endNodeId = node.id;
        schema.end_block = node.id;
      }
    });
    
    // Set start block (first node connected to the start node)
    if (startNodeId && connections[startNodeId] && connections[startNodeId].length > 0) {
      schema.start_block = connections[startNodeId][0];
    }
    
    // Process nodes to build blocks
    reactFlowConfig.nodes.forEach(node => {
      // Skip start nodes in the blocks map
    //   if (node.type === "start") {
    //     return;
    //   }
      
      // Create block
      const block = {
        name: node.id,
        handler: node.type === "end" ? "noop" : node.type,
        input_map: {},
        next_block: connections[node.id] || []
      };
      
      // Add flow data if exists as block_config
      if (reactFlowConfig.flow_data && reactFlowConfig.flow_data[node.id]) {
        block.block_config = reactFlowConfig.flow_data[node.id];
      }
      
      schema.blocks[node.id] = block;
    });
    
    return schema;
  }
  
//   // Example usage
//   const exampleInput = {
//     "id": "ML0t6q9k7K",
//     "name": "test1",
//     "fid": "ML0t6q9k7K",
//     "nodes": [
//       {
//         "label": "start",
//         "type": "start",
//         "id": "c4gqzbj9E9",
//         "data": { 
//           "type": "start", 
//           "id": "c4gqzbj9E9",
//           "handles": [
//             { 
//               "id": "yNDKN8Sucv", 
//               "position": "bottom", 
//               "type": "source" 
//             }
//           ] 
//         },
//         "position": { "x": 242.77526213414268, "y": 91.91778684159522 },
//         "measured": { "width": 180, "height": 70 },
//         "selected": false,
//         "dragging": false
//       },
//       {
//         "label": "Code",
//         "type": "code_block",
//         "id": "EmBCUTY8qp",
//         "position": { "x": 165.76743230953264, "y": 252.50195745615252 },
//         "data": { 
//           "type": "code_block", 
//           "id": "EmBCUTY8qp",
//           "handles": [
//             { "position": "bottom", "type": "source", "id": "v7mqK6R5rJ" },
//             { "position": "top", "type": "target", "id": "oP8ou3Vcz5" }
//           ] 
//         },
//         "measured": { "width": 180, "height": 70 },
//         "selected": false,
//         "dragging": false
//       },
//       {
//         "label": "end",
//         "type": "end",
//         "id": "o5i2lLHWoP",
//         "data": { 
//           "type": "end", 
//           "id": "o5i2lLHWoP",
//           "handles": [
//             { "id": "A7eMV66nbF", "position": "top", "type": "target" }
//           ] 
//         },
//         "position": { "x": 275.5, "y": 417 },
//         "measured": { "width": 180, "height": 70 },
//         "selected": false,
//         "dragging": false
//       }
//     ],
//     "edges": [
//       {
//         "animated": true,
//         "style": { "stroke": "#555", "strokeWidth": 2 },
//         "source": "c4gqzbj9E9",
//         "sourceHandle": "yNDKN8Sucv",
//         "target": "EmBCUTY8qp",
//         "targetHandle": "oP8ou3Vcz5",
//         "id": "xy-edge__c4gqzbj9E9yNDKN8Sucv-EmBCUTY8qpoP8ou3Vcz5",
//         "selected": false,
//         "type": "smoothstep"
//       },
//       {
//         "animated": true,
//         "style": { "stroke": "#555", "strokeWidth": 2 },
//         "source": "EmBCUTY8qp",
//         "sourceHandle": "v7mqK6R5rJ",
//         "target": "o5i2lLHWoP",
//         "targetHandle": "A7eMV66nbF",
//         "id": "xy-edge__EmBCUTY8qpv7mqK6R5rJ-o5i2lLHWoPA7eMV66nbF",
//         "selected": false,
//         "type": "smoothstep"
//       }
//     ],
//     "flow_data": {
//       "EmBCUTY8qp": {
//         "js_code": "function Test1() {}\nTest1();"
//       },
//       "c4gqzbj9E9": {
//         "input_mapping": {
//           "test1": "test1",
//           "test2": "test2"
//         }
//       },
//       "o5i2lLHWoP": {
//         "output_mapping": {
//           "reponse": "resp1",
//           "noresp": "resp2",
//           "is_succes": "is success"
//         }
//       }
//     }
//   };
  
//   const workflowSchema = generateWorkflowSchema(exampleInput);
//   console.log("workflow_schema:",JSON.stringify(workflowSchema, null, 2));

export {GetWorkflowFormConfig, generateWorkflowSchema};