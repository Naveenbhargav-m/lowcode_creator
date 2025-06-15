const googleConfigs = {
    "google_auth_init": {
        "fields": [
            {
                "id": "input_mapping.client_id",
                "type": "text",
                "label": "client ID",
            },
            {
                "id": "input_mapping.client_secret",
                "type": "text",
                "label": "client Secret",
            }
        ],
        "sections": [ {
            "id": "client_details",
            "title": "Client  details",
            "fieldIds": ["input_mapping.client_id","input_mapping.client_secret"],
        }],
        "tabs": [
            {
                "sectionIds": ["client_details"],
                "id": "details",
                "title": "Google Auth Config"
            }
        ],
        "id": "google_auth_init",
        "title": "Google Auth"
    },
};





export {googleConfigs};