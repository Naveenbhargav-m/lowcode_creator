import { useEffect } from "preact/hooks";
import { TablesView } from "./components";
import { QueriesList } from "./queries_left_list";
import { CreateQueryBlock, LoadQueries } from "./query_signal";

function QueryBuilderPage() {
    useEffect((() => {
        LoadQueries();
    }),[]);
    return(
        <div style={{"display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "flex-start", height:"100vh", width:"100vw"}}>
            <QueriesList />
            <TablesView prefilData={{}}/>
        </div>
    );
}


export {QueryBuilderPage};