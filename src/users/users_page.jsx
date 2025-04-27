import { useEffect } from "preact/hooks";
import { UserGroupsManager } from "../groups/groups_page";
import { useLocation } from "preact-iso";
import { AppID } from "../states/global_state";
import { useAuthCheck } from "../hooks/hooks";

function UsersPage() {
    useAuthCheck();    
    return (
        <div className="p-10 bg-white text-black h-screen">
            <div><UserGroupsManager /></div>
        </div>
    );
}


export {UsersPage};