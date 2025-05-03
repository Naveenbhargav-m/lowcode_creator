import { signal } from "@preact/signals";
import { generateUID } from "../utils/helpers";
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
        "order_aggregate_fields": []
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
    let id = activeQuery["id"];
    queries[id] = activeQuery;
    ActiveQueryData.value = {...activeQuery};
    console.log("called update Query Part:",part, data, activeQuery);
    SyncQueries();

}
function LoadQueries() {
    let jsonStr = localStorage.getItem("queries");
    let map = JSON.parse(jsonStr);
    queries = {...map};
    let keys = Object.keys(queries);
    let names = [];
    for(var i=0;i<keys.length;i++) {
        let cur = queries[keys[i]];
        let obj = {"id": cur["id"], "name": cur["name"]};
        names.push(obj);
    }
    QueryNames.value = [...names];
}
function SyncQueries() {
    let str = JSON.stringify(queries);
    localStorage.setItem("queries", str);
}

export {ActiveQuery,QueryNames, queries, ActiveQueryData,
     SetActiveQuery, CreateQueryBlock , UpdateQueryPart, LoadQueries, SyncQueries};