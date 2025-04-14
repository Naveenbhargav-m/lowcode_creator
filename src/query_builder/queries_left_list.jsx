import { ScreensList } from "../screen_builder/screen_page";
import { CreateQueryBar } from "./components";
import { ActiveQuery, QueryNames } from "./query_signal";


export function QueriesList() {
    return (
        <div>
        <CreateQueryBar />
        <ScreensList elementsList={QueryNames.value} signal={ActiveQuery} callBack={(newquery) => { console.log("new query:",newquery);}}/>
        </div>
    );
}