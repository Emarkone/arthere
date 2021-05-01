import Router from './app/router.js';
import App from './app/app.js';

const app = new App();
app.loadData();
Router.run(app);



window.addEventListener('hashchange', () => {
  Router.run(app);
});