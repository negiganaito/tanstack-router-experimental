import { createBrowserHistory, createMemoryHistory } from "@tanstack/history";
import { Store } from "@tanstack/react-store";
import invariant from "tiny-invariant";
import { rootRouteId } from "./route.js";
import { defaultStringifySearch, defaultParseSearch } from "./searchParams.js";
import { createControlledPromise, replaceEqualDeep, pick, last, deepEqual, escapeJSON, removeLayoutSegments, functionalUpdate } from "./utils.js";
import { getRouteMatch } from "./RouterProvider.js";
import { trimPath, trimPathLeft, parsePathname, resolvePath, cleanPath, matchPathname, trimPathRight, interpolatePath, joinPaths } from "./path.js";
import { isResolvedRedirect, isRedirect } from "./redirects.js";
import { isNotFound } from "./not-found.js";
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function createRouter(options) {
  return new Router(options);
}
class Router {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(
      Math.random() * 1e7
    )}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.latestLoadPromise = Promise.resolve();
    this.subscribers = /* @__PURE__ */ new Set();
    this.injectedHtml = [];
    this.isServer = typeof document === "undefined";
    this.startReactTransition = (fn) => fn();
    this.update = (newOptions) => {
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/guide/not-found-errors#migrating-from-notfoundroute for more info."
        );
      }
      const previousOptions = this.options;
      this.options = {
        ...this.options,
        ...newOptions
      };
      if (!this.basepath || newOptions.basepath && newOptions.basepath !== previousOptions.basepath) {
        if (newOptions.basepath === void 0 || newOptions.basepath === "" || newOptions.basepath === "/") {
          this.basepath = "/";
        } else {
          this.basepath = `/${trimPath(newOptions.basepath)}`;
        }
      }
      if (!this.history || this.options.history && this.options.history !== this.history) {
        this.history = this.options.history ?? (typeof document !== "undefined" ? createBrowserHistory() : createMemoryHistory({
          initialEntries: [this.options.basepath || "/"]
        }));
        this.latestLocation = this.parseLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d) => !["redirected"].includes(d.status)
              )
            };
          }
        });
      }
    };
    this.buildRouteTree = () => {
      this.routesById = {};
      this.routesByPath = {};
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({ originalIndex: 99999999999 });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
      const recurseRoutes = (childRoutes) => {
        childRoutes.forEach((childRoute, i) => {
          childRoute.init({ originalIndex: i });
          const existingRoute = this.routesById[childRoute.id];
          invariant(
            !existingRoute,
            `Duplicate routes found with id: ${String(childRoute.id)}`
          );
          this.routesById[childRoute.id] = childRoute;
          if (!childRoute.isRoot && childRoute.path) {
            const trimmedFullPath = trimPathRight(childRoute.fullPath);
            if (!this.routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
              this.routesByPath[trimmedFullPath] = childRoute;
            }
          }
          const children = childRoute.children;
          if (children == null ? void 0 : children.length) {
            recurseRoutes(children);
          }
        });
      };
      recurseRoutes([this.routeTree]);
      const scoredRoutes = [];
      const routes = Object.values(this.routesById);
      routes.forEach((d, i) => {
        var _a;
        if (d.isRoot || !d.path) {
          return;
        }
        const trimmed = trimPathLeft(d.fullPath);
        const parsed = parsePathname(trimmed);
        while (parsed.length > 1 && ((_a = parsed[0]) == null ? void 0 : _a.value) === "/") {
          parsed.shift();
        }
        const scores = parsed.map((segment) => {
          if (segment.value === "/") {
            return 0.75;
          }
          if (segment.type === "param") {
            return 0.5;
          }
          if (segment.type === "wildcard") {
            return 0.25;
          }
          return 1;
        });
        scoredRoutes.push({ child: d, trimmed, parsed, index: i, scores });
      });
      this.flatRoutes = scoredRoutes.sort((a, b) => {
        const minLength = Math.min(a.scores.length, b.scores.length);
        for (let i = 0; i < minLength; i++) {
          if (a.scores[i] !== b.scores[i]) {
            return b.scores[i] - a.scores[i];
          }
        }
        if (a.scores.length !== b.scores.length) {
          return b.scores.length - a.scores.length;
        }
        for (let i = 0; i < minLength; i++) {
          if (a.parsed[i].value !== b.parsed[i].value) {
            return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
          }
        }
        return a.index - b.index;
      }).map((d, i) => {
        d.child.rank = i;
        return d.child;
      });
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.checkLatest = (promise) => {
      if (this.latestLoadPromise !== promise) {
        throw this.latestLoadPromise;
      }
    };
    this.parseLocation = (previousLocation) => {
      const parse = ({
        pathname,
        search,
        hash,
        state
      }) => {
        const parsedSearch = this.options.parseSearch(search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        return {
          pathname,
          searchStr,
          search: replaceEqualDeep(previousLocation == null ? void 0 : previousLocation.search, parsedSearch),
          hash: hash.split("#").reverse()[0] ?? "",
          href: `${pathname}${searchStr}${hash}`,
          state: replaceEqualDeep(previousLocation == null ? void 0 : previousLocation.state, state)
        };
      };
      const location = parse(this.history.location);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        basepath: this.basepath,
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash
      });
      return resolvedPath;
    };
    this.matchRoutes = (pathname, locationSearch, opts) => {
      let routeParams = {};
      const foundRoute = this.flatRoutes.find((route) => {
        const matchedParams = matchPathname(
          this.basepath,
          trimPathRight(pathname),
          {
            to: route.fullPath,
            caseSensitive: route.options.caseSensitive ?? this.options.caseSensitive,
            fuzzy: true
          }
        );
        if (matchedParams) {
          routeParams = matchedParams;
          return true;
        }
        return false;
      });
      let routeCursor = foundRoute || this.routesById[rootRouteId];
      const matchedRoutes = [routeCursor];
      let isGlobalNotFound = false;
      if (
        // If we found a route, and it's not an index route and we have left over path
        foundRoute ? foundRoute.path !== "/" && routeParams["**"] : (
          // Or if we didn't find a route and we have left over path
          trimPathRight(pathname)
        )
      ) {
        if (this.options.notFoundRoute) {
          matchedRoutes.push(this.options.notFoundRoute);
        } else {
          isGlobalNotFound = true;
        }
      }
      while (routeCursor.parentRoute) {
        routeCursor = routeCursor.parentRoute;
        matchedRoutes.unshift(routeCursor);
      }
      const globalNotFoundRouteId = (() => {
        if (!isGlobalNotFound) {
          return void 0;
        }
        if (this.options.notFoundMode !== "root") {
          for (let i = matchedRoutes.length - 1; i >= 0; i--) {
            const route = matchedRoutes[i];
            if (route.children) {
              return route.id;
            }
          }
        }
        return rootRouteId;
      })();
      const parseErrors = matchedRoutes.map((route) => {
        let parsedParamsError;
        if (route.options.parseParams) {
          try {
            const parsedParams = route.options.parseParams(routeParams);
            Object.assign(routeParams, parsedParams);
          } catch (err) {
            parsedParamsError = new PathParamError(err.message, {
              cause: err
            });
            if (opts == null ? void 0 : opts.throwOnError) {
              throw parsedParamsError;
            }
            return parsedParamsError;
          }
        }
        return;
      });
      const matches = [];
      matchedRoutes.forEach((route, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const parentMatch = matches[index - 1];
        const [preMatchSearch, searchError] = (() => {
          const parentSearch = (parentMatch == null ? void 0 : parentMatch.search) ?? locationSearch;
          try {
            const validator = typeof route.options.validateSearch === "object" ? route.options.validateSearch.parse : route.options.validateSearch;
            const search = (validator == null ? void 0 : validator(parentSearch)) ?? {};
            return [
              {
                ...parentSearch,
                ...search
              },
              void 0
            ];
          } catch (err) {
            const searchParamError = new SearchParamError(err.message, {
              cause: err
            });
            if (opts == null ? void 0 : opts.throwOnError) {
              throw searchParamError;
            }
            return [parentSearch, searchParamError];
          }
        })();
        const loaderDeps = ((_b = (_a = route.options).loaderDeps) == null ? void 0 : _b.call(_a, {
          search: preMatchSearch
        })) ?? "";
        const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
        const interpolatedPath = interpolatePath({
          path: route.fullPath,
          params: routeParams
        });
        const matchId = interpolatePath({
          path: route.id,
          params: routeParams,
          leaveWildcards: true
        }) + loaderDepsHash;
        const existingMatch = getRouteMatch(this.state, matchId);
        const cause = this.state.matches.find((d) => d.id === matchId) ? "stay" : "enter";
        let match;
        if (existingMatch) {
          match = {
            ...existingMatch,
            cause,
            params: routeParams
          };
        } else {
          const status = route.options.loader || route.options.beforeLoad ? "pending" : "success";
          const loadPromise = createControlledPromise();
          if (status === "success") {
            loadPromise.resolve();
          }
          match = {
            id: matchId,
            routeId: route.id,
            params: routeParams,
            pathname: joinPaths([this.basepath, interpolatedPath]),
            updatedAt: Date.now(),
            search: {},
            searchError: void 0,
            status: "pending",
            isFetching: false,
            error: void 0,
            paramsError: parseErrors[index],
            loaderPromise: Promise.resolve(),
            loadPromise,
            routeContext: void 0,
            context: void 0,
            abortController: new AbortController(),
            fetchCount: 0,
            cause,
            loaderDeps,
            invalid: false,
            preload: false,
            links: (_d = (_c = route.options).links) == null ? void 0 : _d.call(_c),
            scripts: (_f = (_e = route.options).scripts) == null ? void 0 : _f.call(_e),
            staticData: route.options.staticData || {}
          };
        }
        if (match.status === "success") {
          match.meta = (_h = (_g = route.options).meta) == null ? void 0 : _h.call(_g, {
            matches,
            params: match.params,
            loaderData: match.loaderData
          });
          match.headers = (_j = (_i = route.options).headers) == null ? void 0 : _j.call(_i, {
            loaderData: match.loaderData
          });
        }
        if (!(opts == null ? void 0 : opts.preload)) {
          match.globalNotFound = globalNotFoundRouteId === route.id;
        }
        match.search = replaceEqualDeep(match.search, preMatchSearch);
        match.searchError = searchError;
        matches.push(match);
      });
      return matches;
    };
    this.cancelMatch = (id) => {
      var _a;
      (_a = getRouteMatch(this.state, id)) == null ? void 0 : _a.abortController.abort();
    };
    this.cancelMatches = () => {
      var _a;
      (_a = this.state.pendingMatches) == null ? void 0 : _a.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}, matches) => {
        var _a, _b, _c;
        let fromPath = this.latestLocation.pathname;
        let fromSearch = dest.fromSearch || this.latestLocation.search;
        const fromMatches = this.matchRoutes(
          this.latestLocation.pathname,
          fromSearch
        );
        fromPath = ((_a = fromMatches.find((d) => d.id === dest.from)) == null ? void 0 : _a.pathname) || fromPath;
        fromSearch = ((_b = last(fromMatches)) == null ? void 0 : _b.search) || this.latestLocation.search;
        const stayingMatches = matches == null ? void 0 : matches.filter(
          (d) => fromMatches.find((e) => e.routeId === d.routeId)
        );
        const fromRouteByFromPath = stayingMatches == null ? void 0 : stayingMatches.find(
          (d) => d.pathname === fromPath
        );
        let pathname = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : this.resolvePathWithBase(
          fromPath,
          fromRouteByFromPath ? removeLayoutSegments(fromRouteByFromPath.routeId) : fromPath
        );
        const prevParams = { ...(_c = last(fromMatches)) == null ? void 0 : _c.params };
        let nextParams = (dest.params ?? true) === true ? prevParams : { ...prevParams, ...functionalUpdate(dest.params, prevParams) };
        if (Object.keys(nextParams).length > 0) {
          matches == null ? void 0 : matches.map((d) => this.looseRoutesById[d.routeId].options.stringifyParams).filter(Boolean).forEach((fn) => {
            nextParams = { ...nextParams, ...fn(nextParams) };
          });
        }
        Object.keys(nextParams).forEach((key) => {
          if (["*", "_splat"].includes(key)) {
            nextParams[key] = encodeURI(nextParams[key]);
          } else {
            nextParams[key] = encodeURIComponent(nextParams[key]);
          }
        });
        pathname = interpolatePath({
          path: pathname,
          params: nextParams ?? {},
          leaveWildcards: false,
          leaveParams: opts.leaveParams
        });
        const preSearchFilters = (stayingMatches == null ? void 0 : stayingMatches.map(
          (match) => this.looseRoutesById[match.routeId].options.preSearchFilters ?? []
        ).flat().filter(Boolean)) ?? [];
        const postSearchFilters = (stayingMatches == null ? void 0 : stayingMatches.map(
          (match) => this.looseRoutesById[match.routeId].options.postSearchFilters ?? []
        ).flat().filter(Boolean)) ?? [];
        const preFilteredSearch = preSearchFilters.length ? preSearchFilters.reduce((prev, next) => next(prev), fromSearch) : fromSearch;
        const destSearch = dest.search === true ? preFilteredSearch : dest.search ? functionalUpdate(dest.search, preFilteredSearch) : preSearchFilters.length ? preFilteredSearch : {};
        const postFilteredSearch = postSearchFilters.length ? postSearchFilters.reduce((prev, next) => next(prev), destSearch) : destSearch;
        const search = replaceEqualDeep(fromSearch, postFilteredSearch);
        const searchStr = this.options.stringifySearch(search);
        const hash = dest.hash === true ? this.latestLocation.hash : dest.hash ? functionalUpdate(dest.hash, this.latestLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? this.latestLocation.state : dest.state ? functionalUpdate(dest.state, this.latestLocation.state) : {};
        nextState = replaceEqualDeep(this.latestLocation.state, nextState);
        return {
          pathname,
          search,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          href: `${pathname}${searchStr}${hashStr}`,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        var _a;
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          let params = {};
          const foundMask = (_a = this.options.routeMasks) == null ? void 0 : _a.find((d) => {
            const match = matchPathname(this.basepath, next.pathname, {
              to: d.from,
              caseSensitive: false,
              fuzzy: false
            });
            if (match) {
              params = match;
              return true;
            }
            return false;
          });
          if (foundMask) {
            maskedDest = {
              ...pick(opts, ["from"]),
              ...foundMask,
              params
            };
            maskedNext = build(maskedDest);
          }
        }
        const nextMatches = this.matchRoutes(next.pathname, next.search);
        const maskedMatches = maskedNext ? this.matchRoutes(maskedNext.pathname, maskedNext.search) : void 0;
        const maskedFinal = maskedNext ? build(maskedDest, maskedMatches) : void 0;
        const final = build(dest, nextMatches);
        if (maskedFinal) {
          final.maskedLocation = maskedFinal;
        }
        return final;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          ...pick(opts, ["from"]),
          ...opts.mask
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({
      startTransition,
      viewTransition,
      ...next
    }) => {
      const isSameState = () => {
        next.state.key = this.latestLocation.state.key;
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        delete next.state.key;
        return isEqual;
      };
      const isSameUrl = this.latestLocation.href === next.href;
      if (isSameUrl && isSameState()) {
        this.load();
      } else {
        let { maskedLocation, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
            nextHistory.state.__tempKey = this.tempLocationKey;
          }
        }
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](
          nextHistory.href,
          nextHistory.state
        );
      }
      this.resetNextScroll = next.resetScroll ?? true;
      return this.latestLoadPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      startTransition,
      viewTransition,
      ...rest
    } = {}) => {
      const location = this.buildLocation(rest);
      return this.commitLocation({
        ...location,
        startTransition,
        viewTransition,
        replace,
        resetScroll
      });
    };
    this.navigate = ({ from, to, ...rest }) => {
      const toString = String(to);
      let isExternal;
      try {
        new URL(`${toString}`);
        isExternal = true;
      } catch (e) {
      }
      invariant(
        !isExternal,
        "Attempting to navigate to external url with this.navigate!"
      );
      return this.buildAndCommitLocation({
        ...rest,
        from,
        to
        // to: toString,
      });
    };
    this.load = async () => {
      this.latestLocation = this.parseLocation(this.latestLocation);
      if (this.state.location === this.latestLocation) {
        return;
      }
      const promise = createControlledPromise();
      this.latestLoadPromise = promise;
      let redirect;
      let notFound;
      this.startReactTransition(async () => {
        try {
          const next = this.latestLocation;
          const prevLocation = this.state.resolvedLocation;
          const pathDidChange = prevLocation.href !== next.href;
          this.cancelMatches();
          this.emit({
            type: "onBeforeLoad",
            fromLocation: prevLocation,
            toLocation: next,
            pathChanged: pathDidChange
          });
          let pendingMatches;
          this.__store.batch(() => {
            this.cleanCache();
            pendingMatches = this.matchRoutes(next.pathname, next.search);
            this.__store.setState((s) => ({
              ...s,
              status: "pending",
              isLoading: true,
              location: next,
              pendingMatches,
              // If a cached moved to pendingMatches, remove it from cachedMatches
              cachedMatches: s.cachedMatches.filter((d) => {
                return !pendingMatches.find((e) => e.id === d.id);
              })
            }));
          });
          await this.loadMatches({
            matches: pendingMatches,
            location: next,
            checkLatest: () => this.checkLatest(promise),
            onReady: async () => {
              await this.startViewTransition(async () => {
                let exitingMatches;
                let enteringMatches;
                let stayingMatches;
                this.__store.batch(() => {
                  this.__store.setState((s) => {
                    const previousMatches = s.matches;
                    const newMatches = s.pendingMatches || s.matches;
                    exitingMatches = previousMatches.filter(
                      (match) => !newMatches.find((d) => d.id === match.id)
                    );
                    enteringMatches = newMatches.filter(
                      (match) => !previousMatches.find((d) => d.id === match.id)
                    );
                    stayingMatches = previousMatches.filter(
                      (match) => newMatches.find((d) => d.id === match.id)
                    );
                    return {
                      ...s,
                      isLoading: false,
                      matches: newMatches,
                      pendingMatches: void 0,
                      cachedMatches: [
                        ...s.cachedMatches,
                        ...exitingMatches.filter((d) => d.status !== "error")
                      ]
                    };
                  });
                  this.cleanCache();
                });
                [
                  [exitingMatches, "onLeave"],
                  [enteringMatches, "onEnter"],
                  [stayingMatches, "onStay"]
                ].forEach(([matches, hook]) => {
                  matches.forEach((match) => {
                    var _a, _b;
                    (_b = (_a = this.looseRoutesById[match.routeId].options)[hook]) == null ? void 0 : _b.call(_a, match);
                  });
                });
              });
            }
          });
        } catch (err) {
          if (isResolvedRedirect(err)) {
            redirect = err;
            if (!this.isServer) {
              this.navigate({ ...err, replace: true });
              this.load();
            }
          } else if (isNotFound(err)) {
            notFound = err;
          }
          this.__store.setState((s) => ({
            ...s,
            statusCode: (redirect == null ? void 0 : redirect.statusCode) || notFound ? 404 : s.matches.some((d) => d.status === "error") ? 500 : 200,
            redirect
          }));
        }
        promise.resolve();
      });
      return this.latestLoadPromise;
    };
    this.startViewTransition = async (fn) => {
      var _a, _b;
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      ((_b = (_a = shouldViewTransition && typeof document !== "undefined" ? document : void 0) == null ? void 0 : _a.startViewTransition) == null ? void 0 : _b.call(_a, fn)) || fn();
    };
    this.loadMatches = async ({
      checkLatest,
      location,
      matches,
      preload,
      onReady
    }) => {
      let firstBadMatchIndex;
      let rendered = false;
      const triggerOnReady = async () => {
        if (!rendered) {
          rendered = true;
          await (onReady == null ? void 0 : onReady());
        }
      };
      if (!this.isServer && !this.state.matches.length) {
        triggerOnReady();
      }
      const updateMatch = (id, updater, opts) => {
        var _a;
        let updated;
        const isPending = (_a = this.state.pendingMatches) == null ? void 0 : _a.find((d) => d.id === id);
        const isMatched = this.state.matches.find((d) => d.id === id);
        const matchesKey = isPending ? "pendingMatches" : isMatched ? "matches" : "cachedMatches";
        this.__store.setState((s) => {
          var _a2, _b;
          return {
            ...s,
            [matchesKey]: (opts == null ? void 0 : opts.remove) ? (_a2 = s[matchesKey]) == null ? void 0 : _a2.filter((d) => d.id !== id) : (_b = s[matchesKey]) == null ? void 0 : _b.map(
              (d) => d.id === id ? updated = updater(d) : d
            )
          };
        });
        return updated;
      };
      const handleRedirectAndNotFound = (match, err) => {
        if (isResolvedRedirect(err))
          throw err;
        if (isRedirect(err) || isNotFound(err)) {
          updateMatch(match.id, (prev) => ({
            ...prev,
            status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : "error",
            isFetching: false,
            error: err
          }));
          rendered = true;
          if (!err.routeId) {
            err.routeId = match.routeId;
          }
          if (isRedirect(err)) {
            err = this.resolveRedirect(err);
            throw err;
          } else if (isNotFound(err)) {
            this.handleNotFound(matches, err);
            throw err;
          }
        }
      };
      try {
        await new Promise((resolveAll, rejectAll) => {
          ;
          (async () => {
            var _a, _b;
            try {
              for (let [index, match] of matches.entries()) {
                const parentMatch = matches[index - 1];
                const route = this.looseRoutesById[match.routeId];
                const abortController = new AbortController();
                let loadPromise = match.loadPromise;
                const pendingMs = route.options.pendingMs ?? this.options.defaultPendingMs;
                const shouldPending = !!(onReady && !this.isServer && !preload && (route.options.loader || route.options.beforeLoad) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? this.options.defaultPendingComponent));
                if (shouldPending) {
                  setTimeout(() => {
                    try {
                      checkLatest();
                      triggerOnReady();
                    } catch {
                    }
                  }, pendingMs);
                }
                if (match.isFetching) {
                  continue;
                }
                const previousResolve = loadPromise.resolve;
                loadPromise = createControlledPromise(
                  // Resolve the old when we we resolve the new one
                  previousResolve
                );
                matches[index] = match = updateMatch(match.id, (prev) => ({
                  ...prev,
                  isFetching: "beforeLoad",
                  loadPromise
                }));
                const handleSerialError = (err, routerCode) => {
                  var _a2, _b2;
                  err.routerCode = routerCode;
                  firstBadMatchIndex = firstBadMatchIndex ?? index;
                  handleRedirectAndNotFound(match, err);
                  try {
                    (_b2 = (_a2 = route.options).onError) == null ? void 0 : _b2.call(_a2, err);
                  } catch (errorHandlerErr) {
                    err = errorHandlerErr;
                    handleRedirectAndNotFound(match, err);
                  }
                  matches[index] = match = {
                    ...match,
                    error: err,
                    status: "error",
                    updatedAt: Date.now(),
                    abortController: new AbortController()
                  };
                };
                if (match.paramsError) {
                  handleSerialError(match.paramsError, "PARSE_PARAMS");
                }
                if (match.searchError) {
                  handleSerialError(match.searchError, "VALIDATE_SEARCH");
                }
                try {
                  const parentContext = (parentMatch == null ? void 0 : parentMatch.context) ?? this.options.context ?? {};
                  const beforeLoadContext = await ((_b = (_a = route.options).beforeLoad) == null ? void 0 : _b.call(_a, {
                    search: match.search,
                    abortController,
                    params: match.params,
                    preload: !!preload,
                    context: parentContext,
                    location,
                    navigate: (opts) => this.navigate({ ...opts, from: match.pathname }),
                    buildLocation: this.buildLocation,
                    cause: preload ? "preload" : match.cause
                  })) ?? {};
                  checkLatest();
                  if (isRedirect(beforeLoadContext) || isNotFound(beforeLoadContext)) {
                    handleSerialError(beforeLoadContext, "BEFORE_LOAD");
                  }
                  const context = {
                    ...parentContext,
                    ...beforeLoadContext
                  };
                  matches[index] = match = {
                    ...match,
                    routeContext: replaceEqualDeep(
                      match.routeContext,
                      beforeLoadContext
                    ),
                    context: replaceEqualDeep(match.context, context),
                    abortController
                  };
                } catch (err) {
                  handleSerialError(err, "BEFORE_LOAD");
                  break;
                } finally {
                  updateMatch(match.id, () => match);
                }
              }
              checkLatest();
              const validResolvedMatches = matches.slice(0, firstBadMatchIndex);
              const matchPromises = [];
              validResolvedMatches.forEach((match, index) => {
                const createValidateResolvedMatchPromise = async () => {
                  const parentMatchPromise = matchPromises[index - 1];
                  const route = this.looseRoutesById[match.routeId];
                  const loaderContext = {
                    params: match.params,
                    deps: match.loaderDeps,
                    preload: !!preload,
                    parentMatchPromise,
                    abortController: match.abortController,
                    context: match.context,
                    location,
                    navigate: (opts) => this.navigate({ ...opts, from: match.pathname }),
                    cause: preload ? "preload" : match.cause,
                    route
                  };
                  const fetch = async () => {
                    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
                    const existing = getRouteMatch(this.state, match.id);
                    let lazyPromise = Promise.resolve();
                    let componentsPromise = Promise.resolve();
                    let loaderPromise = existing.loaderPromise;
                    const potentialPendingMinPromise = async () => {
                      const latestMatch = getRouteMatch(this.state, match.id);
                      if (latestMatch == null ? void 0 : latestMatch.minPendingPromise) {
                        await latestMatch.minPendingPromise;
                        checkLatest();
                        updateMatch(latestMatch.id, (prev) => ({
                          ...prev,
                          minPendingPromise: void 0
                        }));
                      }
                    };
                    try {
                      if (match.isFetching === "beforeLoad") {
                        matches[index] = match = updateMatch(
                          match.id,
                          (prev) => ({
                            ...prev,
                            isFetching: "loader",
                            fetchCount: match.fetchCount + 1
                          })
                        );
                        lazyPromise = ((_a2 = route.lazyFn) == null ? void 0 : _a2.call(route).then((lazyRoute) => {
                          Object.assign(route.options, lazyRoute.options);
                        })) || Promise.resolve();
                        componentsPromise = lazyPromise.then(
                          () => Promise.all(
                            componentTypes.map(async (type) => {
                              const component = route.options[type];
                              if (component == null ? void 0 : component.preload) {
                                await component.preload();
                              }
                            })
                          )
                        );
                        await lazyPromise;
                        checkLatest();
                        loaderPromise = (_c = (_b2 = route.options).loader) == null ? void 0 : _c.call(_b2, loaderContext);
                        matches[index] = match = updateMatch(
                          match.id,
                          (prev) => ({
                            ...prev,
                            loaderPromise
                          })
                        );
                      }
                      const loaderData = await loaderPromise;
                      checkLatest();
                      handleRedirectAndNotFound(match, loaderData);
                      await potentialPendingMinPromise();
                      checkLatest();
                      const meta = (_e = (_d = route.options).meta) == null ? void 0 : _e.call(_d, {
                        matches,
                        params: match.params,
                        loaderData
                      });
                      const headers = (_g = (_f = route.options).headers) == null ? void 0 : _g.call(_f, {
                        loaderData
                      });
                      matches[index] = match = updateMatch(match.id, (prev) => ({
                        ...prev,
                        error: void 0,
                        status: "success",
                        isFetching: false,
                        updatedAt: Date.now(),
                        loaderData,
                        meta,
                        headers
                      }));
                    } catch (e) {
                      checkLatest();
                      let error = e;
                      await potentialPendingMinPromise();
                      checkLatest();
                      handleRedirectAndNotFound(match, e);
                      try {
                        (_i = (_h = route.options).onError) == null ? void 0 : _i.call(_h, e);
                      } catch (onErrorError) {
                        error = onErrorError;
                        handleRedirectAndNotFound(match, onErrorError);
                      }
                      matches[index] = match = updateMatch(match.id, (prev) => ({
                        ...prev,
                        error,
                        status: "error",
                        isFetching: false
                      }));
                    }
                    await componentsPromise;
                    checkLatest();
                    match.loadPromise.resolve();
                  };
                  const age = Date.now() - match.updatedAt;
                  const staleAge = preload ? route.options.preloadStaleTime ?? this.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? this.options.defaultStaleTime ?? 0;
                  const shouldReloadOption = route.options.shouldReload;
                  const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(loaderContext) : shouldReloadOption;
                  matches[index] = match = {
                    ...match,
                    preload: !!preload && !this.state.matches.find((d) => d.id === match.id)
                  };
                  const fetchWithRedirectAndNotFound = async () => {
                    try {
                      await fetch();
                    } catch (err) {
                      checkLatest();
                      handleRedirectAndNotFound(match, err);
                    }
                  };
                  if (match.status === "success" && (match.invalid || (shouldReload ?? age > staleAge))) {
                    fetchWithRedirectAndNotFound();
                    return;
                  }
                  if (match.status !== "success") {
                    await fetchWithRedirectAndNotFound();
                  }
                  return;
                };
                matchPromises.push(createValidateResolvedMatchPromise());
              });
              await Promise.all(matchPromises);
              checkLatest();
              resolveAll();
            } catch (err) {
              rejectAll(err);
            }
          })();
        });
        await triggerOnReady();
      } catch (err) {
        if (isRedirect(err) || isNotFound(err)) {
          throw err;
        }
      }
      return matches;
    };
    this.invalidate = () => {
      const invalidate = (d) => ({
        ...d,
        invalid: true,
        ...d.status === "error" ? { status: "pending" } : {}
      });
      this.__store.setState((s) => {
        var _a;
        return {
          ...s,
          matches: s.matches.map(invalidate),
          cachedMatches: s.cachedMatches.map(invalidate),
          pendingMatches: (_a = s.pendingMatches) == null ? void 0 : _a.map(invalidate)
        };
      });
      return this.load();
    };
    this.resolveRedirect = (err) => {
      const redirect = err;
      if (!redirect.href) {
        redirect.href = this.buildLocation(redirect).href;
      }
      return redirect;
    };
    this.cleanCache = () => {
      this.__store.setState((s) => {
        return {
          ...s,
          cachedMatches: s.cachedMatches.filter((d) => {
            const route = this.looseRoutesById[d.routeId];
            if (!route.options.loader) {
              return false;
            }
            const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3;
            return d.status !== "error" && Date.now() - d.updatedAt < gcTime;
          })
        };
      });
    };
    this.preloadRoute = async (opts) => {
      const next = this.buildLocation(opts);
      let matches = this.matchRoutes(next.pathname, next.search, {
        throwOnError: true,
        preload: true
      });
      const loadedMatchIds = Object.fromEntries(
        [
          ...this.state.matches,
          ...this.state.pendingMatches ?? [],
          ...this.state.cachedMatches
        ].map((d) => [d.id, true])
      );
      this.__store.batch(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds[match.id]) {
            this.__store.setState((s) => ({
              ...s,
              cachedMatches: [...s.cachedMatches, match]
            }));
          }
        });
      });
      const leafMatch = last(matches);
      const currentLeafMatch = last(this.state.matches);
      const pendingLeafMatch = last(this.state.pendingMatches ?? []);
      if (leafMatch && ((currentLeafMatch == null ? void 0 : currentLeafMatch.id) === leafMatch.id || (pendingLeafMatch == null ? void 0 : pendingLeafMatch.id) === leafMatch.id)) {
        return void 0;
      }
      try {
        matches = await this.loadMatches({
          matches,
          location: next,
          preload: true,
          checkLatest: () => void 0
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          return await this.preloadRoute({
            fromSearch: next.search,
            from: next.pathname,
            ...err
          });
        }
        console.error(err);
        return void 0;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if ((opts == null ? void 0 : opts.pending) && this.state.status !== "pending") {
        return false;
      }
      const baseLocation = (opts == null ? void 0 : opts.pending) ? this.latestLocation : this.state.resolvedLocation;
      const match = matchPathname(this.basepath, baseLocation.pathname, {
        ...opts,
        to: next.pathname
      });
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match, location.params, true)) {
          return false;
        }
      }
      if (match && ((opts == null ? void 0 : opts.includeSearch) ?? true)) {
        return deepEqual(baseLocation.search, next.search, true) ? match : false;
      }
      return match;
    };
    this.injectHtml = async (html) => {
      this.injectedHtml.push(html);
    };
    this.registeredDeferredsIds = /* @__PURE__ */ new Map();
    this.registeredDeferreds = /* @__PURE__ */ new WeakMap();
    this.getDeferred = (uid) => {
      const token = this.registeredDeferredsIds.get(uid);
      if (!token) {
        return void 0;
      }
      return this.registeredDeferreds.get(token);
    };
    this.dehydrateData = (key, getData) => {
      console.warn(
        false,
        `The dehydrateData method is deprecated. Please use the injectHtml method to inject your own data.`
      );
      if (typeof document === "undefined") {
        const strKey = typeof key === "string" ? key : JSON.stringify(key);
        this.injectHtml(async () => {
          const id = `__TSR_DEHYDRATED__${strKey}`;
          const data = typeof getData === "function" ? await getData() : getData;
          return `<script id='${id}' suppressHydrationWarning>
  window["__TSR_DEHYDRATED__${escapeJSON(
            strKey
          )}"] = ${JSON.stringify(this.options.transformer.stringify(data))}
<\/script>`;
        });
        return () => this.hydrateData(key);
      }
      return () => void 0;
    };
    this.hydrateData = (key) => {
      console.warn(
        false,
        `The hydrateData method is deprecated. Please use the extractHtml method to extract your own data.`
      );
      if (typeof document !== "undefined") {
        const strKey = typeof key === "string" ? key : JSON.stringify(key);
        return this.options.transformer.parse(
          window[`__TSR_DEHYDRATED__${strKey}`]
        );
      }
      return void 0;
    };
    this.dehydrate = () => {
      var _a;
      const pickError = ((_a = this.options.errorSerializer) == null ? void 0 : _a.serialize) ?? defaultSerializeError;
      return {
        state: {
          dehydratedMatches: this.state.matches.map((d) => ({
            ...pick(d, ["id", "status", "updatedAt", "loaderData"]),
            // If an error occurs server-side during SSRing,
            // send a small subset of the error to the client
            error: d.error ? {
              data: pickError(d.error),
              __isServerError: true
            } : void 0
          }))
        }
      };
    };
    this.hydrate = async (__do_not_use_server_ctx) => {
      var _a, _b, _c;
      let _ctx = __do_not_use_server_ctx;
      if (typeof document !== "undefined") {
        _ctx = (_a = window.__TSR_DEHYDRATED__) == null ? void 0 : _a.data;
      }
      invariant(
        _ctx,
        "Expected to find a __TSR_DEHYDRATED__ property on window... but we did not. Did you forget to render <DehydrateRouter /> in your app?"
      );
      const ctx = this.options.transformer.parse(_ctx);
      this.dehydratedData = ctx.payload;
      (_c = (_b = this.options).hydrate) == null ? void 0 : _c.call(_b, ctx.payload);
      const dehydratedState = ctx.router.state;
      const matches = this.matchRoutes(
        this.state.location.pathname,
        this.state.location.search
      ).map((match, i, allMatches) => {
        var _a2, _b2, _c2, _d, _e, _f;
        const dehydratedMatch = dehydratedState.dehydratedMatches.find(
          (d) => d.id === match.id
        );
        invariant(
          dehydratedMatch,
          `Could not find a client-side match for dehydrated match with id: ${match.id}!`
        );
        const route = this.looseRoutesById[match.routeId];
        const assets = dehydratedMatch.status === "notFound" || dehydratedMatch.status === "redirected" ? {} : {
          meta: (_b2 = (_a2 = route.options).meta) == null ? void 0 : _b2.call(_a2, {
            matches: allMatches,
            params: match.params,
            loaderData: dehydratedMatch.loaderData
          }),
          links: (_d = (_c2 = route.options).links) == null ? void 0 : _d.call(_c2),
          scripts: (_f = (_e = route.options).scripts) == null ? void 0 : _f.call(_e)
        };
        return {
          ...match,
          ...dehydratedMatch,
          ...assets
        };
      });
      this.__store.setState((s) => {
        return {
          ...s,
          matches
        };
      });
    };
    this.handleNotFound = (matches, err) => {
      const matchesByRouteId = Object.fromEntries(
        matches.map((match2) => [match2.routeId, match2])
      );
      let routeCursor = (err.global ? this.looseRoutesById[rootRouteId] : this.looseRoutesById[err.routeId]) || this.looseRoutesById[rootRouteId];
      while (!routeCursor.options.notFoundComponent && !this.options.defaultNotFoundComponent && routeCursor.id !== rootRouteId) {
        routeCursor = routeCursor.parentRoute;
        invariant(
          routeCursor,
          "Found invalid route tree while trying to find not-found handler."
        );
      }
      const match = matchesByRouteId[routeCursor.id];
      invariant(match, "Could not find match for route: " + routeCursor.id);
      Object.assign(match, {
        status: "notFound",
        error: err,
        isFetching: false
      });
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some(
        (d) => d.status === "notFound" || d.globalNotFound
      );
    };
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      transformer: options.transformer ?? JSON
    });
    if (typeof document !== "undefined") {
      window.__TSR__ROUTER__ = this;
    }
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  // resolveMatchPromise = (matchId: string, key: string, value: any) => {
  //   state.matches
  //     .find((d) => d.id === matchId)
  //     ?.__promisesByKey[key]?.resolve(value)
  // }
}
function lazyFn(fn, key) {
  return async (...args) => {
    const imported = await fn();
    return imported[key || "default"](...args);
  };
}
class SearchParamError extends Error {
}
class PathParamError extends Error {
}
function getInitialRouterState(location) {
  return {
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: { ...location },
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200
  };
}
function defaultSerializeError(err) {
  if (err instanceof Error) {
    const obj = {
      name: err.name,
      message: err.message
    };
    if (process.env.NODE_ENV === "development") {
      obj.stack = err.stack;
    }
    return obj;
  }
  return {
    data: err
  };
}
export {
  PathParamError,
  Router,
  SearchParamError,
  componentTypes,
  createRouter,
  defaultSerializeError,
  getInitialRouterState,
  lazyFn
};
//# sourceMappingURL=router.js.map
