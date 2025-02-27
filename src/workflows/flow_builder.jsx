import { useContext, useState } from 'preact/hooks';
import FlowBuilder, { NodeContext } from 'react-flow-builder';
import "./flow_css.css";
import { DragComponent, WorkflowsList } from './flow_left_panel';
import { FlowBuilderDrawer } from './flow_right';
import { activeWorkFlow, UpdateActiveWorkflowNodes } from './workflow_state';

const commonStyle = {"borderRadius":"20px", "color":"white", "backgroundColor":"black", "display":"flex", "flexDirection":"column", "justifyContent":"center","alignItems":"center"}

const StartNodeDisplay = () => {
  const node = useContext(NodeContext);
  return <div class="start-node">{node.name}</div>;
};

const EndNodeDisplay = () => {
  const node = useContext(NodeContext);
  return <div class="end-node">{node.name}</div>;
};

const OtherNodeDisplay = () => {
  const node = useContext(NodeContext);
  return <div class="other-node" style={commonStyle}>{node.name}</div>;
};

const ConditionNodeDisplay = () => {
  const node = useContext(NodeContext);
  return <div class="condition-node" style={commonStyle}>{node.name}</div>;
};

const registerNodes = [
  {
    type: 'start',
    name: 'Start Node',
    displayComponent: StartNodeDisplay,
    isStart: true,
  },
  {
    type: 'end',
    name: 'End Node',
    displayComponent: EndNodeDisplay,
    isEnd: true,
  },
  {
    type: 'node',
    name: 'Insert Row',
    displayComponent: OtherNodeDisplay,
  },
  {
    type: 'node',
    name: 'Update Row',
    displayComponent: OtherNodeDisplay,
  },
  {
    type: 'condition',
    name: 'Condition',
    displayComponent: ConditionNodeDisplay,
  },
  {
    type: 'branch',
    name: 'Branch Node',
    conditionNodeType: 'condition',
  },
];

const NewFlowBuilder = () => {
  const [nodes, setNodes] = useState(activeWorkFlow.value["flow"]);

  const handleChange = (updatedNodes) => {
    console.log('Nodes changed:', updatedNodes);
    UpdateActiveWorkflowNodes(updatedNodes);
    setNodes(updatedNodes);
  };

  return (
    <FlowBuilder 
        draggable
        DragComponent={WorkflowsList}
        nodes={nodes}
        onChange={handleChange}
        DrawerComponent={FlowBuilderDrawer}
        registerNodes={registerNodes} 
    />
  );
};

export{ NewFlowBuilder};
