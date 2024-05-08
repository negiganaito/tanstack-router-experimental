import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Matches } from "./Matches.js";
import { pick, useLayoutEffect } from "./utils.js";
import { useRouter } from "./useRouter.js";
import { useRouterState } from "./useRouterState.js";
import { getRouterContext } from "./routerContext.js";
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
  const routerContext = getRouterContext();
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsx(router.options.defaultPendingComponent, {}) : null;
  const provider = /* @__PURE__ */ jsx(React.Suspense, { fallback: pendingElement, children: /* @__PURE__ */ jsxs(routerContext.Provider, { value: router, children: [
    children,
    /* @__PURE__ */ jsx(Transitioner, {})
  ] }) });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsx(RouterContextProvider, { router, ...rest, children: /* @__PURE__ */ jsx(Matches, {}) });
}
function Transitioner() {
  const router = useRouter();
  const mountLoadForRouter = React.useRef({ router, mounted: false });
  const routerState = useRouterState({
    select: (s) => pick(s, ["isLoading", "location", "resolvedLocation", "isTransitioning"])
  });
  const [isTransitioning, startReactTransition_] = React.useTransition();
  const hasPendingMatches = useRouterState({
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
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
    if (window.__TSR_DEHYDRATED__ || mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    tryLoad();
  }, [router]);
  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
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
  const ref = React.useRef(value);
  if (ref.current !== value) {
    const prevValue = ref.current;
    ref.current = value;
    return prevValue;
  } else {
    return ref.current;
  }
}
export {
  RouterContextProvider,
  RouterProvider,
  getRouteMatch
};
//# sourceMappingURL=RouterProvider.js.map
