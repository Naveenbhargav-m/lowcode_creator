import { googleConfigs } from "./block_configs/google_auth";
import { natsConfigs } from "./block_configs/nats_configs";

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
    },
    {
      "id": "input_mapping.fields",
      "type": "data_mapper",
      "label": "Fields Mapping",
      "description": "columns mapping",
      "path": "input_mapping.fields",
      enableStaticValues: true,
      enableSourceFields: true,
      enableUserFields: false,
      "target_fields": [],
      "source_fields": [],
      "dynamicConfig": [
        {
            "condition": {"dependsOn": "input_mapping.table", "operator": "not_empty"},
            "callback": "get_tables_fields",
        },
      ],
    }
  ],
  "sections": [
    {
      "id": "insert_config",
      "title": "insert_config",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.fields"]
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
      "type": "dropdown",
      "label": "query_block",
      "description": "query_block",
      "path": "input_mapping.query_block",
      "options": [],
      "dynamicConfig": [
        {
          "condition": {"dependsOn": "input_mapping.table", "operator": "not_empty"},
          "callback": "get_query_names",
          "assignTo": "options"
        }
      ],
    },
    {
      "id": "input_mapping.fields",
      "type": "data_mapper",
      "label": "Fields Mapping",
      "description": "columns mapping",
      "path": "input_mapping.fields",
      enableStaticValues: true,
      enableSourceFields: true,
      enableUserFields: false,
      "target_fields": [],
      "source_fields": [],
      "dynamicConfig": [
        {
            "condition": {"dependsOn": "input_mapping.query_block", "operator": "not_empty"},
            "callback": "get_query_fields",
        },
      ],
    },
    {
      "id": "input_mapping.update_fields",
      "type": "data_mapper",
      "label": "Update Mapping",
      "description": "update mapping",
      "path": "input_mapping.update_fields",
      enableStaticValues: true,
      enableSourceFields: true,
      enableUserFields: false,
      "target_fields": [],
      "source_fields": [],
      "dynamicConfig": [
        {
            "condition": {"dependsOn": "input_mapping.table", "operator": "not_empty"},
            "callback": "get_update_fields",
        },
      ],
    }
  ],
  "sections": [
    {
      "id": "update_configs",
      "title": "update_configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.query_block", "input_mapping.fields", "input_mapping.update_fields"]
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
        "type": "dropdown",
        "label": "query_block",
        "description": "query_block",
        "path": "input_mapping.query_block",
        "options": [],
        "dynamicConfig": [
          {
            "condition": {"dependsOn": "input_mapping.table", "operator": "not_empty"},
            "callback": "get_query_names",
            "assignTo": "options"
          }
        ],
      },
      {
        "id": "input_mapping.fields",
        "type": "data_mapper",
        "label": "Fields Mapping",
        "description": "columns mapping",
        "path": "input_mapping.fields",
        enableStaticValues: true,
        enableSourceFields: true,
        enableUserFields: false,
        "target_fields": [],
        "source_fields": [],
        "dynamicConfig": [
          {
              "condition": {"dependsOn": "input_mapping.query_block", "operator": "not_empty"},
              "callback": "get_query_fields",
          },
        ],
      },
  ],
  "sections": [
    {
      "id": "update_configs",
      "title": "update_configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.query_block", "input_mapping.fields"]
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
      "type": "dropdown",
      "label": "query_block",
      "description": "query_block",
      "path": "input_mapping.query_block",
      "options": [],
      "dynamicConfig": [
        {
          "condition": {"dependsOn": "input_mapping.table", "operator": "not_empty"},
          "callback": "get_query_names",
          "assignTo": "options"
        }
      ],
    },
    {
      "id": "input_mapping.fields",
      "type": "data_mapper",
      "label": "Fields Mapping",
      "description": "columns mapping",
      "path": "input_mapping.fields",
      enableStaticValues: true,
      enableSourceFields: true,
      enableUserFields: false,
      "target_fields": [],
      "source_fields": [],
      "dynamicConfig": [
        {
            "condition": {"dependsOn": "input_mapping.query_block", "operator": "not_empty"},
            "callback": "get_query_fields",
        },
      ],
    }
  ],
  "sections": [
    {
      "id": "update_configs",
      "title": "update_configs",
      "fieldIds": ["input_mapping.table", "input_mapping.schema", "input_mapping.query_block", "input_mapping.fields"]
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


const start = {
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
};
const end = {
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
};

const code = {
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
};

var blockFormRequirementsV2 = {
  "start": {...start},
  "end": {...end},
  "condition": {...code},
  "loop": {...code},
  "code_block": {...code},
  "http_call": {...insert_row_fields},
  "insert_rows": {...insert_row_fields},
  "update_rows": {...update_rows},
  "read_rows": {...read_rows},
  "delete_rows": {...delete_rows},
  "google_auth_init": {...googleConfigs["google_auth_init"]},
  "get_google_user": {...googleConfigs.get_google_user},
  "upsert_user": {...googleConfigs.verify_google_token},
  "verify_google_token": {...googleConfigs.verify_google_token},
  "refresh_google_token": {...googleConfigs.refresh_google_token},
  "create_topic": {...natsConfigs.create_topic},
  "publish": {...natsConfigs.publish},
  "subscribe": {...natsConfigs.subscribe},
  "delete_topic": {...natsConfigs.delete_topic},
};
export { blockFormRequirementsV2};