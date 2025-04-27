import { useAuthCheck } from "../hooks/hooks";

function SettingsPage() {
    useAuthCheck();
    return (
        <div className="p-10 bg-white text-black h-screen">
            <div>This is Settings page</div>
        </div>
    );
}


export {SettingsPage};