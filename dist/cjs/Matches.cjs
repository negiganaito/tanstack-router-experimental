"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const invariant = require("tiny-invariant");
const CatchBoundary = require("./CatchBoundary.cjs");
const useRouterState = require("./useRouterState.cjs");
const useRouter = require("./useRouter.cjs");
const utils = require("./utils.cjs");
const notFound = require("./not-found.cjs");
const redirects = require("./redirects.cjs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
const matchContext = React__namespace.createContext(void 0);
function Matches() {
  const router = useRouter.useRouter();
  const matchId = useRouterState.useRouterState({
    select: (s) => {
      var _a;
      return (_a = s.matches[0]) == null ? void 0 : _a.id;
    }
  });
  const resetKey = useRouterState.useRouterState({
    select: (s) => s.resolvedLocation.state.key
  });
  const inner = /* @__PURE__ */ jsxRuntime.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntime.jsx(
    CatchBoundary.CatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: CatchBoundary.ErrorComponent,
      onCatch: (error) => {
        console.warn(
          false,
          `The following error wasn't caught by any route! 👇 At the very least, consider setting an 'errorComponent' in your RootRoute!`
        );
        console.error(error);
      },
      children: matchId ? /* @__PURE__ */ jsxRuntime.jsx(Match, { matchId }) : null
    }
  ) });
  return router.options.InnerWrap ? /* @__PURE__ */ jsxRuntime.jsx(router.options.InnerWrap, { children: inner }) : inner;
}
function SafeFragment(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: props.children });
}
function Match({ matchId }) {
  var _a, _b, _c, _d;
  const router = useRouter.useRouter();
  const routeId = useRouterState.useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a2.routeId;
    }
  });
  invariant(
    routeId,
    `Could not find routeId for matchId "${matchId}". Please file an issue!`
  );
  const route = router.routesById[routeId];
  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsxRuntime.jsx(PendingComponent, {}) : null;
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
  const routeNotFoundComponent = route.isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route.options.notFoundComponent ?? ((_a = router.options.notFoundRoute) == null ? void 0 : _a.options.component)
  ) : route.options.notFoundComponent;
  const ResolvedSuspenseBoundary = route.options.wrapInSuspense ?? PendingComponent ?? ((_b = route.options.component) == null ? void 0 : _b.preload) ?? ((_c = route.options.pendingComponent) == null ? void 0 : _c.preload) ?? ((_d = route.options.errorComponent) == null ? void 0 : _d.preload) ? React__namespace.Suspense : SafeFragment;
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary.CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? notFound.CatchNotFound : SafeFragment;
  const resetKey = useRouterState.useRouterState({
    select: (s) => s.resolvedLocation.state.key
  });
  return /* @__PURE__ */ jsxRuntime.jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsxRuntime.jsx(ResolvedSuspenseBoundary, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntime.jsx(
    ResolvedCatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: routeErrorComponent ?? CatchBoundary.ErrorComponent,
      onCatch: (error) => {
        if (notFound.isNotFound(error))
          throw error;
        console.warn(false, `Error in route match: ${matchId}`);
        console.error(error);
      },
      children: /* @__PURE__ */ jsxRuntime.jsx(
        ResolvedNotFoundBoundary,
        {
          fallback: (error) => {
            if (!routeNotFoundComponent || error.routeId && error.routeId !== routeId || !error.routeId && !route.isRoot)
              throw error;
            return React__namespace.createElement(routeNotFoundComponent, error);
          },
          children: /* @__PURE__ */ jsxRuntime.jsx(MatchInner, { matchId })
        }
      )
    }
  ) }) });
}
function MatchInner({
  matchId
  // pendingElement,
}) {
  var _a, _b;
  const router = useRouter.useRouter();
  const routeId = useRouterState.useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a2.routeId;
    }
  });
  const route = router.routesById[routeId];
  const match = useRouterState.useRouterState({
    select: (s) => utils.pick(s.matches.find((d) => d.id === matchId), [
      "id",
      "status",
      "error",
      "loadPromise",
      "minPendingPromise"
    ])
  });
  const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || CatchBoundary.ErrorComponent;
  if (match.status === "notFound") {
    let error;
    if (isServerSideError(match.error)) {
      const deserializeError = ((_a = router.options.errorSerializer) == null ? void 0 : _a.deserialize) ?? defaultDeserializeError;
      error = deserializeError(match.error.data);
    } else {
      error = match.error;
    }
    invariant(notFound.isNotFound(error), "Expected a notFound error");
    return renderRouteNotFound(router, route, error);
  }
  if (match.status === "redirected") {
    invariant(redirects.isRedirect(match.error), "Expected a redirect error");
    throw match.loadPromise;
  }
  if (match.status === "error") {
    if (router.isServer) {
      return /* @__PURE__ */ jsxRuntime.jsx(
        RouteErrorComponent,
        {
          error: match.error,
          info: {
            componentStack: ""
          }
        }
      );
    }
    if (isServerSideError(match.error)) {
      const deserializeError = ((_b = router.options.errorSerializer) == null ? void 0 : _b.deserialize) ?? defaultDeserializeError;
      throw deserializeError(match.error.data);
    } else {
      throw match.error;
    }
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
    if (pendingMinMs && !match.minPendingPromise) {
      match.minPendingPromise = utils.createControlledPromise();
      if (!router.isServer) {
        Promise.resolve().then(() => {
          router.__store.setState((s) => ({
            ...s,
            matches: s.matches.map(
              (d) => d.id === match.id ? { ...d, minPendingPromise: utils.createControlledPromise() } : d
            )
          }));
        });
        setTimeout(() => {
          router.__store.setState((s) => {
            return {
              ...s,
              matches: s.matches.map(
                (d) => {
                  var _a2;
                  return d.id === match.id ? {
                    ...d,
                    minPendingPromise: ((_a2 = d.minPendingPromise) == null ? void 0 : _a2.resolve(), void 0)
                  } : d;
                }
              )
            };
          });
        }, pendingMinMs);
      }
    }
    throw match.loadPromise;
  }
  if (match.status === "success") {
    const Comp = route.options.component ?? router.options.defaultComponent;
    if (Comp) {
      return /* @__PURE__ */ jsxRuntime.jsx(Comp, {});
    }
    return /* @__PURE__ */ jsxRuntime.jsx(Outlet, {});
  }
  invariant(
    false,
    "Idle routeMatch status encountered during rendering! You should never see this. File an issue!"
  );
}
const Outlet = React__namespace.memo(function Outlet2() {
  const router = useRouter.useRouter();
  const matchId = React__namespace.useContext(matchContext);
  const routeId = useRouterState.useRouterState({
    select: (s) => {
      var _a;
      return (_a = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a.routeId;
    }
  });
  const route = router.routesById[routeId];
  const { parentGlobalNotFound } = useRouterState.useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId);
      invariant(
        parentMatch,
        `Could not find parent match for matchId "${matchId}"`
      );
      return {
        parentGlobalNotFound: parentMatch.globalNotFound
      };
    }
  });
  const childMatchId = useRouterState.useRouterState({
    select: (s) => {
      var _a;
      const matches = s.matches;
      const index = matches.findIndex((d) => d.id === matchId);
      return (_a = matches[index + 1]) == null ? void 0 : _a.id;
    }
  });
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router, route, void 0);
  }
  if (!childMatchId) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntime.jsx(Match, { matchId: childMatchId });
});
function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsxRuntime.jsx(router.options.defaultNotFoundComponent, { data });
    }
    if (process.env.NODE_ENV === "development") {
      console.warn(
        route.options.notFoundComponent,
        `A notFoundError was encountered on the route with ID "${route.id}", but a notFoundComponent option was not configured, nor was a router level defaultNotFoundComponent configured. Consider configuring at least one of these to avoid TanStack Router's overly generic defaultNotFoundComponent (<div>Not Found<div>)`
      );
    }
    return /* @__PURE__ */ jsxRuntime.jsx(notFound.DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsx(route.options.notFoundComponent, { data });
}
function useMatchRoute() {
  const router = useRouter.useRouter();
  return React__namespace.useCallback(
    (opts) => {
      const { pending, caseSensitive, fuzzy, includeSearch, ...rest } = opts;
      return router.matchRoute(rest, {
        pending,
        caseSensitive,
        fuzzy,
        includeSearch
      });
    },
    [router]
  );
}
function MatchRoute(props) {
  const matchRoute = useMatchRoute();
  const params = matchRoute(props);
  if (typeof props.children === "function") {
    return props.children(params);
  }
  return params ? props.children : null;
}
function useMatch(opts) {
  const nearestMatchId = React__namespace.useContext(matchContext);
  const matchSelection = useRouterState.useRouterState({
    select: (state) => {
      const match = state.matches.find(
        (d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId
      );
      invariant(
        match,
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`
      );
      return opts.select ? opts.select(match) : match;
    }
  });
  return matchSelection;
}
function useMatches(opts) {
  return useRouterState.useRouterState({
    select: (state) => {
      const matches = state.matches;
      return (opts == null ? void 0 : opts.select) ? opts.select(matches) : matches;
    }
  });
}
function useParentMatches(opts) {
  const contextMatchId = React__namespace.useContext(matchContext);
  return useMatches({
    select: (matches) => {
      matches = matches.slice(
        0,
        matches.findIndex((d) => d.id === contextMatchId)
      );
      return (opts == null ? void 0 : opts.select) ? opts.select(matches) : matches;
    }
  });
}
function useChildMatches(opts) {
  const contextMatchId = React__namespace.useContext(matchContext);
  return useMatches({
    select: (matches) => {
      matches = matches.slice(
        matches.findIndex((d) => d.id === contextMatchId) + 1
      );
      return (opts == null ? void 0 : opts.select) ? opts.select(matches) : matches;
    }
  });
}
function useLoaderDeps(opts) {
  return useMatch({
    ...opts,
    select: (s) => {
      return typeof opts.select === "function" ? opts.select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useLoaderData(opts) {
  return useMatch({
    ...opts,
    select: (s) => {
      return typeof opts.select === "function" ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function isServerSideError(error) {
  if (!(typeof error === "object" && error && "data" in error))
    return false;
  if (!("__isServerError" in error && error.__isServerError))
    return false;
  if (!(typeof error.data === "object" && error.data))
    return false;
  return error.__isServerError === true;
}
function defaultDeserializeError(serializedData) {
  if ("name" in serializedData && "message" in serializedData) {
    const error = new Error(serializedData.message);
    error.name = serializedData.name;
    if (process.env.NODE_ENV === "development") {
      error.stack = serializedData.stack;
    }
    return error;
  }
  return serializedData.data;
}
exports.Match = Match;
exports.MatchRoute = MatchRoute;
exports.Matches = Matches;
exports.Outlet = Outlet;
exports.defaultDeserializeError = defaultDeserializeError;
exports.isServerSideError = isServerSideError;
exports.matchContext = matchContext;
exports.useChildMatches = useChildMatches;
exports.useLoaderData = useLoaderData;
exports.useLoaderDeps = useLoaderDeps;
exports.useMatch = useMatch;
exports.useMatchRoute = useMatchRoute;
exports.useMatches = useMatches;
exports.useParentMatches = useParentMatches;
//# sourceMappingURL=Matches.cjs.map
