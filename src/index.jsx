import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";
import "@picocss/pico/css/pico.min.css";
import "./index.css";
import "./styles/theme.css";
import { ThemeProvider } from "./components/theme_provider";

import SideBar from "./components/sidebar.jsx";
import { TablesPage } from "./table_builder/tables_page";
import {ScreenPage} from "./screen_builder/screen_page";
import { UsersPage } from "./users/users_page";
import { SettingsPage } from "./settings/settings_page";
import { sideBarEnable } from "./states/global_state";
import AppCreatorPage from "./app_creator/app_creator";
import { FormBuilderTest } from "./form_builder/form_edit_area";
import { ThemeCreator } from "./theme_creator/theme_config_area";
import { WorkFlowPage } from "./workflows/workflow_page";
import {TestRV} from "./components/general/recordset_list";
import { AppHomeScreen } from "./home/app_home";
import QueryCreator from "./query_builder/query_builder";
import { QueryBuilderPage } from "./query_builder/query_builder_page";
import { FormExample } from "./components/generic/form";

export function App() {
  return (
    <ThemeProvider>
    <LocationProvider>
   <div className="flex bg-white">
    {
      sideBarEnable.value ?   <SideBar /> : <span></span>
    }
  <main className="flex-grow bg-white">
    <Router
     onRouteChange={(url) => console.log('Route changed to', url)}
     onLoadStart={(url) => console.log('Starting to load', url)}
     onLoadEnd={(url) => console.log('Finished loading', url)}
    >
      <Route path="/home" component={AppHomeScreen} />
      <Route path="/forms" component={FormBuilderTest} />
      <Route path="/screens" component={ScreenPage}/>
      <Route path="/containers" component={TablesPage} />
      <Route path="/workflows" component={WorkFlowPage} />
      <Route path="/users" component={UsersPage}/>
      <Route path="/settings" component={SettingsPage} />
      <Route path="/" component={AppCreatorPage} />
      <Route path="/test_comp" component={QueryCreator} />
      <Route path="/queries" component={QueryBuilderPage} />
      {/* <Route path="/preview" component={PreviewArea} /> */}
      <Route path="/test" component={FormExample} />

      <Route default component={() => <div>Not Found</div>} />
    </Router>
  </main>
</div>

    </LocationProvider>
    </ThemeProvider>
  );
}

render(<App />, document.getElementById("app"));
