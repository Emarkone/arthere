export default class Router {
  static run(app) {
    const routes = ['home', 'artworks', 'login', 'admin'];
    const restrictedRoutes = ['admin'];
    const anonymousRoutes = ['login'];

    const route = location.hash ? location.hash.substr('1') : 'home';
    const routeExists = routes.includes(route);

    const userExists = (app.currentUser !== null);

    if (!routeExists) {
      location.hash = 'home';
    } else if (anonymousRoutes.includes(route) && userExists) {
      location.hash = 'admin';
    } else if (restrictedRoutes.includes(route) && !userExists) {
      location.hash = 'login';
    } else {
      app.goTo(route);
    }

  }
}