import { useContext } from "preact/hooks";
import { BuilderContext } from "react-flow-builder";
import DynamicIcon from "../components/custom/dynamic_icon";



const icons = [
    "database",
    "database",
    "parentheses",
    "workflow",
];



function DragComponent( {    
    onDragStart ,
    onDragEnd ,
  } ) {  
    const { registerNodes } = useContext ( BuilderContext ) ;   
  
    return ( 
      < div className = " custom-drag-list "> 
        { registerNodes.filter( ( item ) => ! item . isStart && ! item . isEnd ).map ( ( item , ind) => {
            console.log("ind", ind);
           return (
            < div
            style={{"display":"flex", "flexDirection":"row",backgroundColor:"black", "fontSize":"0.8em",margin:"10px 20px", padding:"20px", borderRadius:"20px"}}
              key = {ind}
              className = " custom-drag-item "
              draggable
              onDragStart = { ( ) => onDragStart ( item . type ) }  
              onDragEnd = { onDragEnd }
            >
              <DynamicIcon name={icons[ind]} size={20}/>
              { item.name }
            </ div >
           ); 
        } ) }
      </ div >
    ) ;
  } ;

export {DragComponent};