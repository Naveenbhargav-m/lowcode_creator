import { useAuthCheck } from "../hooks/hooks";


function AppHomeScreen() {
    useAuthCheck();
    return(
        <div>
            <p> This is App Home Screen</p>
        </div>
    );
}


export {AppHomeScreen};