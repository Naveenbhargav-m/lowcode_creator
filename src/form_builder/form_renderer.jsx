import { useComputed, useSignal } from "@preact/signals";
import { Field } from "./fields/chakra_fields";
import { Column, PanelField, Row } from "./fields/fields";
import { AddtoElements, currentForm, currentFormElements, DeleteFormElement, formActiveElement, formBuilderView, formRenderSignal, forms } from "./form_builder_state";
import { useEffect } from "preact/hooks";
import { ReactSortable } from "react-sortablejs";
import { SelectableComponent } from "../components/custom/selectAble";



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
      let temp = currentFormElements[childID];
      childElements.push(temp);
    }
    return RenderElements(childElements, true, values, onChange, onSubmit, updateCallback);
  }
  
  
  export function SelectAble({children , id}) {
    return (
      <div
      style={{ display: "contents" }}
      onClick={(e) => {
        e.stopPropagation();
        formActiveElement.value = id;
      }}
    >
      {children}
    </div>
    );
  }


  
  export function RenderElements(elementsValue = {}, areChildren = false, values = {}, 
    onChange = (data) => {console.log("form submition data:",data);}, 
    onSubmit = (data) => {console.log("form submition data:",data);},
    updateCallback = (newdata) => {},
  ) {
    console.log("called RenderElements :",elementsValue);
      if(elementsValue === undefined) {
        return <></>;
      }

      const items = useSignal([]);
      useEffect(() => {
          console.log("rerendering:", elementsValue);
          const elementsArray = Object.values(elementsValue);
          const filteredItems = areChildren ? elementsArray  :elementsArray.filter((item) => item.value.parent === "screen");
          const sortedItems = filteredItems.sort((a, b) => {
                                const orderA = a.value.order ?? Infinity;
                                const orderB = b.value.order ?? Infinity;
                                return orderA - orderB;});
          console.log("sorted Items before rendering:",sortedItems);
          items.value = sortedItems;
      }, [formRenderSignal.value]);


      let sortableItems = useComputed(() => items.value.map((item) => ({
        id: item.value.id,
        name: item.value.title,
        style: item.value.style || {},
      })));


      function SortItems(items, newItems) {
        console.log("items:",items, "new items:", newItems);
        if(items.length === 0) {
          return items;
        }
        const itemMap = new Map(items.map((item) => [item.value.id, item]));
        let sortedItems = newItems.map(({ id }) => itemMap.get(id)).filter(Boolean);
        console.log("sorted Items after first sort:",sortedItems);
        return sortedItems;
      }

    function SetSortedItems(sortedItems) {
      if(forms[currentForm.value] === undefined) {
        return;
      } 
      console.log("set sorted Items:", sortedItems);
      let updatedItems = [];
      for(var i=0;i<sortedItems.length;i++) {
        let cur = sortedItems[i];
        let id = cur.value["id"]
        cur.value["order"] = i;
        currentFormElements[id].value = {...cur.value};
        updatedItems.push(cur);
      }
      console.log("set sorted items before updation:", updatedItems);
      let key = formBuilderView.value === "smartphone" ? "mobile_children" : "desktop_children";
      forms[currentForm.value][key] = JSON.parse(JSON.stringify(currentFormElements));
      forms[currentForm.value]["_change_type"] = forms[currentForm.value]["_change_type"] || "update";
      items.value = [...updatedItems];
    }

      return (<div  style={{display:"contents"}}>
          <ReactSortable
              list={sortableItems.value}
              setList={(newList) => {
                let temp = [...SortItems(items.value, newList)];
                SetSortedItems(temp);
              }}
              group="elements"
              animation={150}
              ghostClass="element-ghost"
            >
      {items.value.map((curVal) => {
          console.log("in the map",curVal);
          let value = curVal.value;
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
          value["value"] = "";
          return (
            <SelectableComponent 
            onChick={(e,id) => {e.stopPropagation()}}
            onRemove={(e,id) => {DeleteFormElement(id)}}
            id={value["id"]}
            isSelected={formActiveElement.value  === value["id"]}
            >
          <SelectAble id={id}>
          <PanelField 
          label={value["label"]} 
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
          </SelectableComponent>
        );
      })} 
      </ReactSortable>
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