"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const Matches = require("./Matches.cjs");
const utils = require("./utils.cjs");
const useRouter = require("./useRouter.cjs");
const useRouterState = require("./useRouterState.cjs");
const routerContext = require("./routerContext.cjs");
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
function RouterContextProvider({
  router,
  children,
  ...rest
}) {
  router.update({
    ...router.options,
    ...rest,
    context: {
      ...router.options.context,
      ...rest.context
    }
  });
  const routerContext$1 = routerContext.getRouterContext();
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsxRuntime.jsx(router.options.defaultPendingComponent, {}) : null;
  const provider = /* @__PURE__ */ jsxRuntime.jsx(React__namespace.Suspense, { fallback: pendingElement, children: /* @__PURE__ */ jsxRuntime.jsxs(routerContext$1.Provider, { value: router, children: [
    children,
    /* @__PURE__ */ jsxRuntime.jsx(Transitioner, {})
  ] }) });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsxRuntime.jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsxRuntime.jsx(RouterContextProvider, { router, ...rest, children: /* @__PURE__ */ jsxRuntime.jsx(Matches.Matches, {}) });
}
function Transitioner() {
  const router = useRouter.useRouter();
  const mountLoadForRouter = React__namespace.useRef({ router, mounted: false });
  const routerState = useRouterState.useRouterState({
    select: (s) => utils.pick(s, ["isLoading", "location", "resolvedLocation", "isTransitioning"])
  });
  const [isTransitioning, startReactTransition_] = React__namespace.useTransition();
  const hasPendingMatches = useRouterState.useRouterState({
    select: (s) => s.matches.some((d) => d.status === "pending")
  });
  const previousIsLoading = usePrevious(routerState.isLoading);
  const isAnyPending = routerState.isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious(isAnyPending);
  router.startReactTransition = startReactTransition_;
  const tryLoad = async () => {
    try {
      await router.load();
    } catch (err) {
      console.error(err);
    }
  };
  utils.useLayoutEffect(() => {
    const unsub = router.history.subscribe(router.load);
    const nextLocation = router.buildLocation({
      to: router.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true
    });
    if (routerState.location.href !== nextLocation.href) {
      router.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router, router.history]);
  utils.useLayoutEffect(() => {
    if (window.__TSR_DEHYDRATED__ || mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    tryLoad();
  }, [router]);
  utils.useLayoutEffect(() => {
    if (previousIsLoading && !routerState.isLoading) {
      const toLocation = router.state.location;
      const fromLocation = router.state.resolvedLocation;
      const pathChanged = fromLocation.href !== toLocation.href;
      router.emit({
        type: "onLoad",
        fromLocation,
        toLocation,
        pathChanged
      });
    }
  }, [previousIsLoading, router, routerState.isLoading]);
  utils.useLayoutEffect(() => {
    if (previousIsAnyPending && !isAnyPending) {
      const toLocation = router.state.location;
      const fromLocation = router.state.resolvedLocation;
      const pathChanged = fromLocation.href !== toLocation.href;
      router.emit({
        type: "onResolved",
        fromLocation,
        toLocation,
        pathChanged
      });
      router.__store.setState((s) => ({
        ...s,
        status: "idle",
        resolvedLocation: s.location
      }));
      if (document.querySelector) {
        if (router.state.location.hash !== "") {
          const el = document.getElementById(router.state.location.hash);
          if (el) {
            el.scrollIntoView();
          }
        }
      }
    }
  }, [isAnyPending, previousIsAnyPending, router]);
  return null;
}
function getRouteMatch(state, id) {
  return [
    ...state.cachedMatches,
    ...state.pendingMatches ?? [],
    ...state.matches
  ].find((d) => d.id === id);
}
function usePrevious(value) {
  const ref = React__namespace.useRef(value);
  if (ref.current !== value) {
    const prevValue = ref.current;
    ref.current = value;
    return prevValue;
  } else {
    return ref.current;
  }
}
exports.RouterContextProvider = RouterContextProvider;
exports.RouterProvider = RouterProvider;
exports.getRouteMatch = getRouteMatch;
//# sourceMappingURL=RouterProvider.cjs.map
