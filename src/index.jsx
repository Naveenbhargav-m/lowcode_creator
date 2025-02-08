import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import "./index.css";
import "bulma/css/bulma.css";
import "./styles/theme.css";

import { ThemeProvider } from "./components/theme_provider";

import SideBar from "./components/sidebar.jsx";
import TablesPage from "./table_builder/tables_page";
import {ScreenPage} from "./screen_builder/screen_page";
import { WorkFlowPage } from "./workflows/workflow_page";
import { UsersPage } from "./users/users_page";
import { SettingsPage } from "./settings/settings_page";
import { PreviewArea } from "./preview/preview";
import { sideBarEnable } from "./states/global_state";
import AppCreatorPage from "./app_creator/app_creator";
import { FormBuilderTest } from "./form_builder/form_edit_area";
import { ThemeCreator } from "./theme_creator/theme_config_area";
import { Provider } from "./components/ui/provider";
export function App() {
  return (
    <Provider>
    <ThemeProvider>
    <LocationProvider>
   <div className="flex bg-white">
    {
      sideBarEnable.value ?   <SideBar /> : <span></span>
    }
  <main className="flex-grow bg-white">
    <Router>
      <Route path="/home" component={TablesPage} />
      <Route path="/forms" component={FormBuilderTest} />
      <Route path="/screens" component={ScreenPage}/>
      <Route path="/containers" component={TablesPage} />
      <Route path="/workflows" component={WorkFlowPage} />
      <Route path="/users" component={UsersPage}/>
      <Route path="/settings" component={SettingsPage} />
      <Route path="/" component={AppCreatorPage} />
      <Route path="/preview" component={PreviewArea} />
      <Route path="/test" component={ThemeCreator} />
      <Route default component={() => <div>Not Found</div>} />
    </Router>
  </main>
</div>

    </LocationProvider>
    </ThemeProvider>
    </Provider>
  );
}

render(<App />, document.getElementById("app"));
