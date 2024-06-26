"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const invariant = require("tiny-invariant");
const Matches = require("./Matches.cjs");
const path = require("./path.cjs");
const useParams = require("./useParams.cjs");
const useSearch = require("./useSearch.cjs");
const notFound = require("./not-found.cjs");
const useNavigate = require("./useNavigate.cjs");
const rootRouteId = "__root__";
function getRouteApi(id) {
  return new RouteApi({ id });
}
class RouteApi {
  /**
   * @deprecated Use the `getRouteApi` function instead.
   */
  constructor({ id }) {
    this.useMatch = (opts) => {
      return Matches.useMatch({ select: opts == null ? void 0 : opts.select, from: this.id });
    };
    this.useRouteContext = (opts) => {
      return Matches.useMatch({
        from: this.id,
        select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch.useSearch({ ...opts, from: this.id });
    };
    this.useParams = (opts) => {
      return useParams.useParams({ ...opts, from: this.id });
    };
    this.useLoaderDeps = (opts) => {
      return Matches.useLoaderDeps({ ...opts, from: this.id, strict: false });
    };
    this.useLoaderData = (opts) => {
      return Matches.useLoaderData({ ...opts, from: this.id, strict: false });
    };
    this.useNavigate = () => {
      return useNavigate.useNavigate({ from: this.id });
    };
    this.notFound = (opts) => {
      return notFound.notFound({ routeId: this.id, ...opts });
    };
    this.id = id;
  }
}
class Route {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    this.init = (opts) => {
      var _a, _b;
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !(options2 == null ? void 0 : options2.path) && !(options2 == null ? void 0 : options2.id);
      this.parentRoute = (_b = (_a = this.options) == null ? void 0 : _a.getParentRoute) == null ? void 0 : _b.call(_a);
      if (isRoot) {
        this.path = rootRouteId;
      } else {
        invariant(
          this.parentRoute,
          `Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a Route instance.`
        );
      }
      let path$1 = isRoot ? rootRouteId : options2.path;
      if (path$1 && path$1 !== "/") {
        path$1 = path.trimPathLeft(path$1);
      }
      const customId = (options2 == null ? void 0 : options2.id) || path$1;
      let id = isRoot ? rootRouteId : path.joinPaths([
        this.parentRoute.id === rootRouteId ? "" : this.parentRoute.id,
        customId
      ]);
      if (path$1 === rootRouteId) {
        path$1 = "/";
      }
      if (id !== rootRouteId) {
        id = path.joinPaths(["/", id]);
      }
      const fullPath = id === rootRouteId ? "/" : path.joinPaths([this.parentRoute.fullPath, path$1]);
      this.path = path$1;
      this.id = id;
      this.fullPath = fullPath;
      this.to = fullPath;
    };
    this.addChildren = (children) => {
      this.children = children;
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.useMatch = (opts) => {
      return Matches.useMatch({ ...opts, from: this.id });
    };
    this.useRouteContext = (opts) => {
      return Matches.useMatch({
        ...opts,
        from: this.id,
        select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch.useSearch({ ...opts, from: this.id });
    };
    this.useParams = (opts) => {
      return useParams.useParams({ ...opts, from: this.id });
    };
    this.useLoaderDeps = (opts) => {
      return Matches.useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return Matches.useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate.useNavigate({ from: this.id });
    };
    this.options = options || {};
    this.isRoot = !(options == null ? void 0 : options.getParentRoute);
    invariant(
      !((options == null ? void 0 : options.id) && (options == null ? void 0 : options.path)),
      `Route cannot have both an 'id' and a 'path' option.`
    );
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createRoute(options) {
  return new Route(options);
}
function createRootRouteWithContext() {
  return (options) => {
    return createRootRoute(options);
  };
}
const rootRouteWithContext = createRootRouteWithContext;
class RootRoute extends Route {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createRouteMask(opts) {
  return opts;
}
class NotFoundRoute extends Route {
  constructor(options) {
    super({
      ...options,
      id: "404"
    });
  }
}
exports.NotFoundRoute = NotFoundRoute;
exports.RootRoute = RootRoute;
exports.Route = Route;
exports.RouteApi = RouteApi;
exports.createRootRoute = createRootRoute;
exports.createRootRouteWithContext = createRootRouteWithContext;
exports.createRoute = createRoute;
exports.createRouteMask = createRouteMask;
exports.getRouteApi = getRouteApi;
exports.rootRouteId = rootRouteId;
exports.rootRouteWithContext = rootRouteWithContext;
//# sourceMappingURL=route.cjs.map
