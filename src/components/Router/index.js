class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = routes.find((route) => route.default) || routes[0];
    this.currentRoute.component.mount();
  }

  navigate(path, syncRoutes = false) {
    this.currentRoute.component.unmount();
    this.currentRoute = this.routes.find((route) => route.path === path);
    this.currentRoute.component.mount();
    if (!syncRoutes) {
      window.history.pushState({ location: path }, null, path);
    }
  }
}

export default Router;
