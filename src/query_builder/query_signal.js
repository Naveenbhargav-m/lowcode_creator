import { signal } from "@preact/signals";

let ActiveQuery = signal("1");
let queries =  [];
let QueryNames = signal([]);
let ActiveQueryData = signal({});

function SetActiveQuery(activeiD) {}
function UpdateQueryPart(part ,data) {}
function CreateQueryBlock(data) {}
function LoadQueries() {}
function SyncQueries() {}

export {ActiveQuery,QueryNames, queries, ActiveQueryData };