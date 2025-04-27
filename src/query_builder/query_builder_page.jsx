import { useEffect } from "preact/hooks";
import { TablesView } from "./components";
import { QueriesList } from "./queries_left_list";
import { CreateQueryBlock, LoadQueries } from "./query_signal";
import { globalStyle } from "../styles/globalStyle";
import { useAuthCheck } from "../hooks/hooks";

function QueryBuilderPage() {
    useAuthCheck();
    useEffect((() => {
        LoadQueries();
    }),[]);
    return(
        <div style={{"display": "flex", "flexDirection": "row", "justifyContent": "flex-start", "alignItems": "flex-start", height:"100vh", width:"100vw",...globalStyle}}>
            <QueriesList />
            <TablesView prefilData={{}}/>
        </div>
    );
}


export {QueryBuilderPage};