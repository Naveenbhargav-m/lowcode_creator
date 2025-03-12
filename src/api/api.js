import { signal } from "@preact/signals";


const baseurl = "http://localhost:8000/";
const schema = "public/";

const Urlmap = {
    "apps": [],
};

let dbname = localStorage.getItem("db_name") || "";
console.log("dbname",dbname);
if(dbname.length === 0) {
    dbname = "nokodo_creator/"
}  

export const databaseSignal = signal(dbname);
console.log("database signal reloaded:",databaseSignal.peek());

/**
 * Generic API Call Function
 * Handles all types of API requests with flexible configurations.
 */
async function apiCall(endpoint, method = "GET", data = null, id = null, headers = {}, dbname = "") {
    // Construct the final URL
    let finalUrl = baseurl + databaseSignal.peek().toLowerCase() + schema + endpoint;

    // If `id` is provided, append it as a query parameter or resource ID
    if (id) {
        finalUrl += `?id=${id}`;
    }

    // Define the request object
    const requestObj = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    // Add the body for non-GET methods
    if (data) {
        requestObj.body = JSON.stringify(data);
    }

    try {
        console.log("api call:",requestObj, finalUrl);
        const response = await fetch(finalUrl, requestObj);

        // Check for response status
        if (!response.ok) {
            let respbody = await response.json();
            console.log("error:",requestObj, response,respbody);
            throw new Error(`API call failed with status ${response.status}`);

        }

        let respData =  await response.json(); // Parse and return JSON response
        return respData;
    } catch (error) {
        console.error(`Error during API call to ${finalUrl}:`, error);
        throw error; // Rethrow for further handling
    }
}


async function GenericApiCall(url, method = "GET", data = {}, type = "body", headers = {}) {
    try {
        const config = {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        // Handle `body` or `query` parameters based on the `type`
        if (type === "body" && (method === "POST" || method === "PUT" || method === "PATCH")) {
            config.body = JSON.stringify(data);
        } else if (type === "query" && method === "GET") {
            const queryParams = new URLSearchParams(data).toString();
            url += `?${queryParams}`;
        }


        console.log("config:",config);

        const response = await fetch(url, config);

        // Check if response is successful
        if (!response.ok) {
            console.log("config:",response.json());
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("before the returning the data:",response);
        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error during API call:", error);
        throw error; // Re-throw the error to handle it elsewhere
    }
}


export function GetScreensFromAPI(id) {
    return apiCall("screens", "GET", null, id);
}

export function GetAllScreensFromAPI() {
    return apiCall("screens", "GET");
}

export function SetScreenToAPI(data, id = null) {
    const method = id ? "PUT" : "POST";
    return apiCall("screens", method, data, id);
}

// Forms
export function GetFormsFromAPI(id) {
    return apiCall("forms", "GET", null, id);
}

export function GetAllFormsFromAPI() {
    return apiCall("forms", "GET");
}

export function SetFormToAPI(data, id = null) {
    const method = id ? "PUT" : "POST";
    return apiCall("forms", method, data, id);
}

export function GetTableDataFromAPI(id) {
    return apiCall("tables_data", "GET", null, id);
}

export function GetAllTableDataFromAPI() {
    return apiCall("tables_data", "GET");
}

export function SetTableDataToAPI(data, id = null) {
    const method = id ? "PUT" : "POST";
    return apiCall("tables_data", method, data, id);
}

// Global States
export function GetGlobalFieldsFromAPI(id) {
    return apiCall("global_states", "GET", null, id);
}

export function GetAllGlobalFieldsFromAPI() {
    return apiCall("global_states", "GET");
}

export function SetGlobalFieldsToAPI(data, id = null) {
    const method = id ? "PUT" : "POST";
    return apiCall("global_states", method, data, id);
}

// Additional Endpoints (if needed)
// Example for a new "users" resource
export function GetUsersFromAPI(id) {
    return apiCall("users", "GET", null, id);
}

export function GetAllUsersFromAPI() {
    return apiCall("users", "GET");
}

export function SetUserToAPI(data, id = null) {
    const method = id ? "PUT" : "POST";
    return apiCall("users", method, data, id);
}


export function GetAppsfromAPI() {
    databaseSignal.value = "nokodo_creator/";
    return apiCall("apps");
}

export function InsertAppToAPI(appdata) {
    return apiCall("apps","POST",appdata)
}

export function CreateDatabase(name) {
    let baseurl2 = "http://localhost:8001/api/create-database";
    let method = "POST"
    GenericApiCall(baseurl2, method , {"name":name}, "body").then((data)=> {
        return data;
    });
}


export function SyncTablesData(tablesData, edgesData, table_id) {
    let tables = tablesData;
    let edges = edgesData;
    SendTablesData({"tables":tables, "edges":edges});
}
export function SendTablesData(data) {
    console.log("tables data to send to api current ones:",data); 
    let dbname = databaseSignal.peek().toLowerCase();
    let dbname2 = dbname.split("/")[0];
    let baseurl2 = `http://localhost:8001/api/update-table/${dbname2}`;
    GenericApiCall(baseurl2, "POST",data, "body").then((newdata) => {
        return newdata;
    });
}