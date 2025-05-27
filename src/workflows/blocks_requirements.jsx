
let blocksRequirements = {
   "start": {
    "label": "start",
    "description": "This is the start of workflow, that also take global state for workflow",
    "data": {
      "workflow_state": "mapping",
      "is_background": "toggle",
      "name": "text"
    },
   },
   "end": {
    "label": "End",
    "description": "This is the end of the workflow",
    "data": {
      "output_mapping": "mapping",
      "call_flow": "dropdown",
      "name": "text"
    },
   },
   "code_block": {
      "label": "Code",
      "description": "Code block for you customization with more control",
      "data": {
        "input_map": "mapping",
        "is_background": "toggle",
        "max_time": "text"
      },
    }
};

var blockFormRequirementsV2 = {
  "start": {
    "fields": [
      {
        "id": "input_mapping",
        "label": "inputs",
        "type": "array",
      },
    ],
    "sections": [
      {
        "id": "inputs",
        "title": "inputs",
        "fieldIds": ["input_mapping"],
      }
    ],
    "tabs": [
      {
        "id": "configs",
        "title": "Configs",
        "sectionIds": ["inputs"],
      }
    ],
  },
  "end": {
    "fields": [
      {
        "id": "output_mapping",
        "label": "outputs",
        "type": "array",
      },
    ],
    "sections": [
      {
        "id": "outputs",
        "title": "outputs",
        "fieldIds": ["output_mapping"],
      }
    ],
    "tabs": [
      {
        "id": "configs",
        "title": "Configs",
        "sectionIds": ["outputs"],
      }
    ],
  },
  "code_block": {
    "fields": [
      {
        "id": "js_code",
        "label": "js_code",
        "type": "code",
        "description": "Can write js code here."
      },
    ],
    "sections": [
      {
        "id": "inputs",
        "title": "inputs",
        "fieldIds": ["js_code"],
      }
    ],
    "tabs": [
      {
        "id": "configs",
        "title": "Configs",
        "sectionIds": ["inputs"],
      }
    ],
  }
};
export {blocksRequirements, blockFormRequirementsV2};