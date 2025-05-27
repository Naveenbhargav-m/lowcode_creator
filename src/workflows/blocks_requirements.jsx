
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

let blockFormRequirements = {
  "start": {
    "sections": [{
       "id": "workflow Config",
       "title": "Workflow Config",
       "groups": [
          {
            "id": "global_data",
            "title": "global_data",
            "fields": [
              {
                "id": "workflow_state",
                "label": "workflow_state",
                "type": "mapping",
                "description": "global state for the workflow, all the subsequent blocks will have access."
              },
            ],
          },
       ],
    }],
  },
  "end": {
    "sections": [
      {
       "id": "output Config",
       "title": "output Config",
       "groups": [
          {
            "id": "output_data",
            "title": "output_data",
            "fields": [
              {
                "id": "output_mapping",
                "label": "output_mapping",
                "type": "mapping",
                "description": "output mapping from the workflow."
              },
            ],
          },
       ],
      }
      ],
  },
  "code_block": {
    "sections": [
      {
       "id": "code_block",
       "title": "Code Config",
       "groups": [
          {
            "id": "code_block",
            "title": "js_code",
            "fields": [
              {
                "id": "js_code",
                "label": "js_code",
                "type": "code",
                "description": "Can write js code here."
              },
            ],
          },
       ],
      }
      ],
  },
};
export {blocksRequirements, blockFormRequirements};