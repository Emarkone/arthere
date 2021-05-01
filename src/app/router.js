export default class Router {
    static run(app) {
      const routes = ['', 'home', 'artworks','login', 'admin'];
      const restrictedRoutes = ['admin'];
      const anonymousRoutes = ['login'];

      const route = location.hash ? location.hash.substr('1') : 'home';
      const routeExists = routes.includes(route);

      const userExists = (app.user !== null);

      if(routeExists && anonymousRoutes.includes(route) && userExists) {
          location.hash = '#admin';
      } else if(routeExists && restrictedRoutes.includes(route) && !userExists) {
          location.hash = '#login';
      } else if (routeExists) {
          app.goTo(route);
      } else {
        location.hash = 'home';
      }
    }
  }