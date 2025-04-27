import { render } from "preact";
  import { LocationProvider, Router, Route, useLocation } from "preact-iso";
import "./index.css";
import "./styles/theme.css";
import SideBar from "./components/sidebar.jsx";
import { TablesPage } from "./table_builder/tables_page";
import {ScreenPage} from "./screen_builder/screen_page";
import { UsersPage } from "./users/users_page";
import { SettingsPage } from "./settings/settings_page";
import { AppID, sideBarEnable } from "./states/global_state";
import AppCreatorPage from "./app_creator/app_creator";
import { FormBuilderTest } from "./form_builder/form_edit_area";
import { WorkFlowPage } from "./workflows/workflow_page";
import { AppHomeScreen } from "./home/app_home";
import { QueryBuilderPage } from "./query_builder/query_builder_page";
import { ComplexFormComponentsDemo,DynamicFormDemo } from "./form_builder/fields/fieldsdemo";
import WorkflowBuilder from "./tests/reactflow1";
import { WorkflowConfigFormPanel } from "./workflows/flow_right";
import { useEffect } from "preact/hooks";

export function App() {

  return (
    <LocationProvider>
   <div className="flex bg-white">
    {
      sideBarEnable.value ?   <SideBar /> : <span></span>
    }
  <main className="flex-grow bg-white">
    <Router>
      <Route path="/home" component={AppHomeScreen} />
      <Route path="/forms" component={FormBuilderTest} />
      <Route path="/screens" component={ScreenPage}/>
      <Route path="/containers" component={TablesPage} />
      <Route path="/workflows" component={WorkFlowPage} />
      <Route path="/users" component={UsersPage}/>
      <Route path="/settings" component={SettingsPage} />
      <Route path="/" component={AppCreatorPage} />
      <Route path="/queries" component={QueryBuilderPage} />
      <Route path="/test" component={WorkflowBuilder} />
      <Route path="/test2" component={WorkflowConfigFormPanel} />
      <Route default component={() => <div>Not Found</div>} />
    </Router>
  </main>
</div>

    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
