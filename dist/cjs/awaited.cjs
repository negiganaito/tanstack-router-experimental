"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useRouter = require("./useRouter.cjs");
const router = require("./router.cjs");
const defer = require("./defer.cjs");
const Matches = require("./Matches.cjs");
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
function useAwaited({ promise }) {
  var _a, _b;
  const router$1 = useRouter.useRouter();
  const state = promise.__deferredState;
  if (defer.isDehydratedDeferred(promise) && state.status === "pending") {
    const streamedData = window[`__TSR__DEFERRED__${state.uid}`];
    if (streamedData) {
      Object.assign(state, router$1.options.transformer.parse(streamedData));
    } else {
      let token = router$1.registeredDeferredsIds.get(state.uid);
      if (!token) {
        token = {};
        router$1.registeredDeferredsIds.set(state.uid, token);
        router$1.registeredDeferreds.set(token, state);
        Object.assign(state, {
          resolve: () => {
            var _a2;
            (_a2 = state.__resolvePromise) == null ? void 0 : _a2.call(state);
          },
          promise: new Promise((r) => {
            state.__resolvePromise = r;
          }),
          __resolvePromise: () => {
          }
        });
      }
    }
  }
  if (state.status === "pending") {
    throw defer.isDehydratedDeferred(promise) ? state.promise : promise;
  }
  if (!defer.isDehydratedDeferred(promise)) {
    router$1.injectHtml(
      `<script class='tsr_deferred_data'>window.__TSR__DEFERRED__${state.uid} = ${JSON.stringify(router$1.options.transformer.stringify(state))}
  if (window.__TSR__ROUTER__) {
    let deferred = window.__TSR__ROUTER__.getDeferred('${state.uid}');
    if (deferred) deferred.resolve(window.__TSR__DEFERRED__${state.uid});
  }
  document.querySelectorAll('.tsr_deferred_data').forEach((el) => el.parentElement.removeChild(el));
<\/script>`
    );
  }
  if (state.status === "error") {
    if (typeof document !== "undefined") {
      if (Matches.isServerSideError(state.error)) {
        throw (((_a = router$1.options.errorSerializer) == null ? void 0 : _a.deserialize) ?? Matches.defaultDeserializeError)(state.error.data);
      } else {
        console.warn(
          false,
          "Encountered a server-side error that doesn't fit the expected shape"
        );
        throw state.error;
      }
    } else {
      throw {
        data: (((_b = router$1.options.errorSerializer) == null ? void 0 : _b.serialize) ?? router.defaultSerializeError)(state.error),
        __isServerError: true
      };
    }
  }
  return [promise.__deferredState.data];
}
function Await(props) {
  const inner = /* @__PURE__ */ jsxRuntime.jsx(AwaitInner, { ...props });
  if (props.fallback) {
    return /* @__PURE__ */ jsxRuntime.jsx(React__namespace.Suspense, { fallback: props.fallback, children: inner });
  }
  return inner;
}
function AwaitInner(props) {
  const awaited = useAwaited(props);
  return props.children(...awaited);
}
exports.Await = Await;
exports.useAwaited = useAwaited;
//# sourceMappingURL=awaited.cjs.map
