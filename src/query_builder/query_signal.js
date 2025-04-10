import { signal } from "@preact/signals";

let ActiveQuery = signal("1");
let queries =  [];
let QueryNames = signal([]);
export {ActiveQuery,QueryNames, queries };