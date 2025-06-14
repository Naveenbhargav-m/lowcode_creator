import { render } from "preact";
  import { LocationProvider, Router, Route, useLocation } from "preact-iso";
import "./index.css";
import SideBar from "./components/sidebar.jsx";
import { TablesPage } from "./table_builder/tables_page";
import {ScreenPage} from "./screen_builder/screen_page";
import { UsersPage } from "./users/users_page";
import { SettingsPage } from "./settings/settings_page";
import {  sideBarEnable } from "./states/global_state";
import AppCreatorPage from "./app_creator/app_creator";
import { FormBuilderPage } from "./form_builder/form_edit_area";
import { WorkFlowPage } from "./workflows/workflow_page";
import { AppHomeScreen } from "./home/app_home";
import { QueryBuilderPage } from "./query_builder/query_builder_page";
import SecretsManager from "./secret_store/secret_store";
import TemplateRegistrationPage from "./external_templates/external_templates";
import { TemplatePage } from "./template_builder/templates_page";
import { VariablesPage } from "./global_state_screen/global_state_page";
import { ThemeEditor } from "./themes_screen/themes_screen";
import ExtendedPickerDemo from "./tests/data_picker_demo";
import InlinePickerDemo from "./tests/innline_pickers";
import SideDrawerPickersDemo from "./tests/pickers";

export function App() {
  // Add global style to prevent body scrolling
  const globalStyle = `
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
    }
    
    #app {
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    
    /* Hide all scrollbars */
    ::-webkit-scrollbar {
      display: none;
    }
    
    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  return (
    <LocationProvider>
      <style dangerouslySetInnerHTML={{ __html: globalStyle }} />
      <div className="flex bg-white h-screen w-screen overflow-hidden">
        {sideBarEnable.value ? <SideBar /> : <span></span>}
        <main className="flex-grow bg-white h-full w-full overflow-hidden" style={{color:"black"}}>
          <Router>
            <Route path="/home" component={AppHomeScreen} />
            <Route path="/forms" component={FormBuilderPage} />
            <Route path="/screens" component={ScreenPage} />
            <Route path="/containers" component={TablesPage} />
            <Route path="/secrets" component={SecretsManager} />
            <Route path="/view_templates" component={TemplatePage} />
            <Route path="/ui_states" component={VariablesPage} />
            <Route path="/themes" component={ThemeEditor} />
            <Route path="/templates" component={TemplateRegistrationPage} />
            <Route path="/workflows" component={WorkFlowPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/" component={AppCreatorPage} />
            <Route path="/queries" component={QueryBuilderPage} />
            <Route default component={() => <div>Not Found</div>} />
            <Route path="/test" component={SideDrawerPickersDemo} />
          </Router>
        </main>
      </div>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));