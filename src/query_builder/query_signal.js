import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
import { ApiClient, AppID } from "../states/global_state";
import { SyncData } from "../api/api_syncer";
let ActiveQuery = signal("1");
let queries =  {};
let QueryNames = signal([]);
let ActiveQueryData = signal({});

function SetActiveQuery(activeiD) {
    ActiveQuery.value = activeiD;
    let myquery = queries[activeiD];
    ActiveQueryData.value = {...myquery};
    ActiveQuery.value = activeiD;
}
function CreateQueryBlock(data) {
    let name = data["name"];
    let id = generateUID();
    let length = Object.keys(queries).length;
    let querymap = {
        "id": id,
        "name": name,
        "order": length,
        "query_string": "",
        "sql_string": "",
        "inputs": [],
        "outputs": [],
        "input_function": "",
        "output_function": "",
        "select_fields": [],
        "where_fields": [],
        "where_groups": [],
        "join_fields": [],
        "group_fields": [],
        "order_fields": [],
        "select_aggregate_fields": [],
        "order_aggregate_fields": [],
        "input_params": [],
        "input_js": [],
        "output_js": [],
        "output_params": [],
        "_change_type": "add"
    };
    queries[id] = querymap;
    let existing = QueryNames.value;
    existing.push({"id": id, "name": name});
    QueryNames.value = [...existing];
    ActiveQuery.value = id;
    ActiveQueryData.value = {...querymap};

}

function UpdateQueryPart(part ,data) {
    console.log("called update query data : ", part, data);
    let activeQuery = ActiveQueryData.value;
    console.log("called update query active part : ",activeQuery);
    activeQuery[part] = data;
    activeQuery["_change_type"] = activeQuery["_change_type"] || "update";
    let id = activeQuery["id"];
    queries[id] = activeQuery;
    ActiveQueryData.value = {...activeQuery};
    console.log("called update Query Part:",part, data, activeQuery);
    SyncQueries();

}
function LoadQueries() {
    let jsonStr = localStorage.getItem("queries");
    let map = JSON.parse(jsonStr);

    let url = `${AppID.value}/public/_queries`;
    ApiClient.get(url).then(
        (data) => {
            if(data === undefined) {
                console.log("queries data is undefined:",data);
            }
            var temp = {};
            let length = data.length;
            for(var i=0;i<length;i++) {
                let cur = data[i];
                let id = cur["id"];
                let innerdata = cur["query_data"];
                innerdata["id"] = id;
                temp[id] = innerdata;
            }
            queries = {...temp};
            let keys = Object.keys(queries);
            let names = [];
            for(var i=0;i<keys.length;i++) {
                let cur = queries[keys[i]];
                let obj = {"id": cur["id"], "name": cur["name"]};
                names.push(obj);
            }
            QueryNames.value = [...names];
        }
    );
}
function SyncQueries() {
    let keys = Object.keys(queries);
    let queriesArr = [];
    let newqueries = {};
    for(var i=0;i<keys.length;i++) {
        let cur = queries[keys[i]];
        queriesArr.push(cur);
        let copy = JSON.parse(JSON.stringify(cur));
        delete copy["_change_type"];
        newqueries[keys[i]] = copy;
    }
    SyncData("_queries", queriesArr);
    queries = newqueries;
}

export {ActiveQuery,QueryNames, queries, ActiveQueryData,
     SetActiveQuery, CreateQueryBlock , UpdateQueryPart, LoadQueries, SyncQueries};