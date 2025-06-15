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
    "get_google_user": {
        "fields": [
            {
                    "id": "input_mapping.access_token",
                    "type": "text",
                    "label": "Access Token",
            }
        ]
    },
    "verify_google_token": {
        "fields": [
            {
                    "id": "input_mapping.access_token",
                    "type": "text",
                    "label": "Access Token",
            }
        ]
    },
    "refresh_google_token": {
        "fields":  [
            {
                "id": "input_mapping.client_id",
                "type": "text",
                "label": "client ID",
            },
            {
                "id": "input_mapping.client_secret",
                "type": "text",
                "label": "client Secret",
            },
            {
                "id": "input_mapping.refresh_token",
                "type": "text",
                "label": "Refresh Token",
            }
        ]
    },
};





export {googleConfigs};