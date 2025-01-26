

let layouts = [
    {"w": 4,"h": 6,"x": 0,"y": 0,"i": "Name","moved": false,"static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "inputStyle", "moved": false, "static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "LabelStyle", "moved": false, "static": true},
    { "w": 4, "h": 8, "x": 0, "y": 0, "i": "WrapperStyle", "moved": false, "static": true},
  ];
  
  let commonConfig = {
    "inputStyle": {
    "border-radius": "15px",
    "color": "black",
    "width": "100%",
    "height": "100%",
    "overflow": "auto",
    "scrollbar-width": "none",  // For Firefox
    "-ms-overflow-style": "none"  // For Internet Explorer and Edge
},
    "wrapperStyle": {"background-color": "white","marginBottom": "0px","padding": "10px"},
    "labelStyle": {"color": "black"},
    "labelPosition": "top"
  };
  

  
  export {commonConfig, layouts};