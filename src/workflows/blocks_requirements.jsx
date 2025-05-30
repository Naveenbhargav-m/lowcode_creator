const insert_row_fields = {
  "fields": [
    {
      "id": "input_mapping.table",
      "type": "text",
      "label": "table",
      "description": "table to insert",
      "path": "input_mapping.table"
    },
    {
      "id": "input_mapping.schema",
      "type": "text",
      "label": "schema",
      "description": "table schema",
      "path": "input_mapping.schema"
    }
  ],
  "sections": [
    {
      "id": "insert_config",
      "title": "insert_config",
      "fieldIds": ["input_mapping.table", "input_mapping.schema"]
    },
  ],
  "tabs": [
    {
      "id": "Configs",
      "title": "insert configs",
      "sectionIds": ["insert_config"],
    }
  ],
};


const update_rows = {
  "fields": [
    {
      "id": "input_mapping.table",
      "type": "text",
      "label": "table",
      "description": "table to insert",
      "path": "input_mapping.table"
    },
    {
      "id": "input_mapping.schema",
      "type": "text",
      "label": "schema",
      "description": "table schema",
      "path": "input_mapping.schema"
    },
    {
      "id": "input_mapping.query_block",
      "type": "text",
      "label": "query_block",
      "description": "query_block",
      "path": "input_mapping.query_block"
    },
    {
      "id": "input_mapping.fields",
      "type": "mapping",
      "label": "fields",
      "description": "fields to add",
      "path": "input_mapping.fields"
    }
  ],
  "sections": [
    {
      "id": "update_configs",
      "title": "update_configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.fields"]
    },
  ],
  "tabs": [
    {
      "id": "Configs",
      "title": "configs",
      "sectionIds": ["update_configs"],
    }
  ],
};



const read_rows = {
  "fields": [
    {
      "id": "input_mapping.table",
      "type": "text",
      "label": "table",
      "description": "table to insert",
      "path": "input_mapping.table"
    },
    {
      "id": "input_mapping.schema",
      "type": "text",
      "label": "schema",
      "description": "table schema",
      "path": "input_mapping.schema"
    },
    {
      "id": "input_mapping.query_block",
      "type": "text",
      "label": "query_block",
      "description": "query_block",
      "path": "input_mapping.query_block"
    },
    {
      "id": "input_mapping.fields",
      "type": "mapping",
      "label": "fields",
      "description": "fields to add",
      "path": "input_mapping.fields"
    }
  ],
  "sections": [
    {
      "id": "read_configs",
      "title": "read_configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.fields"]
    },
  ],
  "tabs": [
    {
      "id": "Configs",
      "title": "configs",
      "sectionIds": ["read_configs"],
    }
  ],
};



const delete_rows = {
  "fields": [
    {
      "id": "input_mapping.table",
      "type": "text",
      "label": "table",
      "description": "table to insert",
      "path": "input_mapping.table"
    },
    {
      "id": "input_mapping.schema",
      "type": "text",
      "label": "schema",
      "description": "table schema",
      "path": "input_mapping.schema"
    },
    {
      "id": "input_mapping.query_block",
      "type": "text",
      "label": "query_block",
      "description": "query_block",
      "path": "input_mapping.query_block"
    }
  ],
  "sections": [
    {
      "id": "delete_config",
      "title": "delete configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.fields"]
    },
  ],
  "tabs": [
    {
      "id": "Configs",
      "title": "configs",
      "sectionIds": ["delete_configs"],
    }
  ],
};

var blockFormRequirementsV2 = {
  "start": {
    "fields": [
      {
        "id": "input_mapping",
        "label": "inputs",
        "type": "array",
        "path": "input_mapping"
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
        "path": "output_mapping"
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
        "id": "input_mapping.js_code",
        "label": "js_code",
        "type": "code",
        "description": "Can write js code here.",
        "path": "input_mapping.js_code"
      },
    ],
    "sections": [
      {
        "id": "inputs",
        "title": "inputs",
        "fieldIds": ["input_mapping.js_code"],
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
  "insert_rows": {...insert_row_fields},
  "update_rows": {...update_rows},
  "read_rows": {...read_rows},
  "delete_rows": {...delete_rows},
};
export { blockFormRequirementsV2};