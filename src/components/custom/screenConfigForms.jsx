let layouts = [
    {"w": 4,"h": 6,"x": 0,"y": 0,"i": "Name","moved": false,"static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "inputStyle", "moved": false, "static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "LabelStyle", "moved": false, "static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "WrapperStyle", "moved": false, "static": true},


]


let commonConfig = {
    "inputStyle": {
        "border-radius": "15px",
        "color": "black",
        "width": "100%"
    },
    "wrapperStyle": {
            "background-color": "white",
            "marginBottom": "0px",
            "padding": "10px"
        },
    "labelStyle": {
            "color": "black"
        },
    "labelPosition": "top"

};
export let formConfigs = [
    {
        "type": "text",
        "fieldName": "Name",
        "label": "Field Name:",
        "inputStyle": commonConfig["inputStyle"],
        "wrapperStyle": commonConfig["wrapperStyle"],
        "labelStyle": commonConfig["labelStyle"],
        "labelPosition": "top",
        "layout":layouts[0],
    },
    {
        "type": "textarea",
        "fieldName": "inputStyle",
        "label": "inputStyle:",
        "inputStyle": commonConfig["inputStyle"],
        "wrapperStyle": commonConfig["wrapperStyle"],
        "labelStyle": commonConfig["labelStyle"],
        "labelPosition": "top",
        "layout":layouts[1],

    },
    {
        "type": "textarea",
        "fieldName": "LabelStyle",
        "label": "LabelStyle:",
        "inputStyle": commonConfig["inputStyle"],
        "wrapperStyle": commonConfig["wrapperStyle"],
        "labelStyle": commonConfig["labelStyle"],
        "labelPosition": "top",
        "layout":layouts[2],

    },
    {
        "type": "textarea",
        "fieldName": "WrapperStyle",
        "label": "WrapperStyle:",
        "inputStyle": commonConfig["inputStyle"],
        "wrapperStyle": commonConfig["wrapperStyle"],
        "labelStyle": commonConfig["labelStyle"],
        "labelPosition": "top",
        "layout":layouts[3],

    },
]