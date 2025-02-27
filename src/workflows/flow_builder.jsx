import { useContext, useState } from 'preact/hooks';
import FlowBuilder, { NodeContext } from 'react-flow-builder';
import "./flow_css.css";
import { DragComponent, WorkflowsList } from './flow_left_panel';
import { FlowBuilderDrawer } from './flow_right';

const commonStyle = {"borderRadius":"20px", "color":"white", "backgroundColor":"black", "display":"flex", "flexDirection":"column", "justifyContent":"center","alignItems":"center"}
const defaultNodes = [ 
    {
      id : 'node-0d9d4733-e48c-41fd-a41f-d93cc4718d97' , 
      type : 'start' , 
      name : 'start' , 
      path : [ '0' ] , 
    } ,
    {
      id:' node-b2ffe834-c7c2-4f29-a370-305adc03c010' , 
      type : 'branch' , 
      name : 'Branch Node' , 
      children : [ 
        {
          id : 'node-cf9c8f7e-26dd-446c-b3fa-b2406fc7821a' , 
          type : 'condition' , 
          name : 'Conditional Node' , 
          children : [ 
            {
              id : 'node-f227cd08-a503-48b7-babf-b4047fc9dfa5' , 
              type : 'node' , 
              name : 'Ordinary Node' , 
              path : [ '1' , 'children' , '0' , 'children' , '0' ] ,     
            } ,
          ] ,
          path : [ '1' , 'children' , '0' ] ,   
        } ,
        {
          id : 'node-9d393627-24c0-469f-818a-319d9a678707' , 
          type : 'condition' , 
          name : 'Conditional Node' , 
          children : [ ] , 
          path : [ '1' , 'children' , '1' ] ,   
        } ,
      ] ,
      path : [ '1' ] , 
    } ,
    {
  id:     ' node-972401ca-c4db-4268-8780-5607876d8372' , 
      type : 'node' , 
      name : 'Ordinary Node' , 
      path : [ '2' ] , 
    } ,
    {
      id:' node-b106675a-5148-4a2e-aa86-8e06abd692d1' , 
      type : 'end' , 
      name : 'end' , 
      path : [ '3' ] , 
    } ,
  ] ;



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
  const [nodes, setNodes] = useState(defaultNodes);

  const handleChange = (updatedNodes) => {
    console.log('Nodes changed:', updatedNodes);
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
