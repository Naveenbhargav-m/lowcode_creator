import { ApiClient, AppID } from "../states/global_state";

function loadDataFromAPI(apiData) {
    try {
      // Parse route_mapping from JSONB string if it exists
      let routes = [];
      if (apiData.route_mapping) {
        if (typeof apiData.route_mapping === 'string') {
          routes = JSON.parse(apiData.route_mapping);
        } else {
          routes = apiData.route_mapping;
        }
      }
  
      // Transform routes to component format
      const transformedRoutes = routes.map(route => ({
        path: route.path,
        component: {
          name: route.component_name,
          id: parseInt(route.component_id)
        }
      }));
  
      // Create the component format
      const componentData = {
        homePage: apiData.home_route_name || "/dashboard",
        homeRouteScreenId: apiData.home_route_screen_id || "1",
        routes: transformedRoutes,
        workflows: {
          frontend: {
            name: apiData.init_frontend_workflow_name || "default-frontend-init",
            id: parseInt(apiData.init_frontend_workflow_id) || 1
          },
          backend: {
            name: apiData.init_backend_workflow_name || "default-backend-init",
            id: parseInt(apiData.init_backend_workflow_id) || 1
          }
        },
        appearance: {
          title: apiData.web_title || "BuildFlow Studio",
          favicon: apiData.favicon || "/favicon.ico"
        }
      };
  
      return componentData;
    } catch (error) {
      console.error("Error transforming API data:", error);
      // Return default structure if transformation fails
      return {
        homePage: "/dashboard",
        homeRouteScreenId: "1",
        routes: [],
        workflows: {
          frontend: { name: "default-frontend-init", id: 1 },
          backend: { name: "default-backend-init", id: 1 }
        },
        appearance: {
          title: "BuildFlow Studio",
          favicon: "/favicon.ico"
        }
      };
    }
  }
  
  function createAPIRequestBody(componentData) {
    try {
      // Find the home route component details
      const homeRoute = componentData.routes.find(route => route.path === componentData.homePage);
      
      // Transform routes to database format
      const routeMapping = componentData.routes.map(route => ({
        path: route.path,
        component_name: route.component.name,
        component_id: route.component.id
      }));
  
      // Create API request body matching the database schema
      const requestBody = {
        web_title: componentData.appearance.title,
        favicon: componentData.appearance.favicon,
        home_route_name: componentData.homePage,
        home_route_screen_name: homeRoute ? homeRoute.component.name : "",
        home_route_screen_id: componentData.homeRouteScreenId,
        route_mapping: JSON.stringify(routeMapping),
        init_frontend_workflow_name: componentData.workflows.frontend.name,
        init_frontend_workflow_id: componentData.workflows.frontend.id.toString(),
        init_backend_workflow_name: componentData.workflows.backend.name,
        init_backend_workflow_id: componentData.workflows.backend.id.toString()
      };
  
      return requestBody;
    } catch (error) {
      console.error("Error creating API request body:", error);
      throw new Error("Failed to create API request body");
    }
  }

  async function getDataFromAPI() {
    let url = `${AppID}/public/_app_config`;
    let resp = await ApiClient.get(url, {"query": {"where": "id=1"}});
    if(resp === undefined) {
        return {};
    }
    let firstelement = resp[0] || {};
    let data = loadDataFromAPI(firstelement);
    return data;
  }

  function PostDataToAPI(data) {
    let requestoduy = createAPIRequestBody(data);
    let url = `${AppID}/public/_app_config`;
    ApiClient.patch(url, {"body": requestoduy, "query": {"where":"id=1"}});
  }
  export {getDataFromAPI, PostDataToAPI};