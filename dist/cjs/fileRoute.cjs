"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const route = require("./route.cjs");
const Matches = require("./Matches.cjs");
const useSearch = require("./useSearch.cjs");
const useParams = require("./useParams.cjs");
const useNavigate = require("./useNavigate.cjs");
function createFileRoute(path) {
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      console.warn(
        this.silent,
        "FileRoute is deprecated and will be removed in the next major version. Use the createFileRoute(path)(options) function instead."
      );
      const route$1 = route.createRoute(options);
      route$1.isRoot = false;
      return route$1;
    };
    this.silent = _opts == null ? void 0 : _opts.silent;
  }
}
function FileRouteLoader(_path) {
  console.warn(
    false,
    `FileRouteLoader is deprecated and will be removed in the next major version. Please place the loader function in the the main route file, inside the \`createFileRoute('/path/to/file')(options)\` options`
  );
  return (loaderFn) => loaderFn;
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return Matches.useMatch({ select: opts2 == null ? void 0 : opts2.select, from: this.options.id });
    };
    this.useRouteContext = (opts2) => {
      return Matches.useMatch({
        from: this.options.id,
        select: (d) => (opts2 == null ? void 0 : opts2.select) ? opts2.select(d.context) : d.context
      });
    };
    this.useSearch = (opts2) => {
      return useSearch.useSearch({ ...opts2, from: this.options.id });
    };
    this.useParams = (opts2) => {
      return useParams.useParams({ ...opts2, from: this.options.id });
    };
    this.useLoaderDeps = (opts2) => {
      return Matches.useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return Matches.useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      return useNavigate.useNavigate({ from: this.options.id });
    };
    this.options = opts;
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createLazyRoute(id) {
  return (opts) => {
    return new LazyRoute({ id, ...opts });
  };
}
function createLazyFileRoute(path) {
  const id = removeGroups(path);
  return (opts) => new LazyRoute({ id, ...opts });
}
const routeGroupPatternRegex = /\(.+\)/g;
function removeGroups(s) {
  return s.replaceAll(routeGroupPatternRegex, "").replaceAll("//", "/");
}
exports.FileRoute = FileRoute;
exports.FileRouteLoader = FileRouteLoader;
exports.LazyRoute = LazyRoute;
exports.createFileRoute = createFileRoute;
exports.createLazyFileRoute = createLazyFileRoute;
exports.createLazyRoute = createLazyRoute;
//# sourceMappingURL=fileRoute.cjs.map
