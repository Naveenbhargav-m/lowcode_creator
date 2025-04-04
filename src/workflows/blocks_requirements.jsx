

let blocksRequirements = {
    "razor_pay": {
        "title": "RazorPay (Create Payment Link)",
        "inputs": [
          {"title": "Connection", "type": "select", "key": "connection", "required": true, "options": ["Connection 1", "Connection 2"]},
          {"title": "Amount", "type": "textfield", "key": "amount", "required": true},
          {"title": "Currency", "type": "select", "key": "currency", "required": true, "options": ["INR", "USD", "EUR"]},
          {"title": "Reference ID", "type": "textfield", "key": "reference_id"},
          {"title": "Description", "type": "textarea", "key": "description"},
          {"title": "Customer Name", "type": "textfield", "key": "customer_name"},
          {"title": "API Key", "type": "textfield", "key": "api_key"},
          {"title": "API Secret", "type": "textfield", "key": "api_secret"}
        ]},
    "insert_row": {"title": "Insert Row","inputs": [
          {"title": "Table", "type": "select", "key": "table", "required": true, "options": ["users", "posts"]},
          {"title": "fields", "type": "map", "key": "fields", "required": true}
        ] },
    "update_row": {"title": "Update Row","inputs": [
          {"title": "Table", "type": "select", "key": "table", "required": true, "options": ["users", "posts"]},
          {"title": "fields", "type": "map", "key": "fields", "required": true}, 
          {"title": "filter", "type": "map", "key": "filter", "required": true}
        ] },
    "start": {"title": "Start","inputs": [
          {"title": "IsBackground", "type": "toggle", "key": "is_background", "required": true}
        ] },
    "end": {"title": "End","inputs": []},
};

export {blocksRequirements};