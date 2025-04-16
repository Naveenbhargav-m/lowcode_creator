import { generateUID } from "../utils/helpers";
import { queries, QueryNames } from "./query_signal";


// function CreateQueryBlock(data) {
//     let name = data["name"];
//     let id = generateUID();
//     let order = queries.length;
//     let newQuery = {"name": name, "id": id, "order": order,
//         "tables": [], "fields": {}, "where": [], 
//         "join": [], "group_by": [], "sort":[], "query_string": "" };
//     queries.push(newQuery);
//     let names = QueryNames.peek();
//     names.push({"id": id, "name": name});
//     QueryNames.value = [...names];
// }

// export {CreateQueryBlock};