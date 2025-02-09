import { Field } from "./fields/chakra_fields";
import { Column, PanelField, Row } from "./fields/fields";
import { AddtoElements, currentFormElements, formActiveElement } from "./form_builder_state";



export function RenderRoworColumnChildren(children) {
    if(children === undefined) {
      return <></>;
    }
    let childElements = [];
    for(var i=0;i<children.length;i++) {
      let childID = children[i];
      let temp = currentFormElements.value[childID];
      childElements.push(temp);
    }
    return RenderElements(childElements, true);
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


  
  export function RenderElements(elementsValue = [], areChildren) {
      if(elementsValue === undefined) {
        return <></>;
      }
      return (<div style={{display:"contents"}}>
      {Object.values(elementsValue).map(value => {
          let type = value["type"];
          let id = value["id"];
          let parent = value["parent"];
          if(parent !== "screen" && !areChildren) {
            return;
          }
          if(type === "column") {
            let children = value["children"];
            return (
              <SelectAble id={id}>
              <Column config={value} onDrop={AddtoElements}>
                {RenderRoworColumnChildren(children)}
              </Column>
              </SelectAble>
            
            );
  
          }
          if(type === "row") {
            let children = value["children"];
            return (
              <SelectAble id={id}>
              <Row config={value} onDrop={AddtoElements}>
                {RenderRoworColumnChildren(children)}
              </Row>
              </SelectAble>
            );
          }
          let style = value["panelStyle"];
          let labelStyle = value["labelStyle"];
          let fieldStyle = value["fieldStyle"];
          let config = value["config"];
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
                config={{
                  "fieldStyle":fieldStyle, 
                  "onChange":(data) => {console.log("field changes:",id, data)},
                  "value":"test",
                  "options":[{"key":"key","value":"value"}]
                }
                }
            />
          </PanelField>
          </SelectAble>
        );
      })} 
      </div>);
  }
  

  
export function DynamicFormComponent({configs = [], values = {}, onChange = (data) => {console.log("form submition data:",data);}, onSubmit}) {
    
    return RenderElements(configs);
  }