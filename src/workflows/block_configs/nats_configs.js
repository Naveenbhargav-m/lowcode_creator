
const natsConfigs = {
    "create_topic": {
        "fields": [
            {
                "id": "input_mapping.stream_name",
                "type": "text",
                "label": "Topic / Stream Name"
            },
            {
                "id": "input_mapping.subjects",
                "type": "array",
                "label": "Subjects"
            },
            {
                "id": "input_mapping.retention",
                "type": "dropdown",
                "label": "Retention",
                "options": [
                    {"label": "limits", "value": "limits"},
                    {"label": "retention", "value": "retention"},
                    {"label": "workqueue", "value": "workqueue"}
                ],
            },
            {
                "id": "input_mapping.max_messages",
                "type": "number",
                "label": "max messages"
            },
            {
                "id": "input_mapping.max_age",
                "type": "text",
                "label": "max age"
            },
        ],
    },
    "publish": {
        "fields": [
            {
                "id": "input_mapping.subject",
                "type": "text",
                "label": "Topic / subject"
            },
            {
                "id": "input_mapping.message",
                "type": "text",
                "label": "Message"
            },
            {
                "id": "input_mapping.headers",
                "type": "mapping",
                "label": "Headers",
            },
            {
                "id": "input_mapping.timeout",
                "type": "number",
                "label": "time out"
            },
        ],
    },
    "subscribe": {
        "fields":[] 
    },
    "delete_topic": {
        "fields": [
            {
                "id": "input_mapping.subject",
                "type": "text",
                "label": "Topic / subject"
            },]
    },
};


export {natsConfigs};