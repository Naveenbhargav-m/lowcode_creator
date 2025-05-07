import { useEffect } from "preact/hooks";
import { useAuthCheck } from "../hooks/hooks";
import { InitGlobalData } from "../states/global_repo";


function AppHomeScreen() {
    useAuthCheck();
    useEffect((() => {
        InitGlobalData();
      }), []);
    return(
        <div>
            <p> This is App Home Screen</p>
        </div>
    );
}


export {AppHomeScreen};