import { render } from "./dom.js";
import { Div, H1, P } from "./components.js";

class Router {
  constructor() {
    this.routes = [];
    this.currentParams = {};
    this.currentQuery = {};
    this.history = [];
    this.currentIndex = -1;
    this.initialized = false;
    this.ownDomain = window.location.origin;
    this.notFoundHandler = () => {
      return (
        H1({}, ["404 Not Found"])
      );
    };

    window.addEventListener("popstate", this._onPopState.bind(this));

  }


  register(path, handler, title = window.location.origin) {
    const paramNames = [];
    const regex = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    this.routes.push({
      path,
      regex: new RegExp(`^${regex}$`),
      handler,
      paramNames,
      title
    });
  }


  push(path) {
    const [pathname, queryStr] = path.split("?");
    const query = this._parseQuery(queryStr || "");
    const match = this._matchRoute(pathname);

    if (!match) {
      render("not-found", this.notFoundHandler);
      return;
    }

    const state = { path, id: Date.now() };
    history.pushState(state, "", path);
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
    document.title = match.title;
    render(match.path, match.handler);
  }


  pushOnly(path) {
    const state = { path, id: Date.now() };
    history.pushState(state, "", path);
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
    console.log(this.history);
  }

  _onPopState(event) {
    const state = event.state;
    if (!state) return;

    const [pathname, queryStr] = state.path.split("?");
    const query = this._parseQuery(queryStr || "");
    const match = this._matchRoute(pathname);

    const index = this.history.findIndex((s) => s.id === state.id);
    this.currentIndex = index;

    if (match) render(match.path, match.handler);
    else render("not-found", this.notFoundHandler);
  }

  _matchRoute(pathname) {
    for (const route of this.routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        this.currentParams = params;
        return { ...route, params };
      }
    }
    return null;
  }

  _parseQuery(queryStr) {
    this.currentQuery = Object.fromEntries(new URLSearchParams(queryStr).entries());
    return this.currentQuery;
  }


  start() {
    const path = window.location.pathname;
    const queryStr = window.location.search;
    this._parseQuery(queryStr || "");
    const match = this._matchRoute(path);

    const state = { path, queryStr, id: Date.now() };
    history.replaceState(state, "", path + queryStr);
    this.history.push(state);
    this.currentIndex = 0;

    if (match) {
      document.title = match.title;
      render(match.path, match.handler, {});
    } else {
      console.warn(`No route match for start: ${path}`);
      render("not-found-MostJs", this.notFoundHandler);
    }
  }


  useParams() {
    return this.currentParams || {};
  }

  useQuery() {
    return this.currentQuery || {};
  }

  currentPath() {
    return this.currentPath || window.location.pathname;
  }

  setNotFoundHandler(handler) {
    this.notFoundHandler = handler;
  }
}

const router = new Router();
export default router;