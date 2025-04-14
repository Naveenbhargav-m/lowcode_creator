import { TablesView } from "./components";
import { QueriesList } from "./queries_left_list";
import { CreateQueryBlock } from "./query_functions";

function QueryBuilderPage() {
    return(
        <div style={{"display": "flex", "flexDirection": "row", "justifyContent": "space-between", "alignItems": "flex-start", height:"100vh", width:"100vw"}}>
            <QueriesList />
            <TablesView prefilData={{}}/>
        </div>
    );
}


export {QueryBuilderPage};