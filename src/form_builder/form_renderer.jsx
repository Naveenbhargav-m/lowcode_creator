import { getElementByID } from "../utils/helpers";
import { Field } from "./fields/chakra_fields";
import { Column, PanelField, Row } from "./fields/fields";
import { AddtoElements, currentFormElements, formActiveElement } from "./form_builder_state";



export function RenderRoworColumnChildren(children,values = {}, 
  onChange = (data) => {console.log("form submition data:",data);}, 
  onSubmit = (data) => {console.log("form submition data:",data); },
  updateCallback = (newdata) => {},
) {
    if(children === undefined) {
      return <></>;
    }
    let childElements = [];
    for(var i=0;i<children.length;i++) {
      let childID = children[i];
      let temp = getElementByID(currentFormElements, childID);
      childElements.push(temp);
    }
    return RenderElements(childElements, true, values, onChange, onSubmit, updateCallback);
  }
  
  
  export function SelectAble({children , id}) {
    return (
      <div
      style={{ display: "contents" }}
      onClick={(e) => {
        formActiveElement.value = id;
      }}
    >
      {children}
    </div>
    );
  }


  
  export function RenderElements(elementsValue = [], areChildren = false, values = {}, 
    onChange = (data) => {console.log("form submition data:",data);}, 
    onSubmit = (data) => {console.log("form submition data:",data);},
    updateCallback = (newdata) => {},
  ) {
    console.log("called RenderElements :",elementsValue);
      if(elementsValue === undefined) {
        return <></>;
      }
      return (<div style={{display:"contents"}}>
      {elementsValue.map((curVal) => {
          console.log("in the map",curVal);
          let value = curVal.value;
          let type = value["type"];
          let id = value["id"];
          let parent = value["parent"];
          if(parent !== "screen" && !areChildren) {
            console.log("in the map not parent and not children",curVal);
            return;
          }
          if(type === "column") {
            let children = value["children"];
            return (
              <SelectAble id={id}>
              <Column config={value} onDrop={AddtoElements}>
                {RenderRoworColumnChildren(children, values, onChange, onSubmit, updateCallback)}
              </Column>
              </SelectAble>
            
            );
  
          }
          if(type === "row") {
            let children = value["children"];
            return (
              <SelectAble id={id}>
              <Row config={value} onDrop={AddtoElements}>
                {RenderRoworColumnChildren(children,values, onChange, onSubmit, updateCallback)}
              </Row>
              </SelectAble>
            );
          }
          let style = value["panelStyle"];
          let labelStyle = value["labelStyle"];
          let fieldStyle = value["fieldStyle"];
          let config = value["config"];
          // let prefil = values.peek()[value["id"]];
          // console.log("prefil:",prefil);
          value["value"] = "";
          return (
          <SelectAble id={id}>
          <PanelField 
          label={"test label"} 
          labelPosition={"top"} 
          labelStyle={labelStyle} 
          panelStyle={style} 
          showError={false} 
          errorMessage={{}}>
            <Field 
                type={type}
                config={
                  value
                }
                Action={updateCallback}
            />
          </PanelField>
          </SelectAble>
        );
      })} 
      </div>);
  }
  

  
export function DynamicFormComponent({
  configs = [], 
  values = {}, 
  onChange = (data) => {console.log("form submition data:",data);}, 
  onSubmit = (data) => {console.log("form submition data:",data); },
  updateCallback = (newdata) => {},
}) {
    
    return RenderElements(configs, false, values, onChange, onSubmit, updateCallback);
  }