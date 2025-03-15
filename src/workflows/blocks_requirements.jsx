

let blocksRequirements = {
    "insert_row": {"dependency": ["table", "dynamic_mapping", "is_background"], "labels": ["table", "fieldsmap", "is_parallel"]},
    "update_row": {"dependency": ["table", "dynamic_mapping", "is_background"],"labels": ["table", "fieldsmap", "is_parallel"]},
    "condition": {"dependency": ["code", "is_background"],"labels": ["Code:", "is_parallel"]},
    "start": {"dependency": ["mapping", "is_background"],"labels": [ "fieldsmap", "is_parallel"]},
    "end": {"dependency": [], "labels": []},
    "code": {"dependency": ["code"], "labels": ["Code:"]},
    "http_request": {"dependency": ["base_url", "method", "mappings", "mapping", "mapping", "mapping"],"labels": ["Url:", "Method:","headers","query","body","form_data","is_parallel"]},
    "websocket_subscribe": {"dependency": ["topics"],"label": ["topic:"]}
};


export {blocksRequirements};