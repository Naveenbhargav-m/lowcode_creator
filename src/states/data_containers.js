import { signal } from "@preact/signals";
import { TablesDataSetterFromAPI } from "../table_builder/table_builder_helpers";

let temp = [
    {
        "sku": 40,
        "existing_stock": 100,
        "company": "Stock One",
        "city": "banglore",
        "tags": ["#antique", "#premium"]
    },
    {
        "sku": 41,
        "existing_stock": 250,
        "company": "Vintage Treasures",
        "city": "mumbai",
        "tags": ["#vintage", "#collectibles"]
    },
    {
        "sku": 42,
        "existing_stock": 150,
        "company": "Modern Goods",
        "city": "delhi",
        "tags": ["#modern", "#affordable"]
    },
    {
        "sku": 43,
        "existing_stock": 75,
        "company": "Heritage Stock",
        "city": "chennai",
        "tags": ["#heritage", "#premium"]
    },
    {
        "sku": 44,
        "existing_stock": 200,
        "company": "Urban Trends",
        "city": "kolkata",
        "tags": ["#trendy", "#urban"]
    },
    {
        "sku": 45,
        "existing_stock": 50,
        "company": "Luxury Essentials",
        "city": "hyderabad",
        "tags": ["#luxury", "#exclusive"]
    }
]



let appuser = {
    "org":"zino tech",
    "department":"engineer",
    "role":"backend",
    "experience":"2 years"
};


let dataContainers = signal({});
let tablesSchemas = signal({});
let appUserData = signal({});
let staticFields = signal({});

staticFields.value = {
    "tabs":["users", "tasks", "developers"],
    "roles":["managers", "developers","testers"],
};
appUserData.value = {...appuser};

function InitContainers() {
    localStorage.setItem("containers",JSON.stringify(temp));
    dataContainers.value = {"sales":temp};
    tablesSchemas.value = {"sales":[
        {"name":"sku","type":"int"},
        {"name":"exisiting_stock","type":"int"},
        {"name":"company", "type":"text"},
        {"city":"text"},
        {"tags":"text_array"},
    ]
    };

}

InitContainers();


function InitBuilderData() {
    TablesDataSetterFromAPI();

}
export {staticFields, appUserData, dataContainers, tablesSchemas, InitBuilderData};