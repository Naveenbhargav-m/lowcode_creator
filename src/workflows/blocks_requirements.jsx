

let blocksRequirements = {
   "start": {
    "label": "start",
    "description": "This is the start of workflow, that also take global state for workflow",
    "inputs": {
      "workflow_state": "mapping",
      "is_background": "toggle",
      "name": "text"
    },
   },
   "end": {
    "label": "End",
    "description": "This is the end of the workflow",
    "outputs": {
      "output_mapping": "mapping",
      "call_flow": "dropdown",
      "name": "text"
    },
   }
};

export {blocksRequirements};